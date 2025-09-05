import axios from "axios";
import { Atribuicao } from "./atribuicaoService";
import { Usuario } from "./usuarioService";
import config from "../src/config";

const API_BASE_URL = config.API_URL || 'http://localhost:3001/api';

// Define a URL base da API - usando o helper do projeto
const API_URL = API_BASE_URL;

// Configuração do cliente axios
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar token de autenticação a todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para lidar com erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na requisição API:", error);

    if (error.response) {
      console.error("Detalhes da resposta:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error("Nenhuma resposta recebida:", error.request);
    }

    return Promise.reject(error);
  }
);

// ---------------------------
// Serviços
// ---------------------------

// Serviço de notificações
export const notificationService = {
  listar: () => api.get("/notifications"),
  marcarComoLida: (id: number) => api.post("/notifications/read", { id }),
  marcarTodasComoLidas: () => api.post("/notifications/read-all"),
  excluir: (id: number) => api.delete(`/notifications/${id}`),
};

// Serviço de configurações
export const settingsService = {
  buscar: () => api.get("/settings"),
  atualizar: (settings: any) => api.put("/settings", { settings }),
  exportarDados: () => api.get("/export-data"),
};

// Serviço de usuário logado
export const userService = {
  perfil: () => api.get("/me"),
  atualizarPerfil: (dados: any) => api.put("/me", dados),
  alterarSenha: (senhas: any) => api.put("/me/password", senhas),
};

// Função genérica para fazer requisições
async function fetchApi<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
    credentials: "include",
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
    const responseData = await response.json();

    if (!response.ok || !responseData.success) {
      throw new Error(responseData.message || "Erro ao processar requisição");
    }

    return responseData.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro na API:", message);
    throw error;
  }
}

// Auth
export async function login(credentials: { login: string; senha: string }) {
  const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (data.success || data?.data) {
    // compatibilidade com diferentes formatos
    const token = data.data?.token || data.token;
    const usuario = data.data?.usuario || data.usuario;
    if (token) localStorage.setItem("token", token);
    if (usuario) localStorage.setItem("usuario", JSON.stringify(usuario));
    return data;
  } else {
    console.error("Erro no login:", data.message || data.error);
    throw new Error(data.message || data.error || 'Erro no login');
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  window.location.href = "/login";
}

// Atribuições
export async function listarAtribuicoes(filtros?: Record<string, string>) {
  let endpoint = "atribuicoes";

  if (filtros && Object.keys(filtros).length > 0) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filtros)) {
      params.append(key, value);
    }
    endpoint += `?${params.toString()}`;
  }

  return fetchApi<Atribuicao[]>(endpoint);
}

export async function criarAtribuicao(
  atribuicao: Omit<
    Atribuicao,
    "id" | "data_criacao" | "data_atualizacao" | "data_conclusao"
  >
) {
  return fetchApi<Atribuicao>("atribuicoes", "POST", atribuicao);
}

export async function atualizarAtribuicao(id: number, dados: Partial<Atribuicao>) {
  return fetchApi<Atribuicao>(`atribuicoes/${id}`, "PUT", { id, ...dados });
}

export async function excluirAtribuicao(id: number) {
  return fetchApi<void>(`atribuicoes/${id}`, "DELETE");
}

// Usuários
export async function listarUsuarios(tipo?: string) {
  let endpoint = `usuarios`;
  if (tipo) {
    endpoint += `?tipo=${tipo}`;
  }
  return fetchApi<Usuario[]>(endpoint);
}

// Registros de entrada
export async function listarRegistrosEntrada(bolsistaId?: number | "all") {
  if (!bolsistaId) return fetchApi('horarios');
  const endpoint = `horarios/bolsista/${bolsistaId}`;
  return fetchApi(endpoint);
}

// Registrar saída do bolsista
export async function registrarSaidaBolsista(bolsistaId: number, data_registro?: string) {
  const payload: any = {
    bolsista_id: bolsistaId,
  hora_saida: new Date().toLocaleTimeString('pt-BR', { hour12: false }),
  };
  if (data_registro) {
    payload.data_registro = data_registro;
  } else {
    payload.data_registro = new Date().toISOString().slice(0, 10);
  }
  return fetchApi('horarios/saida', 'POST', payload);
}

// Helper para obter o usuário atual
export function getUsuarioAtual() {
  const usuarioString = localStorage.getItem("usuario");
  if (!usuarioString) return null;

  try {
    return JSON.parse(usuarioString);
  } catch (e) {
    return null;
  }
}

// Helper para verificar se o usuário está autenticado
export function isAutenticado() {
  return !!localStorage.getItem("token");
}

// Novas funções adicionadas
export async function getRegistrosEntrada(bolsistaId = null) {
  if (!bolsistaId) return fetchApi('horarios');
  const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/horarios/bolsista/${bolsistaId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Erro ao obter registros');
  }

  return data.data;
}

export default api;
