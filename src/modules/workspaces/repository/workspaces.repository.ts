import { Prisma, Role } from '@prisma/client';
import { prisma } from '../../../config/prisma';

export const workspacesRepository = {
  findOrganizationForUser(organizationId: string, userId: string) {
    return prisma.organization.findFirst({
      where: {
        id: organizationId,
        OR: [{ ownerId: userId }, { memberships: { some: { userId, workspaceId: null } } }]
      }
    });
  },

  createWorkspace(data: { organizationId: string; name: string; slug: string }) {
    return prisma.workspace.create({
      data,
      include: {
        organization: { select: { id: true, name: true, slug: true } }
      }
    });
  },

  createWorkspaceMembership(data: { userId: string; organizationId: string; workspaceId: string; role: Role }) {
    return prisma.membership.create({ data });
  },

  findWorkspaceMembership(workspaceId: string, userId: string) {
    return prisma.membership.findFirst({
      where: {
        workspaceId,
        userId
      }
    });
  },

  findWorkspaceWithOrg(workspaceId: string) {
    return prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        organization: { select: { id: true, name: true, slug: true, ownerId: true } }
      }
    });
  },

  listWorkspaceMembers(workspaceId: string) {
    return prisma.membership.findMany({
      where: {
        workspaceId
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true, createdAt: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  createInvitation(data: Prisma.InvitationUncheckedCreateInput) {
    return prisma.invitation.create({ data });
  }
};
