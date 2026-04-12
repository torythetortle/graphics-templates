import { scaleLinear, scaleTime, scaleBand, scaleLog } from 'd3-scale';
import type { ScaleLinear, ScaleTime, ScaleBand, ScaleLogarithmic } from 'd3-scale';

export type { ScaleLinear, ScaleTime, ScaleBand, ScaleLogarithmic } from 'd3-scale';

interface ScaleOpts<D> {
  domain: D[];
  range: [number, number];
  nice?: boolean;
  clamp?: boolean;
}

export function linearScale(opts: ScaleOpts<number>): ScaleLinear<number, number> {
  const s = scaleLinear().domain(opts.domain).range(opts.range);
  if (opts.nice !== false) s.nice();
  if (opts.clamp) s.clamp(true);
  return s;
}

export function timeScale(opts: ScaleOpts<Date>): ScaleTime<number, number> {
  const s = scaleTime().domain(opts.domain).range(opts.range);
  if (opts.nice !== false) s.nice();
  if (opts.clamp) s.clamp(true);
  return s;
}

export function bandScale(opts: {
  domain: string[];
  range: [number, number];
  padding?: number;
  paddingInner?: number;
  paddingOuter?: number;
}): ScaleBand<string> {
  const s = scaleBand().domain(opts.domain).range(opts.range);
  if (opts.padding != null) s.padding(opts.padding);
  if (opts.paddingInner != null) s.paddingInner(opts.paddingInner);
  if (opts.paddingOuter != null) s.paddingOuter(opts.paddingOuter);
  return s;
}

export function logScale(opts: ScaleOpts<number>): ScaleLogarithmic<number, number> {
  const s = scaleLog().domain(opts.domain).range(opts.range);
  if (opts.nice !== false) s.nice();
  if (opts.clamp) s.clamp(true);
  return s;
}
