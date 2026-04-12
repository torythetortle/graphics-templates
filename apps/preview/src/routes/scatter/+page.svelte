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
  Two-variable correlation with optional size encoding, group coloring,
  and point labels. Keyboard navigable.
</p>

<section class="demo">
  <h2>Life Expectancy vs. GDP per Capita</h2>
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
  <h2>Fixed Radius, No Labels</h2>
  <ScatterPlot
    {data}
    title="Life expectancy vs. GDP"
    xLabel="Life expectancy"
    yLabel="GDP per capita"
    radius={6}
  />
</section>

<style>
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; }
  h2 { margin: 0 0 0.75rem; font-size: 1.125rem; font-weight: 600; }
  .desc { color: var(--chart-text-secondary); margin: 0 0 2rem; line-height: 1.5; max-width: 600px; }
  .demo { margin-bottom: 3rem; }
</style>
