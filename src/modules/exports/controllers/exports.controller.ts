import { Request, Response } from 'express';
import { exportsService } from '../services/exports.service';

export const exportsController = {
  async getExportById(req: Request, res: Response): Promise<void> {
    const exportId = String(req.params.id);
    const data = await exportsService.getExportById(exportId, req.user!.id, req.user!.role);
    res.status(200).json({ data });
  }
};
