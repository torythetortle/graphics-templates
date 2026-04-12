import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    conditions: ['svelte', 'import', 'module', 'browser', 'default'],
  },
  server: {
    fs: {
      allow: ['../..'],
    },
  },
  ssr: {
    // Resolve .js → .ts for workspace packages in SSR
    noExternal: ['@graphics-templates/core', '@graphics-templates/svelte'],
  },
});
