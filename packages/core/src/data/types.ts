export interface TimeSeriesRow {
  date: Date | string;
  value: number;
  series?: string;
  [key: string]: unknown;
}

export interface CategoricalRow {
  label: string;
  value: number;
  group?: string;
  color?: string;
  [key: string]: unknown;
}

export interface GeoRow {
  id: string;
  value: number;
  label?: string;
  [key: string]: unknown;
}

export interface GeoPointRow {
  id: string;
  lat: number;
  lon: number;
  value: number;
  label?: string;
  [key: string]: unknown;
}

export interface OHLCRow {
  date: Date | string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface ScatterRow {
  x: number;
  y: number;
  label?: string;
  size?: number;
  group?: string;
  [key: string]: unknown;
}

export interface CandidateRow {
  candidate: string;
  party: string;
  votes: number;
  pct: number;
  [key: string]: unknown;
}

export interface SlopeRow {
  label: string;
  start: number;
  end: number;
  group?: string;
  [key: string]: unknown;
}

export interface RankingRow {
  label: string;
  values: { period: string | number; rank: number }[];
  [key: string]: unknown;
}

export interface FlowRow {
  source: string;
  target: string;
  value: number;
  [key: string]: unknown;
}

export interface HeatmapRow {
  x: string | number;
  y: string | number;
  value: number;
  [key: string]: unknown;
}

export interface PartWholeRow {
  label: string;
  value: number;
  total: number;
  [key: string]: unknown;
}

export interface Annotation {
  x?: unknown;
  y?: unknown;
  date?: string | Date;
  label: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
}

export interface ReferenceLine {
  value: number;
  axis: 'x' | 'y';
  label?: string;
  dashed?: boolean;
}
