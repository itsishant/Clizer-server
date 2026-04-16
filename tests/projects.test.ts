import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/middlewares/auth.middleware', () => ({
  authenticate: (req: any, _res: any, next: any) => {
    req.user = {
      id: 'user-1',
      email: 'user@clizer.ai',
      role: 'org_admin'
    };
    next();
  }
}));

vi.mock('../src/modules/projects/services/projects.service', () => ({
  projectsService: {
    createProject: vi.fn(),
    listProjects: vi.fn(),
    getProjectById: vi.fn(),
    uploadProjectVideo: vi.fn(),
    getProjectStatus: vi.fn()
  }
}));

import { app } from '../src/app';
import { projectsService } from '../src/modules/projects/services/projects.service';

const mockedProjectsService = vi.mocked(projectsService);

describe('projects endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create project', async () => {
    mockedProjectsService.createProject.mockResolvedValue({
      id: 'project-1',
      title: 'Podcast Episode',
      workspaceId: 'workspace-1'
    } as any);

    const response = await request(app).post('/api/projects').send({
      workspaceId: 'workspace-1',
      title: 'Podcast Episode',
      description: 'Sample project',
      platformTargets: ['youtube_shorts', 'tiktok']
    });

    expect(response.status).toBe(201);
    expect(response.body.data.id).toBe('project-1');
  });

  it('should reject upload when mime type is invalid', async () => {
    const response = await request(app)
      .post('/api/projects/project-1/upload')
      .attach('video', Buffer.from('not-a-video'), {
        filename: 'invalid.txt',
        contentType: 'text/plain'
      });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe('Invalid video mime type');
  });
});
