import { Prisma, Role } from '@prisma/client';
import { prisma } from '../../../config/prisma';

export const clipsRepository = {
  getClipForUser(clipId: string, userId: string, role: Role) {
    return prisma.clip.findFirst({
      where:
        role === Role.super_admin
          ? { id: clipId }
          : {
              id: clipId,
              project: {
                workspace: {
                  memberships: {
                    some: {
                      userId
                    }
                  }
                }
              }
            },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            workspaceId: true
          }
        },
        captions: {
          orderBy: { createdAt: 'desc' }
        },
        exports: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  },

  updateClip(clipId: string, data: Prisma.ClipUncheckedUpdateInput) {
    return prisma.clip.update({
      where: { id: clipId },
      data
    });
  },

  createAuditLog(data: Prisma.AuditLogUncheckedCreateInput) {
    return prisma.auditLog.create({ data });
  }
};
