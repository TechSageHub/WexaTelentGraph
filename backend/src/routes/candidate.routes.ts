import { Router } from 'express';
import {
  handleListCandidates,
  handleGetCandidate,
  handleGetCandidateMatch,
} from '../controllers/candidate.controller';
import { validateParams } from '../middleware/validateParams';

const router = Router();

router.get('/', handleListCandidates);
router.get('/:candidateId', validateParams(['candidateId']), handleGetCandidate);
router.get(
  '/:candidateId/matches/:jobId',
  validateParams(['candidateId', 'jobId']),
  handleGetCandidateMatch
);

export default router;
