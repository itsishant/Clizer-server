import { Role } from '@prisma/client';
import { prisma } from '../../../config/prisma';

export const organizationsRepository = {
  createOrganization(data: { name: string; slug: string; ownerId: string }) {
    return prisma.organization.create({
      data: {
        name: data.name,
        slug: data.slug,
        ownerId: data.ownerId,
        memberships: {
          create: {
            userId: data.ownerId,
            role: Role.org_admin
          }
        }
      }
    });
  },

  listOrganizationsForUser(userId: string) {
    return prisma.organization.findMany({
      where: {
        OR: [{ ownerId: userId }, { memberships: { some: { userId } } }]
      },
      include: {
        workspaces: {
          select: { id: true, name: true, slug: true, createdAt: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  getOrganizationForUser(organizationId: string, userId: string) {
    return prisma.organization.findFirst({
      where: {
        id: organizationId,
        OR: [{ ownerId: userId }, { memberships: { some: { userId } } }]
      },
      include: {
        workspaces: {
          select: { id: true, name: true, slug: true, createdAt: true }
        }
      }
    });
  }
};
