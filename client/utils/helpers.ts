import { User, Atribuicao } from '../types';

// Função para filtrar bolsistas e responsáveis
export const filterUsersByType = (users: User[], tipo: string): User[] => {
  return users.filter(user => user.tipo_usuario === tipo);
};

// Função para filtrar usuários por status
export const filterUsersByStatus = (users: User[], status: string): User[] => {
  return users.filter(user => user.status === status);
};

// Função para filtrar atribuições por responsável
export const filterAtribuicoesByResponsavel = (atribuicoes: Atribuicao[], responsavelId: number | null): Atribuicao[] => {
  if (!responsavelId) return atribuicoes;
  return atribuicoes.filter(a => a.responsavel_id === responsavelId);
};

// Função para filtrar atribuições por bolsista
export const filterAtribuicoesByBolsista = (atribuicoes: Atribuicao[], bolsistaId: number | null): Atribuicao[] => {
  if (!bolsistaId) return atribuicoes;
  return atribuicoes.filter(a => a.bolsista_id === bolsistaId);
};

// Função para filtrar atribuições por data
export const filterAtribuicoesByDate = (atribuicoes: Atribuicao[], dataInicio: string): Atribuicao[] => {
  if (!dataInicio) return atribuicoes;
  return atribuicoes.filter(a => new Date(a.data_criacao) >= new Date(dataInicio));
};

// Função para obter IDs únicos de responsáveis ou bolsistas
export const getUniqueUserIds = (atribuicoes: Atribuicao[], field: 'responsavel_id' | 'bolsista_id'): Set<number> => {
  const ids = atribuicoes.map(a => a[field]).filter(id => id !== null) as number[];
  return new Set(ids);
};

// Função para formatar data
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Função para obter classe de estilo baseada no status
export const getStatusClass = (status: string): string => {
  switch(status) {
    case 'pendente': return 'bg-yellow-100 text-yellow-800';
    case 'em_andamento': return 'bg-blue-100 text-blue-800';
    case 'concluida': return 'bg-green-100 text-green-800';
    case 'cancelada': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Função para obter label do status
export const getStatusLabel = (status: string): string => {
  switch(status) {
    case 'pendente': return 'Pendente';
    case 'em_andamento': return 'Em Andamento';
    case 'concluida': return 'Concluída';
    case 'cancelada': return 'Cancelada';
    default: return status;
  }
};
