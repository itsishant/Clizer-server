import { ExportStatus, Prisma, Role } from '@prisma/client';
import { prisma } from '../../../config/prisma';

export const exportsRepository = {
  createExport(data: Prisma.ExportUncheckedCreateInput) {
    return prisma.export.create({ data });
  },

  updateExport(exportId: string, data: Prisma.ExportUncheckedUpdateInput) {
    return prisma.export.update({
      where: { id: exportId },
      data
    });
  },

  updateClipForExport(clipId: string, exportUrl: string) {
    return prisma.clip.update({
      where: { id: clipId },
      data: {
        exportUrl,
        status: 'exported'
      }
    });
  },

  getExportForUser(exportId: string, userId: string, role: Role) {
    return prisma.export.findFirst({
      where:
        role === Role.super_admin
          ? { id: exportId }
          : {
              id: exportId,
              clip: {
                project: {
                  workspace: {
                    memberships: {
                      some: {
                        userId
                      }
                    }
                  }
                }
              }
            },
      include: {
        clip: {
          select: {
            id: true,
            title: true,
            projectId: true,
            status: true
          }
        }
      }
    });
  },

  markExportCompleted(exportId: string, downloadUrl: string) {
    return prisma.export.update({
      where: { id: exportId },
      data: {
        status: ExportStatus.completed,
        downloadUrl
      }
    });
  },

  createAuditLog(data: Prisma.AuditLogUncheckedCreateInput) {
    return prisma.auditLog.create({ data });
  }
};
