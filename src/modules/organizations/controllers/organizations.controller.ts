import { Request, Response } from 'express';
import { organizationsService } from '../services/organizations.service';

export const organizationsController = {
  async createOrganization(req: Request, res: Response): Promise<void> {
    const data = await organizationsService.createOrganization({
      name: req.body.name,
      ownerId: req.user!.id
    });
    res.status(201).json({ data });
  },

  async listOrganizations(req: Request, res: Response): Promise<void> {
    const data = await organizationsService.listOrganizations(req.user!.id);
    res.status(200).json({ data });
  },

  async getOrganizationById(req: Request, res: Response): Promise<void> {
    const organizationId = String(req.params.id);
    const data = await organizationsService.getOrganizationById(organizationId, req.user!.id);
    res.status(200).json({ data });
  }
};
