// Tipos para registro de usuários
export interface RegistrationData {
  nome: string;
  funcao: string;
  endereco: string;
  email: string;
  login: string;
  senha: string;
  tipoUsuario: "responsavel" | "bolsista";
  enviarEmailAdmin?: boolean;
}

// Tipos para resposta da API
export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  // Formato específico do backend PHP
  status?: string;
  aviso?: string;
  erro?: string;
}

// Tipos para usuário
export interface User {
  id: number;
  nomeCompleto: string;
  funcao: string;
  email: string;
  login: string;
  endereco: string;
  tipoUsuario: "responsavel" | "bolsista";
  status: "pendente" | "liberado" | "bloqueado";
  dataSolicitacao: string;
  dataAprovacao?: string;
  matricula?: string; // Para bolsistas
}

// Tipos para notificações
export interface Notification {
  id: number;
  titulo: string;
  mensagem: string;
  tipo: "info" | "success" | "warning" | "error";
  lida: boolean;
  dataCriacao: string;
  usuarioId?: number;
}

// Tipos para configurações
export interface Settings {
  emailAdmin: string;
  nomeEmpresa: string;
  logoUrl?: string;
  temaSite: "light" | "dark";
  notificacoesPorEmail: boolean;
}

// Tipos para upload
export interface Upload {
  id: number;
  nomeArquivo: string;
  tipoArquivo: string;
  tamanho: number;
  url: string;
  usuarioId: number;
  dataUpload: string;
}
