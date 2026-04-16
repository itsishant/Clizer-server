import { ClipStatus, JobStatus, Prisma, ProjectStatus, Role, TargetPlatform } from '@prisma/client';
import { prisma } from '../../../config/prisma';

export const processingRepository = {
  getProjectForUser(projectId: string, userId: string, role: Role) {
    return prisma.project.findFirst({
      where:
        role === Role.super_admin
          ? { id: projectId }
          : {
              id: projectId,
              workspace: { memberships: { some: { userId } } }
            },
      include: { sourceVideo: true }
    });
  },

  createJob(data: Prisma.ProcessingJobUncheckedCreateInput) {
    return prisma.processingJob.create({ data });
  },

  updateJob(jobId: string, data: Prisma.ProcessingJobUncheckedUpdateInput) {
    return prisma.processingJob.update({
      where: { id: jobId },
      data
    });
  },

  updateProjectStatus(projectId: string, status: ProjectStatus) {
    return prisma.project.update({
      where: { id: projectId },
      data: { status }
    });
  },

  createManyClips(projectId: string, jobId: string) {
    return prisma.$transaction([
      prisma.clip.create({
        data: {
          projectId,
          jobId,
          title: 'Opening Hook',
          description: 'High-retention intro segment',
          hookText: 'You are wasting hours editing clips by hand',
          startTime: 70,
          endTime: 103,
          duration: 33,
          score: 0.94,
          targetPlatform: TargetPlatform.youtube_shorts,
          transcriptSnippet: 'Most teams can repurpose this in minutes',
          captionStyle: 'bold-modern',
          thumbnailUrl: '/thumbnails/opening-hook.jpg',
          status: ClipStatus.ready
        }
      }),
      prisma.clip.create({
        data: {
          projectId,
          jobId,
          title: 'Core Insight',
          description: 'Main lesson with strong educational value',
          hookText: 'The workflow that scaled content output',
          startTime: 768,
          endTime: 812,
          duration: 44,
          score: 0.91,
          targetPlatform: TargetPlatform.tiktok,
          transcriptSnippet: 'A repeatable short-form pipeline matters most',
          captionStyle: 'minimal-clean',
          thumbnailUrl: '/thumbnails/core-insight.jpg',
          status: ClipStatus.ready
        }
      }),
      prisma.clip.create({
        data: {
          projectId,
          jobId,
          title: 'Story Segment',
          description: 'Narrative moment with emotional peak',
          hookText: 'What changed after adopting Clizer',
          startTime: 1574,
          endTime: 1626,
          duration: 52,
          score: 0.89,
          targetPlatform: TargetPlatform.instagram_reels,
          transcriptSnippet: 'We moved from ad-hoc edits to a system',
          captionStyle: 'creator-pop',
          thumbnailUrl: '/thumbnails/story-segment.jpg',
          status: ClipStatus.ready
        }
      })
    ]);
  },

  listProjectJobs(projectId: string) {
    return prisma.processingJob.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    });
  },

  listProjectClips(projectId: string) {
    return prisma.clip.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    });
  },

  createAuditLog(data: Prisma.AuditLogUncheckedCreateInput) {
    return prisma.auditLog.create({ data });
  },

  setProjectSourceReady(sourceVideoId: string) {
    return prisma.sourceVideo.update({
      where: { id: sourceVideoId },
      data: { status: 'ready' }
    });
  }
};
