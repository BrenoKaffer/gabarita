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
