import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware';
import { uploadVideo } from '../../../middlewares/upload.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { asyncHandler } from '../../../utils/async-handler';
import { projectsController } from '../controllers/projects.controller';
import { createProjectSchema, projectIdSchema } from '../validators/projects.validator';

export const projectsRouter = Router();

projectsRouter.use(authenticate);

projectsRouter.post('/', validate(createProjectSchema), asyncHandler(projectsController.createProject));
projectsRouter.get('/', asyncHandler(projectsController.listProjects));
projectsRouter.get('/:id', validate(projectIdSchema), asyncHandler(projectsController.getProjectById));
projectsRouter.post('/:id/upload', validate(projectIdSchema), uploadVideo.single('video'), asyncHandler(projectsController.uploadVideo));
projectsRouter.get('/:id/status', validate(projectIdSchema), asyncHandler(projectsController.getProjectStatus));
