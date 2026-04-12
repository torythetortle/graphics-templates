<script lang="ts">
  import { sum } from 'd3-array';
  import {
    getPalette,
    detectColorMode,
    formatComma,
    formatPct,
    type CandidateRow,
    type ColorMode,
    type PaletteName,
  } from '@graphics-templates/core';
  import { announce } from '@graphics-templates/core/a11y';
  // @ts-ignore
  import AccessibleTable from '../../primitives/AccessibleTable.svelte';

  interface Props {
    data: CandidateRow[];
    title: string;
    subtitle?: string;
    caption?: string;
    sourceLabel?: string;
    totalVotes?: number;
    winner?: string;
    precinctsPct?: number;
    palette?: PaletteName | string[];
    colorMode?: ColorMode;
    showTable?: boolean;
    partyColors?: Record<string, string>;
  }

  let {
    data,
    title,
    subtitle,
    caption,
    sourceLabel,
    totalVotes,
    winner,
    precinctsPct,
    palette = 'politics',
    colorMode: colorModeProp,
    showTable = true,
    partyColors,
  }: Props = $props();

  const chartId = `election-${Math.random().toString(36).slice(2, 9)}`;
  const colorMode = $derived(colorModeProp ?? detectColorMode());

  const DEFAULT_PARTY_COLORS: Record<string, string> = {
    Democratic: '#1473b8',
    Democrat: '#1473b8',
    DEM: '#1473b8',
    D: '#1473b8',
    Republican: '#c0392b',
    GOP: '#c0392b',
    REP: '#c0392b',
    R: '#c0392b',
    Independent: '#888888',
    IND: '#888888',
    I: '#888888',
    Libertarian: '#f4a620',
    LIB: '#f4a620',
    Green: '#17aa5c',
    GRN: '#17aa5c',
  };

  const A11Y_PARTY_COLORS: Record<string, string> = {
    Democratic: '#0072b2',
    Democrat: '#0072b2',
    DEM: '#0072b2',
    D: '#0072b2',
    Republican: '#d55e00',
    GOP: '#d55e00',
    REP: '#d55e00',
    R: '#d55e00',
    Independent: '#999999',
    IND: '#999999',
    I: '#999999',
  };

  function getPartyColor(party: string): string {
    if (partyColors?.[party]) return partyColors[party];
    if (colorMode === 'colorblind') return A11Y_PARTY_COLORS[party] ?? '#888';
    if (colorMode === 'print') return '#555';
    return DEFAULT_PARTY_COLORS[party] ?? '#888';
  }

  const sorted = $derived([...data].sort((a, b) => b.votes - a.votes));
  const total = $derived(totalVotes ?? sum(data, (d) => d.votes));
  const detectedWinner = $derived(winner ?? sorted[0]?.candidate);

  const description = $derived(
    `Election results: ${title}. ${detectedWinner} leads with ${sorted[0]?.pct != null ? (sorted[0].pct * 100).toFixed(1) + '%' : 'the most votes'}. ${data.length} candidates.${precinctsPct != null ? ` ${(precinctsPct * 100).toFixed(0)}% of precincts reporting.` : ''}`,
  );

  const tableColumns = $derived([
    { key: 'candidate', label: 'Candidate' },
    { key: 'party', label: 'Party' },
    { key: 'votes', label: 'Votes', format: (v: unknown) => formatComma(v as number) },
    { key: 'pct', label: 'Share', format: (v: unknown) => formatPct(v as number) },
  ]);

  let focusedIndex = $state(-1);
</script>

