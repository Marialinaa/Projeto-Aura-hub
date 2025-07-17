import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

export default defineConfig(({ mode }) => ({
  // Configurações do servidor de desenvolvimento
  server: {
    host: "::",
    port: 8080,
    // Proxy para redirecionar requisições PHP
    proxy: {
      '/php-files': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/php-files/, '/aura-hub/php-files')
      }
    }
  },
  // Configurações de build
  build: {
    outDir: "dist/spa",
  },
  // Plugins utilizados
  plugins: [react(), expressPlugin()],
  // Configuração de aliases para imports
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

// Plugin personalizado para integrar Express com Vite
function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Aplica apenas no modo de desenvolvimento
    configureServer(server) {
      // Cria instância do servidor Express
      const app = createServer();

      // Integra o Express com os middlewares do Vite
      server.middlewares.use(app);
    },
  };
}
