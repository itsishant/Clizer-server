import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { asyncHandler } from '../../../utils/async-handler';
import { clipsController } from '../controllers/clips.controller';
import { clipIdSchema, createCaptionSchema, createExportSchema, updateClipSchema } from '../validators/clips.validator';

export const clipsRouter = Router();

clipsRouter.use(authenticate);
clipsRouter.get('/:id', validate(clipIdSchema), asyncHandler(clipsController.getClipById));
clipsRouter.patch('/:id', validate(updateClipSchema), asyncHandler(clipsController.updateClip));
clipsRouter.post('/:id/captions', validate(createCaptionSchema), asyncHandler(clipsController.createCaption));
clipsRouter.post('/:id/export', validate(createExportSchema), asyncHandler(clipsController.requestExport));
