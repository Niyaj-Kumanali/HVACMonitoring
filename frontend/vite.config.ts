import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import inspect from 'vite-plugin-inspect';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    inspect(),
    visualizer({
      open: true, // Automatically open the report in the browser
    }),
  ],
  build: {
    sourcemap: false, // Disable sourcemaps for production
    chunkSizeWarningLimit: 600, // Adjust for chunk sizes
  },
  optimizeDeps: {
    include: ['react', 'react-dom'], // Include essential dependencies
  },
});
