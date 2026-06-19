import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    root: '.',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
