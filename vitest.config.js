import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/unit/**/*.spec.{ts,tsx}'],
    setupFiles: ['tests/unit/setup.ts'],
    testTimeout: 5000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});