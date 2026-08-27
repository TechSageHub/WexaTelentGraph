import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { getDriver } from './database/neo4j';
import { config } from './config/env';
import jobRoutes from './routes/job.routes';
import candidateRoutes from './routes/candidate.routes';
import { errorMiddleware } from './middleware/error.middleware';

export const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.disable('x-powered-by');
app.use(helmet());

// Restrict CORS to an explicit allow-list when configured; otherwise reflect any
// origin (useful for local dev where the Vite proxy shares the origin anyway).
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.corsOrigins.length === 0 || config.corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
  })
);
app.use(express.json());

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  try {
    await getDriver().verifyConnectivity();
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', database: 'unavailable' });
  }
});

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: { message: 'Route not found' } });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorMiddleware);
