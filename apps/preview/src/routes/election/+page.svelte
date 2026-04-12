<script lang="ts">
  import { ElectionResults, VoteMargin } from '@graphics-templates/svelte';
  import electionData from '$lib/sample-data/election-2024.json';
</script>

<svelte:head>
  <title>Election Results | Graphics Templates</title>
</svelte:head>

<h1>Election Results</h1>
<p class="desc">
  Candidate results table with party colors, vote margin bars,
  and historical comparison. Keyboard navigable, screen-reader friendly.
</p>

<section class="demo">
  <h2>Presidential Race</h2>
  <ElectionResults
    data={electionData.presidential}
    title="2024 Presidential Election"
    subtitle="National popular vote"
    sourceLabel="Source: Associated Press"
    precinctsPct={0.99}
  />
</section>

<section class="demo">
  <h2>Senate Race</h2>
  <ElectionResults
    data={electionData.senate}
    title="Pennsylvania Senate"
    subtitle="2024 general election"
    sourceLabel="Source: AP"
    precinctsPct={0.97}
  />
</section>

<section class="demo">
  <h2>Vote Margin</h2>
  <VoteMargin
    margin={-1.5}
    title="2024 Presidential Popular Vote Margin"
  />
</section>

<section class="demo">
  <h2>Margin with Historical Comparison</h2>
  <VoteMargin
    margin={-1.5}
    title="Presidential Popular Vote Margin Over Time"
    historical={electionData.historical_margins}
  />
</section>

<section class="demo">
  <h2>Colorblind-Safe Mode</h2>
  <ElectionResults
    data={electionData.presidential}
    title="2024 Presidential (colorblind palette)"
    colorMode="colorblind"
  />
  <div style="margin-top: 1rem;">
    <VoteMargin
      margin={-1.5}
      title="Margin (colorblind)"
      colorMode="colorblind"
      historical={electionData.historical_margins}
    />
  </div>
</section>

<style>
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; }
  h2 { margin: 0 0 0.75rem; font-size: 1.125rem; font-weight: 600; }
  .desc { color: var(--chart-text-secondary); margin: 0 0 2rem; line-height: 1.5; max-width: 600px; }
  .demo { margin-bottom: 3rem; }
</style>
