import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          'animations': [
            'gsap',
            'framer-motion',
            '@gsap/react',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Disable sourcemaps in production
  },
  server: {
    // This ensures React Router paths work in dev mode
    historyApiFallback: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      '@react-oauth/google',
    ],
  },
});
