<script lang="ts">
  import { area, curveMonotoneX, curveLinear, curveStep, curveBasis, stack, stackOrderNone, stackOffsetNone } from 'd3-shape';
  import { extent, groups } from 'd3-array';
  import {
    timeScale, linearScale, getPalette, getBreakpoint, RESPONSIVE_DEFAULTS,
    innerDimensions, describeTimeSeries, detectColorMode, DASH_PATTERNS, parseDate,
    type TimeSeriesRow, type ColorMode, type PaletteName,
  } from '@graphics-templates/core';
  // @ts-ignore
  import Svg from '../../primitives/Svg.svelte';
  // @ts-ignore
  import Axis from '../../primitives/Axis.svelte';
  // @ts-ignore
  import Grid from '../../primitives/Grid.svelte';
  // @ts-ignore
  import Legend from '../../primitives/Legend.svelte';
  // @ts-ignore
  import AccessibleTable from '../../primitives/AccessibleTable.svelte';
  import { useDimensions } from '../../lib/use-dimensions.svelte.js';

  const CURVES = { linear: curveLinear, monotone: curveMonotoneX, step: curveStep, basis: curveBasis } as const;

  interface Props {
    data: TimeSeriesRow[];
    title: string;
    subtitle?: string;
    caption?: string;
    sourceLabel?: string;
    xKey?: string;
    yKey?: string;
    seriesKey?: string;
    width?: number;
    height?: number;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    aspectRatio?: number;
    palette?: PaletteName | string[];
    colorMode?: ColorMode;
    curve?: keyof typeof CURVES;
    stacked?: boolean;
    showGrid?: boolean;
    showLegend?: boolean;
    showTable?: boolean;
    xLabel?: string;
    yLabel?: string;
    xFormat?: (d: unknown) => string;
    yFormat?: (d: unknown) => string;
  }

  let {
    data, title, subtitle, caption, sourceLabel,
    xKey = 'date', yKey = 'value', seriesKey = 'series',
    width: widthProp, height: heightProp,
    marginTop, marginRight, marginBottom, marginLeft, aspectRatio,
    palette = 'newsroom', colorMode: colorModeProp, curve = 'monotone',
    stacked = false, showGrid = true, showLegend, showTable = true,
    xLabel, yLabel, xFormat, yFormat,
  }: Props = $props();

  let containerEl: HTMLElement | undefined = $state();
  const dims = useDimensions(() => containerEl ?? null);
  const chartId = `area-${Math.random().toString(36).slice(2, 9)}`;
  const colorMode = $derived(colorModeProp ?? detectColorMode());

  const parsed = $derived(data.map((d) => ({
    ...d, _date: parseDate(d[xKey] as string | Date), _value: d[yKey] as number,
    _series: (d[seriesKey] as string) ?? 'default',
  })));

  const seriesGroups = $derived(groups(parsed, (d) => d._series));
  const seriesNames = $derived(seriesGroups.map(([n]) => n));
  const multiSeries = $derived(seriesNames.length > 1);
  const legendVisible = $derived(showLegend ?? multiSeries);

  const w = $derived(widthProp ?? dims.width);
  const bp = $derived(getBreakpoint(w));
  const defaults = $derived(RESPONSIVE_DEFAULTS[bp]);
  const margin = $derived({
    top: marginTop ?? defaults.marginTop, right: marginRight ?? defaults.marginRight,
    bottom: marginBottom ?? defaults.marginBottom, left: marginLeft ?? defaults.marginLeft,
  });
  const ar = $derived(aspectRatio ?? defaults.aspectRatio);
  const h = $derived(heightProp ?? Math.round(w / ar));
  const inner = $derived(innerDimensions(w, h, margin));

  const xDomain = $derived(extent(parsed, (d) => d._date) as [Date, Date]);
  const yMax = $derived(
    stacked
      ? parsed.reduce((max, d) => Math.max(max, d._value), 0) * seriesNames.length
      : (extent(parsed, (d) => d._value) as [number, number])[1],
  );

  const xScale = $derived(timeScale({ domain: xDomain, range: [0, inner.innerWidth] }));
  const yScale = $derived(linearScale({ domain: [0, yMax], range: [inner.innerHeight, 0] }));
  const colors = $derived(getPalette(palette, colorMode, 'categorical', seriesNames.length));

  const areaGen = $derived(
    area<(typeof parsed)[0]>()
      .x((d) => xScale(d._date))
      .y0(inner.innerHeight)
      .y1((d) => yScale(d._value))
      .curve(CURVES[curve]),
  );

  const description = $derived(describeTimeSeries(data, { title, subtitle, sourceLabel }));
  const tableColumns = $derived([
    { key: xKey, label: xLabel ?? 'Date' },
    { key: yKey, label: yLabel ?? 'Value' },
    ...(multiSeries ? [{ key: seriesKey, label: 'Series' }] : []),
  ]);
