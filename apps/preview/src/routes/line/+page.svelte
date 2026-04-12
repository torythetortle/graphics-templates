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
  and full keyboard navigation.
</p>

<section class="demo">
  <h2>Unemployment Rate, US vs EU</h2>
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
  <h2>Single Series</h2>
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

<style>
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; }
  h2 { margin: 0 0 0.75rem; font-size: 1.125rem; font-weight: 600; }
  .desc { color: var(--chart-text-secondary); margin: 0 0 2rem; line-height: 1.5; max-width: 600px; }
  .demo { margin-bottom: 3rem; }
</style>
