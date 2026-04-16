import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';

export const adminController = {
  async getLanding(_req: Request, res: Response): Promise<void> {
    const data = await adminService.getLanding();
    res.status(200).json(data);
  },

  async updateHero(req: Request, res: Response): Promise<void> {
    const data = await adminService.updateHero(req.body);
    res.status(200).json(data);
  },

  async updateMarquee(req: Request, res: Response): Promise<void> {
    const data = await adminService.updateMarquee(req.body);
    res.status(200).json(data);
  },

  async updateFeatures(req: Request, res: Response): Promise<void> {
    const data = await adminService.updateFeatures(req.body);
    res.status(200).json(data);
  },

  async updateWorkflow(req: Request, res: Response): Promise<void> {
    const data = await adminService.updateWorkflow(req.body);
    res.status(200).json(data);
  },

  async updateTestimonials(req: Request, res: Response): Promise<void> {
    const data = await adminService.updateTestimonials(req.body);
    res.status(200).json(data);
  },

  async updateStats(req: Request, res: Response): Promise<void> {
    const data = await adminService.updateStats(req.body);
    res.status(200).json(data);
  },

  async listUsers(_req: Request, res: Response): Promise<void> {
    const data = await adminService.listUsers();
    res.status(200).json({ data });
  },

  async listProjects(_req: Request, res: Response): Promise<void> {
    const data = await adminService.listProjects();
    res.status(200).json({ data });
  },

  async listJobs(_req: Request, res: Response): Promise<void> {
    const data = await adminService.listJobs();
    res.status(200).json({ data });
  }
};
