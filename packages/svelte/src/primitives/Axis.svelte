<script lang="ts">
  import type { ScaleLinear, ScaleTime, ScaleBand } from 'd3-scale';

  type AnyScale = ScaleLinear<number, number> | ScaleTime<number, number> | ScaleBand<string>;

  interface Props {
    scale: AnyScale;
    position: 'top' | 'right' | 'bottom' | 'left';
    width: number;
    height: number;
    tickCount?: number;
    tickFormat?: (d: unknown) => string;
    label?: string;
    gridLines?: boolean;
  }

  let {
    scale,
    position,
    width,
    height,
    tickCount = 6,
    tickFormat,
    label,
    gridLines = false,
  }: Props = $props();

  const isHorizontal = $derived(position === 'top' || position === 'bottom');
  const transform = $derived(
    position === 'bottom' ? `translate(0, ${height})`
    : position === 'right' ? `translate(${width}, 0)`
    : '',
  );

  function getTicks(s: AnyScale): unknown[] {
    if ('ticks' in s && typeof s.ticks === 'function') {
      return s.ticks(tickCount);
    }
    if ('domain' in s) {
      return s.domain();
    }
    return [];
  }

  function getPosition(s: AnyScale, value: unknown): number {
    if ('bandwidth' in s && typeof s.bandwidth === 'function') {
      return (s as ScaleBand<string>)(value as string)! + s.bandwidth() / 2;
    }
    return (s as ScaleLinear<number, number>)(value as number);
  }

  function formatTick(value: unknown): string {
    if (tickFormat) return tickFormat(value);
    if (value instanceof Date) return value.toLocaleDateString();
    if (typeof value === 'number') return value.toLocaleString();
    return String(value);
  }

  const ticks = $derived(getTicks(scale));
</script>

<g class="axis axis-{position}" transform={transform} aria-hidden="true">
  <!-- Axis line -->
  {#if isHorizontal}
    <line x1={0} x2={width} stroke="var(--chart-axis, #888)" stroke-width="1" />
  {:else}
    <line y1={0} y2={height} stroke="var(--chart-axis, #888)" stroke-width="1" />
  {/if}

  <!-- Ticks -->
  {#each ticks as tick}
    {@const pos = getPosition(scale, tick)}
    {#if isHorizontal}
      <g transform="translate({pos}, 0)">
        <line
          y1={position === 'top' ? -6 : 0}
          y2={position === 'top' ? 0 : 6}
          stroke="var(--chart-axis, #888)"
          stroke-width="1"
        />
        {#if gridLines}
          <line
            y1={position === 'top' ? 0 : -height}
            y2={position === 'top' ? height : 0}
            stroke="var(--chart-grid, #e5e5e5)"
            stroke-width="1"
          />
        {/if}
        <text
          y={position === 'top' ? -10 : 20}
          text-anchor="middle"
          fill="var(--chart-axis, #888)"
          font-size="12"
        >
          {formatTick(tick)}
        </text>
      </g>
    {:else}
      <g transform="translate(0, {pos})">
        <line
          x1={position === 'left' ? -6 : 0}
          x2={position === 'left' ? 0 : 6}
          stroke="var(--chart-axis, #888)"
          stroke-width="1"
        />
        {#if gridLines}
          <line
            x1={position === 'left' ? 0 : -width}
            x2={position === 'left' ? width : 0}
            stroke="var(--chart-grid, #e5e5e5)"
            stroke-width="1"
          />
        {/if}
        <text
          x={position === 'left' ? -10 : 10}
          dy="0.35em"
          text-anchor={position === 'left' ? 'end' : 'start'}
          fill="var(--chart-axis, #888)"
          font-size="12"
        >
          {formatTick(tick)}
        </text>
      </g>
    {/if}
  {/each}

  <!-- Label -->
  {#if label}
    {#if isHorizontal}
      <text
        x={width / 2}
        y={position === 'top' ? -30 : 44}
        text-anchor="middle"
        fill="var(--chart-text, #1a1a1a)"
        font-size="13"
        font-weight="500"
      >
        {label}
      </text>
    {:else}
      <text
        transform="translate({position === 'left' ? -40 : 40}, {height / 2}) rotate(-90)"
        text-anchor="middle"
        fill="var(--chart-text, #1a1a1a)"
        font-size="13"
        font-weight="500"
      >
        {label}
      </text>
    {/if}
  {/if}
</g>
