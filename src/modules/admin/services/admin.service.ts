import { landingService } from '../../landing/services/landing.service';
import { adminRepository } from '../repository/admin.repository';
import { LandingContentDto } from '../../landing/validators/landing.validator';

export const adminService = {
  async getLanding() {
    return landingService.getAdminLanding();
  },

  async updateHero(body: LandingContentDto['hero']) {
    return landingService.updateHero(body);
  },

  async updateMarquee(body: LandingContentDto['marquee']) {
    return landingService.updateMarquee(body);
  },

  async updateFeatures(body: LandingContentDto['features']) {
    return landingService.updateFeatures(body);
  },

  async updateWorkflow(body: LandingContentDto['workflow']) {
    return landingService.updateWorkflow(body);
  },

  async updateTestimonials(body: LandingContentDto['testimonials']) {
    return landingService.updateTestimonials(body);
  },

  async updateStats(body: LandingContentDto['stats']) {
    return landingService.updateStats(body);
  },

  async listUsers() {
    return adminRepository.listUsers();
  },

  async listProjects() {
    return adminRepository.listProjects();
  },

  async listJobs() {
    return adminRepository.listJobs();
  }
};
