<script lang="ts">
  import { AreaChart } from '@graphics-templates/svelte';
  import rawData from '$lib/sample-data/timeseries.json';

  const data = rawData.map((d) => ({ ...d, date: d.date, value: d.value, series: d.series }));
  const singleSeries = data.filter((d) => d.series === 'US');
</script>

<svelte:head>
  <title>Area Chart | Graphics Templates</title>
</svelte:head>

<h1>Area Chart</h1>
<p class="desc">
  Filled area charts for time series data. Supports single-series, multi-series, and
  stacked modes with optional gradient fills and colorblind-safe palettes.
</p>

<section class="demo">
  <h2>Single Series</h2>
  <AreaChart
    data={singleSeries}
    title="US unemployment rate, 2020–2024"
    subtitle="Quarterly, seasonally adjusted"
    sourceLabel="Source: Bureau of Labor Statistics"
    xLabel="Date"
    yLabel="Rate (%)"
    curve="monotone"
  />
</section>

<section class="demo">
  <h2>Multi-Series</h2>
  <AreaChart
    {data}
    title="Unemployment rate by region, 2020–2024"
    subtitle="Quarterly, seasonally adjusted"
    sourceLabel="Source: Bureau of Labor Statistics, Eurostat"
    xLabel="Date"
    yLabel="Rate (%)"
    curve="monotone"
  />
</section>

<section class="demo">
  <h2>Stacked Areas</h2>
  <AreaChart
    {data}
    title="Stacked unemployment rate, 2020–2024"
    subtitle="US and EU combined"
    sourceLabel="Source: Bureau of Labor Statistics, Eurostat"
    stacked={true}
    curve="monotone"
  />
</section>

<style>
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; }
  h2 { margin: 0 0 0.75rem; font-size: 1.125rem; font-weight: 600; }
  .desc { color: var(--chart-text-secondary); margin: 0 0 2rem; line-height: 1.6; max-width: 600px; }
  .demo { margin-bottom: 3rem; }
</style>
