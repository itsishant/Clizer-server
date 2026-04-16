export const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const uniqueSlug = (value: string): string => {
  return `${slugify(value)}-${Math.random().toString(36).slice(2, 8)}`;
};
