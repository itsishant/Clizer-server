import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware';
import { authRateLimiter } from '../../../middlewares/rate-limit.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { asyncHandler } from '../../../utils/async-handler';
import { authController } from '../controllers/auth.controller';
import {
  forgotPasswordSchema,
  loginSchema,
  logoutSchema,
  refreshSchema,
  resetPasswordSchema,
  signupSchema
} from '../validators/auth.validator';

export const authRouter = Router();

authRouter.post('/signup', authRateLimiter, validate(signupSchema), asyncHandler(authController.signup));
authRouter.post('/login', authRateLimiter, validate(loginSchema), asyncHandler(authController.login));
authRouter.post('/logout', validate(logoutSchema), asyncHandler(authController.logout));
authRouter.post('/refresh', validate(refreshSchema), asyncHandler(authController.refresh));
authRouter.post('/forgot-password', authRateLimiter, validate(forgotPasswordSchema), asyncHandler(authController.forgotPassword));
authRouter.post('/reset-password', authRateLimiter, validate(resetPasswordSchema), asyncHandler(authController.resetPassword));
authRouter.get('/me', authenticate, asyncHandler(authController.me));
