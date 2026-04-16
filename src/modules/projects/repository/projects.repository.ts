import { Prisma, ProjectStatus, Role } from '@prisma/client';
import { prisma } from '../../../config/prisma';

export const projectsRepository = {
  findWorkspaceMembership(workspaceId: string, userId: string) {
    return prisma.membership.findFirst({
      where: {
        workspaceId,
        userId
      }
    });
  },

  createProject(data: Prisma.ProjectUncheckedCreateInput) {
    return prisma.project.create({
      data,
      include: {
        workspace: {
          select: { id: true, name: true, organizationId: true }
        }
      }
    });
  },

  listProjects(userId: string, role: Role) {
    return prisma.project.findMany({
      where:
        role === Role.super_admin
          ? undefined
          : {
              workspace: {
                memberships: {
                  some: {
                    userId
                  }
                }
              }
            },
      include: {
        workspace: { select: { id: true, name: true } },
        sourceVideo: { select: { id: true, fileName: true, status: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  getProjectById(projectId: string, userId: string, role: Role) {
    return prisma.project.findFirst({
      where:
        role === Role.super_admin
          ? { id: projectId }
          : {
              id: projectId,
              workspace: {
                memberships: {
                  some: {
                    userId
                  }
                }
              }
            },
      include: {
        workspace: { select: { id: true, name: true, organizationId: true } },
        sourceVideo: true,
        jobs: { orderBy: { createdAt: 'desc' }, take: 5 },
        clips: { orderBy: { createdAt: 'desc' }, take: 10 }
      }
    });
  },

  updateProjectStatus(projectId: string, status: ProjectStatus) {
    return prisma.project.update({
      where: { id: projectId },
      data: { status }
    });
  },

  getLatestProjectJob(projectId: string) {
    return prisma.processingJob.findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    });
  },

  countProjectClips(projectId: string) {
    return prisma.clip.count({ where: { projectId } });
  }
};
