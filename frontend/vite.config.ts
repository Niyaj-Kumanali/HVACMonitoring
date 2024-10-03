import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import inspect from 'vite-plugin-inspect';

export default defineConfig({
  plugins: [
    react(),
    inspect(),
  ],
  build: {
    sourcemap: false, // Disable sourcemaps for production
    chunkSizeWarningLimit: 800, // Adjust for chunk sizes
  },
  optimizeDeps: {
    include: ['react', 'react-dom'], // Include essential dependencies
  },
});
