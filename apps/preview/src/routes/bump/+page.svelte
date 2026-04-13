<script lang="ts">
  import { BumpChart } from '@graphics-templates/svelte';

  const marketCapData = [
    {
      label: 'Apple',
      values: [
        { period: '2019', rank: 1 },
        { period: '2020', rank: 1 },
        { period: '2021', rank: 1 },
        { period: '2022', rank: 1 },
        { period: '2023', rank: 1 },
      ],
    },
    {
      label: 'Microsoft',
      values: [
        { period: '2019', rank: 3 },
        { period: '2020', rank: 2 },
        { period: '2021', rank: 2 },
        { period: '2022', rank: 2 },
        { period: '2023', rank: 2 },
      ],
    },
    {
      label: 'Amazon',
      values: [
        { period: '2019', rank: 2 },
        { period: '2020', rank: 3 },
        { period: '2021', rank: 3 },
        { period: '2022', rank: 4 },
        { period: '2023', rank: 4 },
      ],
    },
    {
      label: 'Alphabet',
      values: [
        { period: '2019', rank: 4 },
        { period: '2020', rank: 4 },
        { period: '2021', rank: 4 },
        { period: '2022', rank: 3 },
        { period: '2023', rank: 3 },
      ],
    },
    {
      label: 'Meta',
      values: [
        { period: '2019', rank: 5 },
        { period: '2020', rank: 5 },
        { period: '2021', rank: 5 },
        { period: '2022', rank: 5 },
        { period: '2023', rank: 5 },
      ],
    },
  ];
</script>

<svelte:head>
  <title>Bump Chart | Graphics Templates</title>
</svelte:head>

<h1>Bump Chart</h1>
<p class="desc">
  Shows how rankings change over time across multiple entities. Each line represents
  one entity, and the vertical position encodes rank. Crossings reveal shifts in
  relative standing — useful for league tables, competitive rankings, and trend stories.
</p>

<section class="demo">
  <h2>Tech Company Market Cap Rankings, 2019–2023</h2>
  <BumpChart
    data={marketCapData}
    title="Largest US tech companies by market capitalization"
    subtitle="Year-end ranking, 2019–2023"
    sourceLabel="Source: CompaniesMarketCap"
    showLegend={true}
    highlightLabel="Alphabet"
  />
</section>

<style>
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; }
  h2 { margin: 0 0 0.75rem; font-size: 1.125rem; font-weight: 600; }
  .desc { color: var(--chart-text-secondary); margin: 0 0 2rem; line-height: 1.6; max-width: 600px; }
  .demo { margin-bottom: 3rem; }
</style>
