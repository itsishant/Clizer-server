import { ExportStatus, Role } from '@prisma/client';
import { AppError } from '../../../utils/app-error';
import { exportsRepository } from '../repository/exports.repository';

export const exportsService = {
  async createExport(input: { clipId: string; format: string; resolution: string; userId: string }) {
    const record = await exportsRepository.createExport({
      clipId: input.clipId,
      format: input.format,
      resolution: input.resolution,
      status: ExportStatus.processing
    });

    const downloadUrl = `/downloads/${record.id}.${input.format.toLowerCase()}`;

    const completed = await exportsRepository.markExportCompleted(record.id, downloadUrl);
    await exportsRepository.updateClipForExport(input.clipId, completed.downloadUrl || downloadUrl);

    await exportsRepository.createAuditLog({
      actorId: input.userId,
      action: 'clip.export_requested',
      entity: 'Export',
      entityId: completed.id,
      metadata: {
        clipId: input.clipId,
        format: input.format,
        resolution: input.resolution
      }
    });

    return completed;
  },

  async getExportById(exportId: string, userId: string, role: Role) {
    const data = await exportsRepository.getExportForUser(exportId, userId, role);
    if (!data) {
      throw new AppError('Export not found', 404);
    }
    return data;
  }
};
