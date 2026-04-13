<script lang="ts">
  import {
    getPalette, detectColorMode, formatPct,
    type PartWholeRow, type ColorMode, type PaletteName,
  } from '@graphics-templates/core';
  import { announce } from '@graphics-templates/core/a11y';
  // @ts-ignore
  import AccessibleTable from '../../primitives/AccessibleTable.svelte';
  import { useDimensions } from '../../lib/use-dimensions.svelte.js';

  interface Props {
    data: PartWholeRow[];
    title: string;
    subtitle?: string;
    caption?: string;
    sourceLabel?: string;
    total?: number;
    gridSize?: number;
    palette?: PaletteName | string[];
    colorMode?: ColorMode;
    showTable?: boolean;
    showLabels?: boolean;
  }

  let {
    data, title, subtitle, caption, sourceLabel,
    total: totalProp, gridSize = 10,
    palette = 'newsroom', colorMode: colorModeProp,
    showTable = true, showLabels = true,
  }: Props = $props();

  let containerEl: HTMLElement | undefined = $state();
  const dims = useDimensions(() => containerEl ?? null);
  const chartId = `waffle-${Math.random().toString(36).slice(2, 9)}`;
  const colorMode = $derived(colorModeProp ?? detectColorMode());
  const colors = $derived(getPalette(palette, colorMode, 'categorical', data.length));

  const total = $derived(totalProp ?? data.reduce((s, d) => s + d.value, 0));
  const cells = gridSize * gridSize;

  const cellAssignments = $derived(() => {
    const assignments: number[] = new Array(cells).fill(-1);
    let cellIndex = 0;
    for (let i = 0; i < data.length; i++) {
      const count = Math.round((data[i].value / total) * cells);
      for (let j = 0; j < count && cellIndex < cells; j++) {
        assignments[cellIndex++] = i;
      }
    }
    return assignments;
  });

  const w = $derived(dims.width);
  const cellSize = $derived(Math.floor(w / gridSize) - 2);

  const description = $derived(
    `Waffle chart: ${title}. ${data.map((d) => `${d.label}: ${formatPct(d.value / total)}`).join(', ')}.`,
  );

  const tableColumns = $derived([
    { key: 'label', label: 'Category' },
    { key: 'value', label: 'Value' },
    { key: 'pct', label: 'Share' },
  ]);
  const tableRows = $derived(data.map((d) => ({
    label: d.label, value: d.value,
    pct: formatPct(d.value / total),
  })));
</script>

<figure class="chart-container waffle-chart" bind:this={containerEl} aria-label={title}>
  <figcaption class="chart-header">
    <h3 class="chart-title">{title}</h3>
    {#if subtitle}<p class="chart-subtitle">{subtitle}</p>{/if}
  </figcaption>

  {#if w > 0 && cellSize > 0}
    <div class="waffle-grid" role="img" aria-label={description}
      style="grid-template-columns: repeat({gridSize}, {cellSize}px); gap: 2px;">
      {#each cellAssignments() as dataIdx, i}
        <div
          class="waffle-cell"
          style="width:{cellSize}px; height:{cellSize}px; background:{dataIdx >= 0 ? colors[dataIdx % colors.length] : 'var(--chart-grid, #e5e5e5)'};"
          aria-hidden="true"
        ></div>
      {/each}
    </div>

    {#if showLabels}
      <div class="waffle-legend" role="list">
        {#each data as row, i}
          <div class="legend-item" role="listitem">
            <span class="legend-dot" style="background:{colors[i % colors.length]};" aria-hidden="true"></span>
            <span class="legend-label">{row.label}</span>
            <span class="legend-pct">{formatPct(row.value / total)}</span>
          </div>
        {/each}
      </div>
    {/if}

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
  .chart-container { width: 100%; max-width: 480px; margin: 0; padding: 0; font-family: var(--font-chart, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif); color: var(--chart-text, #1a1a1a); }
  .chart-header { padding: 0 0 0.75rem; }
  .chart-title { margin: 0; font-size: 1.25rem; font-weight: 700; line-height: 1.3; }
  .chart-subtitle { margin: 0.25rem 0 0; font-size: 0.875rem; color: var(--chart-text-secondary, #666); }
  .waffle-grid { display: grid; }
  .waffle-cell { border-radius: 2px; }
  .waffle-legend { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 0.75rem; }
  .legend-item { display: flex; align-items: center; gap: 0.375rem; font-size: 0.8125rem; }
  .legend-dot { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
  .legend-pct { font-weight: 600; font-variant-numeric: tabular-nums; }
  .chart-footer { padding: 0.75rem 0 0; font-size: 0.75rem; color: var(--chart-text-secondary, #888); }
  .chart-caption { margin: 0; }
  .chart-source { margin: 0.125rem 0 0; font-style: italic; }
  @media print { .chart-container { break-inside: avoid; max-width: 3.5in; } .waffle-cell { border: 0.5px solid #ccc; } }
</style>
