import { Role } from '@prisma/client';
import { AppError } from '../../../utils/app-error';
import { captionsService } from '../../captions/services/captions.service';
import { exportsService } from '../../exports/services/exports.service';
import { clipsRepository } from '../repository/clips.repository';

export const clipsService = {
  async getClipById(clipId: string, userId: string, role: Role) {
    const clip = await clipsRepository.getClipForUser(clipId, userId, role);
    if (!clip) {
      throw new AppError('Clip not found', 404);
    }
    return clip;
  },

  async updateClip(clipId: string, userId: string, role: Role, payload: Record<string, unknown>) {
    const existing = await clipsRepository.getClipForUser(clipId, userId, role);
    if (!existing) {
      throw new AppError('Clip not found', 404);
    }

    const updated = await clipsRepository.updateClip(clipId, payload);

    await clipsRepository.createAuditLog({
      actorId: userId,
      action: 'clip.updated',
      entity: 'Clip',
      entityId: clipId,
      metadata: payload as any
    });

    return updated;
  },

  async createCaption(
    clipId: string,
    userId: string,
    role: Role,
    body: { language: string; style?: string; content: string[] }
  ) {
    const existing = await clipsRepository.getClipForUser(clipId, userId, role);
    if (!existing) {
      throw new AppError('Clip not found', 404);
    }

    const caption = await captionsService.createCaption({
      clipId,
      language: body.language,
      style: body.style,
      content: body.content
    });

    await clipsRepository.updateClip(clipId, {
      captionStyle: body.style ?? existing.captionStyle
    });

    await clipsRepository.createAuditLog({
      actorId: userId,
      action: 'clip.caption_generated',
      entity: 'CaptionTrack',
      entityId: caption.id,
      metadata: {
        clipId,
        language: body.language
      }
    });

    return caption;
  },

  async requestExport(
    clipId: string,
    userId: string,
    role: Role,
    body: { format: string; resolution: string }
  ) {
    const existing = await clipsRepository.getClipForUser(clipId, userId, role);
    if (!existing) {
      throw new AppError('Clip not found', 404);
    }

    return exportsService.createExport({
      clipId,
      format: body.format,
      resolution: body.resolution,
      userId
    });
  }
};
