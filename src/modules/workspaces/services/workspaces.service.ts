import { Role } from '@prisma/client';
import { env } from '../../../config/env';
import { AppError } from '../../../utils/app-error';
import { addDays } from '../../../utils/time';
import { generateRandomToken, hashToken } from '../../../utils/token';
import { uniqueSlug } from '../../../utils/slug';
import { workspacesRepository } from '../repository/workspaces.repository';

const ensureInvitePermission = (globalRole: Role, membershipRole: Role): void => {
  if (globalRole === Role.super_admin) {
    return;
  }

  if (membershipRole !== Role.org_admin) {
    throw new AppError('Only org admin can invite members', 403);
  }
};

export const workspacesService = {
  async createWorkspace(input: { organizationId: string; name: string; userId: string; userRole: Role }) {
    const organization = await workspacesRepository.findOrganizationForUser(input.organizationId, input.userId);
    if (!organization && input.userRole !== Role.super_admin) {
      throw new AppError('Organization not found or inaccessible', 404);
    }

    const workspace = await workspacesRepository.createWorkspace({
      organizationId: input.organizationId,
      name: input.name,
      slug: uniqueSlug(input.name)
    });

    await workspacesRepository.createWorkspaceMembership({
      userId: input.userId,
      organizationId: input.organizationId,
      workspaceId: workspace.id,
      role: Role.org_admin
    });

    return workspace;
  },

  async getWorkspaceById(workspaceId: string, userId: string, role: Role) {
    const workspace = await workspacesRepository.findWorkspaceWithOrg(workspaceId);
    if (!workspace) {
      throw new AppError('Workspace not found', 404);
    }

    if (role !== Role.super_admin) {
      const membership = await workspacesRepository.findWorkspaceMembership(workspaceId, userId);
      if (!membership) {
        throw new AppError('Forbidden', 403);
      }
    }

    return workspace;
  },

  async inviteMember(input: { workspaceId: string; email: string; role: Role; inviterId: string; inviterRole: Role }) {
    const workspace = await workspacesRepository.findWorkspaceWithOrg(input.workspaceId);
    if (!workspace) {
      throw new AppError('Workspace not found', 404);
    }

    const inviterMembership = await workspacesRepository.findWorkspaceMembership(input.workspaceId, input.inviterId);
    if (!inviterMembership && input.inviterRole !== Role.super_admin) {
      throw new AppError('Forbidden', 403);
    }

    if (inviterMembership) {
      ensureInvitePermission(input.inviterRole, inviterMembership.role);
    }

    const rawToken = generateRandomToken(24);

    await workspacesRepository.createInvitation({
      email: input.email,
      tokenHash: hashToken(rawToken),
      organizationId: workspace.organizationId,
      workspaceId: input.workspaceId,
      invitedById: input.inviterId,
      role: input.role,
      expiresAt: addDays(new Date(), 7)
    });

    return {
      message: 'Invitation created',
      invitationToken: env.NODE_ENV === 'production' ? undefined : rawToken
    };
  },

  async listWorkspaceMembers(workspaceId: string, userId: string, role: Role) {
    if (role !== Role.super_admin) {
      const membership = await workspacesRepository.findWorkspaceMembership(workspaceId, userId);
      if (!membership) {
        throw new AppError('Forbidden', 403);
      }
    }

    return workspacesRepository.listWorkspaceMembers(workspaceId);
  }
};
