/**
 * Vitest Configuration
 * 
 * This file configures Vitest for running tests in the application.
 * It sets up paths, environment, and other test-related options.
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './test-setup.ts',
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'coverage/**',
        '**/*.d.ts',
        '**/types.ts',
        'test-setup.ts',
        'vitest.config.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './client/src'),
      '@lib': resolve(__dirname, './client/src/lib'),
      '@pages': resolve(__dirname, './client/src/pages'),
      '@components': resolve(__dirname, './client/src/components'),
      '@hooks': resolve(__dirname, './client/src/hooks'),
      '@shared': resolve(__dirname, './shared'),
    },
  },
});