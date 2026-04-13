<script lang="ts">
  import { ScatterPlot } from '@graphics-templates/svelte';
  import rawData from '$lib/sample-data/scatter.json';

  const data = rawData.map((d) => ({
    x: d.x,
    y: d.y,
    label: d.label,
    group: d.group,
    size: d.size,
  }));
</script>

<svelte:head>
  <title>Scatter Plot | Graphics Templates</title>
</svelte:head>

<h1>Scatter Plot</h1>
<p class="desc">
  Two-variable correlation with optional size encoding (bubble mode), group coloring,
  and point labels. Keyboard navigable with screen reader announcements.
</p>

<section class="demo">
  <h2>Bubble Chart — Size Encoding</h2>
  <ScatterPlot
    {data}
    title="Life expectancy vs. GDP per capita"
    subtitle="Selected countries, 2023"
    sourceLabel="Source: World Bank"
    xLabel="Life expectancy (years)"
    yLabel="GDP per capita (USD)"
    sizeKey="size"
    sizeRange={[4, 24]}
    showLabels={true}
  />
</section>

<section class="demo">
  <h2>Fixed Radius</h2>
  <ScatterPlot
    {data}
    title="Life expectancy vs. GDP"
    xLabel="Life expectancy"
    yLabel="GDP per capita"
    radius={6}
  />
</section>

<section class="api">
  <h2>Usage</h2>
  <div class="code-block">
    <pre><code>&lt;ScatterPlot
  data=&#123;data&#125;
  title="Life expectancy vs. GDP per capita"
  xLabel="Life expectancy (years)"
  yLabel="GDP per capita (USD)"
  sizeKey="size"
  showLabels=&#123;true&#125;
/&gt;</code></pre>
  </div>
</section>

<section class="api">
  <h2>Props</h2>
  <div class="props-table">
    <div class="prop-row header"><span>Prop</span><span>Type</span><span>Default</span></div>
    <div class="prop-row"><code>data</code><span>ScatterRow[]</span><span class="req">required</span></div>
    <div class="prop-row"><code>title</code><span>string</span><span class="req">required</span></div>
    <div class="prop-row"><code>xLabel / yLabel</code><span>string</span><span>—</span></div>
    <div class="prop-row"><code>sizeKey</code><span>string</span><span>— (fixed radius mode)</span></div>
    <div class="prop-row"><code>sizeRange</code><span>[number, number]</span><span>[3, 20]</span></div>
    <div class="prop-row"><code>radius</code><span>number</span><span>5 (when no sizeKey)</span></div>
    <div class="prop-row"><code>showLabels</code><span>boolean</span><span>false</span></div>
    <div class="prop-row"><code>groupKey</code><span>string</span><span>'group'</span></div>
    <div class="prop-row"><code>palette</code><span>PaletteName | string[]</span><span>'newsroom'</span></div>
    <div class="prop-row"><code>colorMode</code><span>'default' | 'colorblind' | 'print' | 'highcontrast'</span><span>auto-detect</span></div>
    <div class="prop-row"><code>showGrid</code><span>boolean</span><span>true</span></div>
    <div class="prop-row"><code>showTable</code><span>boolean</span><span>true</span></div>
  </div>
</section>

<section class="api">
  <h2>Data Shape</h2>
  <div class="code-block">
    <pre><code>interface ScatterRow &#123;
  x: number;
  y: number;
  label?: string;   // point label text
  size?: number;    // drives radius via sizeKey
  group?: string;   // color grouping
&#125;</code></pre>
  </div>
</section>

<section class="api">
  <h2>Accessibility</h2>
  <ul class="a11y-list">
    <li>Each point is focusable with ARIA label ("Mexico: Life expectancy 67.2, GDP $38,200")</li>
    <li>Arrow keys navigate between points, values announced on focus</li>
    <li>Auto-generated description with X/Y ranges and point count</li>
    <li>Square aspect ratio by default for visual accuracy</li>
  </ul>
</section>

<style>
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; }
  h2 { margin: 0 0 0.75rem; font-size: 1.125rem; font-weight: 600; }
  .desc { color: var(--chart-text-secondary); margin: 0 0 2rem; line-height: 1.6; max-width: 600px; }
  .demo { margin-bottom: 3rem; }
  .api { margin-bottom: 2.5rem; max-width: 640px; }
  .code-block { background: var(--chart-bg); border: 1px solid var(--border); border-radius: 6px; padding: 1rem 1.25rem; overflow-x: auto; }
  .code-block pre { margin: 0; }
  .code-block code { font-family: 'SF Mono', 'Fira Code', Menlo, monospace; font-size: 0.8125rem; line-height: 1.6; }
  .props-table { border: 1px solid var(--border); border-radius: 6px; overflow: hidden; }
  .prop-row { display: grid; grid-template-columns: 140px 1fr 120px; padding: 0.5rem 1rem; font-size: 0.8125rem; border-bottom: 1px solid var(--border); align-items: baseline; }
  .prop-row:last-child { border-bottom: none; }
  .prop-row.header { background: var(--surface); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--chart-text-secondary); }
  .prop-row code { font-family: 'SF Mono', Menlo, monospace; font-size: 0.8125rem; background: none; padding: 0; }
  .prop-row span { color: var(--chart-text-secondary); font-size: 0.75rem; }
  .req { color: #c73a27 !important; font-weight: 600; font-size: 0.6875rem !important; text-transform: uppercase; }
  .a11y-list { padding-left: 1.25rem; font-size: 0.875rem; line-height: 1.8; }
</style>