</script>

<figure class="chart-container area-chart" bind:this={containerEl} aria-label={title}>
  <figcaption class="chart-header">
    <h3 class="chart-title">{title}</h3>
    {#if subtitle}<p class="chart-subtitle">{subtitle}</p>{/if}
  </figcaption>

  {#if w > 0}
    <div class="chart-body">
      <Svg width={w} height={h} {chartId} {title} description={description}>
        <g transform="translate({margin.left}, {margin.top})">
          {#if showGrid}
            <Grid {xScale} {yScale} width={inner.innerWidth} height={inner.innerHeight}
              xTickCount={defaults.tickCount.x} yTickCount={defaults.tickCount.y} />
          {/if}
          <Axis scale={xScale} position="bottom" width={inner.innerWidth} height={inner.innerHeight}
            tickCount={defaults.tickCount.x} tickFormat={xFormat} label={xLabel} />
          <Axis scale={yScale} position="left" width={inner.innerWidth} height={inner.innerHeight}
            tickCount={defaults.tickCount.y} tickFormat={yFormat} label={yLabel} />

          {#each seriesGroups as [, points], i}
            <path
              d={areaGen(points) ?? ''}
              fill={colors[i % colors.length]}
              fill-opacity={0.3}
              stroke={colors[i % colors.length]}
              stroke-width="2"
              stroke-dasharray={DASH_PATTERNS[i % DASH_PATTERNS.length] === 'none' ? undefined : DASH_PATTERNS[i % DASH_PATTERNS.length]}
            />
          {/each}
        </g>
      </Svg>
    </div>

    {#if legendVisible}
      <Legend items={seriesNames.map((n, i) => ({ label: n, color: colors[i % colors.length], dashIndex: i }))} showDashes={true} />
    {/if}
    {#if showTable}
      <AccessibleTable caption="{title}{subtitle ? `: ${subtitle}` : ''}" columns={tableColumns}
        rows={data as unknown as Record<string, unknown>[]} {chartId} />
    {/if}
  {/if}

  {#if caption || sourceLabel}
    <footer class="chart-footer">
      {#if caption}<p class="chart-caption">{caption}</p>{/if}
      {#if sourceLabel}<p class="chart-source">{sourceLabel}</p>{/if}
    </footer>
  {/if}
</figure>

<style>
  .chart-container { width: 100%; margin: 0; padding: 0; font-family: var(--font-chart, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif); color: var(--chart-text, #1a1a1a); }
  .chart-header { padding: 0 0 0.5rem; }
  .chart-title { margin: 0; font-size: 1.25rem; font-weight: 700; line-height: 1.3; }
  .chart-subtitle { margin: 0.25rem 0 0; font-size: 0.875rem; color: var(--chart-text-secondary, #666); }
  .chart-footer { padding: 0.5rem 0 0; font-size: 0.75rem; color: var(--chart-text-secondary, #888); }
  .chart-caption { margin: 0; }
  .chart-source { margin: 0.125rem 0 0; font-style: italic; }
  @media print { .chart-container { break-inside: avoid; max-width: 6.5in; } }
</style>
