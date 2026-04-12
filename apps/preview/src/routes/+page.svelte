<script lang="ts">
  import { base } from '$app/paths';
  import { PALETTES } from '@graphics-templates/core/color';
</script>

<svelte:head>
  <title>Graphics Templates</title>
</svelte:head>

<div class="hero">
  <h1>Graphics Templates</h1>
  <p class="tagline">
    Accessible-by-default chart components for newsroom graphics.
    Built with Svelte 5 and D3.
  </p>

  <div class="features">
    <div class="feature">
      <span class="feature-icon" aria-hidden="true">a11y</span>
      <div>
        <strong>Accessibility First</strong>
        <p>Screen reader descriptions, keyboard navigation, data table alternatives, and skip links on every chart.</p>
      </div>
    </div>
    <div class="feature">
      <span class="feature-icon" aria-hidden="true">css</span>
      <div>
        <strong>Responsive &amp; Print-Ready</strong>
        <p>Auto-resizing via ResizeObserver. Mobile-first breakpoints. <code>@media print</code> stylesheets with dash patterns for grayscale.</p>
      </div>
    </div>
    <div class="feature">
      <span class="feature-icon" aria-hidden="true">svg</span>
      <div>
        <strong>Deadline Friendly</strong>
        <p>Drop in data, set a title, publish. Every component works out of the box with sensible defaults.</p>
      </div>
    </div>
  </div>
</div>

<section class="section">
  <h2 class="section-title">Chart Components</h2>
  <p class="section-desc">18 chart types covering the full range of newsroom graphics needs.</p>

  <div class="grid">
    <a href="{base}/line" class="card ready">
      <h3>Line Chart</h3>
      <p>Time series, multi-series, annotations, dash patterns</p>
    </a>
    <a href="{base}/bar" class="card ready">
      <h3>Bar Chart</h3>
      <p>Vertical, horizontal, grouped, stacked, value labels</p>
    </a>
    <a href="{base}/scatter" class="card ready">
      <h3>Scatter Plot</h3>
      <p>Correlation, size encoding, group coloring</p>
    </a>
    <a href="{base}/election" class="card ready">
      <h3>Election Results</h3>
      <p>Candidates, margins, party colors, precincts reporting</p>
    </a>
    <a href="{base}/choropleth" class="card ready">
      <h3>Choropleth</h3>
      <p>US states, counties, world countries, sequential &amp; diverging</p>
    </a>
    <a href="{base}/bubble-map" class="card ready">
      <h3>Bubble Map</h3>
      <p>Proportional circles on geography</p>
    </a>
    <a href="{base}/area" class="card">
      <h3>Area Chart</h3>
      <p>Stacked areas, gradient fills</p>
    </a>
    <a href="{base}/beeswarm" class="card">
      <h3>Beeswarm</h3>
      <p>Distribution with collision detection</p>
    </a>
    <a href="{base}/waffle" class="card">
      <h3>Waffle Chart</h3>
      <p>Part-to-whole, icon grid</p>
    </a>
    <a href="{base}/slope" class="card">
      <h3>Slope Chart</h3>
      <p>Before/after comparison</p>
    </a>
    <a href="{base}/bump" class="card">
      <h3>Bump Chart</h3>
      <p>Rankings over time</p>
    </a>
    <a href="{base}/heatmap" class="card">
      <h3>Heatmap</h3>
      <p>Calendar, grid patterns</p>
    </a>
    <a href="{base}/sankey" class="card">
      <h3>Sankey Diagram</h3>
      <p>Flows between categories</p>
    </a>
    <a href="{base}/candlestick" class="card">
      <h3>Candlestick</h3>
      <p>OHLC, volume, moving averages</p>
    </a>
    <a href="{base}/small-multiples" class="card">
      <h3>Small Multiples</h3>
      <p>Faceted grid comparison</p>
    </a>
    <a href="{base}/scrolly" class="card">
      <h3>Scrollytelling</h3>
      <p>Scroll-driven narrative</p>
    </a>
  </div>
</section>

<section class="section">
  <h2 class="section-title">Design System</h2>
  <div class="grid grid-2">
    <a href="{base}/colors" class="card system-card">
      <h3>Color Palettes</h3>
      <p>15 named palettes — categorical, sequential, diverging, politics, finance. Colorblind-safe variants included.</p>
      <div class="palette-preview" aria-hidden="true">
        {#each PALETTES.newsroom.colors as color}
          <span style="background:{color}"></span>
        {/each}
      </div>
    </a>
    <a href="{base}/accessibility" class="card system-card">
      <h3>Accessibility</h3>
      <p>Every chart ships with ARIA roles, auto-generated descriptions, keyboard navigation, data table alternatives, and <code>prefers-reduced-motion</code> support.</p>
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
  <p class="code-note">
    That's it. Responsive sizing, keyboard navigation, screen reader support, print styles, and a visually-hidden data table are all included automatically.
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
  .hero {
    margin-bottom: 3rem;
  }

  h1 {
    margin: 0 0 0.5rem;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .tagline {
    margin: 0 0 2rem;
    color: var(--chart-text-secondary);
    font-size: 1.0625rem;
    max-width: 520px;
    line-height: 1.6;
  }

  .features {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .feature {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .feature-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    background: var(--chart-bg);
    border: 1px solid var(--border);
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--chart-text-secondary);
    flex-shrink: 0;
  }

  .feature strong {
    display: block;
    font-size: 0.9375rem;
    margin-bottom: 0.125rem;
  }

  .feature p {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--chart-text-secondary);
    line-height: 1.5;
    max-width: 420px;
  }

  .section {
    margin-bottom: 3rem;
  }

  .section-title {
    margin: 0 0 0.25rem;
    font-size: 1.125rem;
    font-weight: 700;
  }

  .section-desc {
    margin: 0 0 1.25rem;
    font-size: 0.875rem;
    color: var(--chart-text-secondary);
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
    padding: 1rem;
    background: var(--chart-bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    text-decoration: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    opacity: 0.55;
  }

  .card.ready {
    opacity: 1;
  }

  .card:hover {
    border-color: var(--chart-axis);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .card h3 {
    margin: 0 0 0.25rem;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .card p {
    margin: 0;
    font-size: 0.75rem;
    color: var(--chart-text-secondary);
    line-height: 1.4;
  }

  .card code {
    font-size: 0.6875rem;
    background: var(--surface);
    padding: 0.1em 0.3em;
    border-radius: 3px;
  }

  .system-card {
    opacity: 1;
    padding: 1.25rem;
  }

  .system-card h3 {
    font-size: 0.9375rem;
  }

  .system-card p {
    font-size: 0.8125rem;
  }

  .palette-preview {
    display: flex;
    gap: 3px;
    margin-top: 0.75rem;
  }

  .palette-preview span {
    width: 20px;
    height: 20px;
    border-radius: 3px;
  }

  .code-block {
    background: var(--chart-bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1.25rem;
    overflow-x: auto;
  }

  .code-block pre {
    margin: 0;
  }

  .code-block code {
    font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, monospace;
    font-size: 0.8125rem;
    line-height: 1.6;
    color: var(--chart-text);
  }

  .code-note {
    margin: 0.75rem 0 0;
    font-size: 0.8125rem;
    color: var(--chart-text-secondary);
    line-height: 1.5;
    max-width: 580px;
  }

  .tech-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tech {
    display: inline-block;
    padding: 0.375rem 0.75rem;
    background: var(--chart-bg);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 0.8125rem;
    font-weight: 500;
  }
</style>
