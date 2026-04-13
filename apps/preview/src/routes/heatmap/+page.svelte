<script lang="ts">
  import { Heatmap } from '@graphics-templates/svelte';

  const activityData = [
    { x: 'Mon', y: 'Morning',   value: 42 },
    { x: 'Mon', y: 'Afternoon', value: 78 },
    { x: 'Mon', y: 'Evening',   value: 91 },
    { x: 'Mon', y: 'Night',     value: 23 },
    { x: 'Tue', y: 'Morning',   value: 38 },
    { x: 'Tue', y: 'Afternoon', value: 81 },
    { x: 'Tue', y: 'Evening',   value: 87 },
    { x: 'Tue', y: 'Night',     value: 19 },
    { x: 'Wed', y: 'Morning',   value: 45 },
    { x: 'Wed', y: 'Afternoon', value: 74 },
    { x: 'Wed', y: 'Evening',   value: 88 },
    { x: 'Wed', y: 'Night',     value: 21 },
    { x: 'Thu', y: 'Morning',   value: 51 },
    { x: 'Thu', y: 'Afternoon', value: 83 },
    { x: 'Thu', y: 'Evening',   value: 92 },
    { x: 'Thu', y: 'Night',     value: 27 },
    { x: 'Fri', y: 'Morning',   value: 47 },
    { x: 'Fri', y: 'Afternoon', value: 69 },
    { x: 'Fri', y: 'Evening',   value: 98 },
    { x: 'Fri', y: 'Night',     value: 55 },
    { x: 'Sat', y: 'Morning',   value: 61 },
    { x: 'Sat', y: 'Afternoon', value: 85 },
    { x: 'Sat', y: 'Evening',   value: 95 },
    { x: 'Sat', y: 'Night',     value: 62 },
    { x: 'Sun', y: 'Morning',   value: 58 },
    { x: 'Sun', y: 'Afternoon', value: 77 },
    { x: 'Sun', y: 'Evening',   value: 82 },
    { x: 'Sun', y: 'Night',     value: 34 },
  ];

  const tempData = [
    { x: 'Jan', y: 'Seattle',   value: 41 },
    { x: 'Jan', y: 'Denver',    value: 30 },
    { x: 'Jan', y: 'Austin',    value: 50 },
    { x: 'Jan', y: 'Miami',     value: 70 },
    { x: 'Feb', y: 'Seattle',   value: 44 },
    { x: 'Feb', y: 'Denver',    value: 34 },
    { x: 'Feb', y: 'Austin',    value: 54 },
    { x: 'Feb', y: 'Miami',     value: 72 },
    { x: 'Mar', y: 'Seattle',   value: 49 },
    { x: 'Mar', y: 'Denver',    value: 43 },
    { x: 'Mar', y: 'Austin',    value: 62 },
    { x: 'Mar', y: 'Miami',     value: 76 },
    { x: 'Apr', y: 'Seattle',   value: 54 },
    { x: 'Apr', y: 'Denver',    value: 52 },
    { x: 'Apr', y: 'Austin',    value: 71 },
    { x: 'Apr', y: 'Miami',     value: 80 },
    { x: 'May', y: 'Seattle',   value: 60 },
    { x: 'May', y: 'Denver',    value: 62 },
    { x: 'May', y: 'Austin',    value: 79 },
    { x: 'May', y: 'Miami',     value: 84 },
    { x: 'Jun', y: 'Seattle',   value: 65 },
    { x: 'Jun', y: 'Denver',    value: 72 },
    { x: 'Jun', y: 'Austin',    value: 88 },
    { x: 'Jun', y: 'Miami',     value: 88 },
    { x: 'Jul', y: 'Seattle',   value: 70 },
    { x: 'Jul', y: 'Denver',    value: 80 },
    { x: 'Jul', y: 'Austin',    value: 95 },
    { x: 'Jul', y: 'Miami',     value: 90 },
    { x: 'Aug', y: 'Seattle',   value: 70 },
    { x: 'Aug', y: 'Denver',    value: 78 },
    { x: 'Aug', y: 'Austin',    value: 95 },
    { x: 'Aug', y: 'Miami',     value: 91 },
    { x: 'Sep', y: 'Seattle',   value: 63 },
    { x: 'Sep', y: 'Denver',    value: 67 },
    { x: 'Sep', y: 'Austin',    value: 87 },
    { x: 'Sep', y: 'Miami',     value: 88 },
    { x: 'Oct', y: 'Seattle',   value: 53 },
    { x: 'Oct', y: 'Denver',    value: 54 },
    { x: 'Oct', y: 'Austin',    value: 74 },
    { x: 'Oct', y: 'Miami',     value: 82 },
    { x: 'Nov', y: 'Seattle',   value: 46 },
    { x: 'Nov', y: 'Denver',    value: 40 },
    { x: 'Nov', y: 'Austin',    value: 61 },
    { x: 'Nov', y: 'Miami',     value: 75 },
    { x: 'Dec', y: 'Seattle',   value: 41 },
    { x: 'Dec', y: 'Denver',    value: 31 },
    { x: 'Dec', y: 'Austin',    value: 51 },
    { x: 'Dec', y: 'Miami',     value: 71 },
  ];
</script>

<svelte:head>
  <title>Heatmap | Graphics Templates</title>
</svelte:head>

<h1>Heatmap</h1>
<p class="desc">
  Color-encoded matrix for showing patterns across two categorical dimensions.
  Cell color intensity encodes the numeric value, making it easy to spot clusters,
  gaps, and outliers in dense data.
</p>

<section class="demo">
  <h2>Website Activity by Day and Time</h2>
  <Heatmap
    data={activityData}
    title="Website sessions by day of week and time of day"
    subtitle="Average daily sessions, January–March 2024"
    sourceLabel="Source: Internal analytics"
    palette="blues"
    cellRadius={3}
  />
</section>

<section class="demo">
  <h2>Average Monthly Temperature by City</h2>
  <Heatmap
    data={tempData}
    title="Average monthly high temperature by city (°F)"
    subtitle="Selected US cities, 2023"
    sourceLabel="Source: NOAA National Centers for Environmental Information"
    palette="oranges"
    cellRadius={3}
  />
</section>

<style>
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; }
  h2 { margin: 0 0 0.75rem; font-size: 1.125rem; font-weight: 600; }
  .desc { color: var(--chart-text-secondary); margin: 0 0 2rem; line-height: 1.6; max-width: 600px; }
  .demo { margin-bottom: 3rem; }
</style>
