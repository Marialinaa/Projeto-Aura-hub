import axios from "axios";
import config from "../src/config";

const API_URL = `${config.API_URL.replace(/\/$/, '')}/api_atividades.php`;

export const listarAtividades = async (usuario_id?: number) => {
  const params = usuario_id ? `?rota=listar&usuario_id=${usuario_id}` : "?rota=listar";
  const res = await axios.get(`${API_URL}${params}`);
  return res.data;
};

export const criarAtividade = async (atividade: { 
  titulo: string; 
  descricao: string; 
  usuario_id: number 
}) => {
  const res = await axios.post(`${API_URL}?rota=criar`, atividade);
  return res.data;
};

export const atualizarAtividade = async (atividade: { 
  id: number; 
  titulo: string; 
  descricao: string 
}) => {
  const res = await axios.post(`${API_URL}?rota=atualizar`, atividade);
  return res.data;
};

export const excluirAtividade = async (id: number) => {
  const res = await axios.post(`${API_URL}?rota=excluir`, { id });
  return res.data;
};

export default {
  listarAtividades,
  criarAtividade,
  atualizarAtividade,
  excluirAtividade,
};
