import { Router } from 'express';
import db, { updateStreak } from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// GET /api/plano/hoje — today's summary: progress vs metas + streak
router.get('/hoje', (req, res) => {
  const uid   = req.user.id;
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // Activity counts for today
  const questoesHoje = db.prepare(
    "SELECT COUNT(*) AS c FROM progress WHERE user_id=? AND date(answered_at)=date('now')"
  ).get(uid).c;

  const flashcardsHoje = db.prepare(
    "SELECT COUNT(*) AS c FROM srs_state WHERE user_id=? AND ultima_rev=?"
  ).get(uid, today).c;

  const minutosHoje = db.prepare(
    "SELECT COALESCE(SUM(duracao_min),0) AS s FROM sessoes_pomodoro WHERE user_id=? AND date(iniciado_em)=date('now') AND tipo='foco'"
  ).get(uid).s;

  // Metas
  const metaRows = db.prepare('SELECT tipo, valor FROM metas WHERE user_id=?').all(uid);
  const metas = { questoes: 10, flashcards: 20, minutos: 50 };
  for (const m of metaRows) metas[m.tipo] = m.valor;

  // Streak
  const streakRow = db.prepare('SELECT * FROM streak WHERE user_id=?').get(uid);
  let streakAtual = streakRow?.atual ?? 0;
  const streakMax = streakRow?.maximo ?? 0;
  // If last active was before yesterday, streak is broken
  if (streakRow && streakRow.ultima_data && streakRow.ultima_data < yesterday) {
    streakAtual = 0;
  }

  // Pomodoro history today
  const sessoes = db.prepare(
    "SELECT * FROM sessoes_pomodoro WHERE user_id=? AND date(iniciado_em)=date('now') ORDER BY iniciado_em DESC"
  ).all(uid);

  res.json({
    questoesHoje,
    flashcardsHoje,
    minutosHoje,
    metas,
    streak: { atual: streakAtual, maximo: streakMax, ultima_data: streakRow?.ultima_data || null },
    sessoesHoje: sessoes,
  });
});

// GET /api/plano/metas
router.get('/metas', (req, res) => {
  const rows = db.prepare('SELECT tipo, valor FROM metas WHERE user_id=?').all(req.user.id);
  const metas = { questoes: 10, flashcards: 20, minutos: 50 };
  for (const r of rows) metas[r.tipo] = r.valor;
  res.json(metas);
});

// POST /api/plano/metas  — body: {questoes, flashcards, minutos}
router.post('/metas', (req, res) => {
  const uid = req.user.id;
  const upsert = db.prepare(`
    INSERT INTO metas (user_id, tipo, valor) VALUES (?,?,?)
    ON CONFLICT(user_id, tipo) DO UPDATE SET valor=excluded.valor
  `);
  const tx = db.transaction(() => {
    for (const [tipo, valor] of Object.entries(req.body)) {
      if (['questoes','flashcards','minutos'].includes(tipo) && typeof valor === 'number' && valor >= 0) {
        upsert.run(uid, tipo, valor);
      }
    }
  });
  tx();
  res.json({ ok: true });
});

// POST /api/plano/pomodoro  — log completed focus session
router.post('/pomodoro', (req, res) => {
  const { duracao_min, nota = '' } = req.body;
  if (!duracao_min || duracao_min < 1)
    return res.status(400).json({ error: 'duracao_min obrigatório' });

  const uid = req.user.id;
  db.prepare('INSERT INTO sessoes_pomodoro (user_id, duracao_min, nota) VALUES (?,?,?)')
    .run(uid, duracao_min, nota || null);

  updateStreak(uid);
  res.json({ ok: true });
});

export default router;
