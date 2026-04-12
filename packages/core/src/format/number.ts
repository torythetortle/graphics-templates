import { format } from 'd3-format';

const compact = format('.3~s');
const pct = format('.1%');
const comma = format(',');
const dollar = format('$,.0f');
const decimal1 = format(',.1f');
const decimal2 = format(',.2f');

/** Format a number compactly: 1200 → "1.2k", 3400000 → "3.4M" */
export function formatCompact(n: number): string {
  return compact(n).replace('G', 'B');
}

/** Format as percentage: 0.423 → "42.3%" */
export function formatPct(n: number): string {
  return pct(n);
}

/** Format with commas: 1234567 → "1,234,567" */
export function formatComma(n: number): string {
  return comma(n);
}

/** Format as dollar: 1234567 → "$1,234,567" */
export function formatDollar(n: number): string {
  return dollar(n);
}

/** Format with 1 decimal: 3.14159 → "3.1" */
export function formatDecimal1(n: number): string {
  return decimal1(n);
}

/** Format with 2 decimals: 3.14159 → "3.14" */
export function formatDecimal2(n: number): string {
  return decimal2(n);
}

/** Smart format: pick the best format based on magnitude and context */
export function formatSmart(n: number): string {
  if (Math.abs(n) >= 1_000_000) return formatCompact(n);
  if (Math.abs(n) >= 1_000) return formatComma(n);
  if (Number.isInteger(n)) return formatComma(n);
  return formatDecimal1(n);
}
