import { Role } from '@prisma/client';
import { AppError } from '../../../utils/app-error';
import { projectsRepository } from '../repository/projects.repository';
import { uploadsService } from '../../uploads/services/uploads.service';

export const projectsService = {
  async createProject(input: {
    workspaceId: string;
    title: string;
    description?: string;
    platformTargets: string[];
    userId: string;
    role: Role;
  }) {
    if (input.role !== Role.super_admin) {
      const membership = await projectsRepository.findWorkspaceMembership(input.workspaceId, input.userId);
      if (!membership) {
        throw new AppError('Forbidden', 403);
      }
    }

    return projectsRepository.createProject({
      workspaceId: input.workspaceId,
      title: input.title,
      description: input.description,
      platformTargets: input.platformTargets as any,
      createdBy: input.userId
    });
  },

  async listProjects(userId: string, role: Role) {
    return projectsRepository.listProjects(userId, role);
  },

  async getProjectById(projectId: string, userId: string, role: Role) {
    const project = await projectsRepository.getProjectById(projectId, userId, role);
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    return project;
  },

  async uploadProjectVideo(input: {
    projectId: string;
    userId: string;
    role: Role;
    file?: Express.Multer.File;
  }) {
    return uploadsService.uploadProjectSourceVideo(input);
  },

  async getProjectStatus(projectId: string, userId: string, role: Role) {
    const project = await projectsRepository.getProjectById(projectId, userId, role);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const [latestJob, clipCount] = await Promise.all([
      projectsRepository.getLatestProjectJob(projectId),
      projectsRepository.countProjectClips(projectId)
    ]);

    return {
      projectId: project.id,
      status: project.status,
      sourceVideoStatus: project.sourceVideo?.status ?? null,
      latestJobStatus: latestJob?.status ?? null,
      latestJobProgress: latestJob?.progress ?? null,
      clipsCount: clipCount,
      updatedAt: project.updatedAt
    };
  }
};
