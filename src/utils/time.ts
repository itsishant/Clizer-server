export const addDays = (date: Date, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const addMinutes = (date: Date, minutes: number): Date => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + minutes);
  return d;
};
