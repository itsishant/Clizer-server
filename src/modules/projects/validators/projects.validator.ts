import { TargetPlatform } from '@prisma/client';
import { z } from 'zod';

const emptyObject = z.object({}).strict();

export const createProjectSchema = z.object({
  body: z.object({
    workspaceId: z.string().min(1),
    title: z.string().min(2).max(180),
    description: z.string().max(2000).optional(),
    platformTargets: z.array(z.nativeEnum(TargetPlatform)).min(1)
  }),
  params: emptyObject,
  query: emptyObject
});

export const projectIdSchema = z.object({
  body: emptyObject,
  params: z.object({ id: z.string().min(1) }),
  query: emptyObject
});
