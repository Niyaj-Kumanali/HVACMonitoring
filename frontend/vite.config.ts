import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import inspect from 'vite-plugin-inspect'; // Import the inspect plugin

export default defineConfig({
  plugins: [
    react(),
    inspect(), // Add the inspect plugin
  ],
});
