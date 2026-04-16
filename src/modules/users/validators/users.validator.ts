import { z } from 'zod';

const emptyObject = z.object({}).strict();

export const userIdSchema = z.object({
  body: emptyObject,
  params: z.object({ id: z.string().min(1) }),
  query: emptyObject
});
