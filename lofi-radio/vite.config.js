import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'intl-vendor': ['react-intl'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['react-icons', 'pure-react-carousel'],
        },
      },
    },
  },
});
