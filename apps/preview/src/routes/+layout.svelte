<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import HexagonBg from '$lib/HexagonBg.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  const charts = [
    { href: '/line', label: 'Line' },
    { href: '/bar', label: 'Bar' },
    { href: '/scatter', label: 'Scatter' },
    { href: '/area', label: 'Area' },
    { href: '/election', label: 'Election' },
    { href: '/choropleth', label: 'Choropleth' },
    { href: '/bubble-map', label: 'Bubble Map' },
    { href: '/beeswarm', label: 'Beeswarm' },
    { href: '/waffle', label: 'Waffle' },
    { href: '/slope', label: 'Slope' },
    { href: '/bump', label: 'Bump' },
    { href: '/heatmap', label: 'Heatmap' },
    { href: '/sankey', label: 'Sankey' },
    { href: '/candlestick', label: 'Candlestick' },
    { href: '/small-multiples', label: 'Small Multiples' },
    { href: '/scrolly', label: 'Scrollytelling' },
  ];

  const docs = [
    { href: '/colors', label: 'Colors' },
    { href: '/accessibility', label: 'Accessibility' },
  ];

  const currentPath = $derived($page.url.pathname.replace(base, ''));
</script>

<HexagonBg />

<div class="shell">
  <header class="header">
    <div class="container">
      <nav class="nav" aria-label="Main navigation">
        <a href="{base}/" class="name">Graphics Templates</a>
        <div class="links">
          <a href="{base}/" class:active={currentPath === '' || currentPath === '/'}>Overview</a>
          <a href="{base}/colors" class:active={currentPath === '/colors'}>Colors</a>
          <a href="{base}/accessibility" class:active={currentPath === '/accessibility'}>Accessibility</a>
          <a href="https://github.com/torythetortle/graphics-templates" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </nav>
    </div>
  </header>

  <div class="body">
    <div class="container">
      <div class="layout">
        <aside class="sidebar" aria-label="Chart index">
          <div class="nav-section">Charts</div>
          <ul class="nav-list">
            {#each charts as chart}
              <li>
                <a
                  href="{base}{chart.href}"
                  class="nav-link"
                  class:active={currentPath === chart.href}
                  aria-current={currentPath === chart.href ? 'page' : undefined}
                >
                  {chart.label}
                </a>
              </li>
            {/each}
          </ul>
        </aside>

        <main class="content">
          {@render children()}
        </main>
      </div>
    </div>
  </div>

  <footer class="footer">
    <div class="container">
      <p>
        Built by Tory Lysik. Accessible-by-default chart components for newsroom graphics.
        Source on <a href="https://github.com/torythetortle/graphics-templates" target="_blank" rel="noopener noreferrer">GitHub</a>.
      </p>
    </div>
  </footer>
</div>

<style>
  .shell {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 var(--space-xl);
  }

  .header {
    padding: var(--space-xl) 0 var(--space-md);
  }

  .nav {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .name {
    font-family: var(--font-mono);
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text-bright);
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .name:hover {
    color: var(--color-text-bright);
  }

  .links {
    display: flex;
    gap: 1.5rem;
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .links a {
    color: var(--color-text-muted);
    text-decoration: underline;
    padding: 0.25rem 0;
  }

  .links a:hover {
    color: var(--color-text-bright);
  }

  .links a.active {
    color: var(--color-text-bright);
    font-weight: 700;
  }

  .body {
    flex: 1;
    padding-top: var(--space-lg);
  }

  .layout {
    display: grid;
    grid-template-columns: var(--sidebar-width) 1fr;
    gap: var(--space-xl);
  }

  .sidebar {
    position: sticky;
    top: var(--space-lg);
    align-self: start;
    max-height: calc(100vh - var(--space-xl));
    overflow-y: auto;
  }

  .nav-section {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-muted);
    padding: 0.25rem 0 0.5rem;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 0.5rem;
  }

  .nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-list li {
    margin: 0;
  }

  .nav-link {
    display: block;
    padding: 0.3125rem 0;
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    text-decoration: none;
    border-left: 2px solid transparent;
    padding-left: 0.625rem;
    margin-left: -0.625rem;
    transition: color 0.15s, border-color 0.15s;
  }

  .nav-link:hover {
    color: var(--color-text-bright);
  }

  .nav-link.active {
    color: var(--color-accent);
    border-left-color: var(--color-accent);
    font-weight: 500;
  }

  .content {
    min-width: 0;
  }

  .footer {
    padding: var(--space-xl) 0 var(--space-lg);
    border-top: 1px solid var(--color-border);
    margin-top: var(--space-xl);
  }

  .footer p {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }

  .footer a {
    color: var(--color-text-muted);
    text-decoration: underline;
  }

  .footer a:hover {
    color: var(--color-text-bright);
  }

  @media (max-width: 900px) {
    .layout {
      grid-template-columns: 1fr;
      gap: var(--space-md);
    }

    .sidebar {
      position: static;
      max-height: none;
    }

    .nav-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem 1rem;
    }

    .nav-link {
      border-left: none;
      padding-left: 0;
      margin-left: 0;
    }

    .nav-link.active {
      border-left: none;
    }
  }

  @media (max-width: 480px) {
    .header {
      padding: var(--space-lg) 0 var(--space-sm);
    }

    .container {
      padding: 0 var(--space-md);
    }

    .name {
      font-size: 1.5rem;
    }

    .links {
      gap: 0.75rem;
      flex-wrap: wrap;
      font-size: 0.75rem;
    }
  }
</style>
