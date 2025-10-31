// MOCKS EM DEV
const isDev = typeof window !== 'undefined' && import.meta.env.DEV;

// Função para simular delay
function delay(ms = 400) { return new Promise(r => setTimeout(r, ms)); }

// Dados mocados
const mockUser = {
  id: 1,
  nome: 'Usuário Teste',
  email: 'teste@mock.com',
  tipo_usuario: 'admin',
  token: 'mock-token-123',
};
const mockUsuarios = [
  { id: 1, nome: 'Administrador Teste', email: 'admin@mock.com', tipo_usuario: 'admin', login: 'admin', senha: 'admin123' },
  // Responsável com acesso liberado solicitado pelo usuário
  { id: 10, nome: 'Maria Silva', email: 'maria.lina149@gmail', tipo_usuario: 'responsavel', login: 'Maria.silva110', senha: 'maria123', materia: 'Matemática', funcao: 'coordenadora', acesso_liberado: true },
  // Bolsista fictício para uso no Android Studio
  { id: 11, nome: 'Bolsista Android', email: 'bolsista.android@mock.com', tipo_usuario: 'bolsista', login: 'bolsista_android', senha: 'bolsista123' },
  { id: 2, nome: 'João', email: 'joao@mock.com', tipo_usuario: 'bolsista', login: 'joao', senha: 'joao123' },
  { id: 3, nome: 'Ana', email: 'ana@mock.com', tipo_usuario: 'responsavel', login: 'ana', senha: 'ana123' },
];
const mockAtribuicoes = [
  { id: 100, titulo: 'Atribuição Android', descricao: 'Atribuição para bolsista Android', bolsista_id: 11, responsavel_id: 10, status: 'pendente' },
  { id: 101, titulo: 'Atribuição Regular', descricao: 'Descrição regular', bolsista_id: 2, responsavel_id: 3, status: 'em_andamento' },
];
const mockAtividades = [
  { id: 1, titulo: 'Atividade 1', descricao: 'Desc 1', usuario_id: 2 },
  { id: 2, titulo: 'Atividade 2', descricao: 'Desc 2', usuario_id: 2 },
];

