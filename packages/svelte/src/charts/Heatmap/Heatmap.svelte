<script lang="ts">
  import { scaleBand, scaleSequential } from 'd3-scale';
  import { extent } from 'd3-array';
  import { interpolateBlues, interpolateReds, interpolateGreens, interpolateOranges, interpolatePurples, interpolateGreys } from 'd3-scale-chromatic';
  import {
    getBreakpoint, RESPONSIVE_DEFAULTS, innerDimensions, detectColorMode, formatSmart,
    type HeatmapRow, type ColorMode, type PaletteName,
  } from '@graphics-templates/core';
  import { announce } from '@graphics-templates/core/a11y';
  // @ts-ignore
  import Svg from '../../primitives/Svg.svelte';
  // @ts-ignore
  import Tooltip from '../../primitives/Tooltip.svelte';
  // @ts-ignore
  import AccessibleTable from '../../primitives/AccessibleTable.svelte';
  import { useDimensions } from '../../lib/use-dimensions.svelte.js';
  import { useTooltip } from '../../lib/use-tooltip.svelte.js';

  const INTERPOLATORS: Record<string, (t: number) => string> = {
    blues: interpolateBlues, reds: interpolateReds, greens: interpolateGreens,
    oranges: interpolateOranges, purples: interpolatePurples, grays: interpolateGreys,
  };

  interface Props {
    data: HeatmapRow[];
    title: string;
    subtitle?: string;
    caption?: string;
    sourceLabel?: string;
    xKey?: string;
    yKey?: string;
    valueKey?: string;
    width?: number;
    height?: number;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    palette?: string;
    colorMode?: ColorMode;
    showTooltip?: boolean;
    showTable?: boolean;
    cellRadius?: number;
  }

  let {
    data, title, subtitle, caption, sourceLabel,
    xKey = 'x', yKey = 'y', valueKey = 'value',
    width: widthProp, height: heightProp,
    marginTop = 24, marginRight = 12, marginBottom = 40, marginLeft = 48,
    palette = 'blues', colorMode: colorModeProp,
    showTooltip: showTooltipProp = true, showTable = true, cellRadius = 1,
  }: Props = $props();

  let containerEl: HTMLElement | undefined = $state();
  const dims = useDimensions(() => containerEl ?? null);
  const tooltip = useTooltip<HeatmapRow>();
  const chartId = `heatmap-${Math.random().toString(36).slice(2, 9)}`;
  const colorMode = $derived(colorModeProp ?? detectColorMode());

  const xLabels = $derived([...new Set(data.map((d) => String(d[xKey])))]);
  const yLabels = $derived([...new Set(data.map((d) => String(d[yKey])))]);

  const w = $derived(widthProp ?? dims.width);
  const bp = $derived(getBreakpoint(w));
  const inner = $derived(innerDimensions(w, heightProp ?? Math.max(200, yLabels.length * 28 + marginTop + marginBottom),
    { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft }));
  const h = $derived(heightProp ?? Math.max(200, yLabels.length * 28 + marginTop + marginBottom));

  const xScale = $derived(scaleBand().domain(xLabels).range([0, inner.innerWidth]).padding(0.05));
  const yScale = $derived(scaleBand().domain(yLabels).range([0, inner.innerHeight]).padding(0.05));

  const [minVal, maxVal] = $derived(extent(data, (d) => d[valueKey] as number) as [number, number]);
  const interpolator = $derived(colorMode === 'print' ? interpolateGreys : (INTERPOLATORS[palette] ?? interpolateBlues));
  const colorScale = $derived(scaleSequential(interpolator).domain([minVal, maxVal]));

  const description = $derived(
    `Heatmap: ${title}. ${xLabels.length} columns, ${yLabels.length} rows. Values: ${formatSmart(minVal)} to ${formatSmart(maxVal)}.`,
  );

  const tableColumns = $derived([
    { key: yKey, label: 'Row' }, { key: xKey, label: 'Column' },
    { key: valueKey, label: 'Value', format: (v: unknown) => formatSmart(v as number) },
  ]);

  let focusedCell = $state<string | null>(null);
