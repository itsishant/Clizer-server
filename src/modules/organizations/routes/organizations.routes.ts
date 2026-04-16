import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { asyncHandler } from '../../../utils/async-handler';
import { organizationsController } from '../controllers/organizations.controller';
import { createOrganizationSchema, getOrganizationByIdSchema } from '../validators/organizations.validator';

export const organizationsRouter = Router();

organizationsRouter.use(authenticate);
organizationsRouter.post('/', validate(createOrganizationSchema), asyncHandler(organizationsController.createOrganization));
organizationsRouter.get('/', asyncHandler(organizationsController.listOrganizations));
organizationsRouter.get('/:id', validate(getOrganizationByIdSchema), asyncHandler(organizationsController.getOrganizationById));
