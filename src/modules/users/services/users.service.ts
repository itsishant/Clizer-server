import { Role } from '@prisma/client';
import { AppError } from '../../../utils/app-error';
import { usersRepository } from '../repository/users.repository';

export const usersService = {
  async getMe(userId: string) {
    const user = await usersRepository.getUserById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  },

  async getUserById(userId: string, requesterRole: Role) {
    if (requesterRole !== Role.super_admin) {
      throw new AppError('Forbidden', 403);
    }

    const user = await usersRepository.getUserById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
};
