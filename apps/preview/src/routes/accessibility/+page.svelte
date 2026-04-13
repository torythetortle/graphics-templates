<svelte:head>
  <title>Accessibility | Graphics Templates</title>
</svelte:head>

<h1>Accessibility</h1>
<p class="desc">
  Every chart in this library is accessible by default. No configuration needed.
  This page documents the four layers of accessibility built into every component.
</p>

<section class="layer">
  <h2>1. Screen Reader Descriptions</h2>
  <p>
    Every chart's <code>&lt;svg&gt;</code> has <code>role="img"</code> with a
    <code>&lt;title&gt;</code> and <code>&lt;desc&gt;</code> element linked via
    <code>aria-labelledby</code>. Descriptions are auto-generated from the data:
  </p>
  <div class="example-box">
    <p class="example-label">Line chart auto-description:</p>
    <blockquote>
      "Line chart: Unemployment rate, 2020–2024. 36 data points with 2 series.
      Values range from 3.4 to 14.7. Average: 5.8. Source: Bureau of Labor Statistics."
    </blockquote>
  </div>
  <div class="example-box">
    <p class="example-label">Bar chart auto-description:</p>
    <blockquote>
      "Bar chart: Most populous US states. 10 categories. Highest: California at 39,538.
      Lowest: Michigan at 10,077. Source: US Census Bureau."
    </blockquote>
  </div>
  <p>
    The <code>title</code> prop is <strong>required</strong> on every chart — TypeScript
    will error at compile time if it's missing. This prevents the single most common
    accessibility failure in data visualization.
  </p>
</section>

<section class="layer">
  <h2>2. Data Table Alternatives</h2>
  <p>
    Every chart renders a full HTML <code>&lt;table&gt;</code> with the underlying data.
    The table is visually hidden using the <code>.sr-only</code> clip pattern (not
    <code>display:none</code>) so it remains accessible to screen readers and
    keyboard users.
  </p>
  <div class="example-box">
    <p class="example-label">What screen reader users experience:</p>
    <ol>
      <li>A "Skip chart, view as data table" link appears on focus</li>
      <li>The table has a <code>&lt;caption&gt;</code> matching the chart title</li>
      <li>Column headers use <code>&lt;th scope="col"&gt;</code></li>
      <li>Values are formatted consistently</li>
    </ol>
  </div>
  <p>
    In print, the table becomes visible alongside the chart — readers get both the
    visual and the precise values.
  </p>
</section>

<section class="layer">
  <h2>3. Keyboard Navigation</h2>
  <p>
    All interactive chart elements are keyboard accessible using a roving
    <code>tabindex</code> pattern:
  </p>
  <div class="key-table">
    <div class="key-row">
      <kbd>Tab</kbd>
      <span>Enter the chart / move to next interactive element</span>
    </div>
    <div class="key-row">
      <kbd>Arrow Left / Right</kbd>
      <span>Navigate between data points along a series</span>
    </div>
    <div class="key-row">
      <kbd>Arrow Up / Down</kbd>
      <span>Switch between series (multi-series charts) or navigate bars</span>
    </div>
    <div class="key-row">
      <kbd>Home / End</kbd>
      <span>Jump to first / last data point</span>
    </div>
    <div class="key-row">
      <kbd>Enter / Space</kbd>
      <span>Announce current data point value via live region</span>
    </div>
    <div class="key-row">
      <kbd>Escape</kbd>
      <span>Return focus to chart container</span>
    </div>
  </div>
  <p>
    When a data point receives focus, its value is announced to an
    <code>aria-live="polite"</code> region — so screen reader users hear the data
    as they navigate.
  </p>
</section>

<section class="layer">
  <h2>4. System Preferences</h2>
  <p>
    Charts automatically respond to three system-level accessibility settings:
  </p>
  <div class="pref-grid">
    <div class="pref">
      <h3><code>prefers-reduced-motion</code></h3>
      <p>
        All animations (line draw-on, bar growth, dot pop-in) are instantly disabled.
        The <code>animated</code> prop defaults to <code>false</code> when this
        preference is detected.
      </p>
    </div>
    <div class="pref">
      <h3><code>prefers-contrast: more</code></h3>
      <p>
        Chart automatically switches to high-contrast mode — black/white palette,
        thicker strokes, no gradients.
      </p>
    </div>
    <div class="pref">
      <h3><code>@media print</code></h3>
      <p>
        Forces grayscale palette, shows data table, hides tooltips, adds dash
        patterns to lines for grayscale reproduction.
      </p>
    </div>
  </div>
</section>

