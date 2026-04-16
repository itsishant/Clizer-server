import { z } from 'zod';

const emptyObject = z.object({}).strict();

export const processProjectSchema = z.object({
  body: emptyObject,
  params: z.object({ id: z.string().min(1) }),
  query: emptyObject
});

export const projectJobsSchema = processProjectSchema;
export const projectClipsSchema = processProjectSchema;
