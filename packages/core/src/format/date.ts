import { timeFormat } from 'd3-time-format';

const fmtYear = timeFormat('%Y');
const fmtMonthYear = timeFormat('%b %Y');
const fmtMonthDay = timeFormat('%b %-d');
const fmtFull = timeFormat('%b %-d, %Y');
const fmtShort = timeFormat('%-m/%-d/%y');

export function formatYear(d: Date): string {
  return fmtYear(d);
}

export function formatMonthYear(d: Date): string {
  return fmtMonthYear(d);
}

export function formatMonthDay(d: Date): string {
  return fmtMonthDay(d);
}

export function formatFullDate(d: Date): string {
  return fmtFull(d);
}

export function formatShortDate(d: Date): string {
  return fmtShort(d);
}

/** Pick appropriate date format based on time span */
export function formatDateSmart(d: Date, spanMs: number): string {
  const oneDay = 86_400_000;
  const oneYear = 365.25 * oneDay;

  if (spanMs > 3 * oneYear) return fmtYear(d);
  if (spanMs > 60 * oneDay) return fmtMonthYear(d);
  return fmtMonthDay(d);
}
