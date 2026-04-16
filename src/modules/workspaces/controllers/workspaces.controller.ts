import { Request, Response } from 'express';
import { workspacesService } from '../services/workspaces.service';

export const workspacesController = {
  async createWorkspace(req: Request, res: Response): Promise<void> {
    const data = await workspacesService.createWorkspace({
      organizationId: req.body.organizationId,
      name: req.body.name,
      userId: req.user!.id,
      userRole: req.user!.role
    });
    res.status(201).json({ data });
  },

  async getWorkspaceById(req: Request, res: Response): Promise<void> {
    const workspaceId = String(req.params.id);
    const data = await workspacesService.getWorkspaceById(workspaceId, req.user!.id, req.user!.role);
    res.status(200).json({ data });
  },

  async inviteMember(req: Request, res: Response): Promise<void> {
    const workspaceId = String(req.params.id);
    const data = await workspacesService.inviteMember({
      workspaceId,
      email: req.body.email,
      role: req.body.role,
      inviterId: req.user!.id,
      inviterRole: req.user!.role
    });
    res.status(201).json(data);
  },

  async getMembers(req: Request, res: Response): Promise<void> {
    const workspaceId = String(req.params.id);
    const data = await workspacesService.listWorkspaceMembers(workspaceId, req.user!.id, req.user!.role);
    res.status(200).json({ data });
  }
};
