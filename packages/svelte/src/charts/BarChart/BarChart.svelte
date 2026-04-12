<script lang="ts">
  import { max } from 'd3-array';
  import { scaleBand, scaleLinear } from 'd3-scale';
  import {
    getPalette,
    getBreakpoint,
    RESPONSIVE_DEFAULTS,
    innerDimensions,
    describeCategorical,
    detectColorMode,
    formatSmart,
    type CategoricalRow,
    type ColorMode,
    type PaletteName,
  } from '@graphics-templates/core';
  import { announce } from '@graphics-templates/core/a11y';
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
  import AccessibleTable from '../../primitives/AccessibleTable.svelte';
  import { useDimensions } from '../../lib/use-dimensions.svelte.js';
  import { useTooltip } from '../../lib/use-tooltip.svelte.js';
  import { useKeyboardNav } from '../../lib/use-keyboard-nav.svelte.js';

  interface Props {
    data: CategoricalRow[];
    title: string;
    subtitle?: string;
    caption?: string;
    sourceLabel?: string;
    labelKey?: string;
    valueKey?: string;
    groupKey?: string;
    orientation?: 'vertical' | 'horizontal';
    layout?: 'grouped' | 'stacked';
    sortBy?: 'value' | 'label' | 'none';
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
    showValueLabels?: boolean;
    animated?: boolean;
    xLabel?: string;
    yLabel?: string;
    yFormat?: (d: unknown) => string;
  }

  let {
    data,
    title,
    subtitle,
    caption,
    sourceLabel,
    labelKey = 'label',
    valueKey = 'value',
    groupKey = 'group',
    orientation = 'vertical',
    sortBy = 'none',
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
    showValueLabels = false,
    animated: animatedProp,
    xLabel,
    yLabel,
    yFormat,
  }: Props = $props();

  let containerEl: HTMLElement | undefined = $state();
  const dims = useDimensions(() => containerEl ?? null);
  const tooltip = useTooltip<CategoricalRow>();
  const chartId = `bar-${Math.random().toString(36).slice(2, 9)}`;

  const colorMode = $derived(colorModeProp ?? detectColorMode());
  const reducedMotion = $derived(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );
  const animated = $derived(animatedProp ?? !reducedMotion);

  const sorted = $derived(
    sortBy === 'none'
      ? data
      : [...data].sort((a, b) =>
          sortBy === 'value'
            ? (b[valueKey] as number) - (a[valueKey] as number)
            : String(a[labelKey]).localeCompare(String(b[labelKey])),
        ),
  );

  const groupNames = $derived([...new Set(data.map((d) => d[groupKey] as string).filter(Boolean))]);
  const hasGroups = $derived(groupNames.length > 1);
  const legendVisible = $derived(showLegend ?? hasGroups);

  const w = $derived(widthProp ?? dims.width);
  const bp = $derived(getBreakpoint(w));
  const defaults = $derived(RESPONSIVE_DEFAULTS[bp]);
  const isHorizontal = $derived(orientation === 'horizontal' || bp === 'mobile');

  const margin = $derived({
    top: marginTop ?? defaults.marginTop,
    right: marginRight ?? (showValueLabels ? 48 : defaults.marginRight),
    bottom: marginBottom ?? defaults.marginBottom,
    left: marginLeft ?? (isHorizontal ? Math.max(defaults.marginLeft, 96) : defaults.marginLeft),
  });
  const ar = $derived(aspectRatio ?? (isHorizontal ? Math.max(1, sorted.length * 0.15) : defaults.aspectRatio));
  const h = $derived(heightProp ?? Math.round(w / ar));
  const inner = $derived(innerDimensions(w, h, margin));

  const labels = $derived(sorted.map((d) => String(d[labelKey])));
  const maxVal = $derived(max(sorted, (d) => d[valueKey] as number) ?? 0);

  const catScale = $derived(
    scaleBand().domain(labels).range([0, isHorizontal ? inner.innerHeight : inner.innerWidth]).padding(0.25),
  );
  const valScale = $derived(
    scaleLinear()
      .domain([0, maxVal])
      .range(isHorizontal ? [0, inner.innerWidth] : [inner.innerHeight, 0])
      .nice(),
  );

  const colors = $derived(getPalette(palette, colorMode, 'categorical', groupNames.length || 1));

  function getColor(row: CategoricalRow): string {
    if (!hasGroups) return colors[0];
    const idx = groupNames.indexOf(row[groupKey] as string);
    return colors[idx % colors.length];
  }

  const description = $derived(describeCategorical(data, { title, subtitle, sourceLabel }));

  const tableColumns = $derived([
    { key: labelKey, label: xLabel ?? 'Category' },
    { key: valueKey, label: yLabel ?? 'Value' },
    ...(hasGroups ? [{ key: groupKey, label: 'Group' }] : []),
  ]);

  const nav = useKeyboardNav({
    count: () => sorted.length,
    formatAnnouncement: (i) => `${sorted[i][labelKey]}: ${sorted[i][valueKey]}`,
  });

  let focusedIndex = $state(-1);
