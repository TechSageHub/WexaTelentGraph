import { Router } from 'express';
import {
  handleListCandidates,
  handleGetCandidate,
  handleGetCandidateMatch,
} from '../controllers/candidate.controller';

const router = Router();

router.get('/', handleListCandidates);
router.get('/:candidateId', handleGetCandidate);
router.get('/:candidateId/matches/:jobId', handleGetCandidateMatch);

export default router;
