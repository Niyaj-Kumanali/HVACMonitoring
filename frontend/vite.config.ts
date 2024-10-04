import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import inspect from 'vite-plugin-inspect';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && inspect(), // Only use in development
  ].filter(Boolean),
  build: {
    sourcemap: mode === 'development', // Source maps only in development
  },
}));
