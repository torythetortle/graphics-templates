<script lang="ts">
  import { type Snippet } from 'svelte';
  import { useDimensions } from '../lib/use-dimensions.svelte.js';
  import { setChartContext } from '../lib/chart-context.svelte.js';
  import {
    getBreakpoint,
    RESPONSIVE_DEFAULTS,
    innerDimensions,
    detectColorMode,
    getPalette,
    type ColorMode,
    type PaletteName,
  } from '@graphics-templates/core';

  interface Props {
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
    aspectRatio?: number;
    palette?: PaletteName | string[];
    colorMode?: ColorMode;
    animated?: boolean;
    showTable?: boolean;
    ariaLabel?: string;
    ariaDescription?: string;
    children: Snippet;
  }

  let {
    title,
    subtitle,
    caption,
    sourceLabel,
    width: widthProp,
    height: heightProp,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    aspectRatio,
    palette = 'newsroom',
    colorMode: colorModeProp,
    animated: animatedProp,
    showTable = true,
    ariaLabel,
    ariaDescription,
    children,
  }: Props = $props();

  let container: HTMLElement | undefined = $state();
  const dims = useDimensions(() => container ?? null);
  const chartId = $derived(`chart-${Math.random().toString(36).slice(2, 9)}`);

  const resolvedColorMode = $derived(colorModeProp ?? detectColorMode());

  const reducedMotion = $derived(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );
  const animated = $derived(animatedProp ?? !reducedMotion);

  const w = $derived(widthProp ?? dims.width);
  const bp = $derived(getBreakpoint(w));
  const defaults = $derived(RESPONSIVE_DEFAULTS[bp]);

  const margin = $derived({
    top: marginTop ?? defaults.marginTop,
    right: marginRight ?? defaults.marginRight,
    bottom: marginBottom ?? defaults.marginBottom,
    left: marginLeft ?? defaults.marginLeft,
  });

  const ar = $derived(aspectRatio ?? defaults.aspectRatio);
  const h = $derived(heightProp ?? Math.round(w / ar));
  const inner = $derived(innerDimensions(w, h, margin));

  $effect(() => {
    setChartContext({
      width: w,
      height: h,
      innerWidth: inner.innerWidth,
      innerHeight: inner.innerHeight,
      margin,
      palette,
      colorMode: resolvedColorMode,
      animated,
      chartId,
    });
  });
</script>

<figure
  class="chart-container"
  bind:this={container}
  aria-label={ariaLabel ?? title}
>
  {#if title}
    <figcaption class="chart-header">
      <h3 class="chart-title">{title}</h3>
      {#if subtitle}
        <p class="chart-subtitle">{subtitle}</p>
      {/if}
    </figcaption>
  {/if}

  {#if w > 0}
    {@render children()}
  {/if}

  {#if caption || sourceLabel}
    <footer class="chart-footer">
      {#if caption}<p class="chart-caption">{caption}</p>{/if}
      {#if sourceLabel}<p class="chart-source">{sourceLabel}</p>{/if}
    </footer>
  {/if}
</figure>

<style>
  .chart-container {
    width: 100%;
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-family: var(--font-chart, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
    color: var(--chart-text, #1a1a1a);
  }

  .chart-header {
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

  .chart-footer {
    padding: 0.5rem 0 0;
    font-size: 0.75rem;
    color: var(--chart-text-secondary, #888);
    line-height: 1.4;
  }

  .chart-caption {
    margin: 0;
  }

  .chart-source {
    margin: 0.125rem 0 0;
    font-style: italic;
  }

  @media print {
    .chart-container {
      break-inside: avoid;
      page-break-inside: avoid;
      max-width: 6.5in;
    }

    .chart-title {
      font-size: 14pt;
    }
  }
</style>
