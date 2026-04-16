import { Role } from '@prisma/client';
import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware';
import { authorize } from '../../../middlewares/rbac.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { asyncHandler } from '../../../utils/async-handler';
import { adminController } from '../controllers/admin.controller';
import {
  updateFeaturesSchema,
  updateHeroSchema,
  updateMarqueeSchema,
  updateStatsSchema,
  updateTestimonialsSchema,
  updateWorkflowSchema
} from '../../landing/validators/landing.validator';

export const adminRouter = Router();

adminRouter.use(authenticate);

adminRouter.get('/landing', authorize(Role.super_admin, Role.org_admin), asyncHandler(adminController.getLanding));
adminRouter.put('/landing/hero', authorize(Role.super_admin, Role.org_admin), validate(updateHeroSchema), asyncHandler(adminController.updateHero));
adminRouter.put('/landing/marquee', authorize(Role.super_admin, Role.org_admin), validate(updateMarqueeSchema), asyncHandler(adminController.updateMarquee));
adminRouter.put('/landing/features', authorize(Role.super_admin, Role.org_admin), validate(updateFeaturesSchema), asyncHandler(adminController.updateFeatures));
adminRouter.put('/landing/workflow', authorize(Role.super_admin, Role.org_admin), validate(updateWorkflowSchema), asyncHandler(adminController.updateWorkflow));
adminRouter.put('/landing/testimonials', authorize(Role.super_admin, Role.org_admin), validate(updateTestimonialsSchema), asyncHandler(adminController.updateTestimonials));
adminRouter.put('/landing/stats', authorize(Role.super_admin, Role.org_admin), validate(updateStatsSchema), asyncHandler(adminController.updateStats));

adminRouter.get('/users', authorize(Role.super_admin), asyncHandler(adminController.listUsers));
adminRouter.get('/projects', authorize(Role.super_admin), asyncHandler(adminController.listProjects));
adminRouter.get('/jobs', authorize(Role.super_admin), asyncHandler(adminController.listJobs));
