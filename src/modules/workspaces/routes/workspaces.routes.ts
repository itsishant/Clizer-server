import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { asyncHandler } from '../../../utils/async-handler';
import { workspacesController } from '../controllers/workspaces.controller';
import { createWorkspaceSchema, inviteMemberSchema, workspaceIdSchema } from '../validators/workspaces.validator';

export const workspacesRouter = Router();

workspacesRouter.use(authenticate);

workspacesRouter.post('/', validate(createWorkspaceSchema), asyncHandler(workspacesController.createWorkspace));
workspacesRouter.get('/:id', validate(workspaceIdSchema), asyncHandler(workspacesController.getWorkspaceById));
workspacesRouter.post('/:id/invite', validate(inviteMemberSchema), asyncHandler(workspacesController.inviteMember));
workspacesRouter.get('/:id/members', validate(workspaceIdSchema), asyncHandler(workspacesController.getMembers));
