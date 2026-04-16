import { CookieOptions, Request, Response } from 'express';
import { env } from '../../../config/env';
import { AppError } from '../../../utils/app-error';
import { authService } from '../services/auth.service';

const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? 'none' : 'lax',
  path: '/api/auth',
  domain: env.COOKIE_DOMAIN,
  maxAge: 30 * 24 * 60 * 60 * 1000
};

export const authController = {
  async signup(req: Request, res: Response): Promise<void> {
    const result = await authService.signup(req.body);
    res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
    res.status(201).json({
      user: result.user,
      accessToken: result.accessToken
    });
  },

  async login(req: Request, res: Response): Promise<void> {
    const result = await authService.login(req.body);
    res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
    res.status(200).json({
      user: result.user,
      accessToken: result.accessToken
    });
  },

  async logout(req: Request, res: Response): Promise<void> {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError('Refresh token missing', 400);
    }

    const result = await authService.logout(refreshToken);
    res.clearCookie('refreshToken', refreshCookieOptions);
    res.status(200).json(result);
  },

  async refresh(req: Request, res: Response): Promise<void> {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError('Refresh token missing', 400);
    }

    const result = await authService.refresh(refreshToken);
    res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
    res.status(200).json({
      user: result.user,
      accessToken: result.accessToken
    });
  },

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const result = await authService.forgotPassword(req.body.email);
    res.status(200).json(result);
  },

  async resetPassword(req: Request, res: Response): Promise<void> {
    const result = await authService.resetPassword(req.body);
    res.status(200).json(result);
  },

  async me(req: Request, res: Response): Promise<void> {
    const user = await authService.me(req.user!.id);
    res.status(200).json({ user });
  }
};
