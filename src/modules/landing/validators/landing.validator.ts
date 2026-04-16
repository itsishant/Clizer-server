import { z } from 'zod';

export const navItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1)
});

export const heroSchema = z.object({
  brand: z.string().min(1),
  badge: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  primaryCta: z.string().min(1),
  secondaryCta: z.string().min(1),
  trustText: z.string().min(1),
  nav: z.array(navItemSchema),
  clipSource: z.string().min(1),
  clipCountText: z.string().min(1),
  clips: z.array(z.string().min(1)),
  metrics: z.array(z.string().min(1))
});

export const marqueeSchema = z.array(z.string().min(1));

export const featuresSchema = z.array(
  z.object({
    title: z.string().min(1),
    description: z.string().min(1)
  })
);

export const workflowSchema = z.array(
  z.object({
    title: z.string().min(1),
    description: z.string().min(1)
  })
);

export const testimonialsSchema = z.array(
  z.object({
    quote: z.string().min(1),
    name: z.string().min(1),
    role: z.string().min(1)
  })
);

export const statsSchema = z.array(
  z.object({
    label: z.string().min(1),
    value: z.string().min(1)
  })
);

export const landingContentSchema = z.object({
  hero: heroSchema,
  marquee: marqueeSchema,
  features: featuresSchema,
  workflow: workflowSchema,
  testimonials: testimonialsSchema,
  stats: statsSchema
});

export const updateHeroSchema = z.object({ body: heroSchema, params: z.object({}), query: z.object({}) });
export const updateMarqueeSchema = z.object({ body: marqueeSchema, params: z.object({}), query: z.object({}) });
export const updateFeaturesSchema = z.object({ body: featuresSchema, params: z.object({}), query: z.object({}) });
export const updateWorkflowSchema = z.object({ body: workflowSchema, params: z.object({}), query: z.object({}) });
export const updateTestimonialsSchema = z.object({ body: testimonialsSchema, params: z.object({}), query: z.object({}) });
export const updateStatsSchema = z.object({ body: statsSchema, params: z.object({}), query: z.object({}) });

export type LandingContentDto = z.infer<typeof landingContentSchema>;
