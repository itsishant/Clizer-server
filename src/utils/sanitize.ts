type Sanitizable = Record<string, unknown> | unknown[] | string | unknown;

const sanitizeValue = (value: Sanitizable): Sanitizable => {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (value && typeof value === 'object') {
    const next: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      next[key] = sanitizeValue(val);
    }
    return next;
  }

  return value;
};

export const sanitizeInput = <T>(value: T): T => sanitizeValue(value as Sanitizable) as T;
