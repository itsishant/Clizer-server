import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { asyncHandler } from '../../../utils/async-handler';
import { exportsController } from '../controllers/exports.controller';
import { exportIdSchema } from '../validators/exports.validator';

export const exportsRouter = Router();

exportsRouter.use(authenticate);
exportsRouter.get('/:id', validate(exportIdSchema), asyncHandler(exportsController.getExportById));
