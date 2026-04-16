import { z } from 'zod';

const emptyObject = z.object({}).strict();

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email().max(200),
    password: z.string().min(8).max(120),
    organizationName: z.string().min(2).max(120).optional(),
    workspaceName: z.string().min(2).max(120).optional()
  }),
  params: emptyObject,
  query: emptyObject
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().max(200),
    password: z.string().min(8).max(120)
  }),
  params: emptyObject,
  query: emptyObject
});

export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional()
  }),
  params: emptyObject,
  query: emptyObject
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional()
  }),
  params: emptyObject,
  query: emptyObject
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email().max(200)
  }),
  params: emptyObject,
  query: emptyObject
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(16),
    newPassword: z.string().min(8).max(120)
  }),
  params: emptyObject,
  query: emptyObject
});
