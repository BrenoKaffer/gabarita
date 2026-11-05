import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRouter from './routes/auth.js';
import progressRouter from './routes/progress.js';
import statsRouter from './routes/stats.js';
import cursosRouter from './routes/cursos.js';
import concursosRouter from './routes/concursos.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const STATIC = join(__dir, '..', '..', 'frontend', 'dist');

const app = express();
app.use(cors());
app.use(express.json());

// API
app.use('/api/auth', authRouter);
app.use('/api/progress', progressRouter);
app.use('/api/stats', statsRouter);
app.use('/api/cursos', cursosRouter);
app.use('/api/concursos', concursosRouter);

// Serve Astro build (produção)
app.use(express.static(STATIC));
app.get('*', (req, res) => {
  res.sendFile(join(STATIC, 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Gabarita rodando em http://localhost:${PORT}`));
