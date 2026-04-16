import bcrypt from 'bcrypt';
import {
  ClipStatus,
  JobStatus,
  PrismaClient,
  ProjectStatus,
  Role,
  SourceVideoStatus,
  TargetPlatform
} from '@prisma/client';
import { defaultLandingContent } from '../src/modules/landing/validators/landing.default';

const prisma = new PrismaClient();

const run = async () => {
  const passwordHash = await bcrypt.hash('Clizer@12345', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@clizer.ai' },
    update: {
      name: 'Clizer Super Admin',
      role: Role.super_admin,
      passwordHash,
      isActive: true
    },
    create: {
      email: 'superadmin@clizer.ai',
      name: 'Clizer Super Admin',
      role: Role.super_admin,
      passwordHash,
      isActive: true
    }
  });

  const organization = await prisma.organization.upsert({
    where: { slug: 'clizer-media' },
    update: {
      name: 'Clizer Media',
      ownerId: superAdmin.id
    },
    create: {
      name: 'Clizer Media',
      slug: 'clizer-media',
      ownerId: superAdmin.id
    }
  });

  const workspace = await prisma.workspace.upsert({
    where: {
      organizationId_slug: {
        organizationId: organization.id,
        slug: 'main-workspace'
      }
    },
    update: {
      name: 'Main Workspace'
    },
    create: {
      organizationId: organization.id,
      name: 'Main Workspace',
      slug: 'main-workspace'
    }
  });

  await prisma.membership.createMany({
    data: [
      {
        userId: superAdmin.id,
        organizationId: organization.id,
        workspaceId: null,
        role: Role.org_admin
      },
      {
        userId: superAdmin.id,
        organizationId: organization.id,
        workspaceId: workspace.id,
        role: Role.org_admin
      }
    ],
    skipDuplicates: true
  });

  let sourceVideo = await prisma.sourceVideo.findFirst({
    where: {
      workspaceId: workspace.id,
      storagePath: 'uploads/founder-podcast-episode-42.mp4'
    }
  });

  if (!sourceVideo) {
    sourceVideo = await prisma.sourceVideo.create({
      data: {
        workspaceId: workspace.id,
        uploadedById: superAdmin.id,
        fileName: 'founder-podcast-episode-42.mp4',
        mimeType: 'video/mp4',
        sizeBytes: BigInt(942003200),
        storagePath: 'uploads/founder-podcast-episode-42.mp4',
        durationSeconds: 3220,
        status: SourceVideoStatus.ready
      }
    });
  }

  let project = await prisma.project.findFirst({
    where: {
      workspaceId: workspace.id,
      title: 'Founder Podcast Episode 42'
    }
  });

  if (!project) {
    project = await prisma.project.create({
      data: {
        workspaceId: workspace.id,
        title: 'Founder Podcast Episode 42',
        description: 'Pilot project for automated short clip generation',
        sourceVideoId: sourceVideo.id,
        platformTargets: [
          TargetPlatform.youtube_shorts,
          TargetPlatform.tiktok,
          TargetPlatform.instagram_reels
        ],
        status: ProjectStatus.completed,
        createdBy: superAdmin.id
      }
    });
  }

  let job = await prisma.processingJob.findFirst({
    where: {
      projectId: project.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (!job) {
    job = await prisma.processingJob.create({
      data: {
        projectId: project.id,
        status: JobStatus.completed,
        progress: 100,
        createdBy: superAdmin.id
      }
    });
  }

  const existingClips = await prisma.clip.count({ where: { projectId: project.id } });

  if (existingClips === 0) {
    await prisma.clip.createMany({
      data: [
        {
          projectId: project.id,
          jobId: job.id,
          title: 'Opening Hook',
          description: 'First high-performing hook segment',
          hookText: 'This one workflow changed our content operations',
          startTime: 70,
          endTime: 103,
          duration: 33,
          score: 0.94,
          targetPlatform: TargetPlatform.youtube_shorts,
          transcriptSnippet: 'The first 30 seconds decide retention',
          captionStyle: 'bold-modern',
          thumbnailUrl: '/thumbnails/opening-hook.jpg',
          exportUrl: '/downloads/opening-hook.mp4',
          status: ClipStatus.exported
        },
        {
          projectId: project.id,
          jobId: job.id,
          title: 'Core Insight',
          description: 'Educational core point with strong clarity',
          hookText: 'You do not need a larger team to publish more',
          startTime: 768,
          endTime: 812,
          duration: 44,
          score: 0.91,
          targetPlatform: TargetPlatform.tiktok,
          transcriptSnippet: 'Use systemized clip extraction and review gates',
          captionStyle: 'minimal-clean',
          thumbnailUrl: '/thumbnails/core-insight.jpg',
          exportUrl: '/downloads/core-insight.mp4',
          status: ClipStatus.exported
        },
        {
          projectId: project.id,
          jobId: job.id,
          title: 'Story Segment',
          description: 'Narrative clip ideal for Reels audiences',
          hookText: 'We used to spend 2 days on this one task',
          startTime: 1574,
          endTime: 1626,
          duration: 52,
          score: 0.89,
          targetPlatform: TargetPlatform.instagram_reels,
          transcriptSnippet: 'Consistency arrived once process replaced guesswork',
          captionStyle: 'creator-pop',
          thumbnailUrl: '/thumbnails/story-segment.jpg',
          exportUrl: '/downloads/story-segment.mp4',
          status: ClipStatus.exported
        }
      ]
    });
  }

  await prisma.landingContent.upsert({
    where: { id: 'landing-default' },
    update: {
      hero: defaultLandingContent.hero as any,
      marquee: defaultLandingContent.marquee as any,
      features: defaultLandingContent.features as any,
      workflow: defaultLandingContent.workflow as any,
      testimonials: defaultLandingContent.testimonials as any,
      stats: defaultLandingContent.stats as any
    },
    create: {
      id: 'landing-default',
      hero: defaultLandingContent.hero as any,
      marquee: defaultLandingContent.marquee as any,
      features: defaultLandingContent.features as any,
      workflow: defaultLandingContent.workflow as any,
      testimonials: defaultLandingContent.testimonials as any,
      stats: defaultLandingContent.stats as any
    }
  });

  process.stdout.write('Seed completed\n');
};

run()
  .catch((error) => {
    process.stderr.write(`${error}\n`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