<section class="layer">
  <h2>5. Colorblind Safety</h2>
  <p>
    Every categorical palette has a <code>-a11y</code> variant optimized for
    deuteranopia and protanopia. Line charts always render dash patterns alongside
    color — so series are distinguishable even with no color vision at all.
  </p>
  <div class="example-box">
    <p class="example-label">Enabling colorblind mode:</p>
    <div class="code-inline">
      <code>&lt;LineChart data=&#123;data&#125; title="..." colorMode="colorblind" /&gt;</code>
    </div>
  </div>
</section>

<section class="layer">
  <h2>Implementation Details</h2>
  <div class="impl-grid">
    <div class="impl">
      <h3>Core Module</h3>
      <p><code>packages/core/src/a11y/</code></p>
      <ul>
        <li><code>describe.ts</code> — auto-generates chart descriptions from data statistics</li>
        <li><code>table.ts</code> — builds structured table specs for the AccessibleTable component</li>
        <li><code>keyboard.ts</code> — chart-agnostic keyboard navigation handler</li>
        <li><code>announcer.ts</code> — singleton live region for screen reader announcements</li>
      </ul>
    </div>
    <div class="impl">
      <h3>Svelte Primitives</h3>
      <ul>
        <li><code>AccessibleTable.svelte</code> — visually-hidden table with skip link</li>
        <li><code>Svg.svelte</code> — wraps <code>&lt;svg&gt;</code> with role, title, desc</li>
        <li><code>use-keyboard-nav.svelte.ts</code> — reactive keyboard nav hook</li>
      </ul>
    </div>
  </div>
</section>

<style>
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; }
  h2 { margin: 0 0 0.5rem; font-size: 1.125rem; font-weight: 600; }
  h3 { margin: 0 0 0.25rem; font-size: 0.9375rem; font-weight: 600; }

  .desc {
    color: var(--chart-text-secondary);
    margin: 0 0 2.5rem;
    line-height: 1.6;
    max-width: 620px;
    font-size: 0.9375rem;
  }

  .layer {
    margin-bottom: 2.5rem;
    max-width: 640px;
  }

  .layer p {
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--chart-text);
    margin: 0 0 0.75rem;
  }

  code {
    font-family: 'SF Mono', 'Fira Code', Menlo, monospace;
    font-size: 0.8em;
    background: var(--surface);
    padding: 0.1em 0.35em;
    border-radius: 3px;
  }

  .example-box {
    background: var(--chart-bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1rem 1.25rem;
    margin: 0.75rem 0 1rem;
  }

  .example-label {
    margin: 0 0 0.375rem !important;
    font-size: 0.75rem !important;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--chart-text-secondary) !important;
  }

  blockquote {
    margin: 0;
    font-size: 0.875rem;
    font-style: italic;
    color: var(--chart-text);
    line-height: 1.5;
  }

  ol {
    margin: 0;
    padding-left: 1.25rem;
    font-size: 0.8125rem;
    line-height: 1.6;
  }

  .key-table {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    margin: 0.75rem 0 1rem;
  }

  .key-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  kbd {
    display: inline-block;
    padding: 0.2rem 0.5rem;
    font-family: 'SF Mono', Menlo, monospace;
    font-size: 0.6875rem;
    background: var(--chart-bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    box-shadow: 0 1px 0 var(--border);
    min-width: 120px;
    text-align: center;
    flex-shrink: 0;
  }

  .key-row span {
    font-size: 0.8125rem;
    color: var(--chart-text-secondary);
  }

  .pref-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0.75rem;
    margin: 0.75rem 0 1rem;
  }

  .pref {
    background: var(--chart-bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1rem;
  }

  .pref h3 {
    font-size: 0.75rem;
    font-family: 'SF Mono', Menlo, monospace;
  }

  .pref p {
    font-size: 0.75rem !important;
    margin: 0 !important;
    color: var(--chart-text-secondary) !important;
  }

  .code-inline {
    margin-top: 0.375rem;
  }

  .code-inline code {
    font-size: 0.8125rem;
    display: block;
    padding: 0.5rem 0.75rem;
    background: var(--surface);
    border-radius: 4px;
  }

  .impl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1rem;
    margin-top: 0.75rem;
  }

  .impl {
    background: var(--chart-bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1rem 1.25rem;
  }

  .impl ul {
    margin: 0.375rem 0 0;
    padding-left: 1rem;
    font-size: 0.75rem;
    line-height: 1.7;
    color: var(--chart-text-secondary);
  }

  .impl p {
    font-size: 0.75rem !important;
    font-family: 'SF Mono', Menlo, monospace;
    color: var(--chart-text-secondary) !important;
    margin: 0 0 0.25rem !important;
  }
</style>
