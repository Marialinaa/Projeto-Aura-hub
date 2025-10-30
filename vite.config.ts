import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    strictPort: true, // Isso fará com que o Vite falhe se a porta 3000 não estiver disponível
    proxy: {
      '/api': {
  // Permite sobrescrever o target em dev sem editar o arquivo
  target: process.env.LOCAL_API_TARGET || 'https://back-end-aura-hubb-production.up.railway.app',
        changeOrigin: true,
        secure: true,
      }
    }
  },
})