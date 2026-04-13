<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    items: { key: string; label: string }[];
    columns?: number;
    gap?: number;
    title?: string;
    subtitle?: string;
    caption?: string;
    sourceLabel?: string;
    children: Snippet<[{ key: string; label: string }]>;
  }

  let {
    items, columns = 3, gap = 24,
    title, subtitle, caption, sourceLabel, children,
  }: Props = $props();
</script>

<figure class="chart-container small-multiples" aria-label={title ?? 'Small multiples'}>
  {#if title}
    <figcaption class="chart-header">
      <h3 class="chart-title">{title}</h3>
      {#if subtitle}<p class="chart-subtitle">{subtitle}</p>{/if}
    </figcaption>
  {/if}

  <div class="multiples-grid" style="grid-template-columns: repeat({columns}, 1fr); gap: {gap}px;">
    {#each items as item}
      <div class="multiple-panel">
        <h4 class="panel-title">{item.label}</h4>
        {@render children(item)}
      </div>
    {/each}
  </div>

  {#if caption || sourceLabel}
    <footer class="chart-footer">
      {#if caption}<p class="chart-caption">{caption}</p>{/if}
      {#if sourceLabel}<p class="chart-source">{sourceLabel}</p>{/if}
    </footer>
  {/if}
</figure>

<style>
  .chart-container { width: 100%; margin: 0; padding: 0; font-family: var(--font-chart, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif); color: var(--chart-text, #1a1a1a); }
  .chart-header { padding: 0 0 0.75rem; }
  .chart-title { margin: 0; font-size: 1.25rem; font-weight: 700; line-height: 1.3; }
  .chart-subtitle { margin: 0.25rem 0 0; font-size: 0.875rem; color: var(--chart-text-secondary, #666); }
  .multiples-grid { display: grid; }
  .panel-title { margin: 0 0 0.25rem; font-size: 0.8125rem; font-weight: 600; color: var(--chart-text, #1a1a1a); }
  .chart-footer { padding: 0.75rem 0 0; font-size: 0.75rem; color: var(--chart-text-secondary, #888); }
  .chart-caption { margin: 0; }
  .chart-source { margin: 0.125rem 0 0; font-style: italic; }

  @media (max-width: 600px) {
    .multiples-grid { grid-template-columns: 1fr !important; }
  }

  @media print {
    .chart-container { break-inside: avoid; }
    .multiples-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
  }
</style>
