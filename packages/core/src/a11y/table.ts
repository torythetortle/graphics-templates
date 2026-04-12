export interface TableColumn {
  key: string;
  label: string;
  format?: (value: unknown) => string;
}

export interface TableSpec {
  caption: string;
  columns: TableColumn[];
  rows: Record<string, unknown>[];
}

/** Build a table specification from data rows and column config */
export function buildTableSpec(
  data: Record<string, unknown>[],
  columns: TableColumn[],
  caption: string,
): TableSpec {
  return { caption, columns, rows: data };
}

/** Format a cell value using column formatter or sensible defaults */
export function formatCell(value: unknown, column: TableColumn): string {
  if (column.format) return column.format(value);
  if (value == null) return '';
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === 'number') return value.toLocaleString();
  return String(value);
}
