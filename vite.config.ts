import path from 'node:path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary', 'lcov', 'cobertura'],
      reportsDirectory: './coverage',
      thresholds: {
        statements: 95,
        branches: 90,
        functions: 95,
        lines: 95,
      },
      include: ['src/**/*.{ts,tsx}'],
      // Measure application behavior; omit tests, static fixtures, and supplied UI infrastructure.
      exclude: [
        '**/*.test.{ts,tsx}',
        'src/test/**',
        'src/components/ui/**',
        'src/data/**',
        'src/lib/**',
        'src/main.tsx',
      ],
    },
  },
})

