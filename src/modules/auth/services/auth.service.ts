import { Role, TokenType } from '@prisma/client';
import { env } from '../../../config/env';
import { AppError } from '../../../utils/app-error';
import { durationToMs } from '../../../utils/duration';
import { comparePassword, hashPassword } from '../../../utils/password';
import {
  generateRandomToken,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from '../../../utils/token';
import { addMinutes } from '../../../utils/time';
import { authRepository } from '../repository/auth.repository';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const createTokenPair = async (user: { id: string; email: string; role: Role }): Promise<TokenPair> => {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const refreshExpiresAt = new Date(Date.now() + durationToMs(env.JWT_REFRESH_EXPIRES_IN));

  await authRepository.createRefreshToken({
    user: { connect: { id: user.id } },
    tokenHash: hashToken(refreshToken),
    type: TokenType.refresh,
    expiresAt: refreshExpiresAt
  });

  return { accessToken, refreshToken };
};

export const authService = {
  async signup(input: {
    name: string;
    email: string;
    password: string;
    organizationName?: string;
    workspaceName?: string;
  }) {
    const exists = await authRepository.findUserByEmail(input.email);
    if (exists) {
      throw new AppError('Email already in use', 409);
    }

    const passwordHash = await hashPassword(input.password);
    const user = await authRepository.createUser({
      name: input.name,
      email: input.email,
      passwordHash,
      role: Role.org_admin,
      organizationName: input.organizationName,
      workspaceName: input.workspaceName
    });

    const tokens = await createTokenPair(user);

    await authRepository.createAuditLog({
      actorId: user.id,
      action: 'auth.signup',
      entity: 'User',
      entityId: user.id,
      metadata: { email: user.email }
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      ...tokens
    };
  },

  async login(input: { email: string; password: string }) {
    const user = await authRepository.findUserByEmail(input.email);
    if (!user || !user.isActive) {
      throw new AppError('Invalid credentials', 401);
    }

    const passwordOk = await comparePassword(input.password, user.passwordHash);
    if (!passwordOk) {
      throw new AppError('Invalid credentials', 401);
    }

    const tokens = await createTokenPair(user);

    await authRepository.createAuditLog({
      actorId: user.id,
      action: 'auth.login',
      entity: 'User',
      entityId: user.id,
      metadata: { email: user.email }
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      ...tokens
    };
  },

  async logout(refreshToken: string) {
    await authRepository.revokeRefreshTokenByHash(hashToken(refreshToken), TokenType.refresh);
    return { message: 'Logged out successfully' };
  },

  async refresh(refreshToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Invalid refresh token', 401);
    }

    const stored = await authRepository.findValidTokenByHash(hashToken(refreshToken), TokenType.refresh);

    if (!stored) {
      throw new AppError('Invalid refresh token', 401);
    }

    await authRepository.revokeTokenById(stored.id);

    const user = await authRepository.findUserById(payload.sub);
    if (!user) {
      throw new AppError('Unauthorized', 401);
    }

    const tokens = await createTokenPair({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return {
      user,
      ...tokens
    };
  },

  async forgotPassword(email: string) {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      return { message: 'If the account exists, a reset token has been created' };
    }

    const rawToken = generateRandomToken(24);
    const expiresAt = addMinutes(new Date(), env.RESET_PASSWORD_TOKEN_EXPIRES_MINUTES);

    await authRepository.createRefreshToken({
      user: { connect: { id: user.id } },
      tokenHash: hashToken(rawToken),
      type: TokenType.reset_password,
      expiresAt
    });

    await authRepository.createAuditLog({
      actorId: user.id,
      action: 'auth.forgot_password',
      entity: 'User',
      entityId: user.id,
      metadata: { email: user.email }
    });

    return {
      message: 'If the account exists, a reset token has been created',
      resetToken: env.NODE_ENV === 'production' ? undefined : rawToken
    };
  },

  async resetPassword(input: { token: string; newPassword: string }) {
    const tokenHash = hashToken(input.token);

    const stored = await authRepository.findValidTokenByHash(tokenHash, TokenType.reset_password);
    if (!stored) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    const passwordHash = await hashPassword(input.newPassword);

    await authRepository.updateUserPassword(stored.userId, passwordHash);
    await authRepository.revokeTokenById(stored.id);
    await authRepository.revokeUserRefreshTokens(stored.userId);

    await authRepository.createAuditLog({
      actorId: stored.userId,
      action: 'auth.reset_password',
      entity: 'User',
      entityId: stored.userId
    });

    return { message: 'Password reset successful' };
  },

  async me(userId: string) {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }
};
