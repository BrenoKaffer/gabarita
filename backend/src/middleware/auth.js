import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'gabarita-secret-change-in-prod';

export function sign(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '30d' });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Não autenticado' });
  try {
    req.user = jwt.verify(header.slice(7), SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}
