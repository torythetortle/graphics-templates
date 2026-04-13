<script lang="ts">
  import { Scrollytelling, LineChart } from '@graphics-templates/svelte';
  import rawData from '$lib/sample-data/timeseries.json';

  const steps = [
    { id: 'intro',    label: 'The pandemic shock' },
    { id: 'recovery', label: 'Uneven recovery' },
    { id: 'normal',   label: 'Return to normal' },
  ];

  const stepDescriptions: Record<string, string> = {
    intro:    'In April 2020, the US unemployment rate surged to nearly 15% — the highest since the Great Depression — as the pandemic forced mass layoffs across the economy.',
    recovery: 'Recovery was uneven. The US rebounded sharply by mid-2021, while the EU saw a slower but steadier decline, reflecting different policy responses and labor market structures.',
    normal:   'By 2023, both regions had returned close to pre-pandemic levels, with the US reaching historic lows below 4% and the EU stabilizing near 6%.',
  };

  const data = rawData.map((d) => ({ ...d }));
</script>

<svelte:head>
  <title>Scrollytelling | Graphics Templates</title>
</svelte:head>

<h1>Scrollytelling</h1>
<p class="desc">
  A scroll-driven narrative wrapper that keeps a chart panel sticky while the reader
  scrolls through annotated steps. Each step can update the chart state, highlight
  a period, or swap datasets entirely. Built on IntersectionObserver with no
  external dependencies.
</p>

<section class="demo">
  <h2>Unemployment Through the Pandemic</h2>
  <Scrollytelling {steps}>
    {#snippet stickyContent({ activeStep })}
      <div class="sticky-panel">
        <LineChart
          {data}
          title="Unemployment rate, 2020–2024"
          subtitle="Quarterly, seasonally adjusted"
          sourceLabel="Source: BLS, Eurostat"
          curve="monotone"
          showTable={false}
        />
        {#if activeStep}
          <p class="step-note">{stepDescriptions[activeStep]}</p>
        {/if}
      </div>
    {/snippet}

    {#snippet stepContent({ step, active })}
      <div class="step-card" class:active>
        <span class="step-number">Step {steps.findIndex((s) => s.id === step.id) + 1}</span>
        <p>{step.label}</p>
      </div>
    {/snippet}
  </Scrollytelling>
</section>

<style>
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; }
  h2 { margin: 0 0 0.75rem; font-size: 1.125rem; font-weight: 600; }
  .desc { color: var(--chart-text-secondary); margin: 0 0 2rem; line-height: 1.6; max-width: 600px; }
  .demo { margin-bottom: 3rem; }

  .sticky-panel {
    background: var(--chart-bg, #fff);
    border: 1px solid var(--border, #e5e7eb);
    border-radius: 8px;
    padding: 1.25rem;
    width: 100%;
  }

  .step-note {
    margin: 0.75rem 0 0;
    font-size: 0.875rem;
    color: var(--chart-text-secondary);
    line-height: 1.6;
    border-top: 1px solid var(--border, #e5e7eb);
    padding-top: 0.75rem;
  }

  .step-card {
    background: var(--surface, #f9fafb);
    border: 1px solid var(--border, #e5e7eb);
    border-radius: 6px;
    padding: 1rem 1.25rem;
    transition: border-color 0.2s, background 0.2s;
  }

  .step-card.active {
    border-color: var(--chart-accent, #2563eb);
    background: var(--chart-bg, #fff);
  }

  .step-number {
    display: block;
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--chart-text-secondary);
    margin-bottom: 0.25rem;
  }

  .step-card p {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 600;
    line-height: 1.4;
  }
</style>
