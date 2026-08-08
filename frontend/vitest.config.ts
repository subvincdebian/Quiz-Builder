import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : import.meta.dirname;

const isStorybook = process.env.STORYBOOK_TEST === 'true';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    // Define independent projects
    projects: [
      {
        name: 'unit',
        plugins: [tsconfigPaths()],
        test: {
          globals: true,
          environment: 'jsdom',
          setupFiles: './src/test/setup.ts',
          include: ['src/**/*.{test,spec}.{ts,tsx}'],
        },
      },
      ...(isStorybook
        ? [
            {
              name: 'storybook',
              plugins: [
                storybookTest({
                  configDir: path.join(dirname, '.storybook'),
                }),
              ],
              test: {
                browser: {
                  enabled: true,
                  headless: true,
                  provider: playwright({}),
                  instances: [{ browser: 'chromium' }],
                },
              },
            },
          ]
        : []),
    ],
  },
});
