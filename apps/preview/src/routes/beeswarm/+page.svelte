<script lang="ts">
  import { Beeswarm } from '@graphics-templates/svelte';

  const incomeData = [
    { label: 'Maryland', value: 94388, group: 'Northeast' },
    { label: 'New Jersey', value: 92262, group: 'Northeast' },
    { label: 'Massachusetts', value: 89645, group: 'Northeast' },
    { label: 'Connecticut', value: 83771, group: 'Northeast' },
    { label: 'New Hampshire', value: 80988, group: 'Northeast' },
    { label: 'Washington', value: 82400, group: 'West' },
    { label: 'California', value: 84097, group: 'West' },
    { label: 'Colorado', value: 80184, group: 'West' },
    { label: 'Utah', value: 79133, group: 'West' },
    { label: 'Oregon', value: 72585, group: 'West' },
    { label: 'Minnesota', value: 80441, group: 'Midwest' },
    { label: 'Wisconsin', value: 65897, group: 'Midwest' },
    { label: 'Illinois', value: 72563, group: 'Midwest' },
    { label: 'Michigan', value: 63202, group: 'Midwest' },
    { label: 'Ohio', value: 62689, group: 'Midwest' },
    { label: 'Virginia', value: 80963, group: 'South' },
    { label: 'Georgia', value: 64122, group: 'South' },
    { label: 'Texas', value: 66963, group: 'South' },
    { label: 'Florida', value: 61777, group: 'South' },
    { label: 'Mississippi', value: 49111, group: 'South' },
  ];
</script>

<svelte:head>
  <title>Beeswarm | Graphics Templates</title>
</svelte:head>

<h1>Beeswarm</h1>
<p class="desc">
  Force-simulation dot plot for showing distributions along a single axis. Each dot
  represents one entity; dots spread vertically to avoid overlap. Useful for comparing
  distributions across categories without obscuring individual data points.
</p>

<section class="demo">
  <h2>Median Household Income by State</h2>
  <Beeswarm
    data={incomeData}
    title="Median household income, selected US states"
    subtitle="2022 American Community Survey"
    sourceLabel="Source: US Census Bureau"
    xLabel="Median household income (USD)"
    radius={7}
  />
</section>

<section class="demo">
  <h2>Grouped by Region</h2>
  <Beeswarm
    data={incomeData}
    title="Household income by census region"
    subtitle="2022 American Community Survey"
    sourceLabel="Source: US Census Bureau"
    xLabel="Median household income (USD)"
    groupKey="group"
    radius={7}
  />
</section>

<style>
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; }
  h2 { margin: 0 0 0.75rem; font-size: 1.125rem; font-weight: 600; }
  .desc { color: var(--chart-text-secondary); margin: 0 0 2rem; line-height: 1.6; max-width: 600px; }
  .demo { margin-bottom: 3rem; }
</style>
