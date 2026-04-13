<script lang="ts">
  import { WaffleChart } from '@graphics-templates/svelte';

  const budgetTotal = 1354 + 1178 + 858 + 659 + 951;
  const budgetData = [
    { label: 'Social Security', value: 1354, total: budgetTotal },
    { label: 'Healthcare', value: 1178, total: budgetTotal },
    { label: 'Defense', value: 858, total: budgetTotal },
    { label: 'Interest', value: 659, total: budgetTotal },
    { label: 'Other', value: 951, total: budgetTotal },
  ];

  const energyTotal = 100;
  const energyData = [
    { label: 'Renewables', value: 22, total: energyTotal },
    { label: 'Nuclear', value: 18, total: energyTotal },
    { label: 'Natural Gas', value: 33, total: energyTotal },
    { label: 'Coal', value: 17, total: energyTotal },
    { label: 'Petroleum & Other', value: 10, total: energyTotal },
  ];
</script>

<svelte:head>
  <title>Waffle Chart | Graphics Templates</title>
</svelte:head>

<h1>Waffle Chart</h1>
<p class="desc">
  Part-to-whole visualization using a grid of cells. Each cell represents an equal
  share of the total. A more literal and engaging alternative to a pie chart for
  showing proportions at a glance.
</p>

<section class="demo">
  <h2>Federal Budget Breakdown</h2>
  <WaffleChart
    data={budgetData}
    title="US federal spending by category"
    subtitle="Fiscal year 2023, in billions"
    sourceLabel="Source: Congressional Budget Office"
    gridSize={10}
    showLabels={true}
  />
</section>

<section class="demo">
  <h2>Electricity Generation Mix</h2>
  <WaffleChart
    data={energyData}
    title="US electricity generation by source"
    subtitle="Share of total generation, 2023"
    sourceLabel="Source: US Energy Information Administration"
    gridSize={10}
    showLabels={true}
    palette="oranges"
  />
</section>

<style>
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; }
  h2 { margin: 0 0 0.75rem; font-size: 1.125rem; font-weight: 600; }
  .desc { color: var(--chart-text-secondary); margin: 0 0 2rem; line-height: 1.6; max-width: 600px; }
  .demo { margin-bottom: 3rem; }
</style>
