<script lang="ts">
  import { base } from '$app/paths';
  import { PALETTES } from '@graphics-templates/core/color';
</script>

<svelte:head>
  <title>Graphics Templates</title>
</svelte:head>

<section class="intro">
  <h1>Graphics Templates</h1>
  <p class="tagline">
    Accessible-by-default chart components for newsroom graphics.
    Built with Svelte 5 and D3.
  </p>

  <div class="bio">
    <p>
      Most newsroom chart templates ship without real accessibility. This library
      bakes in screen reader support, keyboard navigation, data table alternatives,
      and colorblind-safe palettes as defaults — not afterthoughts.
    </p>
    <p>
      18 chart types covering the full range of data journalism needs: line and
      bar charts, choropleth maps, election results, beeswarms, sankey diagrams,
      candlesticks, scrollytelling scaffolds, and more.
    </p>
    <p>
      Drop in data, set a title, publish. Every component is responsive,
      print-ready, and keyboard navigable out of the box.
    </p>
  </div>
</section>

<section class="section">
  <h2 class="section-title">Charts</h2>
  <div class="grid">
    <a href="{base}/line" class="card">
      <h3>Line</h3>
      <p>Time series, multi-series, annotations, dash patterns</p>
    </a>
    <a href="{base}/bar" class="card">
      <h3>Bar</h3>
      <p>Vertical, horizontal, grouped, stacked, value labels</p>
    </a>
    <a href="{base}/scatter" class="card">
      <h3>Scatter</h3>
      <p>Correlation, size encoding, group coloring</p>
    </a>
    <a href="{base}/area" class="card">
      <h3>Area</h3>
      <p>Stacked areas, gradient fills, multi-series</p>
    </a>
    <a href="{base}/election" class="card">
      <h3>Election Results</h3>
      <p>Candidates, margins, party colors, precincts reporting</p>
    </a>
    <a href="{base}/choropleth" class="card">
      <h3>Choropleth</h3>
      <p>US states, counties, world countries</p>
    </a>
    <a href="{base}/bubble-map" class="card">
      <h3>Bubble Map</h3>
      <p>Proportional circles on geography</p>
    </a>
    <a href="{base}/beeswarm" class="card">
      <h3>Beeswarm</h3>
      <p>Distribution with collision detection</p>
    </a>
    <a href="{base}/waffle" class="card">
      <h3>Waffle</h3>
      <p>Part-to-whole grid, percentage labels</p>
    </a>
    <a href="{base}/slope" class="card">
      <h3>Slope</h3>
      <p>Before/after comparison across two time points</p>
    </a>
    <a href="{base}/bump" class="card">
      <h3>Bump</h3>
      <p>Rankings over time with dash patterns</p>
    </a>
    <a href="{base}/heatmap" class="card">
      <h3>Heatmap</h3>
      <p>Calendar grids, time × category intensity</p>
    </a>
    <a href="{base}/sankey" class="card">
      <h3>Sankey</h3>
      <p>Flows between categories</p>
    </a>
    <a href="{base}/candlestick" class="card">
      <h3>Candlestick</h3>
      <p>OHLC bars, wicks, up/down colors</p>
    </a>
    <a href="{base}/small-multiples" class="card">
      <h3>Small Multiples</h3>
      <p>Faceted grid of any chart type</p>
    </a>
    <a href="{base}/scrolly" class="card">
      <h3>Scrollytelling</h3>
      <p>Sticky panels with IntersectionObserver</p>
    </a>
  </div>
</section>

<section class="section">
  <h2 class="section-title">Design System</h2>
  <div class="grid grid-2">
    <a href="{base}/colors" class="card card-big">
      <h3>Color Palettes</h3>
      <p>15 named palettes — categorical, sequential, diverging, politics, finance. Colorblind-safe variants included.</p>
      <div class="palette-preview" aria-hidden="true">
        {#each PALETTES.newsroom.colors as color}
          <span style="background:{color}"></span>
        {/each}
      </div>
    </a>
    <a href="{base}/accessibility" class="card card-big">
      <h3>Accessibility</h3>
      <p>Every chart ships with ARIA roles, auto-generated descriptions, keyboard navigation, data table alternatives, and prefers-reduced-motion support.</p>
    </a>
  </div>
</section>

<section class="section">
  <h2 class="section-title">Quick Start</h2>
  <div class="code-block">
    <pre><code>&lt;script&gt;
  import &#123; LineChart &#125; from '@graphics-templates/svelte';
  import data from './data.csv';
&lt;/script&gt;

&lt;LineChart
  &#123;data&#125;
  title="Unemployment rate, 2020–2024"
  subtitle="Quarterly, seasonally adjusted"
  sourceLabel="Bureau of Labor Statistics"
/&gt;</code></pre>
  </div>
  <p class="note">
    Responsive sizing, keyboard navigation, screen reader support, print styles,
    and a visually-hidden data table are included automatically.
  </p>
</section>

<section class="section">
  <h2 class="section-title">Built With</h2>
  <div class="tech-list">
    <span class="tech">Svelte 5</span>
    <span class="tech">D3.js</span>
    <span class="tech">TypeScript</span>
    <span class="tech">WAI-ARIA</span>
    <span class="tech">pnpm</span>
    <span class="tech">Turborepo</span>
    <span class="tech">SvelteKit</span>
  </div>
</section>

<style>
  .intro {
    margin-bottom: var(--space-xl);
  }

  h1 {
    margin: 0 0 0.5rem;
    font-size: 2.25rem;
    letter-spacing: -0.02em;
  }

  .tagline {
    margin: 0 0 1.5rem;
    color: var(--color-text-muted);
    font-size: 1.0625rem;
    font-family: var(--font-mono);
    max-width: 600px;
    line-height: 1.6;
  }

  .bio p {
    max-width: 680px;
    line-height: 1.75;
    margin: 0 0 1rem;
    color: var(--color-text);
    font-size: 0.9375rem;
  }

  .section {
    margin-bottom: var(--space-xl);
  }

  .section-title {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-muted);
    margin: 0 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-border);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
  }

  .grid-2 {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  .card {
    display: block;
    padding: 1rem 1.125rem;
    background: var(--color-bg-subtle);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    text-decoration: none;
    transition: border-color 0.15s, transform 0.15s;
  }

  .card:hover {
    border-color: var(--color-accent);
    transform: translateY(-1px);
  }

  .card h3 {
    margin: 0 0 0.25rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--color-text-bright);
    font-family: var(--font-mono);
  }

  .card p {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    line-height: 1.5;
    font-family: var(--font-body);
  }

  .card-big {
    padding: 1.25rem 1.5rem;
  }

  .card-big h3 {
    font-size: 1rem;
  }

  .card-big p {
    font-size: 0.875rem;
  }

  .palette-preview {
    display: flex;
    gap: 3px;
    margin-top: 0.75rem;
  }

  .palette-preview span {
    width: 22px;
    height: 22px;
    border-radius: 3px;
  }

  .code-block {
    background: var(--color-bg-subtle);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    padding: 1.25rem;
    overflow-x: auto;
  }

  .code-block pre {
    margin: 0;
  }

  .code-block code {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    line-height: 1.7;
    color: var(--color-text);
  }

  .note {
    margin: 0.75rem 0 0;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-text-muted);
    line-height: 1.6;
    max-width: 620px;
  }

  .tech-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tech {
    display: inline-block;
    padding: 0.375rem 0.75rem;
    background: var(--color-bg-subtle);
    border: 1px solid var(--color-border);
    border-radius: 100px;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }
</style>
