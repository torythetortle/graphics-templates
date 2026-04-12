<script lang="ts">
  interface Props {
    title: string;
    subtitle?: string;
  }

  let { title, subtitle }: Props = $props();
</script>

<div class="chart-title-block">
  <h3 class="chart-title">{title}</h3>
  {#if subtitle}
    <p class="chart-subtitle">{subtitle}</p>
  {/if}
</div>

<style>
  .chart-title-block {
    padding: 0 0 0.5rem;
  }

  .chart-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.3;
    color: var(--chart-text, #1a1a1a);
  }

  .chart-subtitle {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: var(--chart-text-secondary, #666);
    line-height: 1.4;
  }
</style>
