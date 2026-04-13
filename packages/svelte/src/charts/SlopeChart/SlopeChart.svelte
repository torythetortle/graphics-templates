<script lang="ts">
  import { scaleLinear, scalePoint } from 'd3-scale';
  import { extent } from 'd3-array';
  import {
    getPalette, getBreakpoint, RESPONSIVE_DEFAULTS, innerDimensions, detectColorMode, formatSmart,
    type SlopeRow, type ColorMode, type PaletteName,
  } from '@graphics-templates/core';
  import { announce } from '@graphics-templates/core/a11y';
  // @ts-ignore
  import Svg from '../../primitives/Svg.svelte';
  // @ts-ignore
  import AccessibleTable from '../../primitives/AccessibleTable.svelte';
  import { useDimensions } from '../../lib/use-dimensions.svelte.js';

  interface Props {
    data: SlopeRow[];
    title: string;
    subtitle?: string;
    caption?: string;
    sourceLabel?: string;
    startLabel?: string;
    endLabel?: string;
    width?: number;
    height?: number;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    palette?: PaletteName | string[];
    colorMode?: ColorMode;
    showTable?: boolean;
    highlightLabel?: string;
  }

  let {
    data, title, subtitle, caption, sourceLabel,
    startLabel = 'Before', endLabel = 'After',
    width: widthProp, height: heightProp,
    marginTop = 32, marginRight = 80, marginBottom = 32, marginLeft = 80,
    palette = 'newsroom', colorMode: colorModeProp,
    showTable = true, highlightLabel,
  }: Props = $props();

  let containerEl: HTMLElement | undefined = $state();
  const dims = useDimensions(() => containerEl ?? null);
  const chartId = `slope-${Math.random().toString(36).slice(2, 9)}`;
  const colorMode = $derived(colorModeProp ?? detectColorMode());
  const colors = $derived(getPalette(palette, colorMode, 'categorical', data.length));

  const w = $derived(widthProp ?? dims.width);
  const bp = $derived(getBreakpoint(w));
  const defaults = $derived(RESPONSIVE_DEFAULTS[bp]);
  const h = $derived(heightProp ?? Math.max(300, data.length * 36));
  const inner = $derived(innerDimensions(w, h, { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft }));

  const allValues = $derived(data.flatMap((d) => [d.start, d.end]));
  const [minVal, maxVal] = $derived(extent(allValues) as [number, number]);
  const yScale = $derived(scaleLinear().domain([minVal, maxVal]).range([inner.innerHeight, 0]).nice());

  const description = $derived(
    `Slope chart: ${title}. ${data.length} items comparing ${startLabel} to ${endLabel}.`,
  );

  const tableColumns = $derived([
    { key: 'label', label: 'Item' },
    { key: 'start', label: startLabel },
    { key: 'end', label: endLabel },
    { key: 'change', label: 'Change' },
  ]);
  const tableRows = $derived(data.map((d) => ({
    label: d.label, start: d.start, end: d.end,
    change: `${d.end - d.start > 0 ? '+' : ''}${(d.end - d.start).toFixed(1)}`,
  })));

  let focusedLabel = $state<string | null>(null);
</script>

<figure class="chart-container slope-chart" bind:this={containerEl} aria-label={title}>
  <figcaption class="chart-header">
    <h3 class="chart-title">{title}</h3>
    {#if subtitle}<p class="chart-subtitle">{subtitle}</p>{/if}
  </figcaption>

  {#if w > 0}
    <Svg width={w} height={h} {chartId} {title} description={description}>
      <g transform="translate({marginLeft}, {marginTop})">
        <!-- Column labels -->
        <text x={0} y={-12} text-anchor="middle" font-size="12" font-weight="600" fill="var(--chart-text, #1a1a1a)">{startLabel}</text>
        <text x={inner.innerWidth} y={-12} text-anchor="middle" font-size="12" font-weight="600" fill="var(--chart-text, #1a1a1a)">{endLabel}</text>

        <!-- Vertical axes -->
        <line x1={0} y1={0} x2={0} y2={inner.innerHeight} stroke="var(--chart-grid, #e5e5e5)" stroke-width="1" />
        <line x1={inner.innerWidth} y1={0} x2={inner.innerWidth} y2={inner.innerHeight} stroke="var(--chart-grid, #e5e5e5)" stroke-width="1" />

        {#each data as row, i}
          {@const y1 = yScale(row.start)}
          {@const y2 = yScale(row.end)}
          {@const color = colors[i % colors.length]}
          {@const highlighted = highlightLabel ? row.label === highlightLabel : true}
          {@const focused = focusedLabel === row.label}
          {@const opacity = highlighted || focused ? 1 : 0.2}

          <g
            tabindex={i === 0 ? 0 : -1}
            role="button"
            aria-label="{row.label}: {startLabel} {formatSmart(row.start)}, {endLabel} {formatSmart(row.end)}"
            onfocus={() => { focusedLabel = row.label; announce(`${row.label}: ${formatSmart(row.start)} to ${formatSmart(row.end)}`); }}
            onblur={() => { focusedLabel = null; }}
            onmouseenter={() => { focusedLabel = row.label; }}
            onmouseleave={() => { focusedLabel = null; }}
            style="outline: none;"
          >
            <line x1={0} {y1} x2={inner.innerWidth} {y2}
              stroke={color} stroke-width={focused ? 3 : 2} {opacity} />
            <circle cx={0} cy={y1} r={focused ? 5 : 4} fill={color} {opacity} />
            <circle cx={inner.innerWidth} cy={y2} r={focused ? 5 : 4} fill={color} {opacity} />

            <!-- Labels -->
            <text x={-8} y={y1} dy="0.35em" text-anchor="end" font-size="11" fill={color} {opacity}>
              {row.label} {formatSmart(row.start)}
            </text>
            <text x={inner.innerWidth + 8} y={y2} dy="0.35em" font-size="11" fill={color} {opacity}>
              {formatSmart(row.end)} {row.label}
            </text>
          </g>
        {/each}
      </g>
    </Svg>

    {#if showTable}
      <AccessibleTable caption="{title}{subtitle ? `: ${subtitle}` : ''}" columns={tableColumns}
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
  line, circle { transition: opacity 0.15s; }
  .chart-footer { padding: 0.5rem 0 0; font-size: 0.75rem; color: var(--chart-text-secondary, #888); }
  .chart-caption { margin: 0; }
  .chart-source { margin: 0.125rem 0 0; font-style: italic; }
  @media (prefers-reduced-motion: reduce) { line, circle { transition: none; } }
  @media print { .chart-container { break-inside: avoid; max-width: 6.5in; } }
</style>
