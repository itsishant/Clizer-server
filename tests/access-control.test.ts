import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app';

describe('access control', () => {
  it('should block protected admin route without auth token', async () => {
    const response = await request(app).get('/api/admin/users');

    expect(response.status).toBe(401);
  });
});
