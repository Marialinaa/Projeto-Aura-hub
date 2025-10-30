import axios from "axios";

import config from "../src/config";

const API_URL = (config.API_URL || '').replace(/\/$/, '');

export const listarSolicitacoes = async () => {
  const res = await axios.get(`${API_URL}/usuarios/solicitacoes/pendentes`);
  return res.data;
};

export const criarSolicitacao = async (data: any) => {
  const res = await axios.post(`${API_URL}/auth/register`, data);
  return res.data;
};

export const aprovarSolicitacao = async (id: number) => {
  const res = await axios.post(`${API_URL}/auth/approve`, { id });
  return res.data;
};

export const rejeitarSolicitacao = async (id: number) => {
  const res = await axios.post(`${API_URL}/auth/reject`, { id });
  return res.data;
};

export default {
  listarSolicitacoes,
  criarSolicitacao,
  aprovarSolicitacao,
  rejeitarSolicitacao,
};
