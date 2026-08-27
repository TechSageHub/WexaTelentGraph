import { Router } from 'express';
import {
  handleListJobs,
  handleGetJob,
  handleGetJobCandidates,
} from '../controllers/job.controller';
import { validateParams } from '../middleware/validateParams';

const router = Router();

router.get('/', handleListJobs);
router.get('/:jobId', validateParams(['jobId']), handleGetJob);
router.get('/:jobId/candidates', validateParams(['jobId']), handleGetJobCandidates);

export default router;
