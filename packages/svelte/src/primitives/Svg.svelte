<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    width: number;
    height: number;
    chartId: string;
    title: string;
    description?: string;
    children: Snippet;
  }

  let { width, height, chartId, title, description, children }: Props = $props();
</script>

<svg
  {width}
  {height}
  viewBox="0 0 {width} {height}"
  role="img"
  aria-labelledby="{chartId}-title {description ? `${chartId}-desc` : ''}"
  class="chart-svg"
>
  <title id="{chartId}-title">{title}</title>
  {#if description}
    <desc id="{chartId}-desc">{description}</desc>
  {/if}
  {@render children()}
</svg>

<style>
  .chart-svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }

  @media print {
    .chart-svg {
      max-width: 100%;
    }
  }
</style>
