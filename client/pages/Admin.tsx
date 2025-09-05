import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button,
  Card,
  CardContent, 
  CardHeader,
  CardTitle,
  Table,
  TableBody, 
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft,
  CheckCircle, 
  Clock,
  Edit3,
  Filter,
  Mail,
  Menu,
  Save,
  Shield,
  Trash2,
  UserCheck,
  Users,
  UserX,
  X,
  XCircle
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ListaAtribuicoes } from '@/components/atribuicoes/ListaAtribuicoes';
import { IonicToggle } from "@/components/ui/ionic-toggle";
import { IonicButton } from "@/components/ui/ionic-button";

interface Usuario {
  id: number;
  nomeCompleto: string;
  email: string;
  tipo_usuario: string;
  status: string;
  dataSolicitacao?: string;
  login?: string;
  funcao?: string;
}

interface Atribuicao {
  id: number;
  bolsista_id: number;
  responsavel_id: number;
  titulo?: string;
  descricao?: string;
  status: string;
  data_criacao: string;
  data_atualizacao?: string;
  data_conclusao?: string;
  // Campos adicionais para compatibilidade com dados antigos
  responsavel?: number;
  responsavel_nome?: string;
  responsavelNome?: string;
  bolsistaId?: number | string;
  bolsista_nome?: string;
  bolsistaNome?: string;
  data_atribuicao?: string;
  dataAtribuicao?: string;
  atividade_nome?: string;
  observacoes?: string;
}



