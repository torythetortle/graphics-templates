<script lang="ts">
  import { DASH_PATTERNS } from '@graphics-templates/core/color';

  interface LegendItem {
    label: string;
    color: string;
    dashIndex?: number;
  }

  interface Props {
    items: LegendItem[];
    position?: 'top' | 'bottom' | 'right';
    showDashes?: boolean;
  }

  let { items, position = 'bottom', showDashes = false }: Props = $props();
</script>

<div class="chart-legend legend-{position}" role="list" aria-label="Chart legend">
  {#each items as item}
    <div class="legend-item" role="listitem">
      {#if showDashes && item.dashIndex != null}
        <svg width="20" height="12" aria-hidden="true">
          <line
            x1="0" y1="6" x2="20" y2="6"
            stroke={item.color}
            stroke-width="2"
            stroke-dasharray={DASH_PATTERNS[item.dashIndex % DASH_PATTERNS.length]}
          />
        </svg>
      {:else}
        <span class="legend-swatch" style="background: {item.color};" aria-hidden="true"></span>
      {/if}
      <span class="legend-label">{item.label}</span>
    </div>
  {/each}
</div>

<style>
  .chart-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    font-size: 0.8125rem;
    color: var(--chart-text, #1a1a1a);
  }

  .legend-right {
    flex-direction: column;
    gap: 0.375rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .legend-swatch {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .legend-label {
    line-height: 1;
  }

  @media print {
    .chart-legend {
      color: #000;
    }
  }
</style>
