import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { asyncHandler } from '../../../utils/async-handler';
import { usersController } from '../controllers/users.controller';
import { userIdSchema } from '../validators/users.validator';

export const usersRouter = Router();

usersRouter.use(authenticate);
usersRouter.get('/me', asyncHandler(usersController.me));
usersRouter.get('/:id', validate(userIdSchema), asyncHandler(usersController.getById));
