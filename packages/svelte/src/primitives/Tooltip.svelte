<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    visible: boolean;
    x: number;
    y: number;
    children: Snippet;
  }

  let { visible, x, y, children }: Props = $props();

  const offset = 12;
</script>

{#if visible}
  <div
    class="chart-tooltip"
    style="left: {x + offset}px; top: {y - offset}px;"
    role="tooltip"
  >
    {@render children()}
  </div>
{/if}

<style>
  .chart-tooltip {
    position: absolute;
    pointer-events: none;
    background: var(--chart-bg, #fff);
    border: 1px solid var(--chart-grid, #ddd);
    border-radius: 4px;
    padding: 0.5rem 0.625rem;
    font-size: 0.8125rem;
    line-height: 1.4;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    z-index: 10;
    max-width: 240px;
    color: var(--chart-text, #1a1a1a);
    white-space: nowrap;
  }

  @media print {
    .chart-tooltip {
      display: none !important;
    }
  }
</style>
