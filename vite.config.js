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
    server: {
      deps: {
        inline: ['parse5']
      }
    }
  },
  build: {
    outDir: 'build',
    sourcemap: true, // Enable source maps for debugging production issues
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // DON'T split React and React-DOM separately
          // They must be in the same chunk to avoid initialization issues
          if (id.includes('node_modules')) {
            // Group all node_modules into vendor chunks by package
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'react-vendor';
            }
            
            // Bootstrap
            if (id.includes('bootstrap')) {
              return 'ui-framework';
            }
            
            // Internationalization
            if (id.includes('i18next')) {
              return 'i18n';
            }
            
            // Logging utilities
            if (id.includes('@logtail')) {
              return 'logging';
            }
            
            // Everything else from node_modules
            return 'vendor';
          }
        }
      }
    }
  }
})