import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**/src/test/manual/**',
      '**/src/test/development/**'
    ],
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React and React DOM
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          
          // Bootstrap
          if (id.includes('bootstrap')) {
            return 'ui-framework';
          }
          
          // Individual chart libraries for better caching
          if (id.includes('@nivo/bar')) {
            return 'chart-bar';
          }
          if (id.includes('@nivo/line')) {
            return 'chart-line';
          }
          if (id.includes('@nivo/pie')) {
            return 'chart-pie';
          }
          if (id.includes('@nivo/calendar')) {
            return 'chart-calendar';
          }
          if (id.includes('@nivo/radar')) {
            return 'chart-radar';
          }
          
          // Other @nivo shared dependencies
          if (id.includes('@nivo/')) {
            return 'chart-core';
          }
          
          // Internationalization
          if (id.includes('i18next') || id.includes('react-i18next')) {
            return 'i18n';
          }
          
          // Logging utilities
          if (id.includes('@logtail/browser')) {
            return 'logging';
          }
          
          // Node modules vendor chunk for other dependencies
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})