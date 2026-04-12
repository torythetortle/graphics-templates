/** Parse a date string into a Date, handling common formats */
export function parseDate(raw: string | Date): Date {
  if (raw instanceof Date) return raw;
  const d = new Date(raw);
  if (!isNaN(d.getTime())) return d;
  throw new Error(`Cannot parse date: "${raw}"`);
}

/** Coerce a string to a number, stripping $, %, and commas */
export function parseNumber(raw: string | number): number {
  if (typeof raw === 'number') return raw;
  const cleaned = raw.replace(/[$,%]/g, '').trim();
  const n = Number(cleaned);
  if (isNaN(n)) throw new Error(`Cannot parse number: "${raw}"`);
  return n;
}

/** Auto-parse CSV-style row object: dates in date-like columns, numbers elsewhere */
export function autoParseRow(row: Record<string, string>): Record<string, unknown> {
  const parsed: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(row)) {
    if (val === '' || val == null) {
      parsed[key] = null;
      continue;
    }
    if (/^(date|time|year|month|day)/i.test(key)) {
      try {
        parsed[key] = parseDate(val);
        continue;
      } catch {
        // fall through to number/string
      }
    }
    const num = Number(val.replace(/[$,%]/g, ''));
    parsed[key] = isNaN(num) ? val : num;
  }
  return parsed;
}