import "../formal-theme.css";
import config from "../src/config";
export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("visao-geral");
  const [activeView, setActiveView] = useState("responsavel");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<Usuario[]>([]);
  const [allUsers, setAllUsers] = useState<Usuario[]>([]);
  const [atribuicoes, setAtribuicoes] = useState<Atribuicao[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPendentes, setShowPendentes] = useState(true);
  const [showBolsistasAprovados, setshowBolsistasAprovados] = useState(true);
  const [showBolsistasPendentes, setshowBolsistasPendentes] = useState(true);
  const [novoResponsavel, setnovoResponsavel] = useState({
    nomeCompleto: "",
    email: "",
    endereco: "",
    telefone: "",
    instituicao: ""
  });
  const [novoBolsista, setNovoBolsista] = useState({
    nomeCompleto: "",
    email: "",
    matricula: "",
    curso: "",
    periodo: "",
    instituicao: ""
  });
  // Base URL para API Node (consistente com server/routes index.ts)
  const baseApi = (config.API_URL || 'http://localhost:3001/api').replace(/\/$/, '');
  const [novaAtribuicao, setNovaAtribuicao] = useState({
    titulo: "",
    descricao: ""
  });
  const [responsavelSelecionado, setResponsavelSelecionado] = useState("");
  const [bolsistaSelecionado, setBolsistaSelecionado] = useState("");
  const [filtroResponsavel, setFiltroResponsavel] = useState("");
  const [filtroBolsista, setFiltroBolsista] = useState("");
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [atribuicaoEditando, setAtribuicaoEditando] = useState<{
    index: number;
    responsavelId: number;
    bolsistaId: number;
  } | null>(null);
  const [novoResponsavelEdicao, setnovoResponsavelEdicao] = useState("");
  const [novoBolsistaEdicao, setNovoBolsistaEdicao] = useState("");

  const isAutenticado = () => {
    return localStorage.getItem("usuario") !== null;
  };

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (!isAutenticado()) {
      navigate("/login");
      return;
    }

    // Verificar se o usuário tem permissão para acessar esta página
    const usuario = JSON.parse(localStorage.getItem("usuario") || localStorage.getItem("user") || "{}");
    console.log("🔍 Verificando permissões Admin - dados do usuário:", usuario);
    
    // Verificar tanto 'tipo' quanto 'tipo_usuario' para compatibilidade
    const tipoUsuario = usuario.tipo || usuario.tipo_usuario;
    console.log("🔍 Tipo do usuário detectado:", tipoUsuario);
    
    if (tipoUsuario !== "admin") {
      console.log("❌ Usuário não é admin, redirecionando para dashboard");
      navigate("/dashboard");
    } else {
      console.log("✅ Usuário é admin, acesso permitido");
    }
  }, [navigate]);

  useEffect(() => {
    carregarUsuarios();
    carregarAtribuicoes();
    carregarTodosUsuarios(); // Carregar dados para allUsers
  }, []);

  const parseJSONResponse = async (response: Response) => {
    try {
      const text = await response.text();
    console.log("Resposta do servidor (raw):", text);
      
      if (!text || text.trim() === '') {
        console.warn("Resposta vazia do servidor");
        return {};
      }

      // Tentar limpar caracteres problemáticos
      const cleanText = text.trim().replace(/^\uFEFF/, ''); // Remove BOM se existir
      
      try {
        return JSON.parse(cleanText);
      } catch (jsonError) {
        console.error("Erro ao fazer parse do JSON:", {
          erro: jsonError,
          respostaOriginal: text,
          respostaLimpa: cleanText,
          tamanho: text.length,
          primeiros100chars: text.substring(0, 100),
          ultimos100chars: text.substring(Math.max(0, text.length - 100))
        });
        
        // Tentar extrair JSON válido se a resposta contém JSON misturado com outros dados
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            console.log("Tentando extrair JSON da resposta:", jsonMatch[0]);
            return JSON.parse(jsonMatch[0]);
          } catch (extractError) {
            console.error("Falha ao extrair JSON:", extractError);
          }
        }
        
        throw new Error(`JSON inválido recebido do servidor. Primeiros 100 caracteres: ${text.substring(0, 100)}`);
      }
    } catch (parseError) {
      console.error("Erro geral ao processar resposta:", parseError);
      throw parseError;
    }
  };

  const carregarUsuarios = async () => {
    try {
      setIsLoading(true);
      setMessage("");
      
      // Chamar a rota Node para listar usuários
      const apiUrl = `${baseApi}/usuarios`;
      const response = await fetch(apiUrl, { method: 'GET' });
      if (!response.ok) throw new Error('Falha ao buscar usuários do servidor');
      const data = await parseJSONResponse(response);
      let users = [];
      if (Array.isArray(data)) users = data;
      else if (data && Array.isArray(data.data)) users = data.data;
      else if (data && Array.isArray(data.usuarios)) users = data.usuarios;
      
      if (users.length === 0) {
        throw new Error('Nenhum usuário retornado pela API');
      }
      const usuariosMapeados = users.map((user: any) => ({
        id: user.id || user.matricula || Math.random(),
        nomeCompleto: user.nomeCompleto || user.nome || user.name || "Nome não informado",
        email: user.email || "email@exemplo.com",
        tipo_usuario: user.tipoUsuario || user.tipo_usuario || user.tipo || "usuario",
        status: user.status || "pendente",
        dataSolicitacao: user.dataSolicitacao || user.data_solicitacao || new Date().toISOString().split('T')[0],
        login: user.login || user.email || `user${user.id}`,
        funcao: user.funcao || (activeView === "bolsista" ? "Bolsista" : "Responsável")
      }));
      setUsers(usuariosMapeados);
    } catch (error: any) {
  console.error('Erro ao carregar usuários:', error);
  setUsers([]);
  setMessage(`❌ Erro ao carregar usuários: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const carregarTodosUsuarios = async () => {
    try {
      // Tentar carregar usuários aprovados de APIs reais
      // Carregar usuários aprovados via rota Node
      const apiUrl = `${baseApi}/usuarios?status=liberado`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        setAllUsers([]);
        setMessage('❌ Erro ao carregar todos os usuários: API indisponível');
        return;
      }
      const data = await parseJSONResponse(response);
      let users = [];
      if (Array.isArray(data)) users = data;
      else if (data && Array.isArray(data.data)) users = data.data;
      else if (data && data.usuarios && Array.isArray(data.usuarios)) users = data.usuarios;
      setAllUsers(users.map((user: any) => ({
        id: user.id || user.matricula || Math.random(),
        nomeCompleto: user.nomeCompleto || user.nome || user.name || "Nome não informado",
        email: user.email || "email@exemplo.com",
        tipo_usuario: user.tipoUsuario || user.tipo_usuario || user.tipo || "usuario",
        status: user.status || "liberado",
        dataSolicitacao: user.dataSolicitacao || user.data_solicitacao || new Date().toISOString().split('T')[0],
        login: user.login || user.email || `user${user.id}`,
        funcao: user.funcao || (user.tipoUsuario === "bolsista" ? "Bolsista" : "Responsável")
      })));
    } catch (error: any) {
  console.error('Erro ao carregar todos os usuários:', error);
  setAllUsers([]);
  setMessage(`❌ Erro ao carregar todos os usuários: ${error.message}`);
    }
  };

  const carregarAtribuicoes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseApi}/atribuicoes`, {
        method: 'GET',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (!response.ok) throw new Error('API de atribuições falhou');
      const data = await parseJSONResponse(response);
      let atribuicoes = [];
      if (Array.isArray(data)) atribuicoes = data;
      else if (Array.isArray(data.data)) atribuicoes = data.data;
      else if (Array.isArray(data.atribuicoes)) atribuicoes = data.atribuicoes;
      setAtribuicoes(atribuicoes);
    } catch (error: any) {
      console.error('Erro ao carregar atribuições:', error);
      setAtribuicoes([]);
      setMessage(`❌ Erro ao carregar atribuições: ${error.message}`);
    }
  };

  const handleStatusChange = async (
    userId: number,
    newStatus: "liberado" | "bloqueado",
  ) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (!user) {
        setMessage("Usuário não encontrado.");
        return;
      }
  let apiSucesso = false;
      
      // Tentar múltiplas APIs para aprovação/rejeição
      // Chamar rota Node para alterar status do usuário (PUT não POST para semântica REST)
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${baseApi}/usuarios/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ status: newStatus === 'liberado' ? 'liberado' : 'bloqueado' })
        });
        if (response.ok) {
          const data = await parseJSONResponse(response);
          console.log('✅ Status alterado:', data);
          apiSucesso = true;
        } else {
          console.log('⚠️ Falha ao alterar status via API Node');
          apiSucesso = false;
        }
      } catch (err) {
        console.log('⚠️ Erro ao chamar API Node para alterar status:', err);
      }
      
      // Atualizar interface mesmo se API falhar (para fins de demonstração)
      const APIStatus = newStatus === "liberado" ? "aprovado" : "rejeitado";
      
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, status: APIStatus } : u
        )
      );
      
      if (apiSucesso) {
        setMessage(`✅ Usuário ${user.nomeCompleto} foi ${newStatus === "liberado" ? "aprovado" : "rejeitado"} com sucesso!`);
      } else {
        setMessage(`⚠️ Usuário ${user.nomeCompleto} foi ${newStatus === "liberado" ? "aprovado" : "rejeitado"} localmente (APIs indisponíveis)`);
      }
      
      setTimeout(() => setMessage(""), 5000);
    } catch (error: any) {
      setMessage(`❌ Erro: ${error.message}`);
    }
  };

  const handleatribuirResponsavel = async (userId: number) => {
    try {
      const user = users.find((u: { id: number; }) => u.id === userId);
      if (!user) {
        setMessage("Usuário não encontrado.");
        return;
      }

      // Simulação da chamada da API para atribuir responsável
      // await usuarioService.atribuirResponsavel(userId);

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, tipoUsuario: "responsavel" } : u,
        ),
      );

      setMessage(
        `✅ ${user.nomeCompleto} foi atribuído como responsável com sucesso!`,
      );

      // Clear message after 5 seconds
      setTimeout(() => setMessage(""), 5000);

    } catch (error: any) {
      console.error("erro ao atribuir responsável:", error);
      setMessage("❌ erro ao atribuir responsável. Tente novamente.");
    }
  };

  const handleCriarResponsavel = async () => {
    try {
      if (!novoResponsavel.nomeCompleto || !novoResponsavel.email) {
        setMessage("❌ Nome completo e email são obrigatórios.");
        return;
      }
      const response = await fetch(`${baseApi}/usuarios/responsavel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoResponsavel)
      });
      const Data = await parseJSONResponse(response);
      if (!Data) throw new Error('Resposta inválida ao criar responsável');
      // assumir Data.data ou Data
      const created = Data.Data || Data.data || Data;
      setUsers([...users, created]);
      setMessage(`✅ responsável ${created.nomeCompleto || created.nome} criado com sucesso!`);
      setnovoResponsavel({
        nomeCompleto: "",
        email: "",
        endereco: "",
        telefone: "",
        instituicao: ""
      });
      setTimeout(() => setMessage(""), 5000);
    } catch (error: any) {
      setMessage(`❌ erro: ${error.message}`);
    }
  };

  const handleCriarBolsista = async () => {
    try {
      if (!novoBolsista.nomeCompleto || !novoBolsista.email) {
        setMessage("❌ Nome completo e email são obrigatórios.");
        return;
      }
      const response = await fetch(`${baseApi}/usuarios/bolsista`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoBolsista)
      });
      const Data = await parseJSONResponse(response);
      if (!Data) throw new Error('Resposta inválida ao criar bolsista');
      const created = Data.Data || Data.data || Data;
      setUsers([...users, created]);
      setMessage(`✅ Bolsista ${created.nomeCompleto || created.nome} criado com sucesso!`);
      setNovoBolsista({
        nomeCompleto: "",
        email: "",
        matricula: "",
        curso: "",
        periodo: "",
        instituicao: ""
      });
      setTimeout(() => setMessage(""), 5000);
    } catch (error: any) {
      setMessage(`❌ erro: ${error.message}`);
    }
  };

  const handleatribuirBolsistaResponsavel = async () => {
    console.log('Botão atribuir clicado!');
    console.log('Responsável selecionado:', responsavelSelecionado);
    console.log('Bolsista selecionado:', bolsistaSelecionado);

    try {
      if (!responsavelSelecionado || !bolsistaSelecionado) {
        setMessage("❌ Selecione um responsável e um bolsista.");
        return;
      }

      const token = localStorage.getItem('token');
  const apiUrl = `${baseApi}/atribuicoes`;
      const body = JSON.stringify({
        responsavel_id: responsavelSelecionado,
        bolsista_id: bolsistaSelecionado,
        titulo: novaAtribuicao.titulo || 'Nova Atribuição',
        descricao: novaAtribuicao.descricao || 'Atribuição criada pelo painel admin',
        status: 'pendente'
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body
      });

      if (response.ok) {
        const responseData = await parseJSONResponse(response);
        if (responseData.success !== false && responseData.Data) {
          setMessage(`✅ Atribuição criada com sucesso!`);
          await carregarAtribuicoes();
          // Limpa filtros para garantir que a nova atribuição apareça
          setFiltroResponsavel("");
          setFiltroBolsista("");
          setFiltroDataInicio("");
        } else {
          setMessage(`❌ Erro ao criar atribuição: ${responseData.error || 'Erro desconhecido'}`);
        }
      } else {
        setMessage("❌ Erro ao conectar à API de atribuição.");
      }

      setResponsavelSelecionado("");
      setBolsistaSelecionado("");
      setNovaAtribuicao({ titulo: "", descricao: "" });
      setTimeout(() => setMessage(""), 5000);
    } catch (error: any) {
      setMessage(`❌ Erro: ${error.message}`);
    }
  };

  const handleRemoverAtribuicao = async (atribuicaoId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseApi}/atribuicoes/${atribuicaoId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (!response.ok) throw new Error('Falha ao remover atribuição');
      setAtribuicoes(atribuicoes.filter(a => a.id !== atribuicaoId));
      setMessage("✅ atribuição removida com sucesso!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      setMessage(`❌ erro: ${error.message}`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleEditarAtribuicao = (atribuicaoId: number) => {
    const atribuicao = atribuicoes.find(a => a.id === atribuicaoId);
    if (atribuicao) {
      const responsavelId = atribuicao.responsavel_id || atribuicao.responsavel || 0;
      const bolsistaId = atribuicao.bolsista_id || (typeof atribuicao.bolsistaId === 'string' ? parseInt(atribuicao.bolsistaId) : atribuicao.bolsistaId) || 0;
      
      setAtribuicaoEditando({ 
        index: atribuicaoId, 
        responsavelId: responsavelId, 
        bolsistaId: bolsistaId
      });
      setnovoResponsavelEdicao(responsavelId.toString());
      setNovoBolsistaEdicao(bolsistaId.toString());
    }
  };

  const handleSalvarEdicao = async () => {
    try {
      if (!atribuicaoEditando || !novoResponsavelEdicao || !novoBolsistaEdicao) {
        setMessage("❌ Selecione um responsavel e um Bolsista.");
        return;
      }
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseApi}/atribuicoes/${atribuicaoEditando.index}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          responsavel_id: parseInt(novoResponsavelEdicao),
          bolsista_id: parseInt(novoBolsistaEdicao),
          observacoes: "atribuição editada pelo painel admin"
        })
      });
      if (!response.ok) throw new Error('Falha ao atualizar atribuição');
      const Data = await parseJSONResponse(response);
      const updated = Data.Data || Data.data || Data;
      setAtribuicoes(atribuicoes.map(a => a.id === atribuicaoEditando.index ? updated : a));
      setMessage(`✅ ${Data.message || 'Atribuição atualizada'}`);
      handleCancelarEdicao();
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      setMessage(`❌ erro: ${error.message}`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleCancelarEdicao = () => {
    setAtribuicaoEditando(null);
    setnovoResponsavelEdicao("");
    setNovoBolsistaEdicao("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            pendente
          </Badge>
        );
      case "liberado":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Liberado
          </Badge>
        );
      case "bloqueado":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Bloqueado
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusAtribuicaoBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case "em_andamento":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Em Andamento
          </Badge>
        );
      case "concluido":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Concluído
          </Badge>
        );
      case "cancelado":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelado
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            {status}
          </Badge>
        );
    }
  };

  const pendingUsers = users.filter((user) => user.status === "pendente");
  const responsavelUsers = allUsers.filter((user) => user.tipo_usuario === "responsavel" && (user.status === "liberado" || user.status === "aprovado" || user.status === "aprovada"));
  const bolsistaUsers = allUsers.filter((user) => user.tipo_usuario === "bolsista" && (user.status === "liberado" || user.status === "aprovado" || user.status === "aprovada"));

  const renderContent = () => {
    if (activeView === "responsavel") {
      // Mostrar apenas usuários pendentes do tipo 'responsavel'
      const usuariosSolicitacoespendentes = users.filter(
        (user) => user.status === "pendente" && (user.tipo_usuario === "responsavel" || user.tipo_usuario === "responsavel")
      );
      let usuariosFiltrados = usuariosSolicitacoespendentes;
      if (!showPendentes) {
        usuariosFiltrados = [];
      }

      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Shield className="w-6 h-6 mr-2 text-blue-600" />
                Solicitações pendentes
              </CardTitle>
              <p className="text-gray-600">
                Visualize e aprove/rejeite Solicitações de acesso pendentes
              </p>
            </CardHeader>
            <CardContent>
              {/* filtros Toggle */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <h4 className="text-lg font-semibold text-gray-800">Filtro</h4>
                </div>
                <div className="flex flex-col space-y-3 p-4 bg-white rounded-lg border-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {showPendentes ? 'Visível' : 'oculto'}
                    </span>
                    <IonicToggle 
                      checked={showPendentes}
                      onCheckedChange={setShowPendentes}
                      enableOnOffLabels={true}
                    />
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded-lg border flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Resultado: {usuariosFiltrados.length} Solicitações pendentes
                  </span>
                  {!showPendentes && (
                    <Badge variant="destructive">
                      🚫 Filtro desabilitado
                    </Badge>
                  )}
                </div>
              </div>
              {/* Conteúdo */}
              {usuariosFiltrados.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    nenhuma solicitação pendente encontrada
                  </h3>
                  <p className="text-gray-600">
                    Novas Solicitações aparecerão aqui.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome Completo</TableHead>
                        <TableHead>email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data Solicitação</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usuariosFiltrados.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.nomeCompleto}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>{user.dataSolicitacao}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              <IonicButton
                                variant="outline"
                                color="primary"
                                size="small"
                                onClick={() => {
                                  window.location.href = `mailto:${user.email}`;
                                }}
                              >
                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                email
                              </IonicButton>
                              <IonicButton
                                variant="default"
                                color="success"
                                size="small"
                                onClick={() => handleStatusChange(user.id, "liberado")}
                              >
                                <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                aprovar
                              </IonicButton>
                              <IonicButton
                                variant="default"
                                color="danger"
                                size="small"
                                onClick={() => handleStatusChange(user.id, "bloqueado")}
                              >
                                <UserX className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                Rejeitar
                              </IonicButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeView === "bolsista") {
      const usuariosBolsistas = users.filter((user) => user.tipo_usuario === "bolsista");

      // aplicar filtros baseados nos toggles
      let usuariosFiltrados = usuariosBolsistas;
      
      if (!showBolsistasAprovados && !showBolsistasPendentes) {
        // Se ambos estão desabilitados, não mostra nada
        usuariosFiltrados = [];
      } else if (showBolsistasAprovados && !showBolsistasPendentes) {
        // Só aprovados
        usuariosFiltrados = usuariosBolsistas.filter(user => user.status === "liberado");
      } else if (!showBolsistasAprovados && showBolsistasPendentes) {
        // Só pendentes
        usuariosFiltrados = usuariosBolsistas.filter(user => user.status === "pendente");
      }
      
      // adicionar destaque para Bolsistas pendentes se houver algum
      const Bolsistaspendentes = usuariosBolsistas.filter(user => user.status === "pendente");
      if (Bolsistaspendentes.length > 0 && !message) {
        setMessage(`⚠️  ${Bolsistaspendentes.length} Bolsista(s) aguardando aprovação!`);
      }
      
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Users className="w-6 h-6 mr-2 text-green-600" />
                 Bolsistas
              </CardTitle>
              <p className="text-gray-600">
                Visualize e gerencie todos os usuários com cargo de Bolsista
              </p>
            </CardHeader>
            <CardContent>
              {/* filtros Toggle para Bolsistas */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <h4 className="text-lg font-semibold text-gray-800">filtros de Visualização</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Toggle Ionic para Bolsistas aprovados */}
                  <div className="flex flex-col space-y-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-green-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className={`w-6 h-6 ${showBolsistasAprovados ? 'text-green-600' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <h5 className="text-base font-semibold text-gray-800">Bolsistas aprovados</h5>
                        <p className="text-sm text-gray-500">
                          Status: Liberado no sistema
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {showBolsistasAprovados ? 'Visível' : 'oculto'}
                      </span>
                      <IonicToggle 
                        checked={showBolsistasAprovados}
                        onCheckedChange={setshowBolsistasAprovados}
                        enableOnOffLabels={true}
                      />
                    </div>
                  </div>

                  {/* Toggle Ionic para Bolsistas pendentes */}
                  <div className="flex flex-col space-y-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-yellow-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Clock className={`w-6 h-6 ${showBolsistasPendentes ? 'text-yellow-600' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <h5 className="text-base font-semibold text-gray-800">Bolsistas pendentes</h5>
                        <p className="text-sm text-gray-500">
                          Status: aguardando aprovação
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {showBolsistasPendentes ? 'Visível' : 'oculto'}
                      </span>
                      <IonicToggle 
                        checked={showBolsistasPendentes}
                        onCheckedChange={setshowBolsistasPendentes}
                        enableOnOffLabels={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Status dos filtros */}
                <div className="mt-4 p-3 bg-white rounded-lg border flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">
                      Resultado: {usuariosFiltrados.length} de {usuariosBolsistas.length} Bolsistas
                    </span>
                    {showBolsistasAprovados && (
                      <Badge className="bg-green-100 text-green-800">
                        aprovados: on
                      </Badge>
                    )}
                    {showBolsistasPendentes && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        pendentes: on
                      </Badge>
                    )}
                  </div>
                  {!showBolsistasAprovados && !showBolsistasPendentes && (
                    <Badge variant="destructive">
                      🚫 Todos os filtros desabilitados
                    </Badge>
                  )}
                </div>

                {/* Controles Rápidos estilo Ionic */}
                <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h5 className="text-sm font-semibold text-green-800 mb-3">Controles Rápidos</h5>
                  <div className="flex flex-wrap gap-3">
                    <IonicButton 
                      variant="default" 
                      color="success" 
                      size="small"
                      onClick={() => {
                        setshowBolsistasAprovados(true);
                        setshowBolsistasPendentes(false);
                      }}
                    >
                      Apenas aprovados
                    </IonicButton>
                    
                    <IonicButton 
                      variant="default" 
                      color="warning" 
                      size="small"
                      onClick={() => {
                        setshowBolsistasAprovados(false);
                        setshowBolsistasPendentes(true);
                      }}
                    >
                      Apenas pendentes
                    </IonicButton>
                    
                    <IonicButton 
                      variant="outline" 
                      color="primary" 
                      size="small"
                      onClick={() => {
                        setshowBolsistasAprovados(true);
                        setshowBolsistasPendentes(true);
                      }}
                    >
                      Mostrar Todos
                    </IonicButton>
                    
                    <IonicButton 
                      variant="clear" 
                      color="danger" 
                      size="small"
                      disabled={!showBolsistasAprovados && !showBolsistasPendentes}
                      onClick={() => {
                        setshowBolsistasAprovados(false);
                        setshowBolsistasPendentes(false);
                      }}
                    >
                      ocultar Todos
                    </IonicButton>
                  </div>
                </div>
              </div>

              {/* Conteúdo baseado nos filtros */}
              {usuariosFiltrados.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {!showBolsistasAprovados && !showBolsistasPendentes 
                      ? "filtros desabilitados"
                      : "Nenhum Bolsista encontrado"}
                  </h3>
                  <p className="text-gray-600">
                    {!showBolsistasAprovados && !showBolsistasPendentes 
                      ? "Habilite pelo menos um filtro para ver os Bolsistas."
                      : showBolsistasAprovados && !showBolsistasPendentes
                      ? "Não há Bolsistas aprovados no momento."
                      : !showBolsistasAprovados && showBolsistasPendentes
                      ? "Não há Bolsistas pendentes no momento."
                      : "Todos os usuários liberados são automaticamente Bolsistas."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome Completo</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Matrícula</TableHead>
                        <TableHead>Curso</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data Cadastro</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usuariosFiltrados.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.nomeCompleto}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.login}</TableCell>
                          <TableCell>{'N/a'}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>{user.dataSolicitacao}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              <IonicButton
                                variant="outline"
                                color="primary"
                                size="small"
                                onClick={() => {
                                  window.location.href = `mailto:${user.email}`;
                                }}
                              >
                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                email
                              </IonicButton>
                              
                              {user.status === "pendente" && (
                                <IonicButton
                                  variant="default"
                                  color="success"
                                  size="small"
                                  onClick={() => handleStatusChange(user.id, "liberado")}
                                >
                                  <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  aprovar
                                </IonicButton>
                              )}
                              
                              {user.status !== "bloqueado" && (
                                <IonicButton
                                  variant="default"
                                  color="danger"
                                  size="small"
                                  onClick={() => handleStatusChange(user.id, "bloqueado")}
                                >
                                  <UserX className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  Bloquear
                                </IonicButton>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeView === "atribuir") {
      const usuariosLiberados = allUsers.filter((user) => user.status === "liberado" || user.status === "aprovado");
      const responsaveisAtribuidos = allUsers.filter((user) => user.tipo_usuario === "responsavel");
      const responsavelUsers = allUsers.filter((user) => user.tipo_usuario === "responsavel" && (user.status === "liberado" || user.status === "aprovado" || user.status === "aprovada"));
      const bolsistaUsers = allUsers.filter((user) => user.tipo_usuario === "bolsista" && (user.status === "liberado" || user.status === "aprovado" || user.status === "aprovada"));

      console.log('ResponsavelUsers na seção atribuir:', responsavelUsers);
      console.log('bolsistaUsers na seção atribuir:', bolsistaUsers);
      
      // adicionar constante para cursos únicos dos Bolsistas
      const cursosBolsistas = Array.from(new Set(
        bolsistaUsers
          .map(user => user.funcao)
          .filter(funcao => funcao && funcao.includes("-"))
          .map(funcao => funcao?.split("-")[1]?.trim())
          .filter(curso => curso)
      ));

      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <UserCheck className="w-6 h-6 mr-2 text-purple-600" />
                Atribuir Bolsista a responsável
              </CardTitle>
              <p className="text-gray-600">
                Selecione um responsável e um Bolsista para atribuir
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Dropdown para responsável */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">Selecionar responsável</label>
                  <select
                    className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={responsavelSelecionado}
                    onChange={(e) => setResponsavelSelecionado(e.target.value)}
                  >
                    <option value="">-- Selecione um responsável --</option>
                    {responsavelUsers.map((user) => (
                      <option key={user.id} value={user.id}>{user.nomeCompleto}</option>
                    ))}
                  </select>
                </div>

                {/* Dropdown para Bolsista */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">Selecionar Bolsista</label>
                  <select 
                    className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={bolsistaSelecionado}
                    onChange={(e) => setBolsistaSelecionado(e.target.value)}
                  >
                    <option value="">-- Selecione um Bolsista --</option>
                    {bolsistaUsers.map((user) => (
                      <option key={user.id} value={user.id}>{user.nomeCompleto}</option>
                    ))}
                  </select>
                </div>

                {/* Dropdown para Curso do Bolsista */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">Curso do Bolsista</label>
                  <select 
                    className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={novoBolsista.curso}
                    onChange={(e) => setNovoBolsista({...novoBolsista, curso: e.target.value})}
                  >
                    <option value="">-- Selecione um curso --</option>
                    {cursosBolsistas.map((curso) => (
                      <option key={curso} value={curso}>{curso}</option>
                    ))}
                    <option value="administração">administração</option>
                    <option value="administração Pública">administração Pública</option>
                    <option value="agronomia">agronomia</option>
                    <option value="Ciências Biológicas">Ciências Biológicas</option>
                    <option value="Ciência da Computação">Ciência da Computação</option>
                    <option value="Direito">Direito</option>
                    <option value="educação Física">educação Física</option>
                    <option value="engenharia agrícola">engenharia agrícola</option>
                    <option value="engenharia ambiental">engenharia ambiental</option>
                    <option value="engenharia de alimentos">engenharia de alimentos</option>
                    <option value="engenharia de Controle e automação">engenharia de Controle e automação</option>
                    <option value="engenharia Florestal">engenharia Florestal</option>
                    <option value="Filosofia">Filosofia</option>
                    <option value="Física">Física</option>
                    <option value="Letras (Português e Inglês)">Letras (Português e Inglês)</option>
                    <option value="Matemática">Matemática</option>
                    <option value="Medicina Veterinária">Medicina Veterinária</option>
                    <option value="Nutrição">Nutrição</option>
                    <option value="Química">Química</option>
                    <option value="Sistemas de Informação">Sistemas de Informação</option>
                    <option value="Zootecnia">Zootecnia</option>
                    <option value="outro">outro</option>
                  </select>
                </div>

                {/* Campo para Título */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">Título da Atribuição</label>
                  <input
                    type="text"
                    className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={novaAtribuicao.titulo}
                    onChange={(e) => setNovaAtribuicao({...novaAtribuicao, titulo: e.target.value})}
                    placeholder="Digite o título da atribuição"
                  />
                </div>

                {/* Campo para Descrição */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                    value={novaAtribuicao.descricao}
                    onChange={(e) => setNovaAtribuicao({...novaAtribuicao, descricao: e.target.value})}
                    placeholder="Descreva os objetivos e atividades da atribuição"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <IonicButton
                    variant="default"
                    color="primary"
                    onClick={handleatribuirBolsistaResponsavel}
                    disabled={!responsavelSelecionado || !bolsistaSelecionado}
                    className="transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    atribuir
                  </IonicButton>
                  <IonicButton
                    variant="clear"
                    color="secondary"
                    onClick={() => {
                      setResponsavelSelecionado("");
                      setBolsistaSelecionado("");
                    }}
                  >
                    Cancelar
                  </IonicButton>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* seção para Listar atribuições */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Listar atribuições ({atribuicoes.length})
              </CardTitle>

              {/* Dropdowns de Filtro */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Filtro por responsável */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">Filtrar por responsável</label>
                    <select 
                      className="rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={filtroResponsavel}
                      onChange={(e) => setFiltroResponsavel(e.target.value)}
                    >
                      <option value="">Todos os responsáveis</option>
                      {Array.from(new Set(atribuicoes.map(a => a.responsavel_nome || a.responsavelNome).filter(Boolean))).map((nome) => (
                        <option key={nome} value={nome}>{nome}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro por Bolsista */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">Filtrar por Bolsista</label>
                    <select 
                      className="rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      value={filtroBolsista}
                      onChange={(e) => setFiltroBolsista(e.target.value)}
                    >
                      <option value="">Todos os Bolsistas</option>
                      {Array.from(new Set(atribuicoes.map(a => a.bolsista_nome || a.bolsistaNome).filter(Boolean))).map((nome) => (
                        <option key={nome} value={nome}>{nome}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro por Data de Início */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">Data de Início</label>
                    <input
                      type="date"
                      className="rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                      value={filtroDataInicio}
                      onChange={(e) => setFiltroDataInicio(e.target.value)}
                    />
                  </div>
                </div>
              </div>
             
              {atribuicaoEditando && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-700 font-medium">
                    modo de edição ativo - Selecione o novo responsável e Bolsista, depois clique em "Salvar"
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {atribuicoes.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    nenhuma atribuição encontrada
                  </h3>
                  <p className="text-gray-600">
                    Use o formulário acima para atribuir Bolsistas a responsáveis.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Contador de resultados */}
                  <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="text-sm font-medium text-blue-800">
                      Mostrando {
                        atribuicoes
                          .filter(a => !filtroResponsavel || (a.responsavel_nome || a.responsavelNome) === filtroResponsavel)
                          .filter(a => !filtroBolsista || (a.bolsista_nome || a.bolsistaNome) === filtroBolsista)
                          .filter(a => {
                            if (!filtroDataInicio) return true;
                            const dataAtribuicao = a.data_atribuicao || a.dataAtribuicao;
                            return dataAtribuicao && new Date(dataAtribuicao) >= new Date(filtroDataInicio);
                          })
                          .length
                      } de {atribuicoes.length} atribuições
                    </span>
                    {(filtroResponsavel || filtroBolsista || filtroDataInicio) && (
                      <button
                        onClick={() => {
                          setFiltroResponsavel("");
                          setFiltroBolsista("");
                          setFiltroDataInicio("");
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Limpar filtros
                      </button>
                    )}
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center">Responsável</TableHead>
                          <TableHead className="text-center">Bolsista</TableHead>
                          <TableHead className="text-center">Título</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead className="text-center">Data Criação</TableHead>
                          <TableHead className="text-center">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {atribuicoes
                          .filter(a => !filtroResponsavel || (a.responsavel_nome || a.responsavelNome) === filtroResponsavel)
                          .filter(a => !filtroBolsista || (a.bolsista_nome || a.bolsistaNome) === filtroBolsista)
                          .filter(a => {
                            if (!filtroDataInicio) return true;
                            const dataAtribuicao = a.data_atribuicao || a.dataAtribuicao;
                            return dataAtribuicao && new Date(dataAtribuicao) >= new Date(filtroDataInicio);
                          })
                          .map((atribuicao) => (
                          <TableRow key={atribuicao.id}>
                            <TableCell className="text-center">
                              {atribuicaoEditando?.index === atribuicao.id ? (
                                // modo de edição - Dropdown para responsável
                                <div className="flex flex-col items-center space-y-2">
                                  <select 
                                    className="rounded border border-gray-300 p-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={novoResponsavelEdicao}
                                    onChange={(e) => setnovoResponsavelEdicao(e.target.value)}
                                  >
                                    <option value="">-- Selecione --</option>
                                    {allUsers.filter(u => u.tipo_usuario === "responsavel" && (u.status === "liberado" || u.status === "aprovado")).map((user) => (
                                      <option key={user.id} value={user.id}>{user.nomeCompleto}</option>
                                    ))}
                                  </select>
                                  <span className="text-xs text-gray-500">responsável</span>
                                </div>
                              ) : (
                                // modo de Visualização
                                <div className="flex flex-col items-center space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Shield className="w-4 h-4 text-blue-600" />
                                    <span className="font-medium text-blue-900">
                                      {atribuicao.responsavel_nome || atribuicao.responsavelNome || "Sem responsável"}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    responsável
                                  </span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {atribuicaoEditando?.index === atribuicao.id ? (
                                // modo de edição - Dropdown para Bolsista
                                <div className="flex flex-col items-center space-y-2">
                                  <select 
                                    className="rounded border border-gray-300 p-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={novoBolsistaEdicao}
                                    onChange={(e) => setNovoBolsistaEdicao(e.target.value)}
                                  >
                                    <option value="">-- Selecione --</option>
                                    {allUsers.filter(u => u.tipo_usuario === "bolsista" && (u.status === "liberado" || u.status === "aprovado")).map((user) => (
                                      <option key={user.id} value={user.id}>{user.nomeCompleto}</option>
                                    ))}
                                  </select>
                                  <span className="text-xs text-gray-500">Bolsista</span>
                                </div>
                              ) : (
                                // modo de Visualização
                                <div className="flex flex-col items-center space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Users className="w-4 h-4 text-green-600" />
                                    <span className="font-medium text-green-900">
                                      {atribuicao.bolsista_nome || atribuicao.bolsistaNome || "Sem bolsista"}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    Bolsista
                                  </span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex flex-col items-center space-y-1">
                                <span className="text-sm font-medium text-gray-900">
                                  {atribuicao.titulo || atribuicao.atividade_nome || 'Sem título'}
                                </span>
                                {atribuicao.descricao && (
                                  <span className="text-xs text-gray-500 max-w-xs truncate">
                                    {atribuicao.descricao}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {getStatusAtribuicaoBadge(atribuicao.status)}
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="text-sm text-gray-600">
                                {atribuicao.data_criacao || atribuicao.data_atribuicao || atribuicao.dataAtribuicao}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center space-x-2">
                                {atribuicaoEditando?.index === atribuicao.id ? (
                                  // Botões de Salvar/Cancelar durante edição
                                  <>
                                    <IonicButton
                                      variant="default"
                                      color="success"
                                      size="small"
                                      onClick={handleSalvarEdicao}
                                      disabled={!novoResponsavelEdicao || !novoBolsistaEdicao}
                                    >
                                      <Save className="w-3 h-3 mr-1" />
                                      Salvar
                                    </IonicButton>
                                    
                                    <IonicButton
                                      variant="outline"
                                      color="secondary"
                                      size="small"
                                      onClick={handleCancelarEdicao}
                                    >
                                      <X className="w-3 h-3 mr-1" />
                                      Cancelar
                                    </IonicButton>
                                  </>
                                ) : (
                                  // Botões normais de Editar/Excluir
                                  <>
                                    <IonicButton
                                      variant="outline"
                                      color="warning"
                                      size="small"
                                      onClick={() => handleEditarAtribuicao(atribuicao.id)}
                                      disabled={atribuicaoEditando !== null}
                                    >
                                      <Edit3 className="w-3 h-3 mr-1" />
                                      Editar
                                    </IonicButton>
                                    
                                    <IonicButton
                                      variant="default"
                                      color="danger"
                                      size="small"
                                      onClick={() => handleRemoverAtribuicao(atribuicao.id)}
                                      disabled={atribuicaoEditando !== null}
                                    >
                                      <Trash2 className="w-3 h-3 mr-1" />
                                      Excluir
                                    </IonicButton>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-16"} ${sidebarOpen ? 'block' : 'hidden md:block'} bg-white shadow-lg border-r transition-all duration-300 flex flex-col absolute md:relative z-10 h-full`}
      >
        {/* Sidebar Header */}
        <div className="p-3 sm:p-4 border-b">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h2 className="text-base sm:text-lg font-bold text-gray-900">admin Panel</h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2"
            >
              {sidebarOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4">
          <div className="space-y-2">
            <Button
              variant={activeView === "responsavel" ? "default" : "ghost"}
              className={`w-full justify-start text-sm ${!sidebarOpen && "px-2"}`}
              onClick={() => setActiveView("responsavel")}
            >
              <Shield className="w-4 h-4 mr-2" />
              {sidebarOpen && "Responsáveis"}
            </Button>

            <Button
              variant={activeView === "bolsista" ? "default" : "ghost"}
              className={`w-full justify-start text-sm ${!sidebarOpen && "px-2"}`}
              onClick={() => setActiveView("bolsista")}
            >
              <Users className="w-4 h-4 mr-2" />
              {sidebarOpen && "Bolsistas"}
            </Button>

            <Button
              variant={activeView === "atribuir" ? "default" : "ghost"}
              className={`w-full justify-start text-sm ${!sidebarOpen && "px-2"}`}
              onClick={() => setActiveView("atribuir")}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              {sidebarOpen && "Atribuir"}
            </Button>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 sm:p-4 border-t">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className={`w-full justify-start text-sm ${!sidebarOpen && "px-2"}`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {sidebarOpen && "Voltar"}
          </Button>
        </div>
      </div>

      {/* overlay para mobile quando sidebar aberto */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-5 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              {!sidebarOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 md:hidden"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              )}
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                Painel administrativo
              </h1>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
                {allUsers.filter(u => u.tipo_usuario === "responsavel").length} responsáveis, {allUsers.filter(u => u.tipo_usuario === "bolsista").length} bolsistas
              </span>
              <span className="text-xs text-gray-600 sm:hidden">
                {allUsers.length}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content area */}
        <main className="flex-1 px-4 sm:px-6 py-4 sm:py-8 overflow-auto">
          {message && (
            <Alert className="mb-4">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          {renderContent()}
        </main>
      </div>
    </div>
  );

}
