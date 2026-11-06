import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';
import { toQFormat } from './questoes.js';
import { getStaticList, resolveQuestionMeta, resolveQuestionObj } from '../lib/questionSource.js';

const router = Router();
router.use(requireAuth);

const staticList = getStaticList();

// Monta o relatório de uma sessão a partir das tentativas registradas
function buildRelatorio(sessionId, userId) {
  const sessao = db.prepare('SELECT * FROM sessoes WHERE id = ? AND user_id = ?').get(sessionId, userId);
  if (!sessao) return null;

  const tentativasRows = db.prepare(
    'SELECT * FROM tentativas WHERE session_id = ? AND user_id = ? ORDER BY id ASC'
  ).all(sessionId, userId);

  // mantém só a tentativa mais recente por questão (resolver de novo não deve contar 2x no relatório)
  const latestByQ = new Map();
  for (const t of tentativasRows) latestByQ.set(t.question_id, t);

  const respondidas = latestByQ.size;
  let acertos = 0;
  const porDisciplina = {};
  const porAssunto = {};

  for (const t of latestByQ.values()) {
    if (t.correct === 1) acertos++;
    const meta = resolveQuestionMeta(t.question_id);
    if (meta.disc) {
      porDisciplina[meta.disc] ??= { total: 0, acertos: 0 };
      porDisciplina[meta.disc].total++;
      if (t.correct === 1) porDisciplina[meta.disc].acertos++;
    }
    if (meta.assunto) {
      porAssunto[meta.assunto] ??= { total: 0, acertos: 0 };
      porAssunto[meta.assunto].total++;
      if (t.correct === 1) porAssunto[meta.assunto].acertos++;
    }
  }

  const erros = respondidas - acertos;
  const aproveitamento = respondidas ? Math.round((acertos / respondidas) * 100) : 0;

  const pctOf = (s) => Math.round((s.acertos / s.total) * 100);
  const recomendacoes = [];
  const fonte = Object.keys(porAssunto).length ? porAssunto : porDisciplina;
  for (const [nome, s] of Object.entries(fonte)) {
    const pct = pctOf(s);
    if (s.total >= 1 && pct < 60) recomendacoes.push(`Considere revisar: ${nome} (${pct}% de acerto)`);
  }

  return {
    session_id: sessionId,
    status: sessao.status,
    respondidas,
    total: JSON.parse(sessao.question_ids_json).length,
    acertos,
    erros,
    aproveitamento,
    porDisciplina,
    porAssunto,
    recomendacoes,
  };
}

// ── POST / — cria sessão a partir dos filtros do construtor ──
router.post('/', (req, res) => {
  const {
    curso_id, aula_ids, disciplina, banca, dificuldade, ano, origem,
    status_filtro, quantidade,
  } = req.body;

  const qtd = parseInt(quantidade, 10);
  if (!qtd || qtd < 1) return res.status(400).json({ error: 'quantidade inválida' });

  // Resolve o conjunto efetivo de aulas (Assunto), inclusive quando só "Curso" foi escolhido
  let effectiveAulaIds = null;
  if (Array.isArray(aula_ids) && aula_ids.length) {
    effectiveAulaIds = aula_ids;
  } else if (curso_id) {
    const rows = db.prepare(`
      SELECT a.id FROM aulas a JOIN modulos m ON m.id = a.modulo_id WHERE m.curso_id = ?
    `).all(curso_id);
    effectiveAulaIds = rows.map(r => r.id);
  }

  // ── Questões do banco (DB) ──
  const conds = [];
  const params = [];
  if (effectiveAulaIds) {
    if (!effectiveAulaIds.length) {
      conds.push('1=0'); // curso/assunto escolhido mas sem nenhuma aula -> nenhuma questão
    } else {
      conds.push(`aula_id IN (${effectiveAulaIds.map(() => '?').join(',')})`);
      params.push(...effectiveAulaIds);
    }
  }
  if (disciplina)  { conds.push('disciplina = ?');  params.push(disciplina); }
  if (banca)       { conds.push('banca = ?');       params.push(banca); }
  if (dificuldade) { conds.push('dificuldade = ?');  params.push(dificuldade); }
  if (ano)         { conds.push('ano = ?');          params.push(ano); }
  if (origem)      { conds.push('origem = ?');       params.push(origem); }

  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const dbRows = db.prepare(`SELECT * FROM questoes ${where} ORDER BY importado_em DESC`).all(...params);
  let dbQs = dbRows.map(toQFormat);

  // ── Questões estáticas — só entram se nenhum filtro exclusivo de DB estiver ativo ──
  let staticQs = [];
  if (!effectiveAulaIds && !dificuldade && !origem) {
    staticQs = staticList.filter(q => {
      if (disciplina && q.disc !== disciplina) return false;
      if (banca && q.banca !== banca) return false;
      if (ano && String(q.ano) !== String(ano)) return false;
      return true;
    });
  }

  // DB tem prioridade na deduplicação
  const dbIds = new Set(dbQs.map(q => q.id));
  staticQs = staticQs.filter(q => !dbIds.has(q.id));
  let combined = [...dbQs, ...staticQs];

  // ── Status (já respondida, acertei, errei, fraco...) ──
  if (status_filtro && status_filtro !== 'todas') {
    const answered = db.prepare('SELECT question_id, correct, confidence FROM progress WHERE user_id = ?').all(req.user.id);
    const byId = new Map(answered.map(a => [a.question_id, a]));
    combined = combined.filter(q => {
      const ans = byId.get(q.id);
      if (status_filtro === 'nao_respondidas') return ans === undefined;
      if (status_filtro === 'acertei')         return ans?.correct === 1;
      if (status_filtro === 'errei')           return ans?.correct === 0;
      if (status_filtro === 'fraco')           return !!ans && (ans.correct === 0 || (ans.correct === 1 && ans.confidence === 'chutei'));
      return true;
    });
  }

  const quantidade_encontrada = Math.min(qtd, combined.length);
  const selecionadas = combined.slice(0, quantidade_encontrada);
  const ids = selecionadas.map(q => q.id);

  // Distribuição (por assunto quando houver, senão por disciplina)
  const distribuicao = {};
  for (const q of selecionadas) {
    const meta = resolveQuestionMeta(q.id);
    const chave = meta.assunto || meta.disc || 'Outros';
    distribuicao[chave] = (distribuicao[chave] || 0) + 1;
  }

  const { lastInsertRowid } = db.prepare(`
    INSERT INTO sessoes (user_id, status, filtros_json, question_ids_json, quantidade_solicitada, quantidade_encontrada)
    VALUES (?, 'aberta', ?, ?, ?, ?)
  `).run(req.user.id, JSON.stringify(req.body), JSON.stringify(ids), qtd, quantidade_encontrada);

  res.json({
    session_id: lastInsertRowid,
    quantidade_solicitada: qtd,
    quantidade_encontrada,
    distribuicao,
    tempo_estimado_min: Math.max(1, Math.round(quantidade_encontrada * 1.5)),
  });
});

