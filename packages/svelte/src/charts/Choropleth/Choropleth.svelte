<script lang="ts">
  import { geoPath, geoAlbersUsa, geoNaturalEarth1, geoMercator } from 'd3-geo';
  import { scaleSequential, scaleDiverging } from 'd3-scale';
  import { extent } from 'd3-array';
  import * as topojson from 'topojson-client';
  import type { Topology, GeometryCollection } from 'topojson-specification';
  import {
    getPalette,
    getBreakpoint,
    RESPONSIVE_DEFAULTS,
    detectColorMode,
    describeGeo,
    formatSmart,
    type GeoRow,
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
  import { interpolateBlues, interpolateReds, interpolateGreens, interpolateOranges, interpolatePurples, interpolateGreys, interpolateRdBu, interpolateBrBG, interpolatePuOr } from 'd3-scale-chromatic';

  const PROJECTIONS = {
    albersUsa: geoAlbersUsa,
    naturalEarth: geoNaturalEarth1,
    mercator: geoMercator,
  } as const;

  const INTERPOLATORS: Record<string, (t: number) => string> = {
    blues: interpolateBlues,
    reds: interpolateReds,
    greens: interpolateGreens,
    oranges: interpolateOranges,
    purples: interpolatePurples,
    grays: interpolateGreys,
    redblue: (t: number) => interpolateRdBu(1 - t), // flip so blue = low, red = high
    'redblue-a11y': interpolateBrBG,
    warmcool: interpolatePuOr,
  };

  interface Props {
    data: GeoRow[];
    topology: Topology;
    topologyObject?: string;
    title: string;
    subtitle?: string;
    caption?: string;
    sourceLabel?: string;
    idKey?: string;
    projection?: keyof typeof PROJECTIONS;
    colorScheme?: 'sequential' | 'diverging';
    palette?: PaletteName | string[];
    colorMode?: ColorMode;
    divergingMidpoint?: number;
    width?: number;
    height?: number;
    showTooltip?: boolean;
    showTable?: boolean;
    showLegend?: boolean;
  }

  let {
    data,
    topology,
    topologyObject,
    title,
    subtitle,
    caption,
    sourceLabel,
    idKey = 'id',
    projection = 'albersUsa',
    colorScheme = 'sequential',
    palette = 'blues',
    colorMode: colorModeProp,
    divergingMidpoint = 0,
    width: widthProp,
    height: heightProp,
    showTooltip: showTooltipProp = true,
    showTable = true,
    showLegend = true,
  }: Props = $props();

  let containerEl: HTMLElement | undefined = $state();
  const dims = useDimensions(() => containerEl ?? null);
  const tooltip = useTooltip<{ feature: GeoJSON.Feature; row?: GeoRow }>();
  const chartId = `choropleth-${Math.random().toString(36).slice(2, 9)}`;

  const colorMode = $derived(colorModeProp ?? detectColorMode());

  // Resolve topology object name
  const objectName = $derived(
    topologyObject ?? Object.keys(topology.objects)[0],
  );

  // Convert topojson → geojson features
  const features = $derived(
    topojson.feature(
      topology,
      topology.objects[objectName] as GeometryCollection,
    ).features,
  );

  // Build data lookup by id
  const dataMap = $derived(
    new Map(data.map((d) => [String(d[idKey]), d])),
  );

  // Dimensions
  const w = $derived(widthProp ?? dims.width);
  const bp = $derived(getBreakpoint(w));
  const defaults = $derived(RESPONSIVE_DEFAULTS[bp]);

  // Projection + path
  const proj = $derived(
    PROJECTIONS[projection]().fitSize([w, heightProp ?? w * 0.625], {
      type: 'FeatureCollection',
      features,
    }),
  );
  const pathGen = $derived(geoPath(proj));
  const h = $derived(heightProp ?? w * 0.625);

  // Color scale
  const [minVal, maxVal] = $derived(extent(data, (d) => d.value) as [number, number]);

  const interpolator = $derived(
    colorMode === 'print'
      ? interpolateGreys
      : INTERPOLATORS[palette as string] ?? interpolateBlues,
  );

  const colorScale = $derived(
    colorScheme === 'diverging'
      ? scaleDiverging<string>()
          .domain([minVal, divergingMidpoint, maxVal])
          .interpolator(interpolator)
      : scaleSequential<string>()
          .domain([minVal, maxVal])
          .interpolator(interpolator),
  );

  function getFill(feature: GeoJSON.Feature): string {
    const id = String(feature.id ?? feature.properties?.['FIPS'] ?? '');
    const row = dataMap.get(id);
    if (!row) return 'var(--chart-grid, #e5e5e5)';
    return colorScale(row.value);
  }

  function getLabel(feature: GeoJSON.Feature): string {
    const id = String(feature.id ?? '');
    const row = dataMap.get(id);
    const name = row?.label ?? feature.properties?.['name'] ?? id;
    const val = row ? formatSmart(row.value) : 'No data';
    return `${name}: ${val}`;
  }

  // A11y
  const description = $derived(describeGeo(data, { title, subtitle, sourceLabel }));

  const tableColumns = $derived([
    { key: 'label', label: 'Area' },
    { key: 'value', label: 'Value', format: (v: unknown) => formatSmart(v as number) },
  ]);

  const tableRows = $derived(
    data.map((d) => ({ label: d.label ?? d[idKey], value: d.value })),
  );

  // Legend ticks
  const legendSteps = 5;
  const legendColors = $derived(
    Array.from({ length: legendSteps }, (_, i) => {
      const t = i / (legendSteps - 1);
      const val = minVal + t * (maxVal - minVal);
      return { color: colorScale(val), value: val };
    }),
  );

  let focusedFeatureId = $state<string | null>(null);
</script>

<figure
  class="chart-container choropleth"
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
        <g>
          {#each features as feature}
            {@const id = String(feature.id ?? '')}
            {@const focused = focusedFeatureId === id}
            <path
              d={pathGen(feature) ?? ''}
              fill={getFill(feature)}
              stroke={focused ? 'var(--chart-text, #1a1a1a)' : 'var(--chart-bg, #fff)'}
              stroke-width={focused ? 2 : 0.5}
              tabindex={-1}
              role="button"
              aria-label={getLabel(feature)}
              onmouseenter={(e) => {
                focusedFeatureId = id;
                showTooltipProp && tooltip.show(e, { feature, row: dataMap.get(id) });
              }}
              onmouseleave={() => { focusedFeatureId = null; tooltip.hide(); }}
              onfocus={() => {
                focusedFeatureId = id;
                announce(getLabel(feature));
              }}
              onblur={() => { focusedFeatureId = null; }}
            />
          {/each}
        </g>
      </Svg>

      {#if showTooltipProp && tooltip.visible && tooltip.data}
        <Tooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y}>
          <strong>{tooltip.data.row?.label ?? tooltip.data.feature.properties?.['name'] ?? tooltip.data.feature.id}</strong><br />
          {tooltip.data.row ? formatSmart(tooltip.data.row.value) : 'No data'}
        </Tooltip>
      {/if}
    </div>

    {#if showLegend}
      <div class="map-legend" aria-hidden="true">
        <div class="legend-bar">
          {#each legendColors as step}
            <div class="legend-swatch" style="background: {step.color};"></div>
          {/each}
        </div>
        <div class="legend-labels">
          <span>{formatSmart(minVal)}</span>
          <span>{formatSmart(maxVal)}</span>
        </div>
      </div>
    {/if}

    {#if showTable}
      <AccessibleTable
        caption="{title}{subtitle ? `: ${subtitle}` : ''}"
        columns={tableColumns}
        rows={tableRows as unknown as Record<string, unknown>[]}
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

  path {
    cursor: pointer;
    transition: stroke-width 0.1s;
    outline: none;
  }

  path:focus-visible {
    stroke: var(--chart-text, #1a1a1a);
    stroke-width: 2;
  }

  .map-legend {
    margin-top: 0.75rem;
    max-width: 240px;
  }

  .legend-bar {
    display: flex;
    height: 10px;
    border-radius: 2px;
    overflow: hidden;
  }

  .legend-swatch {
    flex: 1;
  }

  .legend-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.6875rem;
    color: var(--chart-text-secondary, #888);
    margin-top: 0.25rem;
  }

  .chart-footer {
    padding: 0.5rem 0 0;
    font-size: 0.75rem;
    color: var(--chart-text-secondary, #888);
  }

  .chart-caption { margin: 0; }
  .chart-source { margin: 0.125rem 0 0; font-style: italic; }

  @media (prefers-reduced-motion: reduce) {
    path { transition: none; }
  }

  @media print {
    .chart-container {
      break-inside: avoid;
      max-width: 6.5in;
    }

    path {
      stroke: #666 !important;
      stroke-width: 0.5 !important;
    }
  }
</style>