<figure class="chart-container election-results" aria-label={title}>
  <figcaption class="chart-header">
    <h3 class="chart-title">{title}</h3>
    {#if subtitle}
      <p class="chart-subtitle">{subtitle}</p>
    {/if}
    {#if precinctsPct != null}
      <p class="precincts">{(precinctsPct * 100).toFixed(0)}% of precincts reporting</p>
    {/if}
  </figcaption>

  <!-- Summary bar -->
  <div class="results-bar" role="img" aria-label={description}>
    {#each sorted as row}
      {@const pct = row.pct ?? row.votes / total}
      <div
        class="bar-segment"
        style="width: {pct * 100}%; background: {getPartyColor(row.party)};"
        aria-hidden="true"
      ></div>
    {/each}
  </div>

  <!-- Candidate rows -->
  <div class="candidates" role="list">
    {#each sorted as row, i}
      {@const pct = row.pct ?? row.votes / total}
      {@const isWinner = row.candidate === detectedWinner}
      {@const focused = focusedIndex === i}
      <div
        class="candidate-row"
        class:winner={isWinner}
        class:focused
        role="listitem"
        tabindex={i === 0 ? 0 : -1}
        aria-label="{row.candidate}, {row.party}: {formatComma(row.votes)} votes, {(pct * 100).toFixed(1)}%{isWinner ? ', leading' : ''}"
        onfocus={() => { focusedIndex = i; announce(`${row.candidate}: ${(pct * 100).toFixed(1)}%`); }}
        onblur={() => { focusedIndex = -1; }}
        onkeydown={(e) => {
          if (e.key === 'ArrowDown' && i < sorted.length - 1) {
            e.preventDefault();
            (e.currentTarget as HTMLElement).nextElementSibling?.focus();
          }
          if (e.key === 'ArrowUp' && i > 0) {
            e.preventDefault();
            (e.currentTarget as HTMLElement).previousElementSibling?.focus();
          }
        }}
      >
        <div class="candidate-info">
          <span
            class="party-dot"
            style="background: {getPartyColor(row.party)};"
            aria-hidden="true"
          ></span>
          <span class="candidate-name">
            {row.candidate}
            {#if isWinner}<span class="winner-check" aria-label="Leading">✓</span>{/if}
          </span>
          <span class="candidate-party">{row.party}</span>
        </div>
        <div class="candidate-numbers">
          <span class="candidate-pct">{(pct * 100).toFixed(1)}%</span>
          <span class="candidate-votes">{formatComma(row.votes)}</span>
        </div>
      </div>
    {/each}
  </div>

  {#if showTable}
    <AccessibleTable
      caption="{title}{subtitle ? `: ${subtitle}` : ''}"
      columns={tableColumns}
      rows={data as unknown as Record<string, unknown>[]}
      {chartId}
    />
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
    max-width: 520px;
    margin: 0;
    padding: 0;
    font-family: var(--font-chart, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
    color: var(--chart-text, #1a1a1a);
  }

  .chart-header { padding: 0 0 0.75rem; }

  .chart-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.3;
  }

  .chart-subtitle {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: var(--chart-text-secondary, #666);
  }

  .precincts {
    margin: 0.25rem 0 0;
    font-size: 0.75rem;
    color: var(--chart-text-secondary, #888);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .results-bar {
    display: flex;
    height: 10px;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .bar-segment {
    transition: width 0.6s ease-out;
  }

  .candidates {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .candidate-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.625rem 0;
    border-bottom: 1px solid var(--chart-grid, #e5e5e5);
    cursor: default;
    outline: none;
  }

  .candidate-row:first-child {
    border-top: 1px solid var(--chart-grid, #e5e5e5);
  }

  .candidate-row:focus-visible {
    background: var(--surface, #f5f5f5);
    outline: 2px solid var(--chart-text, #1a1a1a);
    outline-offset: -2px;
  }

  .candidate-row.winner .candidate-name {
    font-weight: 700;
  }

  .candidate-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .party-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .candidate-name {
    font-size: 0.9375rem;
  }

  .winner-check {
    display: inline-block;
    margin-left: 0.25rem;
    font-weight: 700;
    font-size: 0.875rem;
  }

  .candidate-party {
    font-size: 0.8125rem;
    color: var(--chart-text-secondary, #888);
  }

  .candidate-numbers {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    text-align: right;
  }

  .candidate-pct {
    font-size: 1.125rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .candidate-votes {
    font-size: 0.8125rem;
    color: var(--chart-text-secondary, #888);
    font-variant-numeric: tabular-nums;
    min-width: 80px;
    text-align: right;
  }

  .chart-footer {
    padding: 0.75rem 0 0;
    font-size: 0.75rem;
    color: var(--chart-text-secondary, #888);
  }

  .chart-caption { margin: 0; }
  .chart-source { margin: 0.125rem 0 0; font-style: italic; }

  @media (prefers-reduced-motion: reduce) {
    .bar-segment { transition: none; }
  }

  @media print {
    .chart-container {
      break-inside: avoid;
      max-width: 4in;
    }

    .party-dot {
      border: 1.5px solid #333;
    }

    .results-bar {
      border: 1px solid #ccc;
    }
  }
</style>
