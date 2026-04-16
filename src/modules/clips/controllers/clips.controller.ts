import { Request, Response } from 'express';
import { clipsService } from '../services/clips.service';

export const clipsController = {
  async getClipById(req: Request, res: Response): Promise<void> {
    const clipId = String(req.params.id);
    const data = await clipsService.getClipById(clipId, req.user!.id, req.user!.role);
    res.status(200).json({ data });
  },

  async updateClip(req: Request, res: Response): Promise<void> {
    const clipId = String(req.params.id);
    const data = await clipsService.updateClip(clipId, req.user!.id, req.user!.role, req.body);
    res.status(200).json({ data });
  },

  async createCaption(req: Request, res: Response): Promise<void> {
    const clipId = String(req.params.id);
    const data = await clipsService.createCaption(clipId, req.user!.id, req.user!.role, req.body);
    res.status(201).json({ data });
  },

  async requestExport(req: Request, res: Response): Promise<void> {
    const clipId = String(req.params.id);
    const data = await clipsService.requestExport(clipId, req.user!.id, req.user!.role, req.body);
    res.status(202).json({ data });
  }
};
