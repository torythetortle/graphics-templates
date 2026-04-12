import { PALETTES } from './palettes.js';
import type { ColorMode, PaletteName, PaletteType } from './types.js';

export { PALETTES } from './palettes.js';
export { DASH_PATTERNS } from './types.js';
export type { Palette, PaletteName, PaletteType, ColorMode } from './types.js';

/**
 * Resolve a palette by name and mode. Handles colorblind fallback,
 * print override, and high-contrast substitution.
 */
export function getPalette(
  name: PaletteName | string[],
  mode: ColorMode = 'default',
  _type?: PaletteType,
  n?: number,
): string[] {
  if (mode === 'print') return PALETTES['print-bw'].colors;
  if (mode === 'highcontrast') return ['#000000', '#ffffff', '#767676'];

  if (Array.isArray(name)) return n ? name.slice(0, n) : name;

  let palette = PALETTES[name];
  if (!palette) return PALETTES.newsroom.colors;

  if (mode === 'colorblind' && !palette.colorblindSafe) {
    const a11yName = `${name}-a11y` as PaletteName;
    if (PALETTES[a11yName]) palette = PALETTES[a11yName];
  }

  const colors = palette.colors;
  return n ? colors.slice(0, n) : colors;
}

/** Auto-detect color mode from user's system preferences */
export function detectColorMode(): ColorMode {
  if (typeof window === 'undefined') return 'default';
  if (window.matchMedia('(prefers-contrast: more)').matches) return 'highcontrast';
  if (window.matchMedia('print').matches) return 'print';
  return 'default';
}
