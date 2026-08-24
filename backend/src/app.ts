import express from 'express';
import cors from 'cors';
import { getDriver } from './database/neo4j';
import jobRoutes from './routes/job.routes';
import candidateRoutes from './routes/candidate.routes';
import { errorMiddleware } from './middleware/error.middleware';

export const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
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
