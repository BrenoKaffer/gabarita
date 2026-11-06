import { Router } from 'express';
import db, { updateStreak } from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveQuestionObj, resolveQuestionMeta } from '../lib/questionSource.js';

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
      INSERT INTO progress (user_id, question_id, chosen, correct, confidence)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id, question_id) DO UPDATE SET
        chosen=excluded.chosen, correct=excluded.correct,
        confidence=excluded.confidence, answered_at=datetime('now')
    `).run(req.user.id, question_id, chosen, correct, confidence || null);
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

// Questões erradas + lacunas (acertou chutando) para revisão
router.get('/errors', (req, res) => {
  const rows = db.prepare(`
    SELECT question_id, chosen, correct, confidence, answered_at
    FROM progress WHERE user_id = ? AND correct IS NOT NULL
    ORDER BY answered_at DESC
  `).all(req.user.id);

  const build = (r) => {
    const q = resolveQuestionObj(r.question_id);
    if (!q) return null; // questão apagada/órfã — não quebra a lista
    const meta = resolveQuestionMeta(r.question_id);
    const gab = db.prepare('SELECT correct FROM gabarito WHERE question_id = ?').get(r.question_id);
    return {
      question_id: r.question_id,
      chosen: r.chosen,
      correct_answer: gab?.correct ?? null,
      disc: meta.disc,
      assunto: meta.assunto,
      e: q.e,
      a: q.a,
      answered_at: r.answered_at,
    };
  };

  const erros = rows.filter(r => r.correct === 0).map(build).filter(Boolean);
  const chutei_acertos = rows.filter(r => r.correct === 1 && r.confidence === 'chutei').map(build).filter(Boolean);
  res.json({ erros, chutei_acertos });
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

export default router;
