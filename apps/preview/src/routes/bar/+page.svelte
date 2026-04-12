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
  Vertical and horizontal bars with grouping, sorting, value labels,
  and auto-flip to horizontal on mobile.
</p>

<section class="demo">
  <h2>Top 10 US States by Population</h2>
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
  <h2>Horizontal Bars</h2>
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

<style>
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; }
  h2 { margin: 0 0 0.75rem; font-size: 1.125rem; font-weight: 600; }
  .desc { color: var(--chart-text-secondary); margin: 0 0 2rem; line-height: 1.5; max-width: 600px; }
  .demo { margin-bottom: 3rem; }
</style>
