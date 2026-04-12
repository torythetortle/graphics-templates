<script lang="ts">
  import type { ScaleLinear, ScaleTime } from 'd3-scale';

  type ContinuousScale = ScaleLinear<number, number> | ScaleTime<number, number>;

  interface Props {
    xScale?: ContinuousScale;
    yScale?: ContinuousScale;
    width: number;
    height: number;
    xTickCount?: number;
    yTickCount?: number;
  }

  let {
    xScale,
    yScale,
    width,
    height,
    xTickCount = 6,
    yTickCount = 6,
  }: Props = $props();

  const xTicks = $derived(xScale?.ticks(xTickCount) ?? []);
  const yTicks = $derived(yScale?.ticks(yTickCount) ?? []);
</script>

<g class="grid" aria-hidden="true">
  {#each xTicks as tick}
    <line
      x1={xScale!(tick)}
      x2={xScale!(tick)}
      y1={0}
      y2={height}
      stroke="var(--chart-grid, #e5e5e5)"
      stroke-width="1"
    />
  {/each}
  {#each yTicks as tick}
    <line
      x1={0}
      x2={width}
      y1={yScale!(tick)}
      y2={yScale!(tick)}
      stroke="var(--chart-grid, #e5e5e5)"
      stroke-width="1"
    />
  {/each}
</g>
