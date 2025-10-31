/**
 * ============================================
 * CONFIGURAÇÃO AUTOMÁTICA DE AMBIENTE (AURA-HUB)
 * ============================================
 *
 * Este script carrega as variáveis de ambiente do arquivo:
 *  - aiven-deploy.json (produção)
 *  - .env (desenvolvimento)
 *
 * Uso:
 *    import './config/loadConfig';
 *
 * Assim, todas as variáveis estarão disponíveis em process.env.
 */

import fs from "fs";
import path from "path";
import dotenv from "dotenv";

export function loadConfig() {
  const rootDir = path.resolve(__dirname, "../..");
  const jsonPath = path.join(rootDir, "aiven-deploy.json");
  const envPath = path.join(rootDir, ".env");

  if (fs.existsSync(jsonPath)) {
    console.log("🌍 Carregando configuração de produção (aiven-deploy.json)");

    try {
      const raw = fs.readFileSync(jsonPath, "utf8");
      const json = JSON.parse(raw);

      for (const [key, value] of Object.entries(json)) {
        if (!process.env[key]) {
          process.env[key] = String(value);
        }
      }

      console.log("✅ Variáveis carregadas do aiven-deploy.json");
    } catch (err) {
      console.error("❌ Erro ao carregar aiven-deploy.json:", err);
      process.exit(1);
    }
  } else if (fs.existsSync(envPath)) {
    console.log("💻 Carregando configuração local (.env)");
    dotenv.config({ path: envPath });
  } else {
    console.warn("⚠️ Nenhum arquivo de configuração encontrado (.env ou aiven-deploy.json)");
  }
}

// Executa automaticamente se o script for importado
loadConfig();
