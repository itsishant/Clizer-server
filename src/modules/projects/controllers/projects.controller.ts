import { Request, Response } from 'express';
import { projectsService } from '../services/projects.service';

export const projectsController = {
  async createProject(req: Request, res: Response): Promise<void> {
    const data = await projectsService.createProject({
      workspaceId: req.body.workspaceId,
      title: req.body.title,
      description: req.body.description,
      platformTargets: req.body.platformTargets,
      userId: req.user!.id,
      role: req.user!.role
    });
    res.status(201).json({ data });
  },

  async listProjects(req: Request, res: Response): Promise<void> {
    const data = await projectsService.listProjects(req.user!.id, req.user!.role);
    res.status(200).json({ data });
  },

  async getProjectById(req: Request, res: Response): Promise<void> {
    const projectId = String(req.params.id);
    const data = await projectsService.getProjectById(projectId, req.user!.id, req.user!.role);
    res.status(200).json({ data });
  },

  async uploadVideo(req: Request, res: Response): Promise<void> {
    const projectId = String(req.params.id);
    const data = await projectsService.uploadProjectVideo({
      projectId,
      userId: req.user!.id,
      role: req.user!.role,
      file: req.file
    });
    res.status(201).json({ data });
  },

  async getProjectStatus(req: Request, res: Response): Promise<void> {
    const projectId = String(req.params.id);
    const data = await projectsService.getProjectStatus(projectId, req.user!.id, req.user!.role);
    res.status(200).json({ data });
  }
};
