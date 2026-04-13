<script lang="ts">
  import {
    getPalette, getBreakpoint, RESPONSIVE_DEFAULTS, innerDimensions, detectColorMode, formatSmart,
    type FlowRow, type ColorMode, type PaletteName,
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

  interface SankeyNode { id: string; x: number; y: number; dy: number; value: number; }
  interface SankeyLink { source: SankeyNode; target: SankeyNode; value: number; sy: number; ty: number; dy: number; }

  interface Props {
    data: FlowRow[];
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
    nodeWidth?: number;
    nodePadding?: number;
    showTooltip?: boolean;
    showTable?: boolean;
  }

  let {
    data, title, subtitle, caption, sourceLabel,
    width: widthProp, height: heightProp,
    marginTop = 12, marginRight = 12, marginBottom = 12, marginLeft = 12,
    palette = 'newsroom', colorMode: colorModeProp,
    nodeWidth = 16, nodePadding = 12,
    showTooltip: showTooltipProp = true, showTable = true,
  }: Props = $props();

  let containerEl: HTMLElement | undefined = $state();
  const dims = useDimensions(() => containerEl ?? null);
  const tooltip = useTooltip<{ label: string; value: number }>();
  const chartId = `sankey-${Math.random().toString(36).slice(2, 9)}`;
  const colorMode = $derived(colorModeProp ?? detectColorMode());

  const w = $derived(widthProp ?? dims.width);
  const h = $derived(heightProp ?? 400);
  const inner = $derived(innerDimensions(w, h, { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft }));

  // Simple two-column sankey layout
  const layout = $derived.by((): { nodes: SankeyNode[]; links: SankeyLink[] } => {
    if (inner.innerWidth <= 0) return { nodes: [], links: [] };

    const sourceNames = [...new Set(data.map((d) => d.source))];
    const targetNames = [...new Set(data.map((d) => d.target))];
    const allNames = [...new Set([...sourceNames, ...targetNames])];

    // Aggregate values per node
    const nodeValues = new Map<string, number>();
    for (const d of data) {
      nodeValues.set(d.source, (nodeValues.get(d.source) ?? 0) + d.value);
      nodeValues.set(d.target, (nodeValues.get(d.target) ?? 0) + d.value);
    }

    const totalSource = sourceNames.reduce((s, n) => s + (nodeValues.get(n) ?? 0), 0);
    const totalTarget = targetNames.reduce((s, n) => s + (nodeValues.get(n) ?? 0), 0);
    const maxTotal = Math.max(totalSource, totalTarget);

    const availableHeight = inner.innerHeight - (Math.max(sourceNames.length, targetNames.length) - 1) * nodePadding;
    const scale = availableHeight / maxTotal;

    // Position source nodes
    const nodes: SankeyNode[] = [];
    let sy = 0;
    for (const name of sourceNames) {
      const dy = (nodeValues.get(name) ?? 0) * scale;
      nodes.push({ id: name, x: 0, y: sy, dy, value: nodeValues.get(name) ?? 0 });
      sy += dy + nodePadding;
    }

    // Position target nodes
    let ty = 0;
    for (const name of targetNames) {
      const dy = (nodeValues.get(name) ?? 0) * scale;
      nodes.push({ id: name, x: inner.innerWidth - nodeWidth, y: ty, dy, value: nodeValues.get(name) ?? 0 });
      ty += dy + nodePadding;
    }

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    // Build links
    const sourceOffsets = new Map<string, number>();
    const targetOffsets = new Map<string, number>();
    const links: SankeyLink[] = [];

    for (const d of data) {
      const source = nodeMap.get(d.source)!;
      const target = nodeMap.get(d.target)!;
      const dy = d.value * scale;
      const sOffset = sourceOffsets.get(d.source) ?? 0;
      const tOffset = targetOffsets.get(d.target) ?? 0;

      links.push({
        source, target, value: d.value,
        sy: source.y + sOffset, ty: target.y + tOffset, dy,
      });
      sourceOffsets.set(d.source, sOffset + dy);
      targetOffsets.set(d.target, tOffset + dy);
    }

    return { nodes, links };
  });

  const colors = $derived(getPalette(palette, colorMode, 'categorical', layout.nodes.length));
  const nodeColorMap = $derived(new Map(layout.nodes.map((n, i) => [n.id, colors[i % colors.length]])));

  function linkPath(link: SankeyLink): string {
    const x0 = link.source.x + nodeWidth;
    const x1 = link.target.x;
    const xi = (x0 + x1) / 2;
    const y0 = link.sy + link.dy / 2;
    const y1 = link.ty + link.dy / 2;
    return `M${x0},${y0} C${xi},${y0} ${xi},${y1} ${x1},${y1}`;
  }

  const description = $derived(
    `Sankey diagram: ${title}. ${data.length} flows between ${layout.nodes.length} nodes.`,
  );

  const tableColumns = $derived([
    { key: 'source', label: 'Source' },
    { key: 'target', label: 'Target' },
    { key: 'value', label: 'Value', format: (v: unknown) => formatSmart(v as number) },
  ]);

  let focusedLink = $state(-1);
</script>

<figure class="chart-container sankey" bind:this={containerEl} aria-label={title}>
  <figcaption class="chart-header">
    <h3 class="chart-title">{title}</h3>
    {#if subtitle}<p class="chart-subtitle">{subtitle}</p>{/if}
  </figcaption>

  {#if w > 0 && layout.nodes.length > 0}
    <div class="chart-body" style="position: relative;">
      <Svg width={w} height={h} {chartId} {title} description={description}>
        <g transform="translate({marginLeft}, {marginTop})">
          <!-- Links -->
          {#each layout.links as link, i}
            <path
              d={linkPath(link)}
              fill="none"
              stroke={nodeColorMap.get(link.source.id) ?? '#ccc'}
              stroke-width={Math.max(1, link.dy)}
              stroke-opacity={focusedLink === i ? 0.6 : 0.3}
              onmouseenter={(e) => { focusedLink = i; showTooltipProp && tooltip.show(e, { label: `${link.source.id} → ${link.target.id}`, value: link.value }); }}
              onmouseleave={() => { focusedLink = -1; tooltip.hide(); }}
              style="cursor: pointer; outline: none;"
            />
          {/each}

          <!-- Nodes -->
          {#each layout.nodes as node}
            <rect
              x={node.x} y={node.y} width={nodeWidth} height={Math.max(1, node.dy)}
              fill={nodeColorMap.get(node.id) ?? '#888'}
              rx="2"
              role="button"
              aria-label="{node.id}: {formatSmart(node.value)}"
              tabindex={-1}
              onfocus={() => announce(`${node.id}: ${formatSmart(node.value)}`)}
              style="outline: none;"
            />
            <!-- Node label -->
            {#if node.x === 0}
              <text x={node.x - 4} y={node.y + node.dy / 2} dy="0.35em" text-anchor="end"
                font-size="11" fill="var(--chart-text, #1a1a1a)">{node.id}</text>
            {:else}
              <text x={node.x + nodeWidth + 4} y={node.y + node.dy / 2} dy="0.35em"
                font-size="11" fill="var(--chart-text, #1a1a1a)">{node.id}</text>
            {/if}
          {/each}
        </g>
      </Svg>

      {#if showTooltipProp && tooltip.visible && tooltip.data}
        <Tooltip visible={tooltip.visible} x={tooltip.x + marginLeft} y={tooltip.y + marginTop}>
          <strong>{tooltip.data.label}</strong><br />
          {formatSmart(tooltip.data.value)}
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
  @media print { .chart-container { break-inside: avoid; max-width: 6.5in; } path { stroke-opacity: 0.4 !important; } }
</style>
