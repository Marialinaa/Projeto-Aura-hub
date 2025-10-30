import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import config from '../src/config';
import { getUsuarioAtual } from '../services/api';
import { User, Atribuicao, AppContext as IAppContext } from '../types';

export interface AppContextType extends IAppContext {
  isUserLoaded: boolean;
  userId: number | null;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estados originais do AppContext
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [atribuicoes, setAtribuicoes] = useState<Atribuicao[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filtroResponsavel, setFiltroResponsavel] = useState<string>('');
  const [filtroBolsista, setFiltroBolsista] = useState<string>('');
  const [filtroDataInicio, setFiltroDataInicio] = useState<string>('');
  const [responsavelSelecionado, setResponsavelSelecionado] = useState<User | null>(null);
  const [bolsistaSelecionado, setBolsistaSelecionado] = useState<User | null>(null);
  const [novoBolsista, setnovoBolsista] = useState<User | null>(null);
  const [novoResponsavel, setnovoResponsavel] = useState<User | null>(null);
  const [atribuicaoeditando, setatribuicaoeditando] = useState<Atribuicao | null>(null);
  const [novoResponsaveledicao, setnovoResponsaveledicao] = useState<User | null>(null);
  const [novoBolsistaedicao, setNovoBolsistaEdicao] = useState<User | null>(null);
  const [showPendentes, setShowPendentes] = useState<boolean>(true);
  const [showBolsistasAprovados, setshowBolsistasAprovados] = useState<boolean>(true);
  const [showBolsistasPendentes, setshowBolsistasPendentes] = useState<boolean>(true);

  // Novo estado para controlar se o usuário já foi carregado
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(false);
  // Estado para armazenar o id do usuário logado
  const [userId, setUserId] = useState<number | null>(null);

  // Carrega usuário logado ao montar
  useEffect(() => {
    async function carregarUsuario() {
      try {
        setIsLoading(true);
        // Primeiro, tentar obter usuário armazenado localmente (após login)
        const localUser = getUsuarioAtual();
        if (localUser) {
          setUsers([localUser]);
          setUserId(localUser.id ?? null);
          setIsUserLoaded(true);
          return;
        }

        // Fallback: tentar obter pelo token (se o token contém id no payload)
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const parts = token.split('.');
            if (parts.length >= 2) {
              const payload = JSON.parse(atob(parts[1]));
              const id = payload.sub || payload.user_id || payload.userId || payload.userId;
              if (id) {
                const res = await fetch(`${config.API_URL.replace(/\/$/, '')}/usuarios/${id}`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data && (data.success || data.data)) {
                  const u = data.data || data.user || data;
                  setUsers([u]);
                  setUserId(u.id ?? null);
                  setIsUserLoaded(true);
                  return;
                }
              }
            }
          } catch (err) {
            // se falhar, segue para mostrar mensagem de erro
          }
        }

        setMessage('Não foi possível carregar usuário.');
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        setMessage('Erro ao carregar usuário.');
      } finally {
        setIsLoading(false);
      }
    }
    carregarUsuario();
  }, []);

  const parseJSONResponse = async (response: Response) => {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch (error) {
      console.error('Erro ao analisar resposta JSON:', error);
      return { success: false, message: 'Erro ao processar resposta do servidor' };
    }
  };

  const contextValue: AppContextType = {
    activeView,
    setActiveView,
    users,
    setUsers,
    allUsers,
    setAllUsers,
    atribuicoes,
    setAtribuicoes,
    message,
    setMessage,
    isLoading,
    setIsLoading,
    filtroResponsavel,
    setFiltroResponsavel,
    filtroBolsista,
    setFiltroBolsista,
    filtroDataInicio,
    setFiltroDataInicio,
    responsavelSelecionado,
    setResponsavelSelecionado,
    bolsistaSelecionado,
    setBolsistaSelecionado,
    novoBolsista,
    setnovoBolsista,
    novoResponsavel,
    setnovoResponsavel,
    atribuicaoeditando,
    setatribuicaoeditando,
    novoResponsaveledicao,
    setnovoResponsaveledicao,
    novoBolsistaedicao,
    setNovoBolsistaEdicao,
    showPendentes,
    setShowPendentes,
    showBolsistasAprovados,
    setshowBolsistasAprovados,
    showBolsistasPendentes,
    setshowBolsistasPendentes,
    parseJSONResponse,
    isUserLoaded,
    userId,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
