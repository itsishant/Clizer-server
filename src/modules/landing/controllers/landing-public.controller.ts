import { Request, Response } from 'express';
import { landingService } from '../services/landing.service';

export const landingPublicController = {
  async getLanding(_req: Request, res: Response): Promise<void> {
    const data = await landingService.getPublicLanding();
    res.status(200).json(data);
  }
};
