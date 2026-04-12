<script lang="ts">
  import { formatCell, type TableColumn } from '@graphics-templates/core/a11y';

  interface Props {
    caption: string;
    columns: TableColumn[];
    rows: Record<string, unknown>[];
    chartId: string;
  }

  let { caption, columns, rows, chartId }: Props = $props();
</script>

<a href="#{chartId}-table" class="skip-to-table">Skip chart, view as data table</a>

<div id="{chartId}-table" class="sr-only chart-data-table" role="region" aria-label="{caption} data">
  <table>
    <caption>{caption}</caption>
    <thead>
      <tr>
        {#each columns as col}
          <th scope="col">{col.label}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          {#each columns as col}
            <td>{formatCell(row[col.key], col)}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .skip-to-table {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .skip-to-table:focus-visible {
    position: static;
    width: auto;
    height: auto;
    padding: 0.375rem 0.75rem;
    margin: 0;
    overflow: visible;
    clip: auto;
    white-space: normal;
    display: inline-block;
    background: var(--chart-text, #1a1a1a);
    color: var(--chart-bg, #fff);
    border-radius: 3px;
    font-size: 0.8125rem;
    text-decoration: none;
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  table {
    border-collapse: collapse;
    font-size: 0.8125rem;
    width: 100%;
  }

  th, td {
    padding: 0.25rem 0.5rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    font-weight: 600;
  }

  @media print {
    .sr-only,
    .chart-data-table {
      position: static !important;
      width: auto !important;
      height: auto !important;
      clip: auto !important;
      overflow: auto !important;
      white-space: normal !important;
      margin: 0.5em 0 !important;
    }

    .skip-to-table {
      display: none;
    }

    table {
      font-size: 8pt;
    }
  }
</style>
