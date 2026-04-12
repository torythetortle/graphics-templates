export const BREAKPOINTS = {
  mobile: { max: 479 },
  tablet: { min: 480, max: 767 },
  desktop: { min: 768 },
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export function getBreakpoint(width: number): Breakpoint {
  if (width < 480) return 'mobile';
  if (width < 768) return 'tablet';
  return 'desktop';
}

/** Responsive chart defaults per breakpoint */
export const RESPONSIVE_DEFAULTS = {
  mobile: {
    marginTop: 20,
    marginRight: 12,
    marginBottom: 32,
    marginLeft: 32,
    tickCount: { x: 3, y: 4 },
    fontSize: { axis: 10, label: 11, title: 16 },
    aspectRatio: 4 / 3,
    legendPosition: 'bottom' as const,
  },
  tablet: {
    marginTop: 24,
    marginRight: 20,
    marginBottom: 36,
    marginLeft: 40,
    tickCount: { x: 5, y: 5 },
    fontSize: { axis: 11, label: 12, title: 18 },
    aspectRatio: 16 / 10,
    legendPosition: 'bottom' as const,
  },
  desktop: {
    marginTop: 24,
    marginRight: 24,
    marginBottom: 40,
    marginLeft: 48,
    tickCount: { x: 6, y: 6 },
    fontSize: { axis: 12, label: 13, title: 20 },
    aspectRatio: 16 / 9,
    legendPosition: 'right' as const,
  },
} as const;
