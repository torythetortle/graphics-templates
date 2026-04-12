<script lang="ts">
  import { Choropleth } from '@graphics-templates/svelte';
  import stateData from '$lib/sample-data/us-states.json';
  import type { Topology } from 'topojson-specification';

  let topology: Topology | null = $state(null);

  async function loadTopo() {
    const res = await fetch('/geo/us-states-10m.json');
    topology = await res.json();
  }

  $effect(() => { loadTopo(); });
</script>

<svelte:head>
  <title>Choropleth | Graphics Templates</title>
</svelte:head>

<h1>Choropleth</h1>
<p class="desc">
  Color-filled geographic areas with sequential or diverging scales.
  US states, counties, or world countries. Hover for tooltips, keyboard navigable.
</p>

{#if topology}
  <section class="demo">
    <h2>US State Population</h2>
    <Choropleth
      data={stateData}
      {topology}
      topologyObject="states"
      title="US Population by State"
      subtitle="2020 Census"
      sourceLabel="Source: US Census Bureau"
      palette="blues"
      projection="albersUsa"
    />
  </section>

  <section class="demo">
    <h2>Red Color Scheme</h2>
    <Choropleth
      data={stateData}
      {topology}
      topologyObject="states"
      title="US Population by State"
      palette="reds"
      projection="albersUsa"
    />
  </section>
{:else}
  <p>Loading map data...</p>
{/if}

<style>
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; }
  h2 { margin: 0 0 0.75rem; font-size: 1.125rem; font-weight: 600; }
  .desc { color: var(--chart-text-secondary); margin: 0 0 2rem; line-height: 1.5; max-width: 600px; }
  .demo { margin-bottom: 3rem; }
</style>
