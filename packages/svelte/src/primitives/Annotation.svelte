<script lang="ts">
  interface Props {
    x: number;
    y: number;
    label: string;
    side?: 'left' | 'right' | 'top' | 'bottom';
    color?: string;
  }

  let {
    x,
    y,
    label,
    side = 'right',
    color = 'var(--chart-annotation, #333)',
  }: Props = $props();

  const dx = $derived(
    side === 'left' ? -8 : side === 'right' ? 8 : 0,
  );
  const dy = $derived(
    side === 'top' ? -8 : side === 'bottom' ? 16 : 0,
  );
  const anchor = $derived(
    side === 'left' ? 'end' : side === 'right' ? 'start' : 'middle',
  );
</script>

<g class="annotation" aria-hidden="true">
  <circle cx={x} cy={y} r="3" fill={color} />
  <text
    x={x + dx}
    y={y + dy}
    text-anchor={anchor}
    fill={color}
    font-size="12"
    font-weight="500"
    dy={side === 'left' || side === 'right' ? '0.35em' : 0}
  >
    {label}
  </text>
</g>
