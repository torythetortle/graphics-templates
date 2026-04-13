<script lang="ts">
  import { scaleLinear } from 'd3-scale';
  import { extent, groups } from 'd3-array';
  import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';
  import {
    getPalette, getBreakpoint, RESPONSIVE_DEFAULTS, innerDimensions, detectColorMode, formatSmart,
    type CategoricalRow, type ColorMode, type PaletteName,
  } from '@graphics-templates/core';
  import { announce } from '@graphics-templates/core/a11y';
  // @ts-ignore
  import Svg from '../../primitives/Svg.svelte';
  // @ts-ignore
  import Axis from '../../primitives/Axis.svelte';
  // @ts-ignore
  import Tooltip from '../../primitives/Tooltip.svelte';
  // @ts-ignore
  import Legend from '../../primitives/Legend.svelte';
  // @ts-ignore
  import AccessibleTable from '../../primitives/AccessibleTable.svelte';
  import { useDimensions } from '../../lib/use-dimensions.svelte.js';
  import { useTooltip } from '../../lib/use-tooltip.svelte.js';

  interface SimNode {
    x: number;
    y: number;
    label: string;
    value: number;
    group?: string;
  }

  interface Props {
    data: CategoricalRow[];
    title: string;
    subtitle?: string;
    caption?: string;
    sourceLabel?: string;
    valueKey?: string;
    labelKey?: string;
    groupKey?: string;
    width?: number;
    height?: number;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    radius?: number;
    padding?: number;
    palette?: PaletteName | string[];
    colorMode?: ColorMode;
    showTooltip?: boolean;
    showLegend?: boolean;
    showTable?: boolean;
    xLabel?: string;
  }

  let {
    data, title, subtitle, caption, sourceLabel,
    valueKey = 'value', labelKey = 'label', groupKey = 'group',
    width: widthProp, height: heightProp,
    marginTop, marginRight, marginBottom, marginLeft,
    radius = 5, padding = 1.5,
    palette = 'newsroom', colorMode: colorModeProp,
    showTooltip: showTooltipProp = true, showLegend, showTable = true, xLabel,
  }: Props = $props();

  let containerEl: HTMLElement | undefined = $state();
  const dims = useDimensions(() => containerEl ?? null);
  const tooltip = useTooltip<SimNode>();
  const chartId = `beeswarm-${Math.random().toString(36).slice(2, 9)}`;
  const colorMode = $derived(colorModeProp ?? detectColorMode());

  const groupNames = $derived([...new Set(data.map((d) => d[groupKey] as string).filter(Boolean))]);
  const hasGroups = $derived(groupNames.length > 1);
  const legendVisible = $derived(showLegend ?? hasGroups);
  const colors = $derived(getPalette(palette, colorMode, 'categorical', Math.max(groupNames.length, 1)));

  const w = $derived(widthProp ?? dims.width);
  const bp = $derived(getBreakpoint(w));
  const defaults = $derived(RESPONSIVE_DEFAULTS[bp]);
  const margin = $derived({
    top: marginTop ?? defaults.marginTop, right: marginRight ?? defaults.marginRight,
    bottom: marginBottom ?? defaults.marginBottom, left: marginLeft ?? defaults.marginLeft,
  });
  const h = $derived(heightProp ?? 240);
  const inner = $derived(innerDimensions(w, h, margin));

  const [minVal, maxVal] = $derived(extent(data, (d) => d[valueKey] as number) as [number, number]);
  const xScale = $derived(scaleLinear().domain([minVal, maxVal]).range([0, inner.innerWidth]).nice());

  const simNodes: SimNode[] = $derived.by(() => {
    if (inner.innerWidth <= 0) return [];
    const nodes: SimNode[] = data.map((d) => ({
      x: xScale(d[valueKey] as number),
      y: inner.innerHeight / 2,
      label: String(d[labelKey]),
      value: d[valueKey] as number,
      group: d[groupKey] as string | undefined,
    }));

    const sim = forceSimulation(nodes as any)
      .force('x', forceX((d: any) => xScale(d.value)).strength(1))
      .force('y', forceY(inner.innerHeight / 2).strength(0.1))
      .force('collide', forceCollide(radius + padding))
      .stop();

    for (let i = 0; i < 120; i++) sim.tick();
    return nodes;
  });

  function getColor(node: SimNode): string {
    if (!hasGroups || !node.group) return colors[0];
    return colors[groupNames.indexOf(node.group) % colors.length];
  }

  const description = $derived(
    `Beeswarm plot: ${title}. ${data.length} data points. Range: ${formatSmart(minVal)} to ${formatSmart(maxVal)}.`,
  );
  const tableColumns = $derived([
    { key: labelKey, label: 'Label' },
    { key: valueKey, label: xLabel ?? 'Value' },
    ...(hasGroups ? [{ key: groupKey, label: 'Group' }] : []),
  ]);

  let focusedIndex = $state(-1);
</script>

<figure class="chart-container beeswarm" bind:this={containerEl} aria-label={title}>
  <figcaption class="chart-header">
    <h3 class="chart-title">{title}</h3>
    {#if subtitle}<p class="chart-subtitle">{subtitle}</p>{/if}
  </figcaption>

  {#if w > 0 && simNodes.length > 0}
    <div class="chart-body" style="position: relative;">
      <Svg width={w} height={h} {chartId} {title} description={description}>
        <g transform="translate({margin.left}, {margin.top})">
          <Axis scale={xScale} position="bottom" width={inner.innerWidth} height={inner.innerHeight}
            tickCount={defaults.tickCount.x} label={xLabel} />

          {#each simNodes as node, i}
            {@const focused = focusedIndex === i}
            <circle
              cx={node.x} cy={node.y}
              r={focused ? radius + 2 : radius}
              fill={getColor(node)}
              fill-opacity={focused ? 0.9 : 0.7}
              stroke={focused ? 'var(--chart-text, #1a1a1a)' : 'none'}
              stroke-width={focused ? 2 : 0}
              tabindex={i === 0 ? 0 : -1}
              role="button"
              aria-label="{node.label}: {formatSmart(node.value)}"
              onmouseenter={(e) => { focusedIndex = i; showTooltipProp && tooltip.show(e, node); }}
              onmouseleave={() => { focusedIndex = -1; tooltip.hide(); }}
              onfocus={() => { focusedIndex = i; announce(`${node.label}: ${formatSmart(node.value)}`); }}
              onblur={() => { focusedIndex = -1; }}
              style="outline: none;"
            />
          {/each}
        </g>
      </Svg>

      {#if showTooltipProp && tooltip.visible && tooltip.data}
        <Tooltip visible={tooltip.visible} x={tooltip.x + margin.left} y={tooltip.y + margin.top}>
          <strong>{tooltip.data.label}</strong><br />
          {formatSmart(tooltip.data.value)}
        </Tooltip>
      {/if}
    </div>

    {#if legendVisible}
      <Legend items={groupNames.map((n, i) => ({ label: n, color: colors[i % colors.length] }))} />
    {/if}
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
  circle { cursor: pointer; transition: r 0.1s; }
  .chart-footer { padding: 0.5rem 0 0; font-size: 0.75rem; color: var(--chart-text-secondary, #888); }
  .chart-caption { margin: 0; }
  .chart-source { margin: 0.125rem 0 0; font-style: italic; }
  @media (prefers-reduced-motion: reduce) { circle { transition: none; } }
  @media print { .chart-container { break-inside: avoid; max-width: 6.5in; } circle { fill-opacity: 0.8 !important; stroke: #333 !important; stroke-width: 0.5 !important; } }
</style>
