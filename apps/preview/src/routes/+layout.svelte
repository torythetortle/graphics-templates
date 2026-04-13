<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  const charts = [
    { href: '/line', label: 'Line Chart', phase: 2 },
    { href: '/bar', label: 'Bar Chart', phase: 2 },
    { href: '/scatter', label: 'Scatter Plot', phase: 2 },
    { href: '/area', label: 'Area Chart', phase: 5 },
    { href: '/election', label: 'Election Results', phase: 3 },
    { href: '/choropleth', label: 'Choropleth', phase: 4 },
    { href: '/bubble-map', label: 'Bubble Map', phase: 4 },
    { href: '/beeswarm', label: 'Beeswarm', phase: 5 },
    { href: '/waffle', label: 'Waffle Chart', phase: 5 },
    { href: '/slope', label: 'Slope Chart', phase: 5 },
    { href: '/bump', label: 'Bump Chart', phase: 6 },
    { href: '/heatmap', label: 'Heatmap', phase: 6 },
    { href: '/sankey', label: 'Sankey Diagram', phase: 6 },
    { href: '/candlestick', label: 'Candlestick', phase: 6 },
    { href: '/small-multiples', label: 'Small Multiples', phase: 7 },
    { href: '/scrolly', label: 'Scrollytelling', phase: 7 },
  ];

  const currentPath = $derived($page.url.pathname.replace(base, ''));
</script>

<div class="layout">
  <nav class="sidebar" aria-label="Chart types">
    <a href="{base}/" class="sidebar-title">
      <strong>Graphics Templates</strong>
    </a>

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

    <div class="sidebar-footer">
      <span class="nav-section">Design System</span>
      <a href="{base}/colors" class="nav-link" class:active={currentPath === '/colors'}>
        Color Palettes
      </a>
      <a href="{base}/accessibility" class="nav-link" class:active={currentPath === '/accessibility'}>
        Accessibility
      </a>
      <a href="{base}/a11y-audit" class="nav-link" class:active={currentPath === '/a11y-audit'}>
        Audit Tool
      </a>
    </div>
  </nav>

  <main class="content">
    {@render children()}
  </main>
</div>

<style>
  .layout {
    display: flex;
    min-height: 100vh;
  }

  .sidebar {
    width: var(--sidebar-width);
    flex-shrink: 0;
    background: var(--chart-bg);
    border-right: 1px solid var(--border);
    padding: 1.5rem 0;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .sidebar-title {
    display: block;
    padding: 0 1.25rem 1rem;
    font-size: 0.9375rem;
    text-decoration: none;
    border-bottom: 1px solid var(--border);
    margin-bottom: 0.75rem;
  }

  .nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
    flex: 1;
  }

  .nav-section {
    display: block;
    padding: 0.375rem 1.25rem 0.125rem;
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--chart-text-secondary);
  }

  .nav-link {
    display: block;
    padding: 0.375rem 1.25rem;
    font-size: 0.8125rem;
    text-decoration: none;
    color: var(--chart-text-secondary);
    border-left: 3px solid transparent;
    transition: background 0.1s;
  }

  .nav-link:hover {
    background: var(--surface);
    color: var(--chart-text);
  }

  .nav-link.active {
    color: var(--chart-text);
    border-left-color: var(--chart-text);
    font-weight: 600;
  }

  .sidebar-footer {
    border-top: 1px solid var(--border);
    padding-top: 0.75rem;
    margin-top: 0.75rem;
  }

  .content {
    flex: 1;
    padding: 2rem 2.5rem;
    max-width: 960px;
  }

  @media (max-width: 768px) {
    .layout {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
      height: auto;
      position: static;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 0.75rem;
      gap: 0.25rem;
    }

    .sidebar-title {
      width: 100%;
      border-bottom: none;
      padding: 0 0 0.5rem;
      margin-bottom: 0;
    }

    .nav-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .nav-link {
      border-left: none;
      border-radius: 4px;
      padding: 0.25rem 0.625rem;
    }

    .nav-link.active {
      background: var(--chart-text);
      color: var(--chart-bg);
    }

    .sidebar-footer {
      width: 100%;
      border-top: none;
      margin-top: 0;
      padding-top: 0;
    }

    .content {
      padding: 1.25rem;
    }
  }
</style>
