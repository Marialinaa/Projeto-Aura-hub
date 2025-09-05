// Utilitário de configuração de API para o frontend
// Escolhe a melhor URL baseada em variáveis de ambiente ou consulta /api/config em desenvolvimento

const PROD_URL = (import.meta.env.VITE_API_PROD as string | undefined) || 'https://back-end-aura-hubb-production.up.railway.app/api';
const EMULATOR_URL = import.meta.env.VITE_API_EMULATOR as string | undefined;
// Em ambiente de desenvolvimento, use o proxy do Vite (rota relativa '/api')
// Isso evita problemas de CORS e facilita testes locais.
const LOCAL_URL = (import.meta.env.VITE_API_LOCAL as string | undefined) || '/api';

// Detecta se estamos rodando no emulador Android (heurística simples)
function isAndroidEmulator() {
  try {
    return /Android/i.test(navigator.userAgent) && !!import.meta.env.DEV;
  } catch (e) {
    return false;
  }
}

// Resolvido de forma síncrona (útil para inicialização rápida)
export function getApiUrlSync(): string {
  if (import.meta.env.MODE === 'production' && PROD_URL) return PROD_URL;
  if (isAndroidEmulator() && EMULATOR_URL) return EMULATOR_URL;
  return LOCAL_URL;
}

// Tenta obter a URL da API do backend (rota /api/config) em ambiente de desenvolvimento.
// Se falhar, retorna a URL síncrona.
export async function getApiUrlRuntime(): Promise<string> {
  // Prioriza variável de ambiente VITE_API_URL se definida
  const envUrl = (import.meta.env.VITE_API_URL as string | undefined) || undefined;
  if (envUrl) return envUrl;

  if (import.meta.env.DEV) {
    try {
      const resp = await fetch('/api/config');
      if (resp.ok) {
        const json = await resp.json();
        if (json && json.apiUrl) return json.apiUrl;
      }
    } catch (e) {
      // ignora e usa fallback
    }
  }

  return getApiUrlSync();
}

// Valor rápido para usar em módulos que precisam de uma constante
export const API_URL = getApiUrlSync();

export default {
  API_URL,
  getApiUrlRuntime,
  getApiUrlSync,
};
