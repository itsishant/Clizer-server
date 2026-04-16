import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/middlewares/auth.middleware', () => ({
  authenticate: (req: any, _res: any, next: any) => {
    req.user = {
      id: 'admin-1',
      email: 'admin@clizer.ai',
      role: 'super_admin'
    };
    next();
  }
}));

vi.mock('../src/modules/admin/services/admin.service', () => ({
  adminService: {
    getLanding: vi.fn(),
    updateHero: vi.fn(),
    updateMarquee: vi.fn(),
    updateFeatures: vi.fn(),
    updateWorkflow: vi.fn(),
    updateTestimonials: vi.fn(),
    updateStats: vi.fn(),
    listUsers: vi.fn(),
    listProjects: vi.fn(),
    listJobs: vi.fn()
  }
}));

import { app } from '../src/app';
import { adminService } from '../src/modules/admin/services/admin.service';

const mockedAdminService = vi.mocked(adminService);

describe('admin landing update endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update hero section', async () => {
    mockedAdminService.updateHero.mockResolvedValue({
      hero: {
        brand: 'Clizer',
        badge: 'Built for creators and media teams',
        title: 'Turn Every Long Video Into High-Performing Shorts',
        subtitle: 'From podcasts to webinars',
        primaryCta: 'Start Free Trial',
        secondaryCta: 'See Product Tour',
        trustText: 'No credit card required. Export in 1080p.',
        nav: [
          { label: 'Features', href: '#features' },
          { label: 'Workflow', href: '#workflow' }
        ],
        clipSource: 'founder-podcast-episode-42.mp4',
        clipCountText: '12 strong short clips detected',
        clips: ['clip 1'],
        metrics: ['metric 1']
      },
      marquee: [],
      features: [],
      workflow: [],
      testimonials: [],
      stats: []
    } as any);

    const response = await request(app)
      .put('/api/admin/landing/hero')
      .send({
        brand: 'Clizer',
        badge: 'Built for creators and media teams',
        title: 'Turn Every Long Video Into High-Performing Shorts',
        subtitle: 'From podcasts to webinars',
        primaryCta: 'Start Free Trial',
        secondaryCta: 'See Product Tour',
        trustText: 'No credit card required. Export in 1080p.',
        nav: [
          { label: 'Features', href: '#features' },
          { label: 'Workflow', href: '#workflow' }
        ],
        clipSource: 'founder-podcast-episode-42.mp4',
        clipCountText: '12 strong short clips detected',
        clips: ['clip 1'],
        metrics: ['metric 1']
      });

    expect(response.status).toBe(200);
    expect(response.body.hero.brand).toBe('Clizer');
  });
});
