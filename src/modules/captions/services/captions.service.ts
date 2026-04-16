import { captionsRepository } from '../repository/captions.repository';

export const captionsService = {
  async createCaption(input: { clipId: string; language: string; style?: string; content: string[] }) {
    return captionsRepository.createCaptionTrack({
      clipId: input.clipId,
      language: input.language,
      style: input.style,
      content: input.content as any
    });
  }
};
