import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        // Usa variável de ambiente ou localhost como fallback
        target: process.env.VITE_API_LOCAL || 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        // Mantém '/api' no path (não reescreve)
        // porque o backend espera '/api/...' nas rotas
      },
    },
  },
});
