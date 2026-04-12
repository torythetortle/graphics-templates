<script lang="ts">
  import { line, curveLinear, curveMonotoneX, curveStep, curveBasis } from 'd3-shape';
  import { extent, groups } from 'd3-array';
  import {
    timeScale,
    linearScale,
    getPalette,
    getBreakpoint,
    RESPONSIVE_DEFAULTS,
    innerDimensions,
    describeTimeSeries,
    detectColorMode,
    DASH_PATTERNS,
    parseDate,
    type TimeSeriesRow,
    type Annotation,
    type ColorMode,
    type PaletteName,
  } from '@graphics-templates/core';
  // @ts-ignore — svelte component imports
  import Svg from '../../primitives/Svg.svelte';
  // @ts-ignore
  import Axis from '../../primitives/Axis.svelte';
  // @ts-ignore
  import Grid from '../../primitives/Grid.svelte';
  // @ts-ignore
  import Tooltip from '../../primitives/Tooltip.svelte';
  // @ts-ignore
  import Legend from '../../primitives/Legend.svelte';
  // @ts-ignore
  import AnnotationMark from '../../primitives/Annotation.svelte';
  // @ts-ignore
  import AccessibleTable from '../../primitives/AccessibleTable.svelte';
  import { useDimensions } from '../../lib/use-dimensions.svelte.js';
  import { useTooltip } from '../../lib/use-tooltip.svelte.js';
  import { useKeyboardNav } from '../../lib/use-keyboard-nav.svelte.js';

  const CURVES = {
    linear: curveLinear,
    monotone: curveMonotoneX,
    step: curveStep,
    basis: curveBasis,
  } as const;

  interface ParsedRow extends TimeSeriesRow {
    _date: Date;
    _value: number;
    _series: string;
  }

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
    showPoints?: boolean;
    pointRadius?: number;
    showGrid?: boolean;
    showLegend?: boolean;
    showTooltip?: boolean;
    showTable?: boolean;
    animated?: boolean;
    xLabel?: string;
    yLabel?: string;
    xFormat?: (d: unknown) => string;
    yFormat?: (d: unknown) => string;
    annotations?: Annotation[];
  }

  let {
    data,
    title,
    subtitle,
    caption,
    sourceLabel,
    xKey = 'date',
    yKey = 'value',
    seriesKey = 'series',
    width: widthProp,
    height: heightProp,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    aspectRatio,
    palette = 'newsroom',
    colorMode: colorModeProp,
    curve = 'monotone',
    showPoints = false,
    pointRadius = 3.5,
    showGrid = true,
    showLegend,
    showTooltip: showTooltipProp = true,
    showTable = true,
    animated: animatedProp,
    xLabel,
    yLabel,
    xFormat,
    yFormat,
    annotations = [],
  }: Props = $props();

  let containerEl: HTMLElement | undefined = $state();
  const dims = useDimensions(() => containerEl ?? null);
  const tooltip = useTooltip<ParsedRow>();
  const chartId = `line-${Math.random().toString(36).slice(2, 9)}`;

  const colorMode = $derived(colorModeProp ?? detectColorMode());
  const reducedMotion = $derived(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );
  const animated = $derived(animatedProp ?? !reducedMotion);

  const parsed: ParsedRow[] = $derived(
    data.map((d) => ({
      ...d,
      _date: parseDate(d[xKey] as string | Date),
      _value: d[yKey] as number,
      _series: (d[seriesKey] as string) ?? 'default',
    })),
  );

  const seriesGroups = $derived(groups(parsed, (d) => d._series));
  const seriesNames = $derived(seriesGroups.map(([name]) => name));
  const multiSeries = $derived(seriesNames.length > 1);
  const legendVisible = $derived(showLegend ?? multiSeries);

  const w = $derived(widthProp ?? dims.width);
  const bp = $derived(getBreakpoint(w));
  const defaults = $derived(RESPONSIVE_DEFAULTS[bp]);
  const margin = $derived({
    top: marginTop ?? defaults.marginTop,
    right: marginRight ?? defaults.marginRight,
    bottom: marginBottom ?? defaults.marginBottom,
    left: marginLeft ?? defaults.marginLeft,
  });
  const ar = $derived(aspectRatio ?? defaults.aspectRatio);
  const h = $derived(heightProp ?? Math.round(w / ar));
  const inner = $derived(innerDimensions(w, h, margin));

  const xDomain = $derived(extent(parsed, (d) => d._date) as [Date, Date]);
  const yDomain = $derived(extent(parsed, (d) => d._value) as [number, number]);

  const xScale = $derived(
    timeScale({ domain: xDomain, range: [0, inner.innerWidth] }),
  );
  const yScale = $derived(
    linearScale({ domain: yDomain, range: [inner.innerHeight, 0] }),
  );

  const colors = $derived(getPalette(palette, colorMode, 'categorical', seriesNames.length));

  const lineGen = $derived(
    line<ParsedRow>()
      .x((d) => xScale(d._date))
      .y((d) => yScale(d._value))
      .curve(CURVES[curve]),
  );

  const description = $derived(
    describeTimeSeries(data, { title, subtitle, sourceLabel }),
  );

  const tableColumns = $derived([
    { key: xKey, label: xLabel ?? 'Date' },
    { key: yKey, label: yLabel ?? 'Value' },
    ...(multiSeries ? [{ key: seriesKey, label: 'Series' }] : []),
  ]);

  const nav = useKeyboardNav({
    count: () => parsed.length,
    formatAnnouncement: (i) => {
      const pt = parsed[i];
      return `${pt._series}: ${pt._date.toLocaleDateString()}, ${pt._value}`;
    },
  });
</script>

<figure
  class="chart-container line-chart"
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

          <Axis
            scale={xScale}
            position="bottom"
            width={inner.innerWidth}
            height={inner.innerHeight}
            tickCount={defaults.tickCount.x}
            tickFormat={xFormat}
            label={xLabel}
          />
          <Axis
            scale={yScale}
            position="left"
            width={inner.innerWidth}
            height={inner.innerHeight}
            tickCount={defaults.tickCount.y}
            tickFormat={yFormat}
            label={yLabel}
          />

          {#each seriesGroups as [seriesName, points], i}
            {@const color = colors[i % colors.length]}
            {@const dash = DASH_PATTERNS[i % DASH_PATTERNS.length]}
            <path
              d={lineGen(points) ?? ''}
              fill="none"
              stroke={color}
              stroke-width="2.5"
              stroke-dasharray={dash === 'none' ? undefined : dash}
              stroke-linejoin="round"
              stroke-linecap="round"
              class:animated
            />

            {#if showPoints}
              {#each points as pt, j}
                <circle
                  cx={xScale(pt._date)}
                  cy={yScale(pt._value)}
                  r={pointRadius}
                  fill={color}
                  stroke="var(--chart-bg, #fff)"
                  stroke-width="1.5"
                  tabindex={j === 0 && i === 0 ? 0 : -1}
                  role="button"
                  aria-label="{seriesName}: {pt._date.toLocaleDateString()}, {pt._value}"
                  onmouseenter={(e) => showTooltipProp && tooltip.show(e, pt)}
                  onmouseleave={() => tooltip.hide()}
                  onfocus={(e) => showTooltipProp && tooltip.show(e, pt)}
                  onblur={() => tooltip.hide()}
                />
              {/each}
            {/if}
          {/each}

          {#if !showPoints}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <rect
              width={inner.innerWidth}
              height={inner.innerHeight}
              fill="transparent"
              tabindex="0"
              role="group"
              aria-label="Chart data. Use arrow keys to navigate."
              onkeydown={nav.onKeydown}
              onfocus={nav.enter}
            />
          {/if}

          {#each annotations as ann}
            {@const ax = ann.date ? xScale(parseDate(ann.date)) : (ann.x as number)}
            {@const ay = ann.y != null ? yScale(ann.y as number) : inner.innerHeight / 2}
            <AnnotationMark x={ax} y={ay} label={ann.label} side={ann.side} />
          {/each}
        </g>
      </Svg>

      {#if showTooltipProp && tooltip.visible && tooltip.data}
        <Tooltip visible={tooltip.visible} x={tooltip.x + margin.left} y={tooltip.y + margin.top}>
          {#if tooltip.data._series !== 'default'}
            <strong>{tooltip.data._series}: </strong>
          {/if}
          {tooltip.data._date.toLocaleDateString()}<br />
          {tooltip.data._value.toLocaleString()}
        </Tooltip>
      {/if}
    </div>

    {#if legendVisible}
      <Legend
        items={seriesNames.map((name, i) => ({
          label: name,
          color: colors[i % colors.length],
          dashIndex: i,
        }))}
        showDashes={true}
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
    line-height: 1.4;
  }

  .chart-footer {
    padding: 0.5rem 0 0;
    font-size: 0.75rem;
    color: var(--chart-text-secondary, #888);
  }

  .chart-caption { margin: 0; }

  .chart-source {
    margin: 0.125rem 0 0;
    font-style: italic;
  }

  path.animated {
    stroke-dasharray: var(--path-length, 2000);
    stroke-dashoffset: var(--path-length, 2000);
    animation: draw 1.2s ease-out forwards;
  }

  @keyframes draw {
    to { stroke-dashoffset: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    path.animated {
      animation: none;
      stroke-dashoffset: 0;
    }
  }

  @media print {
    .chart-container {
      break-inside: avoid;
      max-width: 6.5in;
    }

    path {
      stroke-width: 2 !important;
    }
  }
</style>
