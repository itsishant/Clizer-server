import { Role } from '@prisma/client';
import { prisma } from '../../../config/prisma';

export const usersRepository = {
  getUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
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

  listUsers(role: Role) {
    if (role !== Role.super_admin) {
      return Promise.resolve([]);
    }

    return prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
};
