import { extent, mean } from 'd3-array';
import type { TimeSeriesRow, CategoricalRow, GeoRow, ScatterRow } from '../data/types.js';

export type ChartType =
  | 'line'
  | 'bar'
  | 'area'
  | 'scatter'
  | 'choropleth'
  | 'bubble-map'
  | 'beeswarm'
  | 'election'
  | 'candlestick'
  | 'waffle'
  | 'slope'
  | 'bump'
  | 'heatmap'
  | 'sankey';

interface DescribeOpts {
  title: string;
  subtitle?: string;
  sourceLabel?: string;
}

export function describeTimeSeries(data: TimeSeriesRow[], opts: DescribeOpts): string {
  const [minVal, maxVal] = extent(data, (d) => d.value);
  const series = new Set(data.map((d) => d.series).filter(Boolean));
  const seriesNote = series.size > 1 ? ` with ${series.size} series` : '';
  const avg = mean(data, (d) => d.value);

  return [
    `Line chart: ${opts.title}.`,
    opts.subtitle,
    `${data.length} data points${seriesNote}.`,
    minVal != null && maxVal != null
      ? `Values range from ${minVal.toLocaleString()} to ${maxVal.toLocaleString()}.`
      : null,
    avg != null ? `Average: ${avg.toLocaleString()}.` : null,
    opts.sourceLabel ? `Source: ${opts.sourceLabel}.` : null,
  ]
    .filter(Boolean)
    .join(' ');
}

export function describeCategorical(data: CategoricalRow[], opts: DescribeOpts): string {
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];

  return [
    `Bar chart: ${opts.title}.`,
    opts.subtitle,
    `${data.length} categories.`,
    highest ? `Highest: ${highest.label} at ${highest.value.toLocaleString()}.` : null,
    lowest ? `Lowest: ${lowest.label} at ${lowest.value.toLocaleString()}.` : null,
    opts.sourceLabel ? `Source: ${opts.sourceLabel}.` : null,
  ]
    .filter(Boolean)
    .join(' ');
}

export function describeGeo(data: GeoRow[], opts: DescribeOpts): string {
  const [minVal, maxVal] = extent(data, (d) => d.value);
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const top3 = sorted.slice(0, 3).map((d) => d.label || d.id);

  return [
    `Map: ${opts.title}.`,
    opts.subtitle,
    `${data.length} areas.`,
    minVal != null && maxVal != null
      ? `Range: ${minVal.toLocaleString()} to ${maxVal.toLocaleString()}.`
      : null,
    top3.length ? `Highest: ${top3.join(', ')}.` : null,
    opts.sourceLabel ? `Source: ${opts.sourceLabel}.` : null,
  ]
    .filter(Boolean)
    .join(' ');
}

export function describeScatter(data: ScatterRow[], opts: DescribeOpts): string {
  const [minX, maxX] = extent(data, (d) => d.x);
  const [minY, maxY] = extent(data, (d) => d.y);

  return [
    `Scatter plot: ${opts.title}.`,
    opts.subtitle,
    `${data.length} data points.`,
    minX != null && maxX != null
      ? `X range: ${minX.toLocaleString()} to ${maxX.toLocaleString()}.`
      : null,
    minY != null && maxY != null
      ? `Y range: ${minY.toLocaleString()} to ${maxY.toLocaleString()}.`
      : null,
    opts.sourceLabel ? `Source: ${opts.sourceLabel}.` : null,
  ]
    .filter(Boolean)
    .join(' ');
}
