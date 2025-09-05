import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Atribuicao } from '../types';
import config from '../src/config';

export function useApi() {
  const { 
    setUsers, 
    setAllUsers, 
    setAtribuicoes, 
    setMessage, 
    setIsLoading,
    parseJSONResponse
  } = useAppContext();
  
  const API_BASE_URL = config.API_URL || 'http://localhost:3001/api';
  
  // Função para carregar usuários
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await parseJSONResponse(response);
      
      if (data.success) {
        setUsers(data.data);
        setAllUsers(data.data);
      } else {
        setMessage(data.message || 'Erro ao carregar usuários');
      }
    } catch (error) {
      setMessage('Erro de conexão com o servidor');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para carregar atribuições
  const loadAtribuicoes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/atribuicoes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await parseJSONResponse(response);
      
      if (data.success) {
        setAtribuicoes(data.data);
      } else {
        setMessage(data.message || 'Erro ao carregar atribuições');
      }
    } catch (error) {
      setMessage('Erro de conexão com o servidor');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para criar uma atribuição
  const createAtribuicao = async (atribuicao: Omit<Atribuicao, 'id' | 'data_criacao' | 'data_atualizacao' | 'data_conclusao'>) => {
    setIsLoading(true);
    try {
  const response = await fetch(`${API_BASE_URL}/atribuicoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(atribuicao)
      });
      
      const data = await parseJSONResponse(response);
      
      if (data.success) {
        setMessage('Atribuição criada com sucesso!');
        // Atualiza a lista de atribuições
        setAtribuicoes(prevAtribuicoes => [...prevAtribuicoes, data.data]);
        return true;
      } else {
        setMessage(data.message || 'Erro ao criar atribuição');
        return false;
      }
    } catch (error) {
      setMessage('Erro de conexão com o servidor');
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para atualizar uma atribuição
  const updateAtribuicao = async (id: number, dadosAtualizados: Partial<Atribuicao>) => {
    setIsLoading(true);
    try {
  const response = await fetch(`${API_BASE_URL}/atribuicoes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ id, ...dadosAtualizados })
      });
      
      const data = await parseJSONResponse(response);
      
      if (data.success) {
        setMessage('Atribuição atualizada com sucesso!');
        // Atualiza a lista de atribuições
        setAtribuicoes(prevAtribuicoes => 
          prevAtribuicoes.map(a => a.id === id ? { ...a, ...dadosAtualizados } : a)
        );
        return true;
      } else {
        setMessage(data.message || 'Erro ao atualizar atribuição');
        return false;
      }
    } catch (error) {
      setMessage('Erro de conexão com o servidor');
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para excluir uma atribuição
  const deleteAtribuicao = async (id: number) => {
    setIsLoading(true);
    try {
  const response = await fetch(`${API_BASE_URL}/atribuicoes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await parseJSONResponse(response);
      
      if (data.success) {
        setMessage('Atribuição excluída com sucesso!');
        // Remove a atribuição da lista
        setAtribuicoes(prevAtribuicoes => 
          prevAtribuicoes.filter(a => a.id !== id)
        );
        return true;
      } else {
        setMessage(data.message || 'Erro ao excluir atribuição');
        return false;
      }
    } catch (error) {
      setMessage('Erro de conexão com o servidor');
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    loadUsers,
    loadAtribuicoes,
    createAtribuicao,
    updateAtribuicao,
    deleteAtribuicao
  };
}
