<script lang="ts">
  import { BubbleMap } from '@graphics-templates/svelte';
  import cityData from '$lib/sample-data/us-cities.json';
  import type { Topology } from 'topojson-specification';

  let topology: Topology | null = $state(null);

  async function loadTopo() {
    const res = await fetch('/geo/us-states-10m.json');
    topology = await res.json();
  }

  $effect(() => { loadTopo(); });
</script>

<svelte:head>
  <title>Bubble Map | Graphics Templates</title>
</svelte:head>

<h1>Bubble Map</h1>
<p class="desc">
  Proportional circles on a geographic base map. Size encodes magnitude,
  largest circles drawn first so small ones remain visible.
</p>

{#if topology}
  <section class="demo">
    <h2>US City Population</h2>
    <BubbleMap
      data={cityData}
      {topology}
      topologyObject="states"
      title="Largest US Cities by Population"
      subtitle="2020 Census"
      sourceLabel="Source: US Census Bureau"
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
