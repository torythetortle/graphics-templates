<script lang="ts">
  import { SankeyDiagram } from '@graphics-templates/svelte';

  const energyFlowData = [
    { source: 'Coal',        target: 'Electricity', value: 820 },
    { source: 'Natural Gas', target: 'Electricity', value: 1600 },
    { source: 'Nuclear',     target: 'Electricity', value: 778 },
    { source: 'Renewables',  target: 'Electricity', value: 940 },
    { source: 'Natural Gas', target: 'Heat',        value: 540 },
    { source: 'Coal',        target: 'Heat',        value: 120 },
    { source: 'Natural Gas', target: 'Transport',   value: 280 },
    { source: 'Renewables',  target: 'Transport',   value: 60 },
  ];

  const budgetFlowData = [
    { source: 'Individual Taxes',  target: 'Mandatory Spending', value: 2200 },
    { source: 'Individual Taxes',  target: 'Discretionary',      value: 900 },
    { source: 'Payroll Taxes',     target: 'Mandatory Spending', value: 1200 },
    { source: 'Corporate Taxes',   target: 'Discretionary',      value: 420 },
    { source: 'Corporate Taxes',   target: 'Net Interest',       value: 180 },
    { source: 'Other Revenue',     target: 'Net Interest',       value: 300 },
    { source: 'Borrowing',         target: 'Mandatory Spending', value: 600 },
    { source: 'Borrowing',         target: 'Discretionary',      value: 400 },
  ];
</script>

<svelte:head>
  <title>Sankey Diagram | Graphics Templates</title>
</svelte:head>

<h1>Sankey Diagram</h1>
<p class="desc">
  Flow diagram showing how quantities move between sources and targets. The width
  of each flow is proportional to its value. Ideal for energy systems, budget flows,
  supply chains, and migration data.
</p>

<section class="demo">
  <h2>Energy Flow by Source and End Use</h2>
  <SankeyDiagram
    data={energyFlowData}
    title="US energy flow by source and end use"
    subtitle="Approximate proportions, in terawatt-hours"
    sourceLabel="Source: US Energy Information Administration"
  />
</section>

<section class="demo">
  <h2>Federal Budget: Revenue to Spending</h2>
  <SankeyDiagram
    data={budgetFlowData}
    title="Federal budget flow: revenue sources to spending categories"
    subtitle="Fiscal year 2023, in billions"
    sourceLabel="Source: Congressional Budget Office"
    palette="finance"
  />
</section>

<style>
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; }
  h2 { margin: 0 0 0.75rem; font-size: 1.125rem; font-weight: 600; }
  .desc { color: var(--chart-text-secondary); margin: 0 0 2rem; line-height: 1.6; max-width: 600px; }
  .demo { margin-bottom: 3rem; }
</style>
