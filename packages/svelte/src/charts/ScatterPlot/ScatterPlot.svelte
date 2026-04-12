<script lang="ts">
  import { extent, groups } from 'd3-array';
  import { scaleLinear, scaleSqrt } from 'd3-scale';
  import {
    getPalette,
    getBreakpoint,
    RESPONSIVE_DEFAULTS,
    innerDimensions,
    describeScatter,
    detectColorMode,
    type ScatterRow,
    type ColorMode,
    type PaletteName,
  } from '@graphics-templates/core';
  import Svg from '../../primitives/Svg.svelte';
  import Axis from '../../primitives/Axis.svelte';
  import Grid from '../../primitives/Grid.svelte';
  import Tooltip from '../../primitives/Tooltip.svelte';
  import Legend from '../../primitives/Legend.svelte';
  import AccessibleTable from '../../primitives/AccessibleTable.svelte';
  import { useDimensions } from '../../lib/use-dimensions.svelte.js';
  import { useTooltip } from '../../lib/use-tooltip.svelte.js';
  import { useKeyboardNav } from '../../lib/use-keyboard-nav.svelte.js';
  import { announce } from '@graphics-templates/core/a11y';

  interface Props {
    data: ScatterRow[];
    title: string;
    subtitle?: string;
    caption?: string;
    sourceLabel?: string;
    xKey?: string;
    yKey?: string;
    sizeKey?: string;
    groupKey?: string;
    labelKey?: string;
    width?: number;
    height?: number;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    aspectRatio?: number;
    palette?: PaletteName | string[];
    colorMode?: ColorMode;
    showGrid?: boolean;
    showLegend?: boolean;
    showTooltip?: boolean;
    showTable?: boolean;
    showLabels?: boolean;
    radius?: number;
    sizeRange?: [number, number];
    animated?: boolean;
    xLabel?: string;
    yLabel?: string;
    xFormat?: (d: unknown) => string;
    yFormat?: (d: unknown) => string;
  }

  let {
    data,
    title,
    subtitle,
    caption,
    sourceLabel,
    xKey = 'x',
    yKey = 'y',
    sizeKey,
    groupKey = 'group',
    labelKey = 'label',
    width: widthProp,
    height: heightProp,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    aspectRatio,
    palette = 'newsroom',
    colorMode: colorModeProp,
    showGrid = true,
    showLegend,
    showTooltip: showTooltipProp = true,
    showTable = true,
    showLabels = false,
    radius = 5,
    sizeRange = [3, 20],
    animated: animatedProp,
    xLabel,
    yLabel,
    xFormat,
    yFormat,
  }: Props = $props();

  let containerEl: HTMLElement | undefined = $state();
  const dims = useDimensions(() => containerEl ?? null);
  const tooltip = useTooltip<ScatterRow>();
  const chartId = `scatter-${Math.random().toString(36).slice(2, 9)}`;

  const colorMode = $derived(colorModeProp ?? detectColorMode());
  const reducedMotion = $derived(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );
  const animated = $derived(animatedProp ?? !reducedMotion);

  // Groups
  const groupNames = $derived(
    [...new Set(data.map((d) => (d[groupKey] as string) ?? 'default'))].filter(
      (g) => g !== 'default',
    ),
  );
  const hasGroups = $derived(groupNames.length > 1);
  const legendVisible = $derived(showLegend ?? hasGroups);

  // Dimensions
  const w = $derived(widthProp ?? dims.width);
  const bp = $derived(getBreakpoint(w));
  const defaults = $derived(RESPONSIVE_DEFAULTS[bp]);
  const margin = $derived({
    top: marginTop ?? defaults.marginTop,
    right: marginRight ?? defaults.marginRight,
    bottom: marginBottom ?? defaults.marginBottom,
    left: marginLeft ?? defaults.marginLeft,
  });
  const ar = $derived(aspectRatio ?? 1); // scatter plots look best square-ish
  const h = $derived(heightProp ?? Math.round(w / ar));
  const inner = $derived(innerDimensions(w, h, margin));

  // Scales
  const xDomain = $derived(extent(data, (d) => d[xKey] as number) as [number, number]);
  const yDomain = $derived(extent(data, (d) => d[yKey] as number) as [number, number]);

  const xScale = $derived(
    scaleLinear().domain(xDomain).range([0, inner.innerWidth]).nice(),
  );
  const yScale = $derived(
    scaleLinear().domain(yDomain).range([inner.innerHeight, 0]).nice(),
  );

  const sizeScale = $derived(
    sizeKey
      ? scaleSqrt()
          .domain(extent(data, (d) => d[sizeKey] as number) as [number, number])
          .range(sizeRange)
      : null,
  );

  const colors = $derived(
    getPalette(palette, colorMode, 'categorical', Math.max(groupNames.length, 1)),
  );

  function getColor(row: ScatterRow): string {
    if (!hasGroups) return colors[0];
    const idx = groupNames.indexOf(row[groupKey] as string);
    return colors[Math.max(0, idx) % colors.length];
  }

  function getRadius(row: ScatterRow): number {
    if (!sizeScale || !sizeKey) return radius;
    return sizeScale(row[sizeKey] as number);
  }

  // A11y
  const description = $derived(describeScatter(data, { title, subtitle, sourceLabel }));

  const tableColumns = $derived([
    ...(labelKey ? [{ key: labelKey, label: 'Label' }] : []),
    { key: xKey, label: xLabel ?? 'X' },
    { key: yKey, label: yLabel ?? 'Y' },
    ...(sizeKey ? [{ key: sizeKey, label: 'Size' }] : []),
    ...(hasGroups ? [{ key: groupKey, label: 'Group' }] : []),
  ]);

  const nav = useKeyboardNav({
    count: () => data.length,
    formatAnnouncement: (i) => {
      const pt = data[i];
      const label = pt[labelKey] ? `${pt[labelKey]}: ` : '';
      return `${label}${xLabel ?? 'X'} ${pt[xKey]}, ${yLabel ?? 'Y'} ${pt[yKey]}`;
    },
  });

  let focusedIndex = $state(-1);
</script>

<figure
  class="chart-container scatter-plot"
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
      <Svg width={w} height={h} {chartId} {title} {description}>
        <g transform="translate({margin.left}, {margin.top})">
          {#if showGrid}
            <Grid
              {xScale}
              {yScale}
              width={inner.innerWidth}
              height={inner.innerHeight}
              xTickCount={defaults.tickCount.x}
              yTickCount={defaults.tickCount.y}
            />
          {/if}

          <Axis scale={xScale} position="bottom" width={inner.innerWidth} height={inner.innerHeight} tickCount={defaults.tickCount.x} tickFormat={xFormat} label={xLabel} />
          <Axis scale={yScale} position="left" width={inner.innerWidth} height={inner.innerHeight} tickCount={defaults.tickCount.y} tickFormat={yFormat} label={yLabel} />

          {#each data as row, i}
            {@const cx = xScale(row[xKey] as number)}
            {@const cy = yScale(row[yKey] as number)}
            {@const r = getRadius(row)}
            {@const color = getColor(row)}
            {@const focused = focusedIndex === i}
            <circle
              {cx}
              {cy}
              r={focused ? r + 2 : r}
              fill={color}
              fill-opacity={focused ? 0.9 : 0.7}
              stroke={focused ? 'var(--chart-text, #1a1a1a)' : color}
              stroke-width={focused ? 2 : 1}
              tabindex={i === 0 ? 0 : -1}
              role="button"
              aria-label="{row[labelKey] ?? ''}: {xLabel ?? 'X'} {row[xKey]}, {yLabel ?? 'Y'} {row[yKey]}"
              onmouseenter={(e) => { focusedIndex = i; showTooltipProp && tooltip.show(e, row); }}
              onmouseleave={() => { focusedIndex = -1; tooltip.hide(); }}
              onfocus={() => {
                focusedIndex = i;
                const label = row[labelKey] ? `${row[labelKey]}: ` : '';
                announce(`${label}${row[xKey]}, ${row[yKey]}`);
              }}
              onblur={() => { focusedIndex = -1; }}
              onkeydown={nav.onKeydown}
              class:animated
            />

            {#if showLabels && row[labelKey]}
              <text
                x={cx + r + 4}
                y={cy}
                dy="0.35em"
                font-size="10"
                fill="var(--chart-text-secondary, #666)"
                aria-hidden="true"
              >
                {row[labelKey]}
              </text>
            {/if}
          {/each}
        </g>
      </Svg>

      {#if showTooltipProp && tooltip.visible && tooltip.data}
        <Tooltip visible={tooltip.visible} x={tooltip.x + margin.left} y={tooltip.y + margin.top}>
          {#if tooltip.data[labelKey]}
            <strong>{tooltip.data[labelKey]}</strong><br />
          {/if}
          {xLabel ?? 'X'}: {(tooltip.data[xKey] as number).toLocaleString()}<br />
          {yLabel ?? 'Y'}: {(tooltip.data[yKey] as number).toLocaleString()}
          {#if sizeKey && tooltip.data[sizeKey] != null}
            <br />Size: {(tooltip.data[sizeKey] as number).toLocaleString()}
          {/if}
        </Tooltip>
      {/if}
    </div>

    {#if legendVisible}
      <Legend
        items={groupNames.map((name, i) => ({
          label: name,
          color: colors[i % colors.length],
        }))}
      />
    {/if}

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

  .chart-footer {
    padding: 0.5rem 0 0;
    font-size: 0.75rem;
    color: var(--chart-text-secondary, #888);
  }

  .chart-caption { margin: 0; }
  .chart-source { margin: 0.125rem 0 0; font-style: italic; }

  circle.animated {
    animation: pop 0.4s ease-out backwards;
  }

  circle:nth-child(1) { animation-delay: 0ms; }
  circle:nth-child(2) { animation-delay: 20ms; }
  circle:nth-child(3) { animation-delay: 40ms; }
  circle:nth-child(4) { animation-delay: 60ms; }
  circle:nth-child(5) { animation-delay: 80ms; }

  @keyframes pop {
    from { r: 0; opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    circle.animated { animation: none; }
  }

  @media print {
    .chart-container {
      break-inside: avoid;
      max-width: 6.5in;
    }

    circle {
      fill-opacity: 0.8 !important;
      stroke-width: 1.5 !important;
    }
  }
</style>
