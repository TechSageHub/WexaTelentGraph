import { Request, Response, NextFunction } from 'express';
import { listJobs, getJobById } from '../services/job.service';
import { findCandidatesForJob } from '../services/matching.service';

export async function handleListJobs(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const jobs = await listJobs();
    res.json({ jobs });
  } catch (err) {
    next(err);
  }
}

export async function handleGetJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const job = await getJobById(req.params['jobId'] as string);
    if (!job) {
      res.status(404).json({ error: { message: 'Job not found' } });
      return;
    }
    res.json({ job });
  } catch (err) {
    next(err);
  }
}

export async function handleGetJobCandidates(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const candidates = await findCandidatesForJob(req.params['jobId'] as string);
    res.json({ candidates, total: candidates.length });
  } catch (err) {
    next(err);
  }
}
