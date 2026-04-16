import { Prisma } from '@prisma/client';
import { prisma } from '../../../config/prisma';

export const captionsRepository = {
  createCaptionTrack(data: Prisma.CaptionTrackUncheckedCreateInput) {
    return prisma.captionTrack.create({ data });
  }
};
