import { Router } from 'express';
import {
  handleListJobs,
  handleGetJob,
  handleGetJobCandidates,
} from '../controllers/job.controller';

const router = Router();

router.get('/', handleListJobs);
router.get('/:jobId', handleGetJob);
router.get('/:jobId/candidates', handleGetJobCandidates);

export default router;
