import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/modules/auth/services/auth.service', () => ({
  authService: {
    signup: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
    me: vi.fn()
  }
}));

import { app } from '../src/app';
import { authService } from '../src/modules/auth/services/auth.service';

const mockedAuthService = vi.mocked(authService);

describe('auth endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('signup should return access token and user', async () => {
    mockedAuthService.signup.mockResolvedValue({
      user: {
        id: 'u1',
        email: 'user@clizer.ai',
        name: 'Test User',
        role: 'org_admin'
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    } as any);

    const response = await request(app).post('/api/auth/signup').send({
      name: 'Test User',
      email: 'user@clizer.ai',
      password: 'Password@123',
      organizationName: 'My Org',
      workspaceName: 'My Workspace'
    });

    expect(response.status).toBe(201);
    expect(response.body.accessToken).toBe('access-token');
    expect(response.body.user.email).toBe('user@clizer.ai');
  });

  it('login should return access token and user', async () => {
    mockedAuthService.login.mockResolvedValue({
      user: {
        id: 'u1',
        email: 'user@clizer.ai',
        name: 'Test User',
        role: 'org_admin'
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    } as any);

    const response = await request(app).post('/api/auth/login').send({
      email: 'user@clizer.ai',
      password: 'Password@123'
    });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBe('access-token');
    expect(response.body.user.id).toBe('u1');
  });
});
