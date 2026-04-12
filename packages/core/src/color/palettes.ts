import type { Palette, PaletteName } from './types.js';

export const PALETTES: Record<PaletteName, Palette> = {
  newsroom: {
    name: 'newsroom',
    type: 'categorical',
    colors: [
      '#1a6faf', '#c73a27', '#2ca25f', '#e07b17',
      '#7b3f9e', '#c2a600', '#5e5e5e', '#2cb0c0',
    ],
    colorblindSafe: true,
    printSafe: false,
    darkVariant: [
      '#4d9fd6', '#e8604a', '#4ec97e', '#f5a034',
      '#a868cc', '#f0cc22', '#9e9e9e', '#4ed1e0',
    ],
  },

  politics: {
    name: 'politics',
    type: 'categorical',
    colors: ['#1473b8', '#c0392b', '#888888'],
    colorblindSafe: false,
    printSafe: true,
  },

  'politics-a11y': {
    name: 'politics-a11y',
    type: 'categorical',
    colors: ['#0072b2', '#d55e00', '#999999'],
    colorblindSafe: true,
    printSafe: true,
  },

  finance: {
    name: 'finance',
    type: 'categorical',
    colors: ['#2ca25f', '#c73a27'],
    colorblindSafe: false,
    printSafe: false,
  },

  'finance-a11y': {
    name: 'finance-a11y',
    type: 'categorical',
    colors: ['#009e73', '#d55e00'],
    colorblindSafe: true,
    printSafe: true,
  },

  blues: {
    name: 'blues',
    type: 'sequential',
    colors: ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594'],
    colorblindSafe: true,
    printSafe: true,
  },

  reds: {
    name: 'reds',
    type: 'sequential',
    colors: ['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#99000d'],
    colorblindSafe: true,
    printSafe: true,
  },

  greens: {
    name: 'greens',
    type: 'sequential',
    colors: ['#edf8e9', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#005a32'],
    colorblindSafe: true,
    printSafe: true,
  },

  oranges: {
    name: 'oranges',
    type: 'sequential',
    colors: ['#feedde', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#8c2d04'],
    colorblindSafe: true,
    printSafe: true,
  },

  purples: {
    name: 'purples',
    type: 'sequential',
    colors: ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#4a1486'],
    colorblindSafe: true,
    printSafe: true,
  },

  grays: {
    name: 'grays',
    type: 'sequential',
    colors: ['#f7f7f7', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525'],
    colorblindSafe: true,
    printSafe: true,
  },

  redblue: {
    name: 'redblue',
    type: 'diverging',
    colors: [
      '#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7',
      '#f7f7f7',
      '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061',
    ],
    colorblindSafe: false,
    printSafe: true,
  },

  'redblue-a11y': {
    name: 'redblue-a11y',
    type: 'diverging',
    colors: [
      '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5',
      '#f5f5f5',
      '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30',
    ],
    colorblindSafe: true,
    printSafe: true,
  },

  warmcool: {
    name: 'warmcool',
    type: 'diverging',
    colors: [
      '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7',
      '#f7f7f7',
      '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b',
    ],
    colorblindSafe: true,
    printSafe: true,
  },

  'print-bw': {
    name: 'print-bw',
    type: 'sequential',
    colors: ['#f7f7f7', '#cccccc', '#969696', '#636363', '#252525'],
    colorblindSafe: true,
    printSafe: true,
  },
};
