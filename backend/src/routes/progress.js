import { Router } from 'express';
import db, { updateStreak } from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// Registrar resposta a uma questão
router.post('/answer', (req, res) => {
  const { question_id, chosen, session_id, confidence, time_spent_s } = req.body;
  if (!question_id || !chosen)
    return res.status(400).json({ error: 'question_id e chosen são obrigatórios' });

  const gab = db.prepare('SELECT correct FROM gabarito WHERE question_id = ?').get(question_id);
  const correct = gab ? (gab.correct === chosen ? 1 : 0) : null;

  if (correct !== null) {
    db.prepare(`
      INSERT INTO progress (user_id, question_id, chosen, correct)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, question_id) DO UPDATE SET chosen=excluded.chosen, correct=excluded.correct, answered_at=datetime('now')
    `).run(req.user.id, question_id, chosen, correct);
  }

  // Tentativa: histórico completo, nunca sobrescrito (independe de haver gabarito)
  db.prepare(`
    INSERT INTO tentativas (user_id, session_id, question_id, chosen, correct, confidence, time_spent_s)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(req.user.id, session_id || null, question_id, chosen, correct, confidence || null, time_spent_s || null);

  if (correct !== null) updateStreak(req.user.id);

  res.json({
    correct,
    correct_answer: gab?.correct ?? null,
    has_gabarito: !!gab,
  });
});

// Questões já respondidas (para evitar repetição)
router.get('/answered', (req, res) => {
  const rows = db.prepare(
    'SELECT question_id, chosen, correct FROM progress WHERE user_id = ?'
  ).all(req.user.id);
  res.json(rows);
});

// Questões erradas para revisão
router.get('/errors', (req, res) => {
  const rows = db.prepare(`
    SELECT p.question_id, p.chosen, g.correct AS correct_answer
    FROM progress p
    LEFT JOIN gabarito g ON g.question_id = p.question_id
    WHERE p.user_id = ? AND p.correct = 0
    ORDER BY p.answered_at DESC
  `).all(req.user.id);
  res.json(rows);
});

// Favoritos
router.get('/favorites', (req, res) => {
  const rows = db.prepare(
    'SELECT question_id FROM favorites WHERE user_id = ?'
  ).all(req.user.id);
  res.json(rows.map(r => r.question_id));
});

router.post('/favorites/:qid', (req, res) => {
  db.prepare(
    'INSERT OR IGNORE INTO favorites (user_id, question_id) VALUES (?, ?)'
  ).run(req.user.id, req.params.qid);
  res.json({ ok: true });
});

router.delete('/favorites/:qid', (req, res) => {
  db.prepare(
    'DELETE FROM favorites WHERE user_id = ? AND question_id = ?'
  ).run(req.user.id, req.params.qid);
  res.json({ ok: true });
});

// Salvar simulado finalizado
router.post('/simulado', (req, res) => {
  const { disc, total, acertos, duration_s, answers } = req.body;
  const { lastInsertRowid } = db.prepare(
    'INSERT INTO simulados (user_id, disc, total, acertos, duration_s) VALUES (?, ?, ?, ?, ?)'
  ).run(req.user.id, disc || null, total, acertos, duration_s || null);

  // gravar respostas individuais
  if (Array.isArray(answers)) {
    const stmt = db.prepare(`
      INSERT INTO progress (user_id, question_id, chosen, correct)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, question_id) DO UPDATE SET chosen=excluded.chosen, correct=excluded.correct, answered_at=datetime('now')
    `);
    for (const a of answers) {
      const gab = db.prepare('SELECT correct FROM gabarito WHERE question_id = ?').get(a.question_id);
      const correct = gab ? (gab.correct === a.chosen ? 1 : 0) : null;
      if (correct !== null) stmt.run(req.user.id, a.question_id, a.chosen, correct);
    }
  }

  res.json({ id: lastInsertRowid });
});

export default router;
