import { Router } from 'express';
import { adminRouter } from '../modules/admin/routes/admin.routes';
import { authRouter } from '../modules/auth/routes/auth.routes';
import { clipsRouter } from '../modules/clips/routes/clips.routes';
import { exportsRouter } from '../modules/exports/routes/exports.routes';
import { landingPublicRouter } from '../modules/landing/routes/landing-public.routes';
import { organizationsRouter } from '../modules/organizations/routes/organizations.routes';
import { processingRouter } from '../modules/processing/routes/processing.routes';
import { projectsRouter } from '../modules/projects/routes/projects.routes';
import { usersRouter } from '../modules/users/routes/users.routes';
import { workspacesRouter } from '../modules/workspaces/routes/workspaces.routes';

export const appRouter = Router();

appRouter.use('/public', landingPublicRouter);
appRouter.use('/auth', authRouter);
appRouter.use('/organizations', organizationsRouter);
appRouter.use('/workspaces', workspacesRouter);
appRouter.use('/projects', projectsRouter);
appRouter.use('/projects', processingRouter);
appRouter.use('/clips', clipsRouter);
appRouter.use('/exports', exportsRouter);
appRouter.use('/users', usersRouter);
appRouter.use('/admin', adminRouter);
