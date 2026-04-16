import { AppError } from '../../../utils/app-error';
import { uniqueSlug } from '../../../utils/slug';
import { organizationsRepository } from '../repository/organizations.repository';

export const organizationsService = {
  async createOrganization(input: { name: string; ownerId: string }) {
    return organizationsRepository.createOrganization({
      name: input.name,
      slug: uniqueSlug(input.name),
      ownerId: input.ownerId
    });
  },

  async listOrganizations(userId: string) {
    return organizationsRepository.listOrganizationsForUser(userId);
  },

  async getOrganizationById(organizationId: string, userId: string) {
    const organization = await organizationsRepository.getOrganizationForUser(organizationId, userId);
    if (!organization) {
      throw new AppError('Organization not found', 404);
    }
    return organization;
  }
};
