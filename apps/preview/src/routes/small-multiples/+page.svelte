<script lang="ts">
  import { SmallMultiples, LineChart } from '@graphics-templates/svelte';
  import rawData from '$lib/sample-data/timeseries.json';

  const allSeries = [...new Set(rawData.map((d) => d.series))];

  const items = allSeries.map((s) => ({ key: s, label: s }));

  function seriesData(key: string) {
    return rawData.filter((d) => d.series === key);
  }
</script>

<svelte:head>
  <title>Small Multiples | Graphics Templates</title>
</svelte:head>

<h1>Small Multiples</h1>
<p class="desc">
  A grid of identical charts each showing a different slice of the data — one panel
  per series, region, or category. Enables direct comparison without overplotting.
  Uses a shared snippet to render each panel consistently.
</p>

<section class="demo">
  <h2>Unemployment Rate by Region</h2>
  <SmallMultiples
    {items}
    columns={2}
    title="Unemployment rate, 2020–2024"
    subtitle="Quarterly, seasonally adjusted"
    sourceLabel="Source: Bureau of Labor Statistics, Eurostat"
  >
    {#snippet children(item)}
      <LineChart
        data={seriesData(item.key)}
        title={item.label}
        yLabel="Rate (%)"
        showLegend={false}
        showTable={false}
        curve="monotone"
      />
    {/snippet}
  </SmallMultiples>
</section>

<section class="demo">
  <h2>Three-Column Grid</h2>
  <SmallMultiples
    {items}
    columns={3}
    title="Unemployment rate — compact view"
    sourceLabel="Source: Bureau of Labor Statistics, Eurostat"
  >
    {#snippet children(item)}
      <LineChart
        data={seriesData(item.key)}
        title={item.label}
        showLegend={false}
        showTable={false}
        showGrid={false}
        curve="monotone"
      />
    {/snippet}
  </SmallMultiples>
</section>

<style>
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; }
  h2 { margin: 0 0 0.75rem; font-size: 1.125rem; font-weight: 600; }
  .desc { color: var(--chart-text-secondary); margin: 0 0 2rem; line-height: 1.6; max-width: 600px; }
  .demo { margin-bottom: 3rem; }
</style>
