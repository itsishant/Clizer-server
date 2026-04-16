import { landingRepository } from '../repository/landing.repository';
import { landingContentSchema, LandingContentDto } from '../validators/landing.validator';

const toLandingDto = (record: {
  hero: unknown;
  marquee: unknown;
  features: unknown;
  workflow: unknown;
  testimonials: unknown;
  stats: unknown;
}): LandingContentDto => {
  return landingContentSchema.parse({
    hero: record.hero,
    marquee: record.marquee,
    features: record.features,
    workflow: record.workflow,
    testimonials: record.testimonials,
    stats: record.stats
  });
};

export const landingService = {
  async getPublicLanding(): Promise<LandingContentDto> {
    const record = await landingRepository.getOrCreate();
    return toLandingDto(record);
  },

  async getAdminLanding(): Promise<LandingContentDto> {
    const record = await landingRepository.getOrCreate();
    return toLandingDto(record);
  },

  async updateHero(payload: LandingContentDto['hero']): Promise<LandingContentDto> {
    const updated = await landingRepository.updateSection('hero', payload);
    return toLandingDto(updated);
  },

  async updateMarquee(payload: LandingContentDto['marquee']): Promise<LandingContentDto> {
    const updated = await landingRepository.updateSection('marquee', payload);
    return toLandingDto(updated);
  },

  async updateFeatures(payload: LandingContentDto['features']): Promise<LandingContentDto> {
    const updated = await landingRepository.updateSection('features', payload);
    return toLandingDto(updated);
  },

  async updateWorkflow(payload: LandingContentDto['workflow']): Promise<LandingContentDto> {
    const updated = await landingRepository.updateSection('workflow', payload);
    return toLandingDto(updated);
  },

  async updateTestimonials(payload: LandingContentDto['testimonials']): Promise<LandingContentDto> {
    const updated = await landingRepository.updateSection('testimonials', payload);
    return toLandingDto(updated);
  },

  async updateStats(payload: LandingContentDto['stats']): Promise<LandingContentDto> {
    const updated = await landingRepository.updateSection('stats', payload);
    return toLandingDto(updated);
  }
};
