import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Leitura pública — usada pelo sidebar sem token
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM concursos WHERE ativo=1 ORDER BY data_prova ASC').all();
  res.json(rows);
});

router.use(requireAuth);

router.post('/', (req, res) => {
  const { nome, data_prova, cor } = req.body;
  if (!nome?.trim()) return res.status(400).json({ error: 'nome obrigatório' });
  const { lastInsertRowid } = db.prepare(
    'INSERT INTO concursos (nome, data_prova, cor) VALUES (?, ?, ?)'
  ).run(nome.trim(), data_prova || null, cor || '#b9ff66');
  res.json({ id: lastInsertRowid });
});

router.put('/:id', (req, res) => {
  const { nome, data_prova, cor, ativo } = req.body;
  db.prepare('UPDATE concursos SET nome=?, data_prova=?, cor=?, ativo=? WHERE id=?')
    .run(nome, data_prova || null, cor || '#b9ff66', ativo ?? 1, req.params.id);
  res.json({ ok: true });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM concursos WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