// Definição global de fetchApi
async function fetchApi<T>(endpoint: string, method: "GET" | "POST" | "PUT" | "DELETE" = "GET", data?: any): Promise<T> {
  if (isDev) {
    await delay();
    // Mocks principais
    if (endpoint === 'auth/login' && method === 'POST') {
      // Procura usuário pelos campos de login
      const found = mockUsuarios.find(u => u.login && data?.login && u.login === data.login && u.senha && data?.senha && u.senha === data.senha);
      if (!found) return { success: false, message: 'Credenciais inválidas' } as any;
      // Se for responsável e o acesso não estiver liberado
      if (found.tipo_usuario === 'responsavel' && found.acesso_liberado === false) {
        return { success: false, message: 'Acesso do responsável não liberado' } as any;
      }
      // Retorna token e usuário (sem senha)
  const { senha, ...usuarioSemSenha } = found as any;
  return { success: true, data: { token: mockUser.token, usuario: usuarioSemSenha } } as any;
    }
    if (endpoint === 'usuarios') {
      return { success: true, data: mockUsuarios } as any;
    }
    if (endpoint.startsWith('atribuicoes')) {
      return { success: true, data: mockAtribuicoes } as any;
    }
    if (endpoint.startsWith('atividades')) {
      return { success: true, data: mockAtividades } as any;
    }
    // Adicione outros mocks conforme necessário
    return { success: true, data: [] } as any;
  }
  // ...código real abaixo...
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

import { Atribuicao } from "./atribuicaoService";
import { Usuario } from "./usuarioService";
import config from "../src/config";

const API_BASE_URL = config.API_URL || "http://localhost:3001/api";



// Serviços convertidos para usar fetchApi (mock em DEV)
export const notificationService = {
  listar: () => fetchApi('notifications'),
  marcarComoLida: (id: number) => fetchApi('notifications/read', 'POST', { id }),
  marcarTodasComoLidas: () => fetchApi('notifications/read-all', 'POST'),
  excluir: (id: number) => fetchApi(`notifications/${id}`, 'DELETE'),
};

export const settingsService = {
  buscar: () => fetchApi('settings'),
  atualizar: (settings: any) => fetchApi('settings', 'PUT', { settings }),
  exportarDados: () => fetchApi('export-data'),
};

export const userService = {
  perfil: () => fetchApi('me'),
  atualizarPerfil: (dados: any) => fetchApi('me', 'PUT', dados),
  alterarSenha: (senhas: any) => fetchApi('me/password', 'PUT', senhas),
};


// Auth
export async function login(credentials: { login: string; senha: string }) {
  const resp = await fetchApi<{ success: boolean; data?: { token: string; usuario: any }; message?: string }>('auth/login', 'POST', credentials);
  if (resp.success && resp.data) {
    const token = resp.data.token;
    const usuario = resp.data.usuario;
    if (token) localStorage.setItem("token", token);
    if (usuario) localStorage.setItem("usuario", JSON.stringify(usuario));
    return resp;
  } else {
    throw new Error(resp.message || 'Erro no login');
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  window.location.href = "/login";
}

// Atribuições
export async function listarAtribuicoes(filtros?: Record<string, string>): Promise<Atribuicao[]> {
  return fetchApi<Atribuicao[]>('atribuicoes', 'GET', filtros);
}

export async function criarAtribuicao(atribuicao: Partial<Atribuicao>): Promise<Atribuicao> {
  return fetchApi<Atribuicao>('atribuicoes', 'POST', atribuicao);
}

export async function atualizarAtribuicao(id: number, atribuicao: Partial<Atribuicao>): Promise<Atribuicao> {
  return fetchApi<Atribuicao>(`atribuicoes/${id}`, 'PUT', atribuicao);
}

export async function excluirAtribuicao(id: number): Promise<void> {
  return fetchApi<void>(`atribuicoes/${id}`, 'DELETE');
}

// Usuários
export async function listarUsuarios(filtros?: Record<string, string>): Promise<Usuario[]> {
  return fetchApi<Usuario[]>('usuarios', 'GET', filtros);
}



export async function getRegistrosEntrada(bolsistaId: number | null = null): Promise<any[]> {
  if (!bolsistaId) return fetchApi<any[]>('horarios');
  return fetchApi<any[]>(`horarios/bolsista/${bolsistaId}`);
}

export async function registrarSaidaBolsista(bolsistaId: number, data_registro?: string): Promise<any> {
  const payload: any = {
    bolsista_id: bolsistaId,
    hora_saida: new Date().toLocaleTimeString('pt-BR', { hour12: false }),
    data_registro: data_registro || new Date().toISOString().slice(0, 10)
  };
  return fetchApi('horarios/saida', 'POST', payload);
}

export function getUsuarioAtual() {
  const usuarioString = localStorage.getItem("usuario");
  if (!usuarioString) return null;
  try {
    return JSON.parse(usuarioString);
  } catch (e) {
    return null;
  }
}

export function isAutenticado() {
  return !!localStorage.getItem("token");
}

export type { Atribuicao, Usuario };

// Default export para compatibilidade com imports antigos
export default {
  get: async <T = any>(url: string, config?: any): Promise<{ data: T }> => {
    const data = await fetchApi<T>(url.replace(/^\//, ''), 'GET', config?.params);
    return { data };
  },
  post: async <T = any>(url: string, payload?: any): Promise<{ data: T }> => {
    const data = await fetchApi<T>(url.replace(/^\//, ''), 'POST', payload);
    return { data };
  },
  put: async <T = any>(url: string, payload?: any): Promise<{ data: T }> => {
    const data = await fetchApi<T>(url.replace(/^\//, ''), 'PUT', payload);
    return { data };
  },
  delete: async <T = any>(url: string): Promise<{ data: T }> => {
    const data = await fetchApi<T>(url.replace(/^\//, ''), 'DELETE');
    return { data };
  },
  login,
  logout,
  listarAtribuicoes,
  criarAtribuicao,
  atualizarAtribuicao,
  excluirAtribuicao,
  listarUsuarios,
  getRegistrosEntrada,
  registrarSaidaBolsista,
  getUsuarioAtual,
  isAutenticado,
  notificationService,
  settingsService,
  userService,
};

