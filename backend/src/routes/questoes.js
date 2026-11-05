import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Convert DB row to questions.json-compatible format
function toQFormat(q) {
  let alts = {};
  try { alts = JSON.parse(q.alternativas); } catch {}
  const letters = Object.keys(alts);
  return {
    id: q.id,
    e: q.enunciado,
    a: letters.map(l => ({ l: l.toUpperCase(), t: alts[l] })),
    disc: q.disciplina || '',
    ano: q.ano ? String(q.ano) : '',
    banca: q.banca || '',
    subtopico: q.subtopico || '',
    dificuldade: q.dificuldade || 'medio',
    explicacao: q.explicacao || '',
    source: 'import',
  };
}

// GET /api/questoes — list all imported questions in questions.json format
router.get('/', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM questoes ORDER BY importado_em DESC').all();
  res.json(rows.map(toQFormat));
});

// GET /api/questoes/meta — unique disciplines and bancas
router.get('/meta', requireAuth, (req, res) => {
  const disciplinas = db.prepare('SELECT DISTINCT disciplina FROM questoes WHERE disciplina IS NOT NULL ORDER BY disciplina').all().map(r => r.disciplina);
  const bancas = db.prepare('SELECT DISTINCT banca FROM questoes WHERE banca IS NOT NULL ORDER BY banca').all().map(r => r.banca);
  const total = db.prepare('SELECT COUNT(*) AS c FROM questoes').get().c;
  res.json({ disciplinas, bancas, total });
});

// POST /api/questoes/import — import batch from parsed JSON
router.post('/import', requireAuth, (req, res) => {
  const { questoes } = req.body;
  if (!Array.isArray(questoes) || questoes.length === 0)
    return res.status(400).json({ error: 'questoes deve ser um array não vazio' });

  const insertQ = db.prepare(`
    INSERT INTO questoes (id, banca, ano, disciplina, subtopico, dificuldade, enunciado, alternativas, gabarito, explicacao)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      banca=excluded.banca, ano=excluded.ano, disciplina=excluded.disciplina,
      subtopico=excluded.subtopico, dificuldade=excluded.dificuldade,
      enunciado=excluded.enunciado, alternativas=excluded.alternativas,
      gabarito=excluded.gabarito, explicacao=excluded.explicacao
  `);

  const checkGab  = db.prepare('SELECT source FROM gabarito WHERE question_id = ?');
  const insertGab = db.prepare('INSERT OR REPLACE INTO gabarito (question_id, correct, disc, source) VALUES (?, ?, ?, ?)');

  let imported = 0;

  const tx = db.transaction((qs) => {
    for (const q of qs) {
      insertQ.run(
        q.id, q.banca || null, q.ano || null, q.disciplina || null,
        q.subtopico || null, q.dificuldade || 'medio',
        q.enunciado, JSON.stringify(q.alternativas), q.gabarito, q.explicacao || null
      );
      // Don't overwrite gabarito for static questions (source != 'import')
      const existing = checkGab.get(q.id);
      if (!existing || existing.source === 'import') {
        insertGab.run(q.id, q.gabarito, q.disciplina || null, 'import');
      }
      imported++;
    }
  });

  tx(questoes);
  res.json({ imported, total: questoes.length });
});

// DELETE /api/questoes/:id — remove one imported question
router.delete('/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM questoes WHERE id = ?').run(req.params.id);
  db.prepare("DELETE FROM gabarito WHERE question_id = ? AND source = 'import'").run(req.params.id);
  res.json({ ok: true });
});

export default router;
