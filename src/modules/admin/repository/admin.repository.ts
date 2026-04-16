import { prisma } from '../../../config/prisma';

export const adminRepository = {
  async listUsers() {
    return prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async listProjects() {
    return prisma.project.findMany({
      include: {
        workspace: { select: { id: true, name: true, organizationId: true } },
        sourceVideo: { select: { id: true, fileName: true, status: true } },
        creator: { select: { id: true, email: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async listJobs() {
    return prisma.processingJob.findMany({
      include: {
        project: { select: { id: true, title: true, status: true } },
        creator: { select: { id: true, email: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
};
