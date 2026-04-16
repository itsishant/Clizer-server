import { Request, Response } from 'express';
import { processingService } from '../services/processing.service';

export const processingController = {
  async triggerProcessing(req: Request, res: Response): Promise<void> {
    const projectId = String(req.params.id);
    const data = await processingService.triggerProcessing(projectId, req.user!.id, req.user!.role);
    res.status(202).json({ data });
  },

  async listJobs(req: Request, res: Response): Promise<void> {
    const projectId = String(req.params.id);
    const data = await processingService.listProjectJobs(projectId, req.user!.id, req.user!.role);
    res.status(200).json({ data });
  },

  async listClips(req: Request, res: Response): Promise<void> {
    const projectId = String(req.params.id);
    const data = await processingService.listProjectClips(projectId, req.user!.id, req.user!.role);
    res.status(200).json({ data });
  }
};
