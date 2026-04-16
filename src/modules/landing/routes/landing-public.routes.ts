import { Router } from 'express';
import { publicRateLimiter } from '../../../middlewares/rate-limit.middleware';
import { asyncHandler } from '../../../utils/async-handler';
import { landingPublicController } from '../controllers/landing-public.controller';

export const landingPublicRouter = Router();

landingPublicRouter.get('/landing', publicRateLimiter, asyncHandler(landingPublicController.getLanding));
