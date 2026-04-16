import { ClipStatus, TargetPlatform } from '@prisma/client';
import { z } from 'zod';

const emptyObject = z.object({}).strict();

export const clipIdSchema = z.object({
  body: emptyObject,
  params: z.object({ id: z.string().min(1) }),
  query: emptyObject
});

export const updateClipSchema = z.object({
  body: z
    .object({
      title: z.string().min(1).max(180).optional(),
      description: z.string().max(2000).optional(),
      hookText: z.string().max(500).optional(),
      startTime: z.number().nonnegative().optional(),
      endTime: z.number().positive().optional(),
      duration: z.number().positive().optional(),
      score: z.number().min(0).max(1).optional(),
      targetPlatform: z.nativeEnum(TargetPlatform).optional(),
      transcriptSnippet: z.string().max(2000).optional(),
      captionStyle: z.string().max(120).optional(),
      thumbnailUrl: z.string().max(1000).optional(),
      exportUrl: z.string().max(1000).optional(),
      status: z.nativeEnum(ClipStatus).optional()
    })
    .refine((body) => {
      if (typeof body.startTime === 'number' && typeof body.endTime === 'number') {
        return body.endTime > body.startTime;
      }
      return true;
    }, 'endTime must be greater than startTime'),
  params: z.object({ id: z.string().min(1) }),
  query: emptyObject
});

export const createCaptionSchema = z.object({
  body: z.object({
    language: z.string().min(2).max(10).default('en'),
    style: z.string().max(120).optional(),
    content: z.array(z.string().min(1)).min(1)
  }),
  params: z.object({ id: z.string().min(1) }),
  query: emptyObject
});

export const createExportSchema = z.object({
  body: z.object({
    format: z.string().min(2).max(20),
    resolution: z.string().min(3).max(20)
  }),
  params: z.object({ id: z.string().min(1) }),
  query: emptyObject
});
