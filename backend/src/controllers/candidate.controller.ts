import { Request, Response, NextFunction } from 'express';
import { getCandidateById, listCandidates } from '../services/candidate.service';
import { getCandidateJobMatchExplanation } from '../services/matching.service';

export async function handleListCandidates(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const candidates = await listCandidates();
    res.json({ candidates });
  } catch (err) {
    next(err);
  }
}

export async function handleGetCandidate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const candidate = await getCandidateById(req.params['candidateId'] as string);
    if (!candidate) {
      res.status(404).json({ error: { message: 'Candidate not found' } });
      return;
    }
    res.json({ candidate });
  } catch (err) {
    next(err);
  }
}

export async function handleGetCandidateMatch(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const match = await getCandidateJobMatchExplanation(
      req.params['candidateId'] as string,
      req.params['jobId'] as string
    );
    if (!match) {
      res.status(404).json({ error: { message: 'No match data found for this candidate and job' } });
      return;
    }
    res.json({ match });
  } catch (err) {
    next(err);
  }
}
