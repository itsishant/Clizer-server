import { Request, Response } from 'express';
import { usersService } from '../services/users.service';

export const usersController = {
  async me(req: Request, res: Response): Promise<void> {
    const data = await usersService.getMe(req.user!.id);
    res.status(200).json({ data });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const userId = String(req.params.id);
    const data = await usersService.getUserById(userId, req.user!.role);
    res.status(200).json({ data });
  }
};
