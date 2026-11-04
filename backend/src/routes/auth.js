import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db/index.js';
import { sign } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Preencha todos os campos' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Senha mínima de 6 caracteres' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(400).json({ error: 'E-mail já cadastrado' });

  const hash = await bcrypt.hash(password, 10);
  const { lastInsertRowid } = db.prepare(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
  ).run(name, email, hash);

  const token = sign({ id: lastInsertRowid, name, email });
  res.json({ token, user: { id: lastInsertRowid, name, email } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'E-mail ou senha incorretos' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'E-mail ou senha incorretos' });

  const token = sign({ id: user.id, name: user.name, email: user.email });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

router.get('/me', (req, res) => {
  // lightweight token check called client-side on load
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).end();
  try {
    const { id, name, email } = JSON.parse(
      Buffer.from(header.slice(7).split('.')[1], 'base64').toString()
    );
    res.json({ id, name, email });
  } catch {
    res.status(401).end();
  }
});

export default router;