// ── GET /aberta — última sessão em aberto do usuário ──
router.get('/aberta', (req, res) => {
  const sessao = db.prepare(`
    SELECT * FROM sessoes WHERE user_id = ? AND status = 'aberta' ORDER BY criada_em DESC LIMIT 1
  `).get(req.user.id);
  if (!sessao) return res.json({ session: null });

  const total = JSON.parse(sessao.question_ids_json).length;
  const respondidas_count = db.prepare(
    'SELECT COUNT(DISTINCT question_id) AS c FROM tentativas WHERE session_id = ?'
  ).get(sessao.id).c;

  res.json({ session: sessao, respondidas_count, total });
});

// ── GET /:id — detalhe da sessão + questões + tentativas já registradas ──
router.get('/:id', (req, res) => {
  const sessao = db.prepare('SELECT * FROM sessoes WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!sessao) return res.status(404).json({ error: 'Sessão não encontrada' });

  const ids = JSON.parse(sessao.question_ids_json);
  const questions = ids.map(resolveQuestionObj).filter(Boolean);

  const tentativasRows = db.prepare(
    'SELECT * FROM tentativas WHERE session_id = ? AND user_id = ? ORDER BY id ASC'
  ).all(sessao.id, req.user.id);
  const respostas = {};
  for (const t of tentativasRows) {
    const gab = db.prepare('SELECT correct FROM gabarito WHERE question_id = ?').get(t.question_id);
    respostas[t.question_id] = {
      chosen: t.chosen,
      correct: t.correct,
      confidence: t.confidence,
      correct_answer: gab?.correct ?? null,
      has_gabarito: !!gab,
    };
  }

  res.json({ session: sessao, questions, respostas });
});

// ── POST /:id/finalizar — fecha a sessão e devolve o relatório ──
router.post('/:id/finalizar', (req, res) => {
  const sessao = db.prepare('SELECT * FROM sessoes WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!sessao) return res.status(404).json({ error: 'Sessão não encontrada' });

  db.prepare(`UPDATE sessoes SET status = 'finalizada', finalizada_em = datetime('now') WHERE id = ?`).run(sessao.id);

  const relatorio = buildRelatorio(sessao.id, req.user.id);
  res.json(relatorio);
});

// ── GET /:id/relatorio — recalcula o relatório sob demanda ──
router.get('/:id/relatorio', (req, res) => {
  const relatorio = buildRelatorio(req.params.id, req.user.id);
  if (!relatorio) return res.status(404).json({ error: 'Sessão não encontrada' });
  res.json(relatorio);
});

export default router;
