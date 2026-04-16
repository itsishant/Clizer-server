import { Role } from '@prisma/client';
import { z } from 'zod';

const emptyObject = z.object({}).strict();

export const createWorkspaceSchema = z.object({
  body: z.object({
    organizationId: z.string().min(1),
    name: z.string().min(2).max(120)
  }),
  params: emptyObject,
  query: emptyObject
});

export const workspaceIdSchema = z.object({
  body: emptyObject,
  params: z.object({ id: z.string().min(1) }),
  query: emptyObject
});

export const inviteMemberSchema = z.object({
  body: z.object({
    email: z.string().email(),
    role: z.nativeEnum(Role)
  }),
  params: z.object({ id: z.string().min(1) }),
  query: emptyObject
});
