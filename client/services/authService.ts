import axios from "axios";
import config from "../src/config";

const API_URL = (config.API_URL || '').replace(/\/$/, '');

const api = axios.create({
  baseURL: API_URL,
});

// Interceptadores de debug (mantidos)
api.interceptors.request.use(
  (config) => {
    console.log("🚀 Fazendo requisição:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// Teste de conectividade (mantido)
const testConnectivity = async () => {
  try {
    const response = await fetch(`${API_URL}/test`);
    const json = await response.json();
    return { success: true, raw: json };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro desconhecido" };
  }
};

// LOGIN para compatibilidade PHP
  const login = async (login: string, senha: string) => {
  return api.post(
    "/auth/login",
    { login, senha },
    { headers: { "Content-Type": "application/json" } }
  );
};



// Registro usando endpoints que funcionam
const register = async (data: any) => {
  // Mapear dados para o formato que os controllers esperam (apenas campos que existem na tabela)
  const dadosFormatados = {
    nomeCompleto: data.nome,
    email: data.email,
    senha: data.senha
    // Removidos: login, matricula, funcao, instituicao (não existem na tabela solicitacoes)
  };
  
  // Usar endpoint específico baseado no tipo
  const endpoint = data.tipo_usuario === 'bolsista' 
    ? '/usuarios/bolsista' 
    : '/usuarios/responsavel';
    
  console.log(`🔄 Usando endpoint: ${endpoint}`);
  return api.post(endpoint, dadosFormatados);
};

const registrarEntrada = async (bolsista_id: string, atividade?: string) => {
  const token = localStorage.getItem("token");
  const dataAtual = new Date();
  return api.post(
    "/horarios/entrada",
    {
      bolsista_id,
      nome_atividade: atividade || "Atividade do dia",
      data_registro: dataAtual.toISOString().split("T")[0],
      hora_entrada: dataAtual.toTimeString().slice(0, 5),
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
const registrarSaida = async (usuario_id: string) => {
  const token = localStorage.getItem("token");
  const agora = new Date();
  const data_entrada = agora.toISOString().split("T")[0];
  // garante HH:MM:SS
  const hora_saida = agora.toTimeString().slice(0, 8);

  return api.post(
    "/horarios/saida",
    { bolsista_id: usuario_id, data_registro: data_entrada, hora_saida },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

const obterDadosGraficos = async (bolsista_id: string, data_inicio?: string, data_fim?: string) => {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams({
    action: "dados_graficos",
    bolsista_id,
    formato: "grafico",
  });
  if (data_inicio) params.append("data_inicio", data_inicio);
  if (data_fim) params.append("data_fim", data_fim);

  return api.get(`/usuarios/${bolsista_id}/graficos?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const obterBolsistasResponsavel = async (responsavel_id: string) => {
  const token = localStorage.getItem("token");
  return api.get(`/usuarios/${responsavel_id}/bolsistas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default {
  login,
  register,
  registrarEntrada,
  registrarSaida,
  obterDadosGraficos,
  obterBolsistasResponsavel,
  testConnectivity,
};
