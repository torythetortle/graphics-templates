<script lang="ts">
  import type { Snippet } from 'svelte';

  interface ScrollyStep {
    id: string;
    label?: string;
  }

  interface Props {
    steps: ScrollyStep[];
    stickyPosition?: 'top' | 'center';
    offset?: string;
    stickyContent: Snippet<[{ activeStep: string; activeIndex: number }]>;
    stepContent: Snippet<[{ step: ScrollyStep; index: number; active: boolean }]>;
  }

  let {
    steps, stickyPosition = 'top', offset = '-40%',
    stickyContent, stepContent,
  }: Props = $props();

  let activeIndex = $state(0);
  let activeStep = $derived(steps[activeIndex]?.id ?? '');

  function onIntersect(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const idx = Number(entry.target.getAttribute('data-step-index'));
        if (!isNaN(idx)) activeIndex = idx;
      }
    }
  }

  let observer: IntersectionObserver | null = null;

  function initObserver(node: HTMLElement) {
    observer = new IntersectionObserver(onIntersect, {
      rootMargin: offset,
      threshold: 0.5,
    });
    const stepEls = node.querySelectorAll('[data-step-index]');
    stepEls.forEach((el) => observer!.observe(el));

    return {
      destroy() { observer?.disconnect(); },
    };
  }
</script>

<div class="scrolly-container" use:initObserver>
  <div class="scrolly-sticky" class:center={stickyPosition === 'center'}>
    {@render stickyContent({ activeStep, activeIndex })}
  </div>

  <div class="scrolly-steps">
    {#each steps as step, i}
      <div
        class="scrolly-step"
        class:active={activeIndex === i}
        data-step-index={i}
        role="listitem"
        aria-current={activeIndex === i ? 'step' : undefined}
      >
        {@render stepContent({ step, index: i, active: activeIndex === i })}
      </div>
    {/each}
  </div>
</div>

<style>
  .scrolly-container {
    position: relative;
    font-family: var(--font-chart, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  }

  .scrolly-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 2rem;
    z-index: 1;
  }

  .scrolly-sticky.center {
    align-items: center;
  }

  .scrolly-steps {
    position: relative;
    z-index: 2;
    pointer-events: none;
  }

  .scrolly-step {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 2rem;
    pointer-events: auto;
  }

  .scrolly-step.active {
    opacity: 1;
  }

  @media print {
    .scrolly-container {
      display: block;
    }

    .scrolly-sticky {
      position: static;
      height: auto;
    }

    .scrolly-step {
      min-height: auto;
      padding: 1rem 0;
    }
  }
</style>
