<script lang="ts">
  import { SlopeChart } from '@graphics-templates/svelte';

  const lifeExpectancyData = [
    { label: 'Japan', start: 81.1, end: 84.3 },
    { label: 'Germany', start: 78.2, end: 81.1 },
    { label: 'United States', start: 76.7, end: 77.5 },
    { label: 'Brazil', start: 70.5, end: 75.1 },
    { label: 'India', start: 62.5, end: 70.8 },
    { label: 'Nigeria', start: 46.8, end: 54.7 },
  ];

  const educationData = [
    { label: 'South Korea', start: 88, end: 98 },
    { label: 'United States', start: 93, end: 96 },
    { label: 'Germany', start: 91, end: 95 },
    { label: 'China', start: 82, end: 97 },
    { label: 'Brazil', start: 72, end: 84 },
    { label: 'India', start: 61, end: 76 },
  ];
</script>

<svelte:head>
  <title>Slope Chart | Graphics Templates</title>
</svelte:head>

<h1>Slope Chart</h1>
<p class="desc">
  Compares values for multiple entities across exactly two time points or conditions.
  The slope of each line conveys the direction and magnitude of change, making it
  easy to spot which entities improved, declined, or stayed the same.
</p>

<section class="demo">
  <h2>Life Expectancy: 2000 vs. 2023</h2>
  <SlopeChart
    data={lifeExpectancyData}
    title="Life expectancy at birth, selected countries"
    subtitle="Years"
    sourceLabel="Source: World Health Organization"
    startLabel="2000"
    endLabel="2023"
    highlightLabel="United States"
  />
</section>

<section class="demo">
  <h2>Secondary School Enrollment: 2000 vs. 2023</h2>
  <SlopeChart
    data={educationData}
    title="Secondary school enrollment rate, selected countries"
    subtitle="Gross enrollment ratio (%)"
    sourceLabel="Source: World Bank"
    startLabel="2000"
    endLabel="2023"
  />
</section>

<style>
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; }
  h2 { margin: 0 0 0.75rem; font-size: 1.125rem; font-weight: 600; }
  .desc { color: var(--chart-text-secondary); margin: 0 0 2rem; line-height: 1.6; max-width: 600px; }
  .demo { margin-bottom: 3rem; }
</style>
