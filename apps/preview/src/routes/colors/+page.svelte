<script lang="ts">
  import { PALETTES, DASH_PATTERNS } from '@graphics-templates/core/color';

  const categorical = ['newsroom', 'politics', 'politics-a11y', 'finance', 'finance-a11y'] as const;
  const sequential = ['blues', 'reds', 'greens', 'oranges', 'purples', 'grays'] as const;
  const diverging = ['redblue', 'redblue-a11y', 'warmcool'] as const;
  const print = ['print-bw'] as const;
</script>

<svelte:head>
  <title>Color Palettes | Graphics Templates</title>
</svelte:head>

<h1>Color Palettes</h1>
<p class="desc">
  15 named palettes designed for data journalism. Every categorical palette has a
  colorblind-safe variant. Sequential and diverging palettes are built on
  perceptually uniform color scales from d3-scale-chromatic.
</p>

<section class="group">
  <h2>Categorical</h2>
  <p class="group-desc">For distinguishing discrete series. The <code>newsroom</code> palette is the default.</p>
  {#each categorical as name}
    {@const p = PALETTES[name]}
    <div class="palette-row">
      <div class="palette-meta">
        <strong class="palette-name">{name}</strong>
        <div class="palette-tags">
          {#if p.colorblindSafe}<span class="tag safe">colorblind safe</span>{/if}
          {#if p.printSafe}<span class="tag">print safe</span>{/if}
        </div>
      </div>
      <div class="swatches">
        {#each p.colors as color}
          <div class="swatch" style="background:{color};" title={color}>
            <span class="swatch-label">{color}</span>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</section>

<section class="group">
  <h2>Sequential</h2>
  <p class="group-desc">For ordered data — choropleths, heatmaps, single-variable intensity.</p>
  {#each sequential as name}
    {@const p = PALETTES[name]}
    <div class="palette-row">
      <div class="palette-meta">
        <strong class="palette-name">{name}</strong>
      </div>
      <div class="swatches gradient">
        {#each p.colors as color}
          <div class="swatch-seq" style="background:{color};"></div>
        {/each}
      </div>
    </div>
  {/each}
</section>

<section class="group">
  <h2>Diverging</h2>
  <p class="group-desc">For data with a meaningful midpoint — vote margins, temperature anomalies, z-scores.</p>
  {#each diverging as name}
    {@const p = PALETTES[name]}
    <div class="palette-row">
      <div class="palette-meta">
        <strong class="palette-name">{name}</strong>
        <div class="palette-tags">
          {#if p.colorblindSafe}<span class="tag safe">colorblind safe</span>{/if}
        </div>
      </div>
      <div class="swatches gradient">
        {#each p.colors as color}
          <div class="swatch-seq" style="background:{color};"></div>
        {/each}
      </div>
    </div>
  {/each}
</section>

<section class="group">
  <h2>Print</h2>
  <p class="group-desc">Grayscale palette auto-applied via <code>@media print</code> or <code>colorMode="print"</code>.</p>
  {#each print as name}
    {@const p = PALETTES[name]}
    <div class="palette-row">
      <div class="palette-meta">
        <strong class="palette-name">{name}</strong>
      </div>
      <div class="swatches gradient">
        {#each p.colors as color}
          <div class="swatch-seq" style="background:{color};"></div>
        {/each}
      </div>
    </div>
  {/each}
</section>

<section class="group">
  <h2>Dash Patterns</h2>
  <p class="group-desc">
    Line charts render both color <em>and</em> a unique dash pattern per series.
    This ensures lines are distinguishable in print and for colorblind readers
    without relying on color alone.
  </p>
  <div class="dashes">
    {#each DASH_PATTERNS as pattern, i}
      <div class="dash-row">
        <svg width="80" height="16" aria-hidden="true">
          <line
            x1="0" y1="8" x2="80" y2="8"
            stroke="var(--chart-text, #1a1a1a)"
            stroke-width="2.5"
            stroke-dasharray={pattern === 'none' ? undefined : pattern}
          />
        </svg>
        <span class="dash-label">Series {i + 1}{i === 0 ? ' (solid)' : ''}</span>
        <code class="dash-code">{pattern}</code>
      </div>
    {/each}
  </div>
</section>

<section class="group">
  <h2>Usage</h2>
  <div class="code-block">
    <pre><code>&lt;!-- Named palette --&gt;
&lt;LineChart data=&#123;data&#125; title="..." palette="politics" /&gt;

&lt;!-- Colorblind-safe mode --&gt;
&lt;LineChart data=&#123;data&#125; title="..." colorMode="colorblind" /&gt;

&lt;!-- Custom colors --&gt;
&lt;LineChart data=&#123;data&#125; title="..." palette=&#123;['#e41a1c', '#377eb8', '#4daf4a']&#125; /&gt;

&lt;!-- In code --&gt;
import &#123; getPalette &#125; from '@graphics-templates/core/color';
const colors = getPalette('newsroom', 'default', 'categorical', 4);</code></pre>
  </div>
</section>

<style>
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; }
  h2 { margin: 0 0 0.25rem; font-size: 1.125rem; font-weight: 600; }

  .desc {
    color: var(--chart-text-secondary);
    margin: 0 0 2.5rem;
    line-height: 1.6;
    max-width: 600px;
    font-size: 0.9375rem;
  }

  .group { margin-bottom: 2.5rem; }

  .group-desc {
    font-size: 0.8125rem;
    color: var(--chart-text-secondary);
    margin: 0 0 1rem;
    line-height: 1.5;
    max-width: 560px;
  }

  .group-desc code {
    font-size: 0.75rem;
    background: var(--surface);
    padding: 0.1em 0.35em;
    border-radius: 3px;
  }

  .palette-row {
    margin-bottom: 1.25rem;
  }

  .palette-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.375rem;
  }

  .palette-name {
    font-size: 0.8125rem;
    font-family: 'SF Mono', 'Fira Code', Menlo, monospace;
  }

  .palette-tags {
    display: flex;
    gap: 0.25rem;
  }

  .tag {
    font-size: 0.625rem;
    padding: 0.125rem 0.375rem;
    border-radius: 100px;
    border: 1px solid var(--border);
    color: var(--chart-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .tag.safe {
    border-color: #2ca25f;
    color: #2ca25f;
  }

  .swatches {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }

  .swatches.gradient {
    gap: 0;
  }

  .swatch {
    width: 44px;
    height: 44px;
    border-radius: 4px;
    position: relative;
    cursor: default;
  }

  .swatch-label {
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.5625rem;
    font-family: 'SF Mono', Menlo, monospace;
    color: var(--chart-text-secondary);
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.1s;
  }

  .swatch:hover .swatch-label {
    opacity: 1;
  }

  .swatch-seq {
    flex: 1;
    height: 28px;
    min-width: 0;
  }

  .swatch-seq:first-child { border-radius: 4px 0 0 4px; }
  .swatch-seq:last-child { border-radius: 0 4px 4px 0; }

  .dashes {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .dash-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .dash-label {
    font-size: 0.8125rem;
    min-width: 100px;
  }

  .dash-code {
    font-size: 0.6875rem;
    font-family: 'SF Mono', Menlo, monospace;
    color: var(--chart-text-secondary);
  }

  .code-block {
    background: var(--chart-bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1.25rem;
    overflow-x: auto;
  }

  .code-block pre { margin: 0; }

  .code-block code {
    font-family: 'SF Mono', 'Fira Code', Menlo, monospace;
    font-size: 0.8125rem;
    line-height: 1.6;
    color: var(--chart-text);
  }
</style>
