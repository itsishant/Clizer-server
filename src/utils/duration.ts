export const durationToMs = (input: string): number => {
  const match = input.trim().match(/^(\d+)([smhd])?$/i);
  if (!match) {
    return 30 * 24 * 60 * 60 * 1000;
  }

  const value = Number(match[1]);
  const unit = (match[2] || 's').toLowerCase();

  if (unit === 's') return value * 1000;
  if (unit === 'm') return value * 60 * 1000;
  if (unit === 'h') return value * 60 * 60 * 1000;
  return value * 24 * 60 * 60 * 1000;
};
