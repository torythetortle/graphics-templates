<script lang="ts">
  import { line, curveMonotoneX } from 'd3-shape';
  import { scaleLinear, scalePoint } from 'd3-scale';
  import {
    getPalette, getBreakpoint, RESPONSIVE_DEFAULTS, innerDimensions, detectColorMode, DASH_PATTERNS,
    type RankingRow, type ColorMode, type PaletteName,
  } from '@graphics-templates/core';
  import { announce } from '@graphics-templates/core/a11y';
  // @ts-ignore
  import Svg from '../../primitives/Svg.svelte';
  // @ts-ignore
  import Legend from '../../primitives/Legend.svelte';
  // @ts-ignore
  import AccessibleTable from '../../primitives/AccessibleTable.svelte';
  import { useDimensions } from '../../lib/use-dimensions.svelte.js';

  interface Props {
    data: RankingRow[];
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
    palette?: PaletteName | string[];
    colorMode?: ColorMode;
    showLegend?: boolean;
    showTable?: boolean;
    highlightLabel?: string;
  }

  let {
    data, title, subtitle, caption, sourceLabel,
    width: widthProp, height: heightProp,
    marginTop = 24, marginRight = 80, marginBottom = 40, marginLeft = 32,
    palette = 'newsroom', colorMode: colorModeProp,
    showLegend: showLegendProp, showTable = true, highlightLabel,
  }: Props = $props();

  let containerEl: HTMLElement | undefined = $state();
  const dims = useDimensions(() => containerEl ?? null);
  const chartId = `bump-${Math.random().toString(36).slice(2, 9)}`;
  const colorMode = $derived(colorModeProp ?? detectColorMode());
  const colors = $derived(getPalette(palette, colorMode, 'categorical', data.length));

  const periods = $derived([...new Set(data.flatMap((d) => d.values.map((v) => String(v.period))))]);
  const maxRank = $derived(Math.max(...data.flatMap((d) => d.values.map((v) => v.rank))));

  const w = $derived(widthProp ?? dims.width);
  const bp = $derived(getBreakpoint(w));
  const defaults = $derived(RESPONSIVE_DEFAULTS[bp]);
  const h = $derived(heightProp ?? Math.max(280, maxRank * 40));
  const inner = $derived(innerDimensions(w, h, { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft }));

  const xScale = $derived(scalePoint<string>().domain(periods).range([0, inner.innerWidth]).padding(0.1));
  const yScale = $derived(scaleLinear().domain([1, maxRank]).range([0, inner.innerHeight]));

  const lineGen = $derived(
    line<{ period: string; rank: number }>()
      .x((d) => xScale(String(d.period)) ?? 0)
      .y((d) => yScale(d.rank))
      .curve(curveMonotoneX),
  );

  const legendVisible = $derived(showLegendProp ?? data.length <= 10);

  const description = $derived(
    `Bump chart: ${title}. ${data.length} items ranked across ${periods.length} periods.`,
  );

  const tableColumns = $derived([
    { key: 'label', label: 'Item' },
    ...periods.map((p) => ({ key: p, label: String(p) })),
  ]);
  const tableRows = $derived(data.map((d) => {
    const row: Record<string, unknown> = { label: d.label };
    for (const v of d.values) row[String(v.period)] = v.rank;
    return row;
  }));

  let focusedLabel = $state<string | null>(null);
</script>

<figure class="chart-container bump-chart" bind:this={containerEl} aria-label={title}>
  <figcaption class="chart-header">
    <h3 class="chart-title">{title}</h3>
    {#if subtitle}<p class="chart-subtitle">{subtitle}</p>{/if}
  </figcaption>

  {#if w > 0}
    <Svg width={w} height={h} {chartId} {title} description={description}>
      <g transform="translate({marginLeft}, {marginTop})">
        <!-- Period labels -->
        {#each periods as period}
          <text x={xScale(period)} y={-8} text-anchor="middle" font-size="11" fill="var(--chart-axis, #888)" aria-hidden="true">
            {period}
          </text>
        {/each}

        <!-- Rank labels on left -->
        {#each Array.from({ length: maxRank }, (_, i) => i + 1) as rank}
          <text x={-12} y={yScale(rank)} dy="0.35em" text-anchor="end" font-size="10" fill="var(--chart-axis, #888)" aria-hidden="true">
            {rank}
          </text>
        {/each}

        {#each data as row, i}
          {@const color = colors[i % colors.length]}
          {@const dash = DASH_PATTERNS[i % DASH_PATTERNS.length]}
          {@const highlighted = highlightLabel ? row.label === highlightLabel : true}
          {@const focused = focusedLabel === row.label}
          {@const opacity = highlighted || focused ? 1 : 0.15}
          {@const points = row.values.map((v) => ({ period: String(v.period), rank: v.rank }))}
          {@const lastPoint = points[points.length - 1]}

          <g
            tabindex={i === 0 ? 0 : -1}
            role="button"
            aria-label="{row.label}: ranks {row.values.map((v) => v.rank).join(', ')}"
            onfocus={() => { focusedLabel = row.label; announce(`${row.label}: rank ${lastPoint?.rank}`); }}
            onblur={() => { focusedLabel = null; }}
            onmouseenter={() => { focusedLabel = row.label; }}
            onmouseleave={() => { focusedLabel = null; }}
            style="outline: none;"
          >
            <path d={lineGen(points) ?? ''} fill="none" stroke={color} stroke-width={focused ? 3.5 : 2.5}
              stroke-dasharray={dash === 'none' ? undefined : dash} {opacity} />

            {#each points as pt}
              <circle cx={xScale(pt.period)} cy={yScale(pt.rank)} r={focused ? 5 : 4}
                fill={color} {opacity} />
            {/each}

            <!-- End label -->
            {#if lastPoint}
              <text x={(xScale(lastPoint.period) ?? 0) + 10} y={yScale(lastPoint.rank)}
                dy="0.35em" font-size="11" fill={color} {opacity} font-weight={focused ? '600' : '400'}>
                {row.label}
              </text>
            {/if}
          </g>
        {/each}
      </g>
    </Svg>

    {#if showTable}
      <AccessibleTable caption="{title}" columns={tableColumns}
        rows={tableRows as unknown as Record<string, unknown>[]} {chartId} />
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
  path, circle { transition: opacity 0.15s; }
  .chart-footer { padding: 0.5rem 0 0; font-size: 0.75rem; color: var(--chart-text-secondary, #888); }
  .chart-caption { margin: 0; }
  .chart-source { margin: 0.125rem 0 0; font-style: italic; }
  @media (prefers-reduced-motion: reduce) { path, circle { transition: none; } }
  @media print { .chart-container { break-inside: avoid; max-width: 6.5in; } }
</style>
