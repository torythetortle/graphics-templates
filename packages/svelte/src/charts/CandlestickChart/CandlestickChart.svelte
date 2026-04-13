<script lang="ts">
  import { scaleBand, scaleLinear } from 'd3-scale';
  import { extent } from 'd3-array';
  import {
    getBreakpoint, RESPONSIVE_DEFAULTS, innerDimensions, detectColorMode, formatSmart, parseDate,
    type OHLCRow, type ColorMode,
  } from '@graphics-templates/core';
  import { announce } from '@graphics-templates/core/a11y';
  // @ts-ignore
  import Svg from '../../primitives/Svg.svelte';
  // @ts-ignore
  import Axis from '../../primitives/Axis.svelte';
  // @ts-ignore
  import Grid from '../../primitives/Grid.svelte';
  // @ts-ignore
  import Tooltip from '../../primitives/Tooltip.svelte';
  // @ts-ignore
  import AccessibleTable from '../../primitives/AccessibleTable.svelte';
  import { useDimensions } from '../../lib/use-dimensions.svelte.js';
  import { useTooltip } from '../../lib/use-tooltip.svelte.js';

  interface ParsedOHLC extends OHLCRow { _date: Date; _up: boolean; }

  interface Props {
    data: OHLCRow[];
    title: string;
    subtitle?: string;
    caption?: string;
    sourceLabel?: string;
    width?: number;
    height?: number;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    aspectRatio?: number;
    upColor?: string;
    downColor?: string;
    colorMode?: ColorMode;
    showGrid?: boolean;
    showTooltip?: boolean;
    showTable?: boolean;
    showVolume?: boolean;
  }

  let {
    data, title, subtitle, caption, sourceLabel,
    width: widthProp, height: heightProp,
    marginTop, marginRight, marginBottom, marginLeft, aspectRatio,
    upColor = '#2ca25f', downColor = '#c73a27',
    colorMode: colorModeProp, showGrid = true,
    showTooltip: showTooltipProp = true, showTable = true, showVolume = false,
  }: Props = $props();

  let containerEl: HTMLElement | undefined = $state();
  const dims = useDimensions(() => containerEl ?? null);
  const tooltip = useTooltip<ParsedOHLC>();
  const chartId = `candle-${Math.random().toString(36).slice(2, 9)}`;
  const colorMode = $derived(colorModeProp ?? detectColorMode());

  const parsed: ParsedOHLC[] = $derived(data.map((d) => ({
    ...d, _date: parseDate(d.date), _up: d.close >= d.open,
  })));

  const w = $derived(widthProp ?? dims.width);
  const bp = $derived(getBreakpoint(w));
  const defaults = $derived(RESPONSIVE_DEFAULTS[bp]);
  const margin = $derived({
    top: marginTop ?? defaults.marginTop, right: marginRight ?? defaults.marginRight,
    bottom: marginBottom ?? defaults.marginBottom, left: marginLeft ?? 56,
  });
  const ar = $derived(aspectRatio ?? defaults.aspectRatio);
  const h = $derived(heightProp ?? Math.round(w / ar));
  const inner = $derived(innerDimensions(w, h, margin));

  const dateLabels = $derived(parsed.map((d) => d._date.toISOString()));
  const xScale = $derived(scaleBand().domain(dateLabels).range([0, inner.innerWidth]).padding(0.3));

  const [minPrice, maxPrice] = $derived(extent(parsed.flatMap((d) => [d.low, d.high])) as [number, number]);
  const yScale = $derived(scaleLinear().domain([minPrice, maxPrice]).range([inner.innerHeight, 0]).nice());

  function getColor(d: ParsedOHLC): string {
    if (colorMode === 'print') return d._up ? '#666' : '#222';
    return d._up ? upColor : downColor;
  }

  const description = $derived(
    `Candlestick chart: ${title}. ${data.length} trading periods. Price range: ${formatSmart(minPrice)} to ${formatSmart(maxPrice)}.`,
  );

  const tableColumns = $derived([
    { key: 'date', label: 'Date' },
    { key: 'open', label: 'Open', format: (v: unknown) => formatSmart(v as number) },
    { key: 'high', label: 'High', format: (v: unknown) => formatSmart(v as number) },
    { key: 'low', label: 'Low', format: (v: unknown) => formatSmart(v as number) },
    { key: 'close', label: 'Close', format: (v: unknown) => formatSmart(v as number) },
  ]);

  let focusedIndex = $state(-1);
</script>

<figure class="chart-container candlestick" bind:this={containerEl} aria-label={title}>
  <figcaption class="chart-header">
    <h3 class="chart-title">{title}</h3>
    {#if subtitle}<p class="chart-subtitle">{subtitle}</p>{/if}
  </figcaption>

  {#if w > 0}
    <div class="chart-body" style="position: relative;">
      <Svg width={w} height={h} {chartId} {title} description={description}>
        <g transform="translate({margin.left}, {margin.top})">
          {#if showGrid}
            <Grid yScale={yScale} width={inner.innerWidth} height={inner.innerHeight} yTickCount={defaults.tickCount.y} />
          {/if}
          <Axis scale={yScale} position="left" width={inner.innerWidth} height={inner.innerHeight}
            tickCount={defaults.tickCount.y} tickFormat={(d) => formatSmart(d as number)} />

          {#each parsed as candle, i}
            {@const x = (xScale(candle._date.toISOString()) ?? 0) + xScale.bandwidth() / 2}
            {@const bw = xScale.bandwidth()}
            {@const color = getColor(candle)}
            {@const focused = focusedIndex === i}

            <!-- Wick -->
            <line x1={x} x2={x} y1={yScale(candle.high)} y2={yScale(candle.low)}
              stroke={color} stroke-width={focused ? 2 : 1} />

            <!-- Body -->
            <rect
              x={x - bw / 2}
              y={yScale(Math.max(candle.open, candle.close))}
              width={bw}
              height={Math.max(1, Math.abs(yScale(candle.open) - yScale(candle.close)))}
              fill={candle._up ? 'var(--chart-bg, #fff)' : color}
              stroke={color}
              stroke-width={focused ? 2 : 1}
              tabindex={i === 0 ? 0 : -1}
              role="button"
              aria-label="{candle._date.toLocaleDateString()}: O {formatSmart(candle.open)} H {formatSmart(candle.high)} L {formatSmart(candle.low)} C {formatSmart(candle.close)}"
              onmouseenter={(e) => { focusedIndex = i; showTooltipProp && tooltip.show(e, candle); }}
              onmouseleave={() => { focusedIndex = -1; tooltip.hide(); }}
              onfocus={() => { focusedIndex = i; announce(`${candle._date.toLocaleDateString()}: Close ${formatSmart(candle.close)}`); }}
              onblur={() => { focusedIndex = -1; }}
              style="outline: none; cursor: pointer;"
            />
          {/each}
        </g>
      </Svg>

      {#if showTooltipProp && tooltip.visible && tooltip.data}
        <Tooltip visible={tooltip.visible} x={tooltip.x + margin.left} y={tooltip.y + margin.top}>
          <strong>{tooltip.data._date.toLocaleDateString()}</strong><br />
          O: {formatSmart(tooltip.data.open)} &middot; H: {formatSmart(tooltip.data.high)}<br />
          L: {formatSmart(tooltip.data.low)} &middot; C: {formatSmart(tooltip.data.close)}
        </Tooltip>
      {/if}
    </div>

    {#if showTable}
      <AccessibleTable caption="{title}" columns={tableColumns}
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
