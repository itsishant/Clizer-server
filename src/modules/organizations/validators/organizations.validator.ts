import { z } from 'zod';

const emptyObject = z.object({}).strict();

export const createOrganizationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120)
  }),
  params: emptyObject,
  query: emptyObject
});

export const getOrganizationByIdSchema = z.object({
  body: emptyObject,
  params: z.object({
    id: z.string().min(1)
  }),
  query: emptyObject
});
