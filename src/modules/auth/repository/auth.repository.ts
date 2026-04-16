import { Prisma, Role, TokenType } from '@prisma/client';
import { prisma } from '../../../config/prisma';
import { uniqueSlug } from '../../../utils/slug';

interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  role?: Role;
  organizationName?: string;
  workspaceName?: string;
}

export const authRepository = {
  findUserByEmail(email: string) {
    return prisma.user.findFirst({ where: { email, deletedAt: null } });
  },

  findUserById(id: string) {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  async createUser(input: CreateUserInput) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash: input.passwordHash,
          role: input.role ?? Role.org_admin
        }
      });

      if (input.organizationName) {
        const organization = await tx.organization.create({
          data: {
            name: input.organizationName,
            slug: uniqueSlug(input.organizationName),
            ownerId: user.id
          }
        });

        const workspace = await tx.workspace.create({
          data: {
            organizationId: organization.id,
            name: input.workspaceName ?? `${input.organizationName} Workspace`,
            slug: uniqueSlug(input.workspaceName ?? `${input.organizationName}-workspace`)
          }
        });

        await tx.membership.createMany({
          data: [
            {
              userId: user.id,
              organizationId: organization.id,
              workspaceId: null,
              role: Role.org_admin
            },
            {
              userId: user.id,
              organizationId: organization.id,
              workspaceId: workspace.id,
              role: Role.org_admin
            }
          ]
        });
      }

      return user;
    });
  },

  createRefreshToken(data: Prisma.RefreshTokenCreateInput) {
    return prisma.refreshToken.create({ data });
  },

  async revokeRefreshTokenByHash(tokenHash: string, type: TokenType = TokenType.refresh) {
    return prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        type,
        revokedAt: null
      },
      data: {
        revokedAt: new Date()
      }
    });
  },

  async revokeUserRefreshTokens(userId: string) {
    return prisma.refreshToken.updateMany({
      where: {
        userId,
        type: TokenType.refresh,
        revokedAt: null
      },
      data: {
        revokedAt: new Date()
      }
    });
  },

  findValidTokenByHash(tokenHash: string, type: TokenType) {
    return prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        type,
        revokedAt: null,
        expiresAt: { gt: new Date() }
      }
    });
  },

  revokeTokenById(id: string) {
    return prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() }
    });
  },

  updateUserPassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    });
  },

  createAuditLog(data: Prisma.AuditLogUncheckedCreateInput) {
    return prisma.auditLog.create({ data });
  }
};
