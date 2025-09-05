export interface User {
  id: number;
  nome_completo: string;
  nomeCompleto?: string; // Compatibilidade
  email: string;
  tipo_usuario: 'admin' | 'bolsista' | 'responsavel';
  tipoUsuario?: string; // Compatibilidade
  login: string;
  status?: string;
  data_criacao?: string;
  dataSolicitacao?: string; // Compatibilidade
  ultimo_acesso?: string;
  funcao?: string; // Para bolsistas
}

export interface Atribuicao {
  id: number;
  bolsista_id: number;
  responsavel_id: number | null;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  data_criacao: string;
  data_atualizacao: string | null;
  data_conclusao: string | null;
  bolsista_nome?: string;
  responsavel_nome?: string;
}

export interface RegistroEntrada {
  hora_saida: string;
  id: number;
  usuario_id: number;
  data_entrada: string;
  hora_entrada: string;
  nome_completo?: string;
  login?: string;
}

// Interface para o estado global do contexto
export interface AppState {
  activeView: string;
  users: User[];
  allUsers: User[];
  atribuicoes: Atribuicao[];
  message: string;
  isLoading: boolean;
  filtroResponsavel: string;
  filtroBolsista: string;
  filtroDataInicio: string;
  responsavelSelecionado: User | null;
  bolsistaSelecionado: User | null;
  novoBolsista: User | null;
  novoResponsavel: User | null;
  atribuicaoeditando: Atribuicao | null;
  novoResponsaveledicao: User | null;
  novoBolsistaedicao: User | null;
  showPendentes: boolean;
  showBolsistasAprovados: boolean;
  showBolsistasPendentes: boolean;
}

// Interface para as ações do contexto
export interface AppActions {
  setActiveView: (view: string) => void;
  setUsers: (users: User[] | ((prevUsers: User[]) => User[])) => void;
  setAllUsers: (users: User[]) => void;
  setAtribuicoes: (atribuicoes: Atribuicao[] | ((prevAtribuicoes: Atribuicao[]) => Atribuicao[])) => void;
  setMessage: (message: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setFiltroResponsavel: (filtro: string) => void;
  setFiltroBolsista: (filtro: string) => void;
  setFiltroDataInicio: (filtro: string) => void;
  setResponsavelSelecionado: (user: User | null) => void;
  setBolsistaSelecionado: (user: User | null) => void;
  setnovoBolsista: (user: User | null) => void;
  setnovoResponsavel: (user: User | null) => void;
  setatribuicaoeditando: (atribuicao: Atribuicao | null) => void;
  setnovoResponsaveledicao: (user: User | null) => void;
  setNovoBolsistaEdicao: (user: User | null) => void;
  setShowPendentes: (show: boolean) => void;
  setshowBolsistasAprovados: (show: boolean) => void;
  setshowBolsistasPendentes: (show: boolean) => void;
  parseJSONResponse: (response: Response) => Promise<any>;
}

// Contexto completo
export interface AppContext extends AppState, AppActions {}
