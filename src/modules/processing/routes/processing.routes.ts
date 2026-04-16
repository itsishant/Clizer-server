import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { asyncHandler } from '../../../utils/async-handler';
import { processingController } from '../controllers/processing.controller';
import { processProjectSchema, projectClipsSchema, projectJobsSchema } from '../validators/processing.validator';

export const processingRouter = Router();

processingRouter.use(authenticate);
processingRouter.post('/:id/process', validate(processProjectSchema), asyncHandler(processingController.triggerProcessing));
processingRouter.get('/:id/jobs', validate(projectJobsSchema), asyncHandler(processingController.listJobs));
processingRouter.get('/:id/clips', validate(projectClipsSchema), asyncHandler(processingController.listClips));
