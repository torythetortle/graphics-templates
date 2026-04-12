<script lang="ts">
  import { scaleLinear } from 'd3-scale';
  import {
    detectColorMode,
    type ColorMode,
  } from '@graphics-templates/core';

  interface HistoricalMargin {
    year: number;
    margin: number;
  }

  interface Props {
    margin: number;
    title?: string;
    partyA?: string;
    partyB?: string;
    colorA?: string;
    colorB?: string;
    maxMargin?: number;
    historical?: HistoricalMargin[];
    colorMode?: ColorMode;
  }

  let {
    margin: marginVal,
    title,
    partyA = 'Democratic',
    partyB = 'Republican',
    colorA,
    colorB,
    maxMargin = 30,
    historical = [],
    colorMode: colorModeProp,
  }: Props = $props();

  const colorMode = $derived(colorModeProp ?? detectColorMode());

  const defaultColorA = $derived(colorMode === 'colorblind' ? '#0072b2' : '#1473b8');
  const defaultColorB = $derived(colorMode === 'colorblind' ? '#d55e00' : '#c0392b');
  const resolvedColorA = $derived(colorA ?? defaultColorA);
  const resolvedColorB = $derived(colorB ?? defaultColorB);

  const leading = $derived(marginVal > 0 ? partyA : marginVal < 0 ? partyB : 'Tie');
  const leadingColor = $derived(marginVal > 0 ? resolvedColorA : marginVal < 0 ? resolvedColorB : '#888');
  const absMargin = $derived(Math.abs(marginVal));

  const scale = $derived(
    scaleLinear().domain([0, maxMargin]).range([0, 50]).clamp(true),
  );

  const description = $derived(
    `Vote margin: ${leading}${marginVal !== 0 ? ` +${absMargin.toFixed(1)} points` : ''}. ${title ?? ''}`,
  );
</script>

<div class="vote-margin" role="img" aria-label={description}>
  {#if title}
    <p class="margin-title">{title}</p>
  {/if}

  <div class="margin-bar-container">
    <span class="party-label left" style="color: {resolvedColorA}">{partyA}</span>

    <div class="margin-bar">
      {#if marginVal > 0}
        <div class="margin-fill left" style="width: {scale(absMargin)}%; background: {resolvedColorA};"></div>
        <div class="center-line"></div>
        <div class="margin-fill-spacer right" style="width: {scale(absMargin)}%;"></div>
      {:else if marginVal < 0}
        <div class="margin-fill-spacer left" style="width: {scale(absMargin)}%;"></div>
        <div class="center-line"></div>
        <div class="margin-fill right" style="width: {scale(absMargin)}%; background: {resolvedColorB};"></div>
      {:else}
        <div class="center-line"></div>
      {/if}
    </div>

    <span class="party-label right" style="color: {resolvedColorB}">{partyB}</span>
  </div>

  <p class="margin-value" style="color: {leadingColor}">
    {leading}
    {#if marginVal !== 0}+{absMargin.toFixed(1)}{/if}
  </p>

  {#if historical.length > 0}
    <div class="historical">
      {#each historical as h}
        {@const hColor = h.margin > 0 ? resolvedColorA : h.margin < 0 ? resolvedColorB : '#888'}
        <div class="historical-row">
          <span class="historical-year">{h.year}</span>
          <div class="historical-bar">
            {#if h.margin > 0}
              <div class="hist-fill left" style="width: {scale(Math.abs(h.margin))}%; background: {resolvedColorA}; opacity: 0.5;"></div>
              <div class="hist-center"></div>
            {:else if h.margin < 0}
              <div class="hist-spacer" style="width: 50%;"></div>
              <div class="hist-center"></div>
              <div class="hist-fill right" style="width: {scale(Math.abs(h.margin))}%; background: {resolvedColorB}; opacity: 0.5;"></div>
            {:else}
              <div class="hist-center"></div>
            {/if}
          </div>
          <span class="historical-val" style="color: {hColor}">
            {h.margin > 0 ? '+' : ''}{h.margin.toFixed(1)}
          </span>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .vote-margin {
    width: 100%;
    max-width: 420px;
    font-family: var(--font-chart, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
    color: var(--chart-text, #1a1a1a);
  }

  .margin-title {
    margin: 0 0 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .margin-bar-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .party-label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    min-width: 28px;
  }

  .party-label.left { text-align: right; }
  .party-label.right { text-align: left; }

  .margin-bar {
    flex: 1;
    height: 20px;
    background: var(--chart-grid, #e5e5e5);
    border-radius: 3px;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .margin-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.5s ease-out;
  }

  .margin-fill-spacer {
    height: 100%;
  }

  .center-line {
    width: 2px;
    height: 100%;
    background: var(--chart-text, #1a1a1a);
    flex-shrink: 0;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .margin-value {
    margin: 0.375rem 0 0;
    font-size: 0.9375rem;
    font-weight: 700;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  .historical {
    margin-top: 0.75rem;
    border-top: 1px solid var(--chart-grid, #e5e5e5);
    padding-top: 0.5rem;
  }

  .historical-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.125rem 0;
  }

  .historical-year {
    font-size: 0.6875rem;
    color: var(--chart-text-secondary, #888);
    min-width: 32px;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .historical-bar {
    flex: 1;
    height: 8px;
    background: var(--chart-grid, #eee);
    border-radius: 2px;
    display: flex;
    align-items: center;
    position: relative;
  }

  .hist-fill {
    height: 100%;
    border-radius: 2px;
  }

  .hist-spacer { height: 100%; }

  .hist-center {
    width: 1px;
    height: 100%;
    background: var(--chart-axis, #aaa);
    position: absolute;
    left: 50%;
  }

  .historical-val {
    font-size: 0.6875rem;
    font-weight: 600;
    min-width: 32px;
    font-variant-numeric: tabular-nums;
  }

  @media (prefers-reduced-motion: reduce) {
    .margin-fill { transition: none; }
  }

  @media print {
    .vote-margin { max-width: 3in; }

    .margin-fill,
    .hist-fill {
      border: 1px solid #333;
    }
  }
</style>
