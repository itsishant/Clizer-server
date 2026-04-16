import { JobStatus, Role } from '@prisma/client';
import { processingQueue } from '../../../config/queue';
import { AppError } from '../../../utils/app-error';
import { processingRepository } from '../repository/processing.repository';

const runImmediateProcessing = async (jobId: string, projectId: string, sourceVideoId?: string) => {
  await processingRepository.updateJob(jobId, { status: JobStatus.analyzing, progress: 30 });
  await processingRepository.updateJob(jobId, { status: JobStatus.segmenting, progress: 55 });
  await processingRepository.updateJob(jobId, { status: JobStatus.captioning, progress: 75 });
  await processingRepository.updateJob(jobId, { status: JobStatus.rendering, progress: 90 });
  await processingRepository.createManyClips(projectId, jobId);
  await processingRepository.updateJob(jobId, { status: JobStatus.completed, progress: 100 });
  await processingRepository.updateProjectStatus(projectId, 'completed');
  if (sourceVideoId) {
    await processingRepository.setProjectSourceReady(sourceVideoId);
  }
};

export const processingService = {
  async triggerProcessing(projectId: string, userId: string, role: Role) {
    const project = await processingRepository.getProjectForUser(projectId, userId, role);

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    if (!project.sourceVideoId || !project.sourceVideo) {
      throw new AppError('Source video is required before processing', 400);
    }

    await processingRepository.updateProjectStatus(project.id, 'processing');

    const job = await processingRepository.createJob({
      projectId: project.id,
      status: JobStatus.queued,
      progress: 0,
      createdBy: userId
    });

    if (processingQueue) {
      await processingQueue.add('process-project', {
        projectId: project.id,
        jobId: job.id,
        sourceVideoId: project.sourceVideoId,
        createdBy: userId
      });
    } else {
      await runImmediateProcessing(job.id, project.id, project.sourceVideoId ?? undefined);
    }

    await processingRepository.createAuditLog({
      actorId: userId,
      action: 'project.process_triggered',
      entity: 'Project',
      entityId: project.id,
      metadata: {
        jobId: job.id
      }
    });

    return {
      jobId: job.id,
      projectId: project.id,
      status: processingQueue ? JobStatus.queued : JobStatus.completed
    };
  },

  async listProjectJobs(projectId: string, userId: string, role: Role) {
    const project = await processingRepository.getProjectForUser(projectId, userId, role);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    return processingRepository.listProjectJobs(projectId);
  },

  async listProjectClips(projectId: string, userId: string, role: Role) {
    const project = await processingRepository.getProjectForUser(projectId, userId, role);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    return processingRepository.listProjectClips(projectId);
  }
};
