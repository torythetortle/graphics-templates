export type PaletteType = 'categorical' | 'sequential' | 'diverging';

export type ColorMode = 'default' | 'colorblind' | 'print' | 'highcontrast';

export interface Palette {
  name: string;
  type: PaletteType;
  colors: string[];
  colorblindSafe: boolean;
  printSafe: boolean;
  darkVariant?: string[];
}

export type PaletteName =
  | 'newsroom'
  | 'politics'
  | 'politics-a11y'
  | 'finance'
  | 'finance-a11y'
  | 'blues'
  | 'reds'
  | 'greens'
  | 'oranges'
  | 'purples'
  | 'grays'
  | 'redblue'
  | 'redblue-a11y'
  | 'warmcool'
  | 'print-bw';

/** Dash pattern per series index — used for print + colorblind redundancy */
export const DASH_PATTERNS = [
  'none', // solid
  '6 3', // long dash
  '2 3', // dots
  '6 3 2 3', // dash-dot
  '10 3', // extra-long dash
  '2 3 6 3', // dot-dash
  '10 3 2 3 2 3', // long-dash-dot-dot
  '4 3', // medium dash
] as const;
