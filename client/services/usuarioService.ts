import axios from "axios";

const API_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:3001/api';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  login: string;
  tipoUsuario: string;
  status: string;
  dataCriacao: string;
  dataAprovacao?: string;
  funcao?: string;
  matricula?: string;
  curso?: string;
}

interface SolicitacaoPendente {
  id: string;
  nome: string;
  email: string;
  login: string;
  tipoUsuario: string;
  status: string;
  dataCriacao: string;
  funcao?: string;
  matricula?: string;
  curso?: string;
}

interface ListaUsuariosResponse {
  usuarios: Usuario[];
  solicitacoesPendentes: SolicitacaoPendente[];
}

export const listarUsuarios = async (tipo?: string, status?: string): Promise<any> => {
  try {
    let url = `${API_URL}/usuarios`;
    const params = new URLSearchParams();
    
    if (tipo) params.append('tipo_usuario', tipo);
    if (status) params.append('status', status);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error);
    throw new Error('Erro ao buscar usuários');
  }
};

export const registrarUsuario = async (data: any) => {
  const res = await axios.post(`${API_URL}/auth/register`, data);
  return res.data;
};

export const aprovarUsuario = async (id: string | number) => {
  const res = await axios.post(`${API_URL}/auth/approve`, { id });
  return res.data;
};

export const rejeitarUsuario = async (id: string | number) => {
  const res = await axios.post(`${API_URL}/auth/reject`, { id });
  return res.data;
};

// Manter compatibilidade com código antigo
const listar = async (): Promise<ListaUsuariosResponse> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error);
    throw new Error('Erro ao buscar usuários');
  }
};

const aprovar = async (id: string): Promise<Usuario> => {
  try {
    const response = await axios.put(`${API_URL}`, { id, acao: 'aprovar' });
    return response.data.data;
  } catch (error) {
    console.error('❌ Erro ao aprovar usuário:', error);
    throw new Error('Erro ao aprovar usuário');
  }
};

const rejeitar = async (id: string): Promise<void> => {
  try {
    await axios.put(`${API_URL}`, { id, acao: 'rejeitar' });
  } catch (error) {
    console.error('❌ Erro ao rejeitar usuário:', error);
    throw new Error('Erro ao rejeitar usuário');
  }
};

export default {
  listar,
  aprovar,
  rejeitar,
  listarUsuarios,
  registrarUsuario,
  aprovarUsuario,
  rejeitarUsuario,
};

export type { Usuario, SolicitacaoPendente, ListaUsuariosResponse };
