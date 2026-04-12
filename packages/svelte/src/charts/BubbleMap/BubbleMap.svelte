<script lang="ts">
  import { geoPath, geoAlbersUsa, geoNaturalEarth1, geoMercator } from 'd3-geo';
  import { scaleSqrt } from 'd3-scale';
  import { extent } from 'd3-array';
  import * as topojson from 'topojson-client';
  import type { Topology, GeometryCollection } from 'topojson-specification';
  import {
    getPalette,
    getBreakpoint,
    detectColorMode,
    formatSmart,
    type GeoPointRow,
    type ColorMode,
    type PaletteName,
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

  const PROJECTIONS = {
    albersUsa: geoAlbersUsa,
    naturalEarth: geoNaturalEarth1,
    mercator: geoMercator,
  } as const;

  interface Props {
    data: GeoPointRow[];
    topology: Topology;
    topologyObject?: string;
    title: string;
    subtitle?: string;
    caption?: string;
    sourceLabel?: string;
    projection?: keyof typeof PROJECTIONS;
    palette?: PaletteName | string[];
    colorMode?: ColorMode;
    radiusRange?: [number, number];
    width?: number;
    height?: number;
    showTooltip?: boolean;
    showTable?: boolean;
  }

  let {
    data,
    topology,
    topologyObject,
    title,
    subtitle,
    caption,
    sourceLabel,
    projection = 'albersUsa',
    palette = 'newsroom',
    colorMode: colorModeProp,
    radiusRange = [3, 30],
    width: widthProp,
    height: heightProp,
    showTooltip: showTooltipProp = true,
    showTable = true,
  }: Props = $props();

  let containerEl: HTMLElement | undefined = $state();
  const dims = useDimensions(() => containerEl ?? null);
  const tooltip = useTooltip<GeoPointRow>();
  const chartId = `bubble-map-${Math.random().toString(36).slice(2, 9)}`;

  const colorMode = $derived(colorModeProp ?? detectColorMode());

  const objectName = $derived(topologyObject ?? Object.keys(topology.objects)[0]);

  const features = $derived(
    topojson.feature(
      topology,
      topology.objects[objectName] as GeometryCollection,
    ).features,
  );

  const w = $derived(widthProp ?? dims.width);
  const h = $derived(heightProp ?? w * 0.625);

  const proj = $derived(
    PROJECTIONS[projection]().fitSize([w, h], {
      type: 'FeatureCollection',
      features,
    }),
  );
  const pathGen = $derived(geoPath(proj));

  const [minVal, maxVal] = $derived(extent(data, (d) => d.value) as [number, number]);
  const sizeScale = $derived(
    scaleSqrt().domain([minVal, maxVal]).range(radiusRange),
  );

  const colors = $derived(getPalette(palette, colorMode, 'categorical', 1));

  // Project points
  const projectedPoints = $derived(
    data
      .map((d) => {
        const coords = proj([d.lon, d.lat]);
        if (!coords) return null;
        return { ...d, cx: coords[0], cy: coords[1] };
      })
      .filter(Boolean)
      .sort((a, b) => b!.value - a!.value) as (GeoPointRow & { cx: number; cy: number })[],
  );

  const description = $derived(
    `Bubble map: ${title}. ${data.length} locations. Values range from ${formatSmart(minVal)} to ${formatSmart(maxVal)}.`,
  );

  const tableColumns = $derived([
    { key: 'label', label: 'Location' },
    { key: 'value', label: 'Value', format: (v: unknown) => formatSmart(v as number) },
  ]);

  let focusedIndex = $state(-1);
</script>

<figure
  class="chart-container bubble-map"
  bind:this={containerEl}
  aria-label={title}
>
  <figcaption class="chart-header">
    <h3 class="chart-title">{title}</h3>
    {#if subtitle}
      <p class="chart-subtitle">{subtitle}</p>
    {/if}
  </figcaption>

  {#if w > 0}
    <div class="chart-body" style="position: relative;">
      <Svg width={w} height={h} {chartId} {title} description={description}>
        <!-- Base map -->
        <g class="basemap" aria-hidden="true">
          {#each features as feature}
            <path
              d={pathGen(feature) ?? ''}
              fill="var(--chart-grid, #e5e5e5)"
              stroke="var(--chart-bg, #fff)"
              stroke-width="0.5"
            />
          {/each}
        </g>

        <!-- Bubbles (sorted largest-first so small ones are on top) -->
        <g class="bubbles">
          {#each projectedPoints as pt, i}
            {@const focused = focusedIndex === i}
            <circle
              cx={pt.cx}
              cy={pt.cy}
              r={focused ? sizeScale(pt.value) + 2 : sizeScale(pt.value)}
              fill={colors[0]}
              fill-opacity={focused ? 0.85 : 0.6}
              stroke={focused ? 'var(--chart-text, #1a1a1a)' : colors[0]}
              stroke-width={focused ? 2 : 1}
              tabindex={i === 0 ? 0 : -1}
              role="button"
              aria-label="{pt.label ?? pt.id}: {formatSmart(pt.value)}"
              onmouseenter={(e) => { focusedIndex = i; showTooltipProp && tooltip.show(e, pt); }}
              onmouseleave={() => { focusedIndex = -1; tooltip.hide(); }}
              onfocus={() => { focusedIndex = i; announce(`${pt.label ?? pt.id}: ${formatSmart(pt.value)}`); }}
              onblur={() => { focusedIndex = -1; }}
            />
          {/each}
        </g>
      </Svg>

      {#if showTooltipProp && tooltip.visible && tooltip.data}
        <Tooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y}>
          <strong>{tooltip.data.label ?? tooltip.data.id}</strong><br />
          {formatSmart(tooltip.data.value)}
        </Tooltip>
      {/if}
    </div>

    {#if showTable}
      <AccessibleTable
        caption="{title}{subtitle ? `: ${subtitle}` : ''}"
        columns={tableColumns}
        rows={data as unknown as Record<string, unknown>[]}
        {chartId}
      />
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
  .chart-container {
    width: 100%;
    margin: 0;
    padding: 0;
    font-family: var(--font-chart, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
    color: var(--chart-text, #1a1a1a);
  }

  .chart-header { padding: 0 0 0.5rem; }

  .chart-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.3;
  }

  .chart-subtitle {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: var(--chart-text-secondary, #666);
  }

  circle {
    cursor: pointer;
    transition: r 0.15s, stroke-width 0.15s;
  }

  circle:focus-visible {
    outline: none;
    stroke: var(--chart-text, #1a1a1a);
    stroke-width: 2;
  }

  .chart-footer {
    padding: 0.5rem 0 0;
    font-size: 0.75rem;
    color: var(--chart-text-secondary, #888);
  }

  .chart-caption { margin: 0; }
  .chart-source { margin: 0.125rem 0 0; font-style: italic; }

  @media (prefers-reduced-motion: reduce) {
    circle { transition: none; }
  }

  @media print {
    .chart-container {
      break-inside: avoid;
      max-width: 6.5in;
    }

    circle {
      stroke: #333 !important;
      stroke-width: 1 !important;
      fill-opacity: 0.7 !important;
    }
  }
</style>
