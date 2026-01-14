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
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Bootstrap
            if (id.includes('bootstrap')) {
              return 'ui-framework';
            }
            
            // Internationalization  
            if (id.includes('i18next')) {
              return 'i18n';
            }
            
            // Logging
            if (id.includes('@logtail')) {
              return 'logging';
            }
            
            // Let Vite handle React automatically
            // Everything else
            return 'vendor';
          }
        }
      }
    }
  }
})