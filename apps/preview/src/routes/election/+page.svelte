<script lang="ts">
  import { ElectionResults, VoteMargin } from '@graphics-templates/svelte';
  import electionData from '$lib/sample-data/election-2024.json';
</script>

<svelte:head>
  <title>Election Results | Graphics Templates</title>
</svelte:head>

<h1>Election Results</h1>
<p class="desc">
  Two components for election night coverage: a candidate results table with party-colored
  summary bar, and a vote margin indicator with historical comparison.
  Built-in party color recognition for Democratic, Republican, Libertarian, Green, and Independent.
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

<section class="api">
  <h2>ElectionResults — Usage</h2>
  <div class="code-block">
    <pre><code>&lt;ElectionResults
  data=&#123;[
    &#123; candidate: 'Harris', party: 'Democratic', votes: 75012341, pct: 0.481 &#125;,
    &#123; candidate: 'Trump', party: 'Republican', votes: 77302892, pct: 0.496 &#125;,
  ]&#125;
  title="2024 Presidential Election"
  precinctsPct=&#123;0.99&#125;
/&gt;</code></pre>
  </div>
</section>

<section class="api">
  <h2>ElectionResults — Props</h2>
  <div class="props-table">
    <div class="prop-row header"><span>Prop</span><span>Type</span><span>Default</span></div>
    <div class="prop-row"><code>data</code><span>CandidateRow[]</span><span class="req">required</span></div>
    <div class="prop-row"><code>title</code><span>string</span><span class="req">required</span></div>
    <div class="prop-row"><code>precinctsPct</code><span>number (0–1)</span><span>—</span></div>
    <div class="prop-row"><code>winner</code><span>string</span><span>auto (highest votes)</span></div>
    <div class="prop-row"><code>colorMode</code><span>'default' | 'colorblind'</span><span>auto-detect</span></div>
    <div class="prop-row"><code>partyColors</code><span>Record&lt;string, string&gt;</span><span>built-in D/R/I/L/G colors</span></div>
  </div>
</section>

<section class="api">
  <h2>VoteMargin — Usage</h2>
  <div class="code-block">
    <pre><code>&lt;VoteMargin
  margin=&#123;-1.5&#125;
  title="Popular Vote Margin"
  historical=&#123;[
    &#123; year: 2016, margin: -2.1 &#125;,
    &#123; year: 2020, margin: 4.5 &#125;,
  ]&#125;
/&gt;</code></pre>
  </div>
  <p class="code-note">Positive margin = party A leads. Negative = party B leads.</p>
</section>

<section class="api">
  <h2>VoteMargin — Props</h2>
  <div class="props-table">
    <div class="prop-row header"><span>Prop</span><span>Type</span><span>Default</span></div>
    <div class="prop-row"><code>margin</code><span>number</span><span class="req">required</span></div>
    <div class="prop-row"><code>partyA / partyB</code><span>string</span><span>'Democratic' / 'Republican'</span></div>
    <div class="prop-row"><code>historical</code><span>&#123; year, margin &#125;[]</span><span>[]</span></div>
    <div class="prop-row"><code>maxMargin</code><span>number</span><span>30</span></div>
    <div class="prop-row"><code>colorMode</code><span>'default' | 'colorblind'</span><span>auto-detect</span></div>
  </div>
</section>

<section class="api">
  <h2>Data Shape</h2>
  <div class="code-block">
    <pre><code>interface CandidateRow &#123;
  candidate: string;
  party: string;      // 'Democratic', 'Republican', 'Libertarian', etc.
  votes: number;
  pct: number;        // 0–1 (0.481 = 48.1%)
&#125;</code></pre>
  </div>
</section>

<style>
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; }
  h2 { margin: 0 0 0.75rem; font-size: 1.125rem; font-weight: 600; }
  .desc { color: var(--chart-text-secondary); margin: 0 0 2rem; line-height: 1.6; max-width: 600px; }
  .demo { margin-bottom: 3rem; }
  .api { margin-bottom: 2.5rem; max-width: 640px; }
  .code-block { background: var(--chart-bg); border: 1px solid var(--border); border-radius: 6px; padding: 1rem 1.25rem; overflow-x: auto; }
  .code-block pre { margin: 0; }
  .code-block code { font-family: 'SF Mono', 'Fira Code', Menlo, monospace; font-size: 0.8125rem; line-height: 1.6; }
  .code-note { font-size: 0.8125rem; color: var(--chart-text-secondary); margin: 0.5rem 0 0; }
  .props-table { border: 1px solid var(--border); border-radius: 6px; overflow: hidden; }
  .prop-row { display: grid; grid-template-columns: 140px 1fr 120px; padding: 0.5rem 1rem; font-size: 0.8125rem; border-bottom: 1px solid var(--border); align-items: baseline; }
  .prop-row:last-child { border-bottom: none; }
  .prop-row.header { background: var(--surface); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--chart-text-secondary); }
  .prop-row code { font-family: 'SF Mono', Menlo, monospace; font-size: 0.8125rem; background: none; padding: 0; }
  .prop-row span { color: var(--chart-text-secondary); font-size: 0.75rem; }
  .req { color: #c73a27 !important; font-weight: 600; font-size: 0.6875rem !important; text-transform: uppercase; }
</style>
