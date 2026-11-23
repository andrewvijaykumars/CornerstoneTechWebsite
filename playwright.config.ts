import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  retries: 0,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4321', channel: 'msedge', trace: 'off' },
  webServer: { command: 'node scripts/serve.mjs', url: 'http://localhost:4321', reuseExistingServer: true, timeout: 20_000 },
});
