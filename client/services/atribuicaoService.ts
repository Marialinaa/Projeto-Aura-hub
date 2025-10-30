// client/services/atribuicaoService.ts
import api from './api';

export interface Atribuicao {
  id: number;
  titulo?: string;
  descricao?: string;
  bolsista_id?: number | string;
  bolsista_nome?: string;
  bolsistaNome?: string;
  responsavel_id?: number | null;
  responsavel_nome?: string;
  responsavelNome?: string;
  status?: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  data_criacao?: string;
  dataAtribuicao?: string;
  data_conclusao?: string | null;
  observacoes?: string;
  atividade_nome?: string;
}

interface CriarAtribuicaoParams {
  responsavelId: number;
  bolsistaId: string;
  observacoes?: string;
}

class AtribuicaoService {
  // Listar todas as atribuições
  async listar(): Promise<Atribuicao[]> {
    console.log('🔍 Iniciando requisição de listagem de atribuições...');
    try {
      const response = await api.get('/atribuicoes');
      console.log('✅ Atribuições recebidas:', response.data);
      return response.data.data || [];
    } catch (error) {
      console.error('❌ Erro ao listar atribuições:', error);
      // Se não conseguir conectar, retornar array vazio para não quebrar a UI
      return [];
    }
  }

  // Criar uma nova atribuição
  async criar(params: CriarAtribuicaoParams): Promise<Atribuicao> {
    console.log('🔍 Criando nova atribuição...', params);
    try {
      const response = await api.post('/atribuicoes', params);
      console.log('✅ Atribuição criada:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Erro ao criar atribuição:', error);
      throw error;
    }
  }

  // Atualizar uma atribuição existente
  async atualizar(id: number, params: CriarAtribuicaoParams): Promise<Atribuicao> {
    console.log(`🔍 Atualizando atribuição ${id}...`, params);
    try {
      const response = await api.put(`/atribuicoes/${id}`, params);
      console.log('✅ Atribuição atualizada:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Erro ao atualizar atribuição:', error);
      throw error;
    }
  }

  // Remover uma atribuição
  async remover(id: number): Promise<void> {
    console.log(`🔍 Removendo atribuição ${id}...`);
    try {
      await api.delete(`/atribuicoes/${id}`);
      console.log('✅ Atribuição removida com sucesso');
    } catch (error) {
      console.error('❌ Erro ao remover atribuição:', error);
      throw error;
    }
  }
}

const atribuicaoService = new AtribuicaoService();
export default atribuicaoService;
