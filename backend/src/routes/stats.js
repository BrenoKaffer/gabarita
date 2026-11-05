import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const uid = req.user.id;

  // % acerto por disciplina
  const byDisc = db.prepare(`
    SELECT g.disc,
           COUNT(*) AS total,
           SUM(p.correct) AS acertos
    FROM progress p
    JOIN gabarito g ON g.question_id = p.question_id
    WHERE p.user_id = ?
    GROUP BY g.disc
    ORDER BY g.disc
  `).all(uid);

  // totais gerais
  const overall = db.prepare(`
    SELECT COUNT(*) AS respondidas,
           SUM(correct) AS acertos
    FROM progress
    WHERE user_id = ?
  `).get(uid);

  // histórico de simulados
  const simulados = db.prepare(`
    SELECT id, disc, total, acertos, duration_s, created_at
    FROM simulados
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 20
  `).all(uid);

  res.json({ byDisc, overall, simulados });
});

// Heatmap: questões respondidas por dia (últimos 91 dias)
router.get('/heatmap', (req, res) => {
  const uid = req.user.id;
  const rows = db.prepare(`
    SELECT date(answered_at) AS dia, COUNT(*) AS cnt
    FROM progress
    WHERE user_id = ? AND answered_at >= date('now', '-90 days')
    GROUP BY dia
  `).all(uid);
  const map = {};
  for (const r of rows) map[r.dia] = r.cnt;
  const days = [];
  for (let i = 90; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, count: map[key] || 0 });
  }
  res.json({ days });
});

// Próximo passo: disciplina com pior aproveitamento (mín 5 questões)
router.get('/proximo-passo', (req, res) => {
  const uid = req.user.id;
  const disc = db.prepare(`
    SELECT g.disc,
           COUNT(*) AS total,
           SUM(p.correct) AS acertos
    FROM progress p
    JOIN gabarito g ON g.question_id = p.question_id
    WHERE p.user_id = ? AND g.disc IS NOT NULL
    GROUP BY g.disc
    HAVING COUNT(*) >= 5
    ORDER BY CAST(SUM(p.correct) AS REAL) / COUNT(*) ASC
    LIMIT 1
  `).get(uid);
  if (!disc) return res.json({ disc: null });
  res.json({
    disc: disc.disc,
    pct: Math.round(disc.acertos / disc.total * 100),
    total: disc.total,
  });
});

// Evolução: aproveitamento diário (últimos 30 dias)
router.get('/evolucao', (req, res) => {
  const uid = req.user.id;
  const rows = db.prepare(`
    SELECT date(answered_at) AS dia,
           COUNT(*) AS total,
           SUM(correct) AS acertos
    FROM progress
    WHERE user_id = ? AND answered_at >= date('now', '-29 days')
    GROUP BY dia
    ORDER BY dia
  `).all(uid);
  res.json(rows.map(r => ({
    date: r.dia,
    pct: r.total > 0 ? Math.round(r.acertos / r.total * 100) : 0,
    total: r.total,
  })));
});

// Admin: inserir/atualizar gabarito de questão QC
router.put('/gabarito/:qid', (req, res) => {
  const { correct, disc, source } = req.body;
  if (!correct) return res.status(400).json({ error: 'correct é obrigatório' });
  db.prepare(`
    INSERT INTO gabarito (question_id, correct, disc, source)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(question_id) DO UPDATE SET correct=excluded.correct, disc=excluded.disc
  `).run(req.params.qid, correct.toUpperCase(), disc || null, source || 'qconcursos');
  res.json({ ok: true });
});

export default router;
