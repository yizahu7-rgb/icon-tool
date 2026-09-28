import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/local-model': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/local-model/, '')
      },
      '/api': {
        target: 'https://icontool.online',
        changeOrigin: true
      }
    }
  },
  preview: {
    proxy: {
      '/local-model': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/local-model/, '')
      },
      '/api': {
        target: 'https://icontool.online',
        changeOrigin: true
      }
    }
  }
});
