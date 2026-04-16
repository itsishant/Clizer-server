import { Prisma } from '@prisma/client';
import { prisma } from '../../../config/prisma';
import { defaultLandingContent } from '../validators/landing.default';

const LANDING_ID = 'landing-default';

export const landingRepository = {
  async getOrCreate() {
    const existing = await prisma.landingContent.findUnique({ where: { id: LANDING_ID } });

    if (existing) {
      return existing;
    }

    return prisma.landingContent.create({
      data: {
        id: LANDING_ID,
        hero: defaultLandingContent.hero as Prisma.JsonObject,
        marquee: defaultLandingContent.marquee as unknown as Prisma.JsonArray,
        features: defaultLandingContent.features as unknown as Prisma.JsonArray,
        workflow: defaultLandingContent.workflow as unknown as Prisma.JsonArray,
        testimonials: defaultLandingContent.testimonials as unknown as Prisma.JsonArray,
        stats: defaultLandingContent.stats as unknown as Prisma.JsonArray
      }
    });
  },

  async updateSection(section: 'hero' | 'marquee' | 'features' | 'workflow' | 'testimonials' | 'stats', value: unknown) {
    await this.getOrCreate();

    return prisma.landingContent.update({
      where: { id: LANDING_ID },
      data: {
        [section]: value as Prisma.JsonValue
      }
    });
  }
};
