<script lang="ts">
  import { LineChart } from '@graphics-templates/svelte';
  import rawData from '$lib/sample-data/timeseries.json';

  const data = rawData.map((d) => ({ ...d, date: d.date, value: d.value, series: d.series }));
</script>

<svelte:head>
  <title>Line Chart | Graphics Templates</title>
</svelte:head>

<h1>Line Chart</h1>
<p class="desc">
  Multi-series time series with annotations, dash patterns for print/colorblind support,
  and full keyboard navigation. The most commonly used chart type in newsroom graphics.
</p>

<section class="demo">
  <h2>Multi-Series with Annotation</h2>
  <LineChart
    {data}
    title="Unemployment rate, 2020–2024"
    subtitle="Quarterly, seasonally adjusted"
    sourceLabel="Source: Bureau of Labor Statistics, Eurostat"
    xLabel="Date"
    yLabel="Rate (%)"
    curve="monotone"
    annotations={[
      { date: '2020-04-01', label: 'COVID peak', side: 'right' },
    ]}
  />
</section>

<section class="demo">
  <h2>Single Series with Data Points</h2>
  <LineChart
    data={data.filter((d) => d.series === 'US')}
    title="US unemployment rate"
    subtitle="2020–2024"
    sourceLabel="Bureau of Labor Statistics"
    showPoints={true}
    palette="blues"
    curve="linear"
  />
</section>

<section class="demo">
  <h2>Colorblind-Safe Mode</h2>
  <LineChart
    {data}
    title="Unemployment rate (colorblind palette)"
    colorMode="colorblind"
    curve="monotone"
  />
</section>

<section class="api">
  <h2>Usage</h2>
  <div class="code-block">
    <pre><code>&lt;script&gt;
  import &#123; LineChart &#125; from '@graphics-templates/svelte';
&lt;/script&gt;

&lt;LineChart
  data=&#123;data&#125;
  title="Unemployment rate"
  subtitle="2020–2024"
  sourceLabel="Bureau of Labor Statistics"
  curve="monotone"
  annotations=&#123;[&#123; date: '2020-04-01', label: 'COVID peak' &#125;]&#125;
/&gt;</code></pre>
  </div>
</section>

<section class="api">
  <h2>Props</h2>
  <div class="props-table">
    <div class="prop-row header">
      <span>Prop</span><span>Type</span><span>Default</span>
    </div>
    <div class="prop-row">
      <code>data</code><span>TimeSeriesRow[]</span><span class="req">required</span>
    </div>
    <div class="prop-row">
      <code>title</code><span>string</span><span class="req">required</span>
    </div>
    <div class="prop-row">
      <code>subtitle</code><span>string</span><span>—</span>
    </div>
    <div class="prop-row">
      <code>sourceLabel</code><span>string</span><span>—</span>
    </div>
    <div class="prop-row">
      <code>curve</code><span>'linear' | 'monotone' | 'step' | 'basis'</span><span>'monotone'</span>
    </div>
    <div class="prop-row">
      <code>palette</code><span>PaletteName | string[]</span><span>'newsroom'</span>
    </div>
    <div class="prop-row">
      <code>colorMode</code><span>'default' | 'colorblind' | 'print' | 'highcontrast'</span><span>auto-detect</span>
    </div>
    <div class="prop-row">
      <code>showPoints</code><span>boolean</span><span>false</span>
    </div>
    <div class="prop-row">
      <code>showGrid</code><span>boolean</span><span>true</span>
    </div>
    <div class="prop-row">
      <code>showLegend</code><span>boolean</span><span>auto (true if multi-series)</span>
    </div>
    <div class="prop-row">
      <code>showTable</code><span>boolean</span><span>true</span>
    </div>
    <div class="prop-row">
      <code>annotations</code><span>Annotation[]</span><span>[]</span>
    </div>
    <div class="prop-row">
      <code>animated</code><span>boolean</span><span>auto (respects prefers-reduced-motion)</span>
    </div>
    <div class="prop-row">
      <code>xKey / yKey</code><span>string</span><span>'date' / 'value'</span>
    </div>
    <div class="prop-row">
      <code>seriesKey</code><span>string</span><span>'series'</span>
    </div>
  </div>
</section>

<section class="api">
  <h2>Data Shape</h2>
  <div class="code-block">
    <pre><code>interface TimeSeriesRow &#123;
  date: Date | string;   // ISO string or Date object
  value: number;
  series?: string;       // for multi-series grouping
&#125;</code></pre>
  </div>
</section>

<section class="api">
  <h2>Accessibility</h2>
  <ul class="a11y-list">
    <li>Auto-generated SVG description with data range, trend, and point count</li>
    <li>Visually-hidden data table with "Skip to table" link</li>
    <li>Keyboard navigation: arrow keys to move between data points</li>
    <li>Each series gets a unique dash pattern for print / colorblind safety</li>
    <li>Animations disabled when <code>prefers-reduced-motion</code> is set</li>
  </ul>
</section>

<style>
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; }
  h2 { margin: 0 0 0.75rem; font-size: 1.125rem; font-weight: 600; }
  .desc { color: var(--chart-text-secondary); margin: 0 0 2rem; line-height: 1.6; max-width: 600px; }
  .demo { margin-bottom: 3rem; }
  .api { margin-bottom: 2.5rem; max-width: 640px; }

  .code-block {
    background: var(--chart-bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1rem 1.25rem;
    overflow-x: auto;
  }

  .code-block pre { margin: 0; }

  .code-block code {
    font-family: 'SF Mono', 'Fira Code', Menlo, monospace;
    font-size: 0.8125rem;
    line-height: 1.6;
  }

  .props-table {
    border: 1px solid var(--border);
    border-radius: 6px;
    overflow: hidden;
  }

  .prop-row {
    display: grid;
    grid-template-columns: 140px 1fr 120px;
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
    border-bottom: 1px solid var(--border);
    align-items: baseline;
  }

  .prop-row:last-child { border-bottom: none; }

  .prop-row.header {
    background: var(--surface);
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--chart-text-secondary);
  }

  .prop-row code {
    font-family: 'SF Mono', Menlo, monospace;
    font-size: 0.8125rem;
    background: none;
    padding: 0;
  }

  .prop-row span {
    color: var(--chart-text-secondary);
    font-size: 0.75rem;
  }

  .req {
    color: #c73a27 !important;
    font-weight: 600;
    font-size: 0.6875rem !important;
    text-transform: uppercase;
  }

  .a11y-list {
    padding-left: 1.25rem;
    font-size: 0.875rem;
    line-height: 1.8;
  }

  .a11y-list code {
    font-size: 0.8em;
    background: var(--surface);
    padding: 0.1em 0.3em;
    border-radius: 3px;
  }
</style>
