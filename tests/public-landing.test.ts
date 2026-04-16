import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../src/modules/landing/services/landing.service', () => ({
  landingService: {
    getPublicLanding: vi.fn().mockResolvedValue({
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
      marquee: ['Trusted by creator-led brands'],
      features: [{ title: 'Moment Detection', description: 'desc' }],
      workflow: [{ title: 'Upload', description: 'desc' }],
      testimonials: [{ quote: 'Great', name: 'Priya', role: 'Creator' }],
      stats: [{ label: 'Hours saved per week', value: '26h' }]
    })
  }
}));

import { app } from '../src/app';

describe('public landing endpoint', () => {
  it('should return landing content', async () => {
    const response = await request(app).get('/api/public/landing');

    expect(response.status).toBe(200);
    expect(response.body.hero.brand).toBe('Clizer');
    expect(Array.isArray(response.body.features)).toBe(true);
  });
});