</script>

<figure class="chart-container heatmap" bind:this={containerEl} aria-label={title}>
  <figcaption class="chart-header">
    <h3 class="chart-title">{title}</h3>
    {#if subtitle}<p class="chart-subtitle">{subtitle}</p>{/if}
  </figcaption>

  {#if w > 0}
    <div class="chart-body" style="position: relative;">
      <Svg width={w} height={h} {chartId} {title} description={description}>
        <g transform="translate({marginLeft}, {marginTop})">
          <!-- X labels -->
          {#each xLabels as label}
            <text x={(xScale(label) ?? 0) + xScale.bandwidth() / 2} y={inner.innerHeight + 16}
              text-anchor="middle" font-size="10" fill="var(--chart-axis, #888)" aria-hidden="true">{label}</text>
          {/each}

          <!-- Y labels -->
          {#each yLabels as label}
            <text x={-8} y={(yScale(label) ?? 0) + yScale.bandwidth() / 2} dy="0.35em"
              text-anchor="end" font-size="10" fill="var(--chart-axis, #888)" aria-hidden="true">{label}</text>
          {/each}

          {#each data as row}
            {@const xLabel = String(row[xKey])}
            {@const yLabel = String(row[yKey])}
            {@const val = row[valueKey] as number}
            {@const key = `${xLabel}-${yLabel}`}
            {@const focused = focusedCell === key}
            <rect
              x={xScale(xLabel)} y={yScale(yLabel)}
              width={xScale.bandwidth()} height={yScale.bandwidth()}
              fill={colorScale(val)}
              stroke={focused ? 'var(--chart-text, #1a1a1a)' : 'none'}
              stroke-width={focused ? 2 : 0}
              rx={cellRadius}
              tabindex={-1}
              role="button"
              aria-label="{yLabel}, {xLabel}: {formatSmart(val)}"
              onmouseenter={(e) => { focusedCell = key; showTooltipProp && tooltip.show(e, row); }}
              onmouseleave={() => { focusedCell = null; tooltip.hide(); }}
              onfocus={() => { focusedCell = key; announce(`${yLabel}, ${xLabel}: ${formatSmart(val)}`); }}
              onblur={() => { focusedCell = null; }}
              style="outline: none;"
            />
          {/each}
        </g>
      </Svg>

      {#if showTooltipProp && tooltip.visible && tooltip.data}
        <Tooltip visible={tooltip.visible} x={tooltip.x + marginLeft} y={tooltip.y + marginTop}>
          <strong>{tooltip.data[yKey]}, {tooltip.data[xKey]}</strong><br />
          {formatSmart(tooltip.data[valueKey] as number)}
        </Tooltip>
      {/if}
    </div>

    <!-- Legend bar -->
    <div class="heat-legend" aria-hidden="true">
      <div class="legend-gradient" style="background: linear-gradient(to right, {colorScale(minVal)}, {colorScale((minVal + maxVal) / 2)}, {colorScale(maxVal)});"></div>
      <div class="legend-labels">
        <span>{formatSmart(minVal)}</span>
        <span>{formatSmart(maxVal)}</span>
      </div>
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
  rect { cursor: pointer; }
  .heat-legend { max-width: 200px; margin-top: 0.75rem; }
  .legend-gradient { height: 10px; border-radius: 2px; }
  .legend-labels { display: flex; justify-content: space-between; font-size: 0.6875rem; color: var(--chart-text-secondary, #888); margin-top: 0.25rem; }
  .chart-footer { padding: 0.5rem 0 0; font-size: 0.75rem; color: var(--chart-text-secondary, #888); }
  .chart-caption { margin: 0; }
  .chart-source { margin: 0.125rem 0 0; font-style: italic; }
  @media print { .chart-container { break-inside: avoid; max-width: 6.5in; } rect { stroke: #ccc !important; stroke-width: 0.5 !important; } }
</style>
