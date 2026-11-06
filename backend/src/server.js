import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRouter from './routes/auth.js';
import progressRouter from './routes/progress.js';
import statsRouter from './routes/stats.js';
import cursosRouter from './routes/cursos.js';
import sessoesRouter from './routes/sessoes.js';
import dominioRouter from './routes/dominio.js';
import concursosRouter from './routes/concursos.js';
import questoesRouter from './routes/questoes.js';
import flashcardsRouter from './routes/flashcards.js';
import planoRouter from './routes/plano.js';
import importarCursoRouter from './routes/importar_curso.js';
import agendaRouter from './routes/agenda.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const STATIC = join(__dir, '..', '..', 'frontend', 'dist');

const app = express();
app.use(cors());
// Limite padrão do Express é 100kb — pequeno demais para capas de curso e
// imagens do editor de aula, que vão embutidas como base64 no corpo JSON.
app.use(express.json({ limit: '15mb' }));

// API
app.use('/api/auth', authRouter);
app.use('/api/progress', progressRouter);
app.use('/api/stats', statsRouter);
app.use('/api/cursos', cursosRouter);
app.use('/api/sessoes', sessoesRouter);
app.use('/api/dominio', dominioRouter);
app.use('/api/concursos', concursosRouter);
app.use('/api/questoes', questoesRouter);
app.use('/api/flashcards', flashcardsRouter);
app.use('/api/plano', planoRouter);
app.use('/api/importar-curso', importarCursoRouter);
app.use('/api/agenda', agendaRouter);

// Serve Astro build (produção)
app.use(express.static(STATIC));
app.get('*', (req, res) => {
  res.sendFile(join(STATIC, 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Gabarita rodando em http://localhost:${PORT}`));
