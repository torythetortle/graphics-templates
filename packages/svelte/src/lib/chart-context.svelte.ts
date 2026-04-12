import { getContext, setContext } from 'svelte';
import type { ColorMode, PaletteName } from '@graphics-templates/core';

const CHART_CTX = Symbol('chart');

export interface ChartContext {
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  margin: { top: number; right: number; bottom: number; left: number };
  palette: PaletteName | string[];
  colorMode: ColorMode;
  animated: boolean;
  chartId: string;
}

export function setChartContext(ctx: ChartContext) {
  setContext(CHART_CTX, ctx);
}

export function getChartContext(): ChartContext {
  return getContext<ChartContext>(CHART_CTX);
}
