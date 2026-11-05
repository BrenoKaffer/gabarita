import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// GET /api/agenda  — eventos do usuário ordenados por data
router.get('/', (req, res) => {
  const eventos = db.prepare(`
    SELECT a.id, a.nome, a.data, a.status, a.peso, a.curso_id,
           c.titulo AS curso_titulo, c.cor AS curso_cor
    FROM agenda_eventos a
    LEFT JOIN cursos c ON c.id = a.curso_id
    WHERE a.user_id = ?
    ORDER BY a.data ASC
  `).all(req.user.id);
  res.json(eventos);
});

// POST /api/agenda  — cria evento manual
router.post('/', (req, res) => {
  const { nome, data, status, curso_id } = req.body;
  if (!nome?.trim()) return res.status(400).json({ error: 'nome obrigatório' });
  if (!data?.match(/^\d{4}-\d{2}-\d{2}$/)) return res.status(400).json({ error: 'data inválida (YYYY-MM-DD)' });

  const { lastInsertRowid } = db.prepare(
    'INSERT INTO agenda_eventos (user_id, curso_id, nome, data, status) VALUES (?,?,?,?,?)'
  ).run(req.user.id, curso_id || null, nome.trim(), data, status || 'confirmada');

  const evento = db.prepare(`
    SELECT a.id, a.nome, a.data, a.status, a.peso, a.curso_id,
           c.titulo AS curso_titulo, c.cor AS curso_cor
    FROM agenda_eventos a
    LEFT JOIN cursos c ON c.id = a.curso_id
    WHERE a.id = ?
  `).get(lastInsertRowid);

  res.status(201).json(evento);
});

// DELETE /api/agenda/:id  — remove evento
router.delete('/:id', (req, res) => {
  const { changes } = db.prepare(
    'DELETE FROM agenda_eventos WHERE id = ? AND user_id = ?'
  ).run(req.params.id, req.user.id);
  if (!changes) return res.status(404).json({ error: 'Evento não encontrado' });
  res.json({ ok: true });
});

export default router;
