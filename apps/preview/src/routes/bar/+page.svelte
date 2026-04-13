<script lang="ts">
  import { BarChart } from '@graphics-templates/svelte';
  import rawData from '$lib/sample-data/categorical.json';

  const data = rawData.map((d) => ({
    label: d.label,
    value: d.value,
    group: d.group,
  }));
</script>

<svelte:head>
  <title>Bar Chart | Graphics Templates</title>
</svelte:head>

<h1>Bar Chart</h1>
<p class="desc">
  Vertical and horizontal bars with grouping, sorting, value labels, and auto-flip
  to horizontal on mobile. The second most common chart type in newsroom work.
</p>

<section class="demo">
  <h2>Sorted with Value Labels</h2>
  <BarChart
    {data}
    title="Most populous US states"
    subtitle="2020 Census, in thousands"
    sourceLabel="Source: US Census Bureau"
    sortBy="value"
    showValueLabels={true}
    yLabel="Population (thousands)"
  />
</section>

<section class="demo">
  <h2>Horizontal Orientation</h2>
  <BarChart
    {data}
    title="Most populous US states"
    orientation="horizontal"
    sortBy="value"
    showValueLabels={true}
  />
</section>

<section class="demo">
  <h2>Grouped by Region</h2>
  <BarChart
    {data}
    title="Population by state and region"
    sortBy="value"
  />
</section>

<section class="api">
  <h2>Usage</h2>
  <div class="code-block">
    <pre><code>&lt;BarChart
  data=&#123;data&#125;
  title="Most populous US states"
  sortBy="value"
  showValueLabels=&#123;true&#125;
  orientation="horizontal"
/&gt;</code></pre>
  </div>
</section>

<section class="api">
  <h2>Props</h2>
  <div class="props-table">
    <div class="prop-row header"><span>Prop</span><span>Type</span><span>Default</span></div>
    <div class="prop-row"><code>data</code><span>CategoricalRow[]</span><span class="req">required</span></div>
    <div class="prop-row"><code>title</code><span>string</span><span class="req">required</span></div>
    <div class="prop-row"><code>orientation</code><span>'vertical' | 'horizontal'</span><span>'vertical' (auto 'horizontal' on mobile)</span></div>
    <div class="prop-row"><code>sortBy</code><span>'value' | 'label' | 'none'</span><span>'none'</span></div>
    <div class="prop-row"><code>showValueLabels</code><span>boolean</span><span>false</span></div>
    <div class="prop-row"><code>palette</code><span>PaletteName | string[]</span><span>'newsroom'</span></div>
    <div class="prop-row"><code>colorMode</code><span>'default' | 'colorblind' | 'print' | 'highcontrast'</span><span>auto-detect</span></div>
    <div class="prop-row"><code>showGrid</code><span>boolean</span><span>true</span></div>
    <div class="prop-row"><code>showTable</code><span>boolean</span><span>true</span></div>
    <div class="prop-row"><code>labelKey / valueKey / groupKey</code><span>string</span><span>'label' / 'value' / 'group'</span></div>
  </div>
</section>

<section class="api">
  <h2>Data Shape</h2>
  <div class="code-block">
    <pre><code>interface CategoricalRow &#123;
  label: string;
  value: number;
  group?: string;  // enables grouped coloring + legend
&#125;</code></pre>
  </div>
</section>

<section class="api">
  <h2>Accessibility</h2>
  <ul class="a11y-list">
    <li>Each bar is a focusable element with an ARIA label ("California: 39,538")</li>
    <li>Arrow keys navigate between bars, values announced to screen reader</li>
    <li>Auto-generated description with highest/lowest values</li>
    <li>Auto-flips to horizontal on mobile for readability</li>
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
  .prop-row { display: grid; grid-template-columns: 180px 1fr 120px; padding: 0.5rem 1rem; font-size: 0.8125rem; border-bottom: 1px solid var(--border); align-items: baseline; }
  .prop-row:last-child { border-bottom: none; }
  .prop-row.header { background: var(--surface); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--chart-text-secondary); }
  .prop-row code { font-family: 'SF Mono', Menlo, monospace; font-size: 0.8125rem; background: none; padding: 0; }
  .prop-row span { color: var(--chart-text-secondary); font-size: 0.75rem; }
  .req { color: #c73a27 !important; font-weight: 600; font-size: 0.6875rem !important; text-transform: uppercase; }
  .a11y-list { padding-left: 1.25rem; font-size: 0.875rem; line-height: 1.8; }
  .a11y-list code { font-size: 0.8em; background: var(--surface); padding: 0.1em 0.3em; border-radius: 3px; }
</style>
