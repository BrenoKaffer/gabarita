import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// ── Sub-rotas (registrar antes de /:id para evitar conflito) ──

router.put('/modulos/:mid', (req, res) => {
  const { titulo } = req.body;
  db.prepare('UPDATE modulos SET titulo=? WHERE id=?').run(titulo, req.params.mid);
  res.json({ ok: true });
});

router.delete('/modulos/:mid', (req, res) => {
  db.prepare('DELETE FROM modulos WHERE id=?').run(req.params.mid);
  res.json({ ok: true });
});

router.post('/modulos/:mid/aulas', (req, res) => {
  const { titulo, conteudo_md, duracao_min } = req.body;
  if (!titulo?.trim()) return res.status(400).json({ error: 'titulo obrigatório' });
  const max = db.prepare('SELECT COALESCE(MAX(ordem),0) AS m FROM aulas WHERE modulo_id=?').get(req.params.mid);
  const { lastInsertRowid } = db.prepare(
    'INSERT INTO aulas (modulo_id, titulo, conteudo_md, duracao_min, ordem) VALUES (?, ?, ?, ?, ?)'
  ).run(req.params.mid, titulo.trim(), conteudo_md || '', duracao_min || 0, (max.m || 0) + 1);
  res.json({ id: lastInsertRowid });
});

router.get('/aulas/:aid', (req, res) => {
  const aula = db.prepare(`
    SELECT a.*, m.titulo AS modulo_titulo, m.curso_id,
      c.titulo AS curso_titulo,
      COALESCE(ap.concluida, 0) AS concluida
    FROM aulas a
    JOIN modulos m ON m.id = a.modulo_id
    JOIN cursos c ON c.id = m.curso_id
    LEFT JOIN aula_progresso ap ON ap.aula_id = a.id AND ap.user_id = ?
    WHERE a.id = ?
  `).get(req.user.id, req.params.aid);
  if (!aula) return res.status(404).json({ error: 'Aula não encontrada' });
  res.json(aula);
});

router.put('/aulas/:aid', (req, res) => {
  const { titulo, conteudo_md, duracao_min } = req.body;
  db.prepare('UPDATE aulas SET titulo=?, conteudo_md=?, duracao_min=? WHERE id=?')
    .run(titulo, conteudo_md ?? '', duracao_min ?? 0, req.params.aid);
  res.json({ ok: true });
});

router.delete('/aulas/:aid', (req, res) => {
  db.prepare('DELETE FROM aulas WHERE id=?').run(req.params.aid);
  res.json({ ok: true });
});

router.post('/aulas/:aid/concluir', (req, res) => {
  const { concluida } = req.body;
  db.prepare(`
    INSERT INTO aula_progresso (user_id, aula_id, concluida) VALUES (?, ?, ?)
    ON CONFLICT(user_id, aula_id) DO UPDATE SET concluida=excluded.concluida
  `).run(req.user.id, req.params.aid, concluida ? 1 : 0);
  res.json({ ok: true });
});

// ── Cursos ──

router.get('/', (req, res) => {
  const rows = db.prepare(`
    SELECT c.id, c.titulo, c.descricao, c.cor, c.criado_em,
      COUNT(DISTINCT m.id) AS total_modulos,
      COUNT(DISTINCT a.id) AS total_aulas,
      COALESCE(SUM(CASE WHEN ap.concluida=1 THEN 1 ELSE 0 END), 0) AS aulas_concluidas
    FROM cursos c
    LEFT JOIN modulos m ON m.curso_id = c.id
    LEFT JOIN aulas a ON a.modulo_id = m.id
    LEFT JOIN aula_progresso ap ON ap.aula_id = a.id AND ap.user_id = ?
    WHERE c.user_id = ?
    GROUP BY c.id
    ORDER BY c.criado_em DESC
  `).all(req.user.id, req.user.id);
  res.json(rows);
});

router.post('/', (req, res) => {
  const { titulo, descricao, cor } = req.body;
  if (!titulo?.trim()) return res.status(400).json({ error: 'titulo obrigatório' });
  const { lastInsertRowid } = db.prepare(
    'INSERT INTO cursos (titulo, descricao, cor, user_id) VALUES (?, ?, ?, ?)'
  ).run(titulo.trim(), descricao || null, cor || '#6366f1', req.user.id);
  res.json({ id: lastInsertRowid });
});

router.get('/:id', (req, res) => {
  const curso = db.prepare('SELECT * FROM cursos WHERE id=? AND user_id=?')
    .get(req.params.id, req.user.id);
  if (!curso) return res.status(404).json({ error: 'Curso não encontrado' });

  const modulos = db.prepare('SELECT * FROM modulos WHERE curso_id=? ORDER BY ordem, id').all(curso.id);
  for (const m of modulos) {
    m.aulas = db.prepare(`
      SELECT a.id, a.titulo, a.duracao_min, a.ordem,
        COALESCE(ap.concluida, 0) AS concluida
      FROM aulas a
      LEFT JOIN aula_progresso ap ON ap.aula_id=a.id AND ap.user_id=?
      WHERE a.modulo_id=?
      ORDER BY a.ordem, a.id
    `).all(req.user.id, m.id);
  }
  res.json({ ...curso, modulos });
});

router.put('/:id', (req, res) => {
  const { titulo, descricao, cor } = req.body;
  db.prepare('UPDATE cursos SET titulo=?, descricao=?, cor=? WHERE id=? AND user_id=?')
    .run(titulo, descricao || null, cor || '#6366f1', req.params.id, req.user.id);
  res.json({ ok: true });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM cursos WHERE id=? AND user_id=?').run(req.params.id, req.user.id);
  res.json({ ok: true });
});

router.post('/:id/modulos', (req, res) => {
  const curso = db.prepare('SELECT id FROM cursos WHERE id=? AND user_id=?')
    .get(req.params.id, req.user.id);
  if (!curso) return res.status(404).json({ error: 'Curso não encontrado' });
  const { titulo } = req.body;
  if (!titulo?.trim()) return res.status(400).json({ error: 'titulo obrigatório' });
  const max = db.prepare('SELECT COALESCE(MAX(ordem),0) AS m FROM modulos WHERE curso_id=?').get(req.params.id);
  const { lastInsertRowid } = db.prepare(
    'INSERT INTO modulos (curso_id, titulo, ordem) VALUES (?, ?, ?)'
  ).run(req.params.id, titulo.trim(), (max.m || 0) + 1);
  res.json({ id: lastInsertRowid });
});

export default router;
