# Graphics Templates

Accessible-by-default chart components for newsroom graphics. Built with Svelte 5 and D3.

**[Live Demo →](https://yourusername.github.io/graphics-templates/)**

## Why this exists

Most newsroom chart templates ship without real accessibility. These components bake in screen reader support, keyboard navigation, data table alternatives, and colorblind-safe palettes as defaults — not afterthoughts.

## Charts

18 chart types covering the full range of data journalism needs:

| Category | Components |
|----------|-----------|
| **Core** | Line, Bar, Scatter, Area |
| **Maps** | Choropleth, Bubble Map |
| **Politics** | Election Results, Vote Margin |
| **Finance** | Candlestick (OHLC) |
| **Distribution** | Beeswarm, Waffle, Slope |
| **Rankings & Flows** | Bump Chart, Heatmap, Sankey Diagram |
| **Composition** | Small Multiples, Scrollytelling |

## Quick start

```bash
pnpm install
pnpm dev
```

Open [localhost:5173](http://localhost:5173) to browse all charts with live demos.

### Using a component

```svelte
<script>
  import { LineChart } from '@graphics-templates/svelte';
  import data from './data.csv';
</script>

<LineChart
  {data}
  title="Unemployment rate, 2020–2024"
  subtitle="Quarterly, seasonally adjusted"
  sourceLabel="Bureau of Labor Statistics"
/>
```

That's it. Responsive sizing, keyboard navigation, screen reader descriptions, print styles, and a visually-hidden data table are included automatically.

## Accessibility

Every chart ships with four layers of accessibility:

1. **Screen reader descriptions** — Auto-generated `<title>` and `<desc>` from data statistics (range, trend, extremes). The `title` prop is required; TypeScript errors if it's missing.

2. **Data table alternatives** — A visually-hidden `<table>` with a "Skip to data table" link that appears on keyboard focus. In print, the table becomes visible alongside the chart.

3. **Keyboard navigation** — Arrow keys move between data points, Enter announces values to a live region, Escape returns focus to the chart container.

4. **System preferences** — `prefers-reduced-motion` disables all animations. `prefers-contrast: more` triggers high-contrast mode. `@media print` forces grayscale and shows data tables.

## Color palettes

15 named palettes with colorblind-safe variants:

- **Categorical**: `newsroom` (default, 8-color), `politics`, `politics-a11y`, `finance`, `finance-a11y`
- **Sequential**: `blues`, `reds`, `greens`, `oranges`, `purples`, `grays`
- **Diverging**: `redblue`, `redblue-a11y`, `warmcool`
- **Print**: `print-bw`

Line charts render both color and a unique dash pattern per series — readable in print and with no color vision at all.

```svelte
<!-- Named palette -->
<LineChart {data} title="..." palette="politics" />

<!-- Colorblind mode -->
<LineChart {data} title="..." colorMode="colorblind" />

<!-- Custom colors -->
<LineChart {data} title="..." palette={['#e41a1c', '#377eb8']} />
```

## Project structure

```
graphics-templates/
├── packages/
│   ├── core/          # Framework-free TS utilities (color, scales, a11y, data, format)
│   └── svelte/        # Svelte 5 chart components
├── apps/
│   └── preview/       # SvelteKit demo site (deploys to GitHub Pages)
└── scripts/           # CLI tools (scaffold, export)
```

### Packages

| Package | Description |
|---------|-------------|
| `@graphics-templates/core` | Color palettes, scale wrappers, accessibility helpers, data types, number/date formatters, FIPS/state lookups. Zero framework dependencies. |
| `@graphics-templates/svelte` | 18 Svelte 5 chart components + primitives (ChartContainer, Svg, Axis, Grid, Tooltip, Legend, Annotation, AccessibleTable). |
| `@graphics-templates/preview` | SvelteKit app with live demos, API docs, color palette showcase, and accessibility documentation. |

## Responsive behavior

Charts auto-resize via `ResizeObserver` (works in iframes and embeds, not just CSS media queries):

| Breakpoint | Width | Behavior |
|-----------|-------|----------|
| Mobile | < 480px | Tighter margins, fewer ticks, 4:3 aspect ratio, bars flip horizontal |
| Tablet | 480–767px | Medium margins, 16:10 aspect ratio |
| Desktop | 768px+ | Full margins, 16:9 aspect ratio |

## Print

`@media print` automatically:
- Forces grayscale palette
- Shows data tables alongside charts
- Hides tooltips and interactive controls
- Adds dash patterns to line series
- Constrains charts to 6.5in max width

## Built with

- [Svelte 5](https://svelte.dev) — Runes, snippets, reactive primitives
- [D3.js](https://d3js.org) — Scales, shapes, geo, force, chromatic
- [TypeScript](https://typescriptlang.org) — Strict types across all packages
- [pnpm](https://pnpm.io) + [Turborepo](https://turbo.build) — Monorepo management
- [SvelteKit](https://svelte.dev/docs/kit) — Preview app with static adapter for GitHub Pages

## License

MIT
