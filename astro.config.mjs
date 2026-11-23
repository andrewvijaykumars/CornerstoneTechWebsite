import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cornerstonetech.co.in',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // External files only, so the CSP can stay free of inline script/style hashes.
    inlineStylesheets: 'never',
  },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  vite: {
    build: { assetsInlineLimit: 0, chunkSizeWarningLimit: 700 },
  },
});
