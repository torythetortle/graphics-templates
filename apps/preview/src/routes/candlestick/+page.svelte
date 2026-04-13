<script lang="ts">
  import { CandlestickChart } from '@graphics-templates/svelte';

  const stockData = [
    { date: '2024-01-02', open: 185.64, high: 188.44, low: 183.20, close: 186.86, volume: 71200000 },
    { date: '2024-01-03', open: 186.12, high: 187.50, low: 183.43, close: 184.25, volume: 58200000 },
    { date: '2024-01-04', open: 183.92, high: 185.08, low: 181.32, close: 181.91, volume: 71800000 },
    { date: '2024-01-05', open: 181.99, high: 183.09, low: 179.81, close: 181.18, volume: 62800000 },
    { date: '2024-01-08', open: 182.09, high: 188.72, low: 181.79, close: 188.32, volume: 59100000 },
    { date: '2024-01-09', open: 188.50, high: 189.30, low: 185.83, close: 185.96, volume: 42800000 },
    { date: '2024-01-10', open: 186.65, high: 191.95, low: 186.60, close: 191.56, volume: 60600000 },
    { date: '2024-01-11', open: 191.73, high: 192.37, low: 189.24, close: 189.69, volume: 47100000 },
    { date: '2024-01-12', open: 189.60, high: 192.35, low: 189.14, close: 192.53, volume: 53300000 },
    { date: '2024-01-16', open: 190.93, high: 191.82, low: 186.50, close: 188.01, volume: 55800000 },
    { date: '2024-01-17', open: 187.40, high: 187.72, low: 182.85, close: 182.68, volume: 58200000 },
    { date: '2024-01-18', open: 183.17, high: 188.78, low: 183.10, close: 188.63, volume: 68500000 },
    { date: '2024-01-19', open: 189.33, high: 191.39, low: 189.09, close: 191.45, volume: 51400000 },
    { date: '2024-01-22', open: 192.28, high: 194.40, low: 191.78, close: 193.89, volume: 41000000 },
    { date: '2024-01-23', open: 194.11, high: 195.62, low: 192.91, close: 195.18, volume: 40200000 },
    { date: '2024-01-24', open: 195.42, high: 196.38, low: 193.65, close: 194.17, volume: 38900000 },
    { date: '2024-01-25', open: 195.22, high: 196.07, low: 192.33, close: 192.42, volume: 45700000 },
    { date: '2024-01-26', open: 192.89, high: 193.82, low: 191.61, close: 192.53, volume: 36400000 },
    { date: '2024-01-29', open: 193.90, high: 195.34, low: 193.50, close: 195.89, volume: 34200000 },
    { date: '2024-01-30', open: 196.02, high: 196.90, low: 193.79, close: 193.89, volume: 48500000 },
  ];
</script>

<svelte:head>
  <title>Candlestick Chart | Graphics Templates</title>
</svelte:head>

<h1>Candlestick Chart</h1>
<p class="desc">
  Financial chart displaying open, high, low, and close prices for each time period.
  Green candles indicate the price closed higher than it opened; red candles indicate
  it closed lower. The wicks show the full intraday price range.
</p>

<section class="demo">
  <h2>AAPL Daily Price, January 2024</h2>
  <CandlestickChart
    data={stockData}
    title="Apple Inc. (AAPL) — daily OHLC"
    subtitle="January 2024"
    sourceLabel="Source: Yahoo Finance"
    showGrid={true}
  />
</section>

<section class="demo">
  <h2>With Volume Bars</h2>
  <CandlestickChart
    data={stockData}
    title="Apple Inc. (AAPL) — price and volume"
    subtitle="January 2024"
    sourceLabel="Source: Yahoo Finance"
    showVolume={true}
    showGrid={true}
  />
</section>

<style>
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; }
  h2 { margin: 0 0 0.75rem; font-size: 1.125rem; font-weight: 600; }
  .desc { color: var(--chart-text-secondary); margin: 0 0 2rem; line-height: 1.6; max-width: 600px; }
  .demo { margin-bottom: 3rem; }
</style>
