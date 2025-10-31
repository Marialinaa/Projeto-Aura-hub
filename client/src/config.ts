// Utilitário de configuração de API para o frontend
// Escolhe a melhor URL baseada em variáveis de ambiente ou consulta /api/config em desenvolvimento

// URLs do backend
const PROD_URL = (import.meta.env.VITE_API_PROD as string | undefined) || 'https://server-zb16.onrender.com/api';
const EMULATOR_URL = import.meta.env.VITE_API_EMULATOR as string | undefined;
const LOCAL_URL = (import.meta.env.VITE_API_LOCAL as string | undefined) || 'http://localhost:3001/api';

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
  // Em produção, usa sempre PROD_URL
  if (import.meta.env.MODE === 'production') {
    return PROD_URL;
  }

  // Em desenvolvimento:
  // 1. Se for Android Emulator, usa URL específica
  if (isAndroidEmulator() && EMULATOR_URL) {
    return EMULATOR_URL;
  }

  // 2. Caso contrário, usa URL local
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

// Log para depuração
try {
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    console.log('🔧 [config] API_URL resolved to:', API_URL);
    console.log('🌍 [config] MODE:', import.meta.env.MODE);
    console.log('🎯 [config] VITE_API_PROD:', PROD_URL);
    console.log('💻 [config] VITE_API_LOCAL:', LOCAL_URL);
  }
} catch (e) {}

export default {
  API_URL,
  getApiUrlRuntime,
  getApiUrlSync,
};
