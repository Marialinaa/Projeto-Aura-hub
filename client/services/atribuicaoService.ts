// client/services/atribuicaoService.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Atribuicao {
  id: number;
  responsavelId: number;
  bolsistaId: string;  // matrícula do bolsista
  responsavelNome: string;
  bolsistaNome: string;
  dataAtribuicao: string;
  status: 'ativa' | 'inativa';
  observacoes?: string;
}

export interface AtribuicaoRequest {
  responsavelId: number;
  bolsistaId: string;
  observacoes?: string;
}

export const atribuicaoService = {
  // Listar todas as atribuições
  async listar(): Promise<Atribuicao[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/atribuicoes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Erro ao listar atribuições');
      }

      return data.data || [];
    } catch (error) {
      console.error('❌ Erro ao listar atribuições:', error);
      throw error;
    }
  },

  // Criar nova atribuição
  async criar(atribuicao: AtribuicaoRequest): Promise<Atribuicao> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/atribuicoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(atribuicao),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Erro ao criar atribuição');
      }

      return data.data;
    } catch (error) {
      console.error('❌ Erro ao criar atribuição:', error);
      throw error;
    }
  },

  // Atualizar atribuição
  async atualizar(id: number, atribuicao: AtribuicaoRequest): Promise<Atribuicao> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/atribuicoes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(atribuicao),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Erro ao atualizar atribuição');
      }

      return data.data;
    } catch (error) {
      console.error('❌ Erro ao atualizar atribuição:', error);
      throw error;
    }
  },

  // Remover atribuição
  async remover(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/atribuicoes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Erro ao remover atribuição');
      }
    } catch (error) {
      console.error('❌ Erro ao remover atribuição:', error);
      throw error;
    }
  },
};
