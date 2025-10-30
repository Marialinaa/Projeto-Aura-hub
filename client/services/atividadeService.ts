import api from './api';

export const listarAtividades = async (usuario_id?: number) => {
  const params: any = {};
  if (usuario_id) params.usuario_id = usuario_id;
  const res = await api.get('/atividades', { params });
  return res.data?.data ?? res.data;
};

export const criarAtividade = async (atividade: { titulo: string; descricao: string; usuario_id: number }) => {
  const res = await api.post('/atividades', atividade);
  return res.data?.data ?? res.data;
};

export const atualizarAtividade = async (atividade: { id: number; titulo: string; descricao: string }) => {
  const res = await api.put(`/atividades/${atividade.id}`, atividade);
  return res.data?.data ?? res.data;
};

export const excluirAtividade = async (id: number) => {
  const res = await api.delete(`/atividades/${id}`);
  return res.data?.data ?? res.data;
};

export default {
  listarAtividades,
  criarAtividade,
  atualizarAtividade,
  excluirAtividade,
};