</script>

<figure
  class="chart-container bar-chart"
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
            {#if isHorizontal}
              <Grid xScale={valScale} width={inner.innerWidth} height={inner.innerHeight} xTickCount={defaults.tickCount.x} />
            {:else}
              <Grid yScale={valScale} width={inner.innerWidth} height={inner.innerHeight} yTickCount={defaults.tickCount.y} />
            {/if}
          {/if}

          {#if isHorizontal}
            <Axis scale={valScale} position="bottom" width={inner.innerWidth} height={inner.innerHeight} tickCount={defaults.tickCount.x} tickFormat={yFormat} label={yLabel} />
            <Axis scale={catScale} position="left" width={inner.innerWidth} height={inner.innerHeight} />
          {:else}
            <Axis scale={catScale} position="bottom" width={inner.innerWidth} height={inner.innerHeight} label={xLabel} />
            <Axis scale={valScale} position="left" width={inner.innerWidth} height={inner.innerHeight} tickCount={defaults.tickCount.y} tickFormat={yFormat} label={yLabel} />
          {/if}

          {#each sorted as row, i}
            {@const label = String(row[labelKey])}
            {@const val = row[valueKey] as number}
            {@const color = getColor(row)}
            {@const focused = focusedIndex === i}

            {#if isHorizontal}
              <rect
                x={0}
                y={catScale(label)}
                width={Math.max(0, valScale(val))}
                height={catScale.bandwidth()}
                fill={color}
                opacity={focused ? 1 : 0.85}
                rx="2"
                tabindex={i === 0 ? 0 : -1}
                role="button"
                aria-label="{label}: {val.toLocaleString()}"
                onmouseenter={(e) => { focusedIndex = i; showTooltipProp && tooltip.show(e, row); }}
                onmouseleave={() => { focusedIndex = -1; tooltip.hide(); }}
                onfocus={() => { focusedIndex = i; announce(`${label}: ${val.toLocaleString()}`); }}
                onblur={() => { focusedIndex = -1; }}
                onkeydown={nav.onKeydown}
              />
              {#if showValueLabels}
                <text
                  x={valScale(val) + 4}
                  y={(catScale(label) ?? 0) + catScale.bandwidth() / 2}
                  dy="0.35em"
                  font-size="11"
                  fill="var(--chart-text, #1a1a1a)"
                  aria-hidden="true"
                >
                  {formatSmart(val)}
                </text>
              {/if}
            {:else}
              <rect
                x={catScale(label)}
                y={valScale(val)}
                width={catScale.bandwidth()}
                height={Math.max(0, inner.innerHeight - valScale(val))}
                fill={color}
                opacity={focused ? 1 : 0.85}
                rx="2"
                tabindex={i === 0 ? 0 : -1}
                role="button"
                aria-label="{label}: {val.toLocaleString()}"
                onmouseenter={(e) => { focusedIndex = i; showTooltipProp && tooltip.show(e, row); }}
                onmouseleave={() => { focusedIndex = -1; tooltip.hide(); }}
                onfocus={() => { focusedIndex = i; announce(`${label}: ${val.toLocaleString()}`); }}
                onblur={() => { focusedIndex = -1; }}
                onkeydown={nav.onKeydown}
              />
              {#if showValueLabels}
                <text
                  x={(catScale(label) ?? 0) + catScale.bandwidth() / 2}
                  y={valScale(val) - 6}
                  text-anchor="middle"
                  font-size="11"
                  fill="var(--chart-text, #1a1a1a)"
                  aria-hidden="true"
                >
                  {formatSmart(val)}
                </text>
              {/if}
            {/if}
          {/each}
        </g>
      </Svg>

      {#if showTooltipProp && tooltip.visible && tooltip.data}
        <Tooltip visible={tooltip.visible} x={tooltip.x + margin.left} y={tooltip.y + margin.top}>
          <strong>{tooltip.data[labelKey]}</strong><br />
          {(tooltip.data[valueKey] as number).toLocaleString()}
          {#if hasGroups}
            <br /><span style="color: var(--chart-text-secondary)">{tooltip.data[groupKey]}</span>
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

  @media print {
    .chart-container {
      break-inside: avoid;
      max-width: 6.5in;
    }
  }
</style>
