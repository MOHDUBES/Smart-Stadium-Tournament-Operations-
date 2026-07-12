/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
    coverage: {
      exclude: [
        'eslint.config.js', 'postcss.config.js', 'tailwind.config.js', 'src/vite-env.d.ts', 'src/setupTests.ts', 'src/main.tsx',
        'src/components/**', 'src/pages/**', 'src/App.tsx'
      ]
    }
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'three']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/three') || id.includes('@react-three')) return 'three';
          if (id.includes('framer-motion')) return 'framer';
          if (id.includes('node_modules')) return 'vendor';
        }
      }
    }
  }
} as any)
