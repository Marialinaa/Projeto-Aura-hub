import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { IonicToggle } from "@/components/ui/ionic-toggle";
import { IonicButton } from "@/components/ui/ionic-button";
import { 
  IonicAccordionGroup, 
  IonicAccordion, 
  IonicAccordionTrigger, 
  IonicAccordionContent,
  IonicItem,
  IonicLabel
} from "@/components/ui/ionic-accordion";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Users,
  UserCheck,
  UserX,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Database,
  Menu,
  X,
  Shield,
  Filter,
  UserPlus,
  Save,
  Edit3,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usuarioService } from "../services/api";
import { atribuicaoService, type Atribuicao } from "../services/atribuicaoService";
import type { User } from "@shared/types";

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState("responsavel"); // "responsavel" | "bolsista" | "atribuir"
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Estados para filtros da seção responsáveis
  const [showAprovados, setShowAprovados] = useState(true);
  const [showPendentes, setShowPendentes] = useState(true);
  
  // Estados para filtros da seção bolsistas
  const [showBolsistasAprovados, setShowBolsistasAprovados] = useState(true);
  const [showBolsistasPendentes, setShowBolsistasPendentes] = useState(true);
  
  // Estados para seção atribuir
  const [activeAtribuirView, setActiveAtribuirView] = useState("atribuir"); // "atribuir" | "listar"

  // Estados para atribuir bolsista a responsável
  const [responsavelSelecionado, setResponsavelSelecionado] = useState("");
  const [bolsistaSelecionado, setBolsistaSelecionado] = useState("");
  const [atribuicoes, setAtribuicoes] = useState<Atribuicao[]>([]);

  // Estados para edição de atribuições
  const [atribuicaoEditando, setAtribuicaoEditando] = useState<{
    index: number;
    responsavelId: number;
    bolsistaId: string;
  } | null>(null);
  const [novoResponsavelEdicao, setNovoResponsavelEdicao] = useState("");
  const [novoBolsistaEdicao, setNovoBolsistaEdicao] = useState("");

  // Estados para formulários de criação
  const [novoResponsavel, setNovoResponsavel] = useState({
    nomeCompleto: "",
    email: "",
    endereco: "",
    telefone: "",
    funcao: "",
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

  // Ref para accordion group
  const accordionGroup = useRef<any>(null);

  // Carregar usuários ao montar o componente
  useEffect(() => {
    carregarUsuarios();
    carregarAtribuicoes();
  }, []);

  // Configurar accordion para ter múltiplos expandidos
  useEffect(() => {
    if (!accordionGroup.current) {
      return;
    }
    // Opcional: você pode definir quais accordions devem estar abertos por padrão
    // accordionGroup.current.value = ['responsavel', 'bolsista'];
  }, [activeView]);

  const carregarUsuarios = async () => {
    try {
      setIsLoading(true);
      setMessage(""); // Limpar mensagens anteriores
      
      const response = await usuarioService.listar();

      if (response.data.success && response.data.data) {
        const usuariosReais = response.data.data;
        setUsers(usuariosReais);
        
        if (usuariosReais.length === 0) {
          setMessage("ℹ️ Nenhum usuário foi encontrado. Aguardando novas solicitações de acesso.");
        } else {
          setMessage(`✅ ${usuariosReais.length} usuário(s) carregado(s) do banco de dados.`);
          
          // Limpar mensagem de sucesso após 3 segundos
          setTimeout(() => setMessage(""), 3000);
        }
      } else {
        // Se não conseguir conectar ou não houver dados reais
        setUsers([]);
        setMessage(
          "⚠️ Não foi possível carregar os usuários do banco de dados. Verifique se o XAMPP está rodando e se o arquivo usuarios.php existe."
        );
      }
    } catch (error: any) {
      console.error("Erro ao carregar usuários:", error);
      setUsers([]);
      
      if (error.response?.status === 503) {
        setMessage(
          "🔌 Servidor PHP não está rodando. Verifique se o XAMPP está iniciado."
        );
      } else if (error.code === 'ECONNREFUSED') {
        setMessage(
          "🔌 Não foi possível conectar ao servidor. Verifique se o XAMPP está rodando."
        );
      } else {
        setMessage(
          "⚠️ Erro ao conectar com o servidor. Verifique sua conexão e se o backend está funcionando."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const carregarAtribuicoes = async () => {
    try {
      const atribuicoesCarregadas = await atribuicaoService.listar();
      setAtribuicoes(atribuicoesCarregadas);
      console.log(`✅ ${atribuicoesCarregadas.length} atribuições carregadas`);
    } catch (error: any) {
      console.error("Erro ao carregar atribuições:", error);
      setMessage(`⚠️ Erro ao carregar atribuições: ${error.message}`);
    }
  };

  const handleStatusChange = async (
    userId: number,
    newStatus: "liberado" | "bloqueado",
  ) => {
    try {
      // Find the user before updating
      const user = users.find((u) => u.id === userId);
      if (!user) {
        setMessage("Usuário não encontrado.");
        return;
      }

      // Call API to update user status
      if (newStatus === "liberado") {
        await usuarioService.aprovar(userId);
      } else {
        await usuarioService.rejeitar(userId);
      }

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, status: newStatus } : u,
        ),
      );

      // Show success message
      const acao = newStatus === "liberado" ? "liberado" : "bloqueado";
      setMessage(
        `✅ Usuário ${user.nomeCompleto} foi ${acao} com sucesso! Email de notificação enviado automaticamente.`,
      );

      // Clear message after 5 seconds
      setTimeout(() => setMessage(""), 5000);

      console.log(`Email enviado para ${user.email}:`, {
        assunto:
          newStatus === "liberado" ? "Acesso Liberado" : "Acesso Bloqueado",
        usuario: user.nomeCompleto,
        status: newStatus,
      });
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);

      if (error.response?.status === 404) {
        setMessage("Usuário não encontrado no servidor.");
      } else if (error.response?.status === 500) {
        setMessage("Erro interno do servidor. Contate o administrador.");
      } else {
        setMessage(
          "⚠️ Erro ao conectar com o servidor. Status atualizado localmente apenas.",
        );

        // Update local state even if API fails (for demo purposes)
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === userId ? { ...u, status: newStatus } : u,
          ),
        );
      }
    }
  };

  const handleAtribuirResponsavel = async (userId: number) => {
    try {
      const user = users.find((u) => u.id === userId);
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
        `✅ ${user.nomeCompleto} foi atribuído como Responsável com sucesso!`,
      );

      // Clear message after 5 seconds
      setTimeout(() => setMessage(""), 5000);

    } catch (error: any) {
      console.error("Erro ao atribuir responsável:", error);
      setMessage("⚠️ Erro ao atribuir responsável. Tente novamente.");
    }
  };

  const handleCriarResponsavel = async () => {
    try {
      if (!novoResponsavel.nomeCompleto || !novoResponsavel.email) {
        setMessage("⚠️ Por favor, preencha pelo menos o nome e email.");
        return;
      }

      // Simulação da criação de novo responsável
      const novoUsuario: User = {
        id: users.length + 1,
        nomeCompleto: novoResponsavel.nomeCompleto,
        email: novoResponsavel.email,
        login: novoResponsavel.email.split('@')[0],
        funcao: novoResponsavel.funcao || "Responsável",
        endereco: novoResponsavel.endereco || "",
        tipoUsuario: "responsavel",
        status: "liberado",
        dataSolicitacao: new Date().toLocaleDateString('pt-BR')
      };

      setUsers([...users, novoUsuario]);
      setMessage(`✅ Responsável ${novoResponsavel.nomeCompleto} criado com sucesso!`);

      // Limpar formulário
      setNovoResponsavel({
        nomeCompleto: "",
        email: "",
        endereco: "",
        telefone: "",
        funcao: "",
        instituicao: ""
      });

      setTimeout(() => setMessage(""), 5000);

    } catch (error: any) {
      console.error("Erro ao criar responsável:", error);
      setMessage("⚠️ Erro ao criar responsável. Tente novamente.");
    }
  };

  const handleCriarBolsista = async () => {
    try {
      if (!novoBolsista.nomeCompleto || !novoBolsista.email) {
        setMessage("⚠️ Por favor, preencha pelo menos o nome e email.");
        return;
      }

      // Simulação da criação de novo bolsista
      const novoUsuario: User = {
        id: users.length + 1,
        nomeCompleto: novoBolsista.nomeCompleto,
        email: novoBolsista.email,
        login: novoBolsista.matricula || novoBolsista.email.split('@')[0],
        funcao: `Bolsista - ${novoBolsista.curso}`,
        endereco: "",
        tipoUsuario: "bolsista",
        status: "liberado",
        dataSolicitacao: new Date().toLocaleDateString('pt-BR')
      };

      setUsers([...users, novoUsuario]);
      setMessage(`✅ Bolsista ${novoBolsista.nomeCompleto} criado com sucesso!`);

      // Limpar formulário
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
      console.error("Erro ao criar bolsista:", error);
      setMessage("⚠️ Erro ao criar bolsista. Tente novamente.");
    }
  };

  const handleAtribuirBolsistaResponsavel = async () => {
    try {
      if (!responsavelSelecionado || !bolsistaSelecionado) {
        setMessage("⚠️ Por favor, selecione um responsável e um bolsista.");
        return;
      }

      const responsavelId = parseInt(responsavelSelecionado);
      const bolsistaId = bolsistaSelecionado; // matrícula já é string

      // Verificar se já existe atribuição
      const atribuicaoExistente = atribuicoes.find(
        a => a.responsavelId === responsavelId && a.bolsistaId === bolsistaId
      );

      if (atribuicaoExistente) {
        setMessage("⚠️ Este bolsista já está atribuído a este responsável.");
        return;
      }

      // Criar atribuição via API
      const novaAtribuicao = await atribuicaoService.criar({
        responsavelId,
        bolsistaId,
        observacoes: "Atribuição criada pelo painel admin"
      });
      
      // Atualizar estado local
      setAtribuicoes(prevAtribuicoes => [...prevAtribuicoes, novaAtribuicao]);
      
      setMessage(`✅ Bolsista ${novaAtribuicao.bolsistaNome} atribuído ao responsável ${novaAtribuicao.responsavelNome}!`);

      // Limpar seleções
      setResponsavelSelecionado("");
      setBolsistaSelecionado("");

      setTimeout(() => setMessage(""), 5000);

    } catch (error: any) {
      console.error("Erro ao atribuir bolsista:", error);
      setMessage(`⚠️ ${error.message || 'Erro ao atribuir bolsista. Tente novamente.'}`);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleRemoverAtribuicao = async (atribuicaoId: number) => {
    try {
      await atribuicaoService.remover(atribuicaoId);
      
      const novasAtribuicoes = atribuicoes.filter(a => a.id !== atribuicaoId);
      setAtribuicoes(novasAtribuicoes);
      setMessage("✅ Atribuição removida com sucesso!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      console.error("Erro ao remover atribuição:", error);
      setMessage(`⚠️ ${error.message || 'Erro ao remover atribuição.'}`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleEditarAtribuicao = (atribuicaoId: number) => {
    const atribuicao = atribuicoes.find(a => a.id === atribuicaoId);
    if (atribuicao) {
      setAtribuicaoEditando({ 
        index: atribuicaoId, 
        responsavelId: atribuicao.responsavelId, 
        bolsistaId: atribuicao.bolsistaId 
      });
      setNovoResponsavelEdicao(atribuicao.responsavelId.toString());
      setNovoBolsistaEdicao(atribuicao.bolsistaId);
    }
  };

  const handleSalvarEdicao = async () => {
    try {
      if (!atribuicaoEditando || !novoResponsavelEdicao || !novoBolsistaEdicao) {
        setMessage("⚠️ Por favor, selecione um responsável e um bolsista.");
        return;
      }

      const novoResponsavelId = parseInt(novoResponsavelEdicao);
      const novoBolsistaId = novoBolsistaEdicao;

      // Verificar se já existe essa atribuição (exceto a atual)
      const atribuicaoExistente = atribuicoes.find(
        a => 
          a.id !== atribuicaoEditando.index && 
          a.responsavelId === novoResponsavelId && 
          a.bolsistaId === novoBolsistaId
      );

      if (atribuicaoExistente) {
        setMessage("⚠️ Esta combinação de responsável e bolsista já existe.");
        return;
      }

      // Atualizar via API
      const atribuicaoAtualizada = await atribuicaoService.atualizar(atribuicaoEditando.index, {
        responsavelId: novoResponsavelId,
        bolsistaId: novoBolsistaId,
        observacoes: "Atribuição editada pelo painel admin"
      });

      // Atualizar estado local
      const novasAtribuicoes = atribuicoes.map(a => 
        a.id === atribuicaoEditando.index ? atribuicaoAtualizada : a
      );
      setAtribuicoes(novasAtribuicoes);

      setMessage(`✅ Atribuição atualizada: ${atribuicaoAtualizada.responsavelNome} -> ${atribuicaoAtualizada.bolsistaNome}`);
      
      // Limpar estado de edição
      handleCancelarEdicao();
      setTimeout(() => setMessage(""), 3000);

    } catch (error: any) {
      console.error("Erro ao salvar edição:", error);
      setMessage(`⚠️ ${error.message || 'Erro ao salvar edição.'}`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleCancelarEdicao = () => {
    setAtribuicaoEditando(null);
    setNovoResponsavelEdicao("");
    setNovoBolsistaEdicao("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
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

  const pendingUsers = users.filter((user) => user.status === "pendente");
  const responsavelUsers = users.filter((user) => user.tipoUsuario === "responsavel");
  const bolsistaUsers = users.filter((user) => user.tipoUsuario === "bolsista");

  const renderContent = () => {
    if (activeView === "responsavel") {
      const usuariosResponsaveis = users.filter((user) => user.tipoUsuario === "responsavel");
      
      // Aplicar filtros baseados nos toggles
      let usuariosFiltrados = usuariosResponsaveis;
      
      if (!showAprovados && !showPendentes) {
        // Se ambos estão desabilitados, não mostra nada
        usuariosFiltrados = [];
      } else if (showAprovados && !showPendentes) {
        // Só aprovados
        usuariosFiltrados = usuariosResponsaveis.filter(user => user.status === "liberado");
      } else if (!showAprovados && showPendentes) {
        // Só pendentes
        usuariosFiltrados = usuariosResponsaveis.filter(user => user.status === "pendente");
      }
      // Se ambos estão habilitados, mostra todos (usuariosFiltrados = usuariosResponsaveis)
      
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Shield className="w-6 h-6 mr-2 text-blue-600" />
                Gerenciar Responsáveis
              </CardTitle>
              <p className="text-gray-600">
                Visualize e gerencie todos os usuários com cargo de Responsável
              </p>
            </CardHeader>
            <CardContent>
              {/* Filtros Toggle */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <h4 className="text-lg font-semibold text-gray-800">Filtros de Visualização</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Toggle Ionic para Aprovados */}
                  <div className="flex flex-col space-y-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-green-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className={`w-6 h-6 ${showAprovados ? 'text-green-600' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <h5 className="text-base font-semibold text-gray-800">Responsáveis Aprovados</h5>
                        <p className="text-sm text-gray-500">
                          Status: Liberado no sistema
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {showAprovados ? 'Visível' : 'Oculto'}
                      </span>
                      <IonicToggle 
                        checked={showAprovados}
                        onCheckedChange={setShowAprovados}
                        enableOnOffLabels={true}
                      />
                    </div>
                  </div>

                  {/* Toggle Ionic para Pendentes */}
                  <div className="flex flex-col space-y-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-yellow-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Clock className={`w-6 h-6 ${showPendentes ? 'text-yellow-600' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <h5 className="text-base font-semibold text-gray-800">Responsáveis Pendentes</h5>
                        <p className="text-sm text-gray-500">
                          Status: Aguardando aprovação
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {showPendentes ? 'Visível' : 'Oculto'}
                      </span>
                      <IonicToggle 
                        checked={showPendentes}
                        onCheckedChange={setShowPendentes}
                        enableOnOffLabels={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Status dos filtros */}
                <div className="mt-4 p-3 bg-white rounded-lg border flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">
                      Resultado: {usuariosFiltrados.length} de {usuariosResponsaveis.length} responsáveis
                    </span>
                    {showAprovados && (
                      <Badge className="bg-green-100 text-green-800">
                        Aprovados: ON
                      </Badge>
                    )}
                    {showPendentes && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Pendentes: ON
                      </Badge>
                    )}
                  </div>
                  {!showAprovados && !showPendentes && (
                    <Badge variant="destructive">
                      ⚠️ Todos os filtros desabilitados
                    </Badge>
                  )}
                </div>

                {/* Controles rápidos estilo Ionic */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h5 className="text-sm font-semibold text-blue-800 mb-3">Controles Rápidos</h5>
                  <div className="flex flex-wrap gap-3">
                    <IonicButton 
                      variant="default" 
                      color="success" 
                      size="small"
                      onClick={() => {
                        setShowAprovados(true);
                        setShowPendentes(false);
                      }}
                    >
                      Apenas Aprovados
                    </IonicButton>
                    
                    <IonicButton 
                      variant="default" 
                      color="warning" 
                      size="small"
                      onClick={() => {
                        setShowAprovados(false);
                        setShowPendentes(true);
                      }}
                    >
                      Apenas Pendentes
                    </IonicButton>
                    
                    <IonicButton 
                      variant="outline" 
                      color="primary" 
                      size="small"
                      onClick={() => {
                        setShowAprovados(true);
                        setShowPendentes(true);
                      }}
                    >
                      Mostrar Todos
                    </IonicButton>
                    
                    <IonicButton 
                      variant="clear" 
                      color="danger" 
                      size="small"
                      disabled={!showAprovados && !showPendentes}
                      onClick={() => {
                        setShowAprovados(false);
                        setShowPendentes(false);
                      }}
                    >
                      Ocultar Todos
                    </IonicButton>
                  </div>
                </div>
              </div>

              {/* Conteúdo baseado nos filtros */}
              {usuariosFiltrados.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {!showAprovados && !showPendentes 
                      ? "Filtros desabilitados"
                      : "Nenhum responsável encontrado"}
                  </h3>
                  <p className="text-gray-600">
                    {!showAprovados && !showPendentes 
                      ? "Habilite pelo menos um filtro para ver os responsáveis."
                      : showAprovados && !showPendentes
                      ? "Não há responsáveis aprovados no momento."
                      : !showAprovados && showPendentes
                      ? "Não há responsáveis pendentes no momento."
                      : "Use a aba 'Atribuir' para promover usuários para responsáveis."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome Completo</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Função</TableHead>
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
                          <TableCell>{user.funcao || 'N/A'}</TableCell>
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
                                Email
                              </IonicButton>
                              
                              {user.status === "pendente" && (
                                <IonicButton
                                  variant="default"
                                  color="success"
                                  size="small"
                                  onClick={() => handleStatusChange(user.id, "liberado")}
                                >
                                  <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  Aprovar
                                </IonicButton>
                              )}
                              
                              {user.status === "liberado" && (
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

    if (activeView === "bolsista") {
      const usuariosBolsistas = users.filter((user) => user.tipoUsuario === "bolsista");
      
      // Aplicar filtros baseados nos toggles
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
      
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Users className="w-6 h-6 mr-2 text-green-600" />
                Gerenciar Bolsistas
              </CardTitle>
              <p className="text-gray-600">
                Visualize e gerencie todos os usuários com cargo de Bolsista
              </p>
            </CardHeader>
            <CardContent>
              {/* Filtros Toggle para Bolsistas */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <h4 className="text-lg font-semibold text-gray-800">Filtros de Visualização</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Toggle Ionic para Bolsistas Aprovados */}
                  <div className="flex flex-col space-y-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-green-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className={`w-6 h-6 ${showBolsistasAprovados ? 'text-green-600' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <h5 className="text-base font-semibold text-gray-800">Bolsistas Aprovados</h5>
                        <p className="text-sm text-gray-500">
                          Status: Liberado no sistema
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {showBolsistasAprovados ? 'Visível' : 'Oculto'}
                      </span>
                      <IonicToggle 
                        checked={showBolsistasAprovados}
                        onCheckedChange={setShowBolsistasAprovados}
                        enableOnOffLabels={true}
                      />
                    </div>
                  </div>

                  {/* Toggle Ionic para Bolsistas Pendentes */}
                  <div className="flex flex-col space-y-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-yellow-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Clock className={`w-6 h-6 ${showBolsistasPendentes ? 'text-yellow-600' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <h5 className="text-base font-semibold text-gray-800">Bolsistas Pendentes</h5>
                        <p className="text-sm text-gray-500">
                          Status: Aguardando aprovação
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {showBolsistasPendentes ? 'Visível' : 'Oculto'}
                      </span>
                      <IonicToggle 
                        checked={showBolsistasPendentes}
                        onCheckedChange={setShowBolsistasPendentes}
                        enableOnOffLabels={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Status dos filtros */}
                <div className="mt-4 p-3 bg-white rounded-lg border flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">
                      Resultado: {usuariosFiltrados.length} de {usuariosBolsistas.length} bolsistas
                    </span>
                    {showBolsistasAprovados && (
                      <Badge className="bg-green-100 text-green-800">
                        Aprovados: ON
                      </Badge>
                    )}
                    {showBolsistasPendentes && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Pendentes: ON
                      </Badge>
                    )}
                  </div>
                  {!showBolsistasAprovados && !showBolsistasPendentes && (
                    <Badge variant="destructive">
                      ⚠️ Todos os filtros desabilitados
                    </Badge>
                  )}
                </div>

                {/* Controles rápidos estilo Ionic */}
                <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h5 className="text-sm font-semibold text-green-800 mb-3">Controles Rápidos</h5>
                  <div className="flex flex-wrap gap-3">
                    <IonicButton 
                      variant="default" 
                      color="success" 
                      size="small"
                      onClick={() => {
                        setShowBolsistasAprovados(true);
                        setShowBolsistasPendentes(false);
                      }}
                    >
                      Apenas Aprovados
                    </IonicButton>
                    
                    <IonicButton 
                      variant="default" 
                      color="warning" 
                      size="small"
                      onClick={() => {
                        setShowBolsistasAprovados(false);
                        setShowBolsistasPendentes(true);
                      }}
                    >
                      Apenas Pendentes
                    </IonicButton>
                    
                    <IonicButton 
                      variant="outline" 
                      color="primary" 
                      size="small"
                      onClick={() => {
                        setShowBolsistasAprovados(true);
                        setShowBolsistasPendentes(true);
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
                        setShowBolsistasAprovados(false);
                        setShowBolsistasPendentes(false);
                      }}
                    >
                      Ocultar Todos
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
                      ? "Filtros desabilitados"
                      : "Nenhum bolsista encontrado"}
                  </h3>
                  <p className="text-gray-600">
                    {!showBolsistasAprovados && !showBolsistasPendentes 
                      ? "Habilite pelo menos um filtro para ver os bolsistas."
                      : showBolsistasAprovados && !showBolsistasPendentes
                      ? "Não há bolsistas aprovados no momento."
                      : !showBolsistasAprovados && showBolsistasPendentes
                      ? "Não há bolsistas pendentes no momento."
                      : "Todos os usuários liberados são automaticamente bolsistas."}
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
                          <TableCell>{'N/A'}</TableCell>
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
                                Email
                              </IonicButton>
                              
                              {user.status === "pendente" && (
                                <IonicButton
                                  variant="default"
                                  color="success"
                                  size="small"
                                  onClick={() => handleStatusChange(user.id, "liberado")}
                                >
                                  <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  Aprovar
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
      const usuariosLiberados = users.filter((user) => user.status === "liberado");
      const responsaveisAtribuidos = users.filter((user) => user.tipoUsuario === "responsavel");
      const responsavelUsers = users.filter((user) => user.tipoUsuario === "responsavel" && user.status === "liberado");
      const bolsistaUsers = users.filter((user) => user.tipoUsuario === "bolsista" && user.status === "liberado");
      
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <UserCheck className="w-6 h-6 mr-2 text-purple-600" />
                Atribuir Bolsista a Responsável
              </CardTitle>
              <p className="text-gray-600">
                Selecione um responsável e um bolsista para atribuir
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Dropdown para Responsável */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">Selecionar Responsável</label>
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
                    <option value="">-- Selecione um bolsista --</option>
                    {bolsistaUsers.map((user) => (
                      <option key={user.id} value={user.matricula || user.id}>{user.nomeCompleto}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <IonicButton
                    variant="default"
                    color="primary"
                    onClick={handleAtribuirBolsistaResponsavel}
                    disabled={!responsavelSelecionado || !bolsistaSelecionado}
                  >
                    Atribuir
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
                  </IonicButton>              </div>
            </div>
          </CardContent>
        </Card>

          {/* Seção para Listar Atribuições */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Listar Atribuições ({atribuicoes.length})
              </CardTitle>
              <p className="text-gray-600">
                Visualize e gerencie as atribuições de bolsistas a responsáveis
              </p>
              {atribuicaoEditando && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-700 font-medium">
                    ✏️ Modo de edição ativo - Selecione o novo responsável e bolsista, depois clique em "Salvar"
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {atribuicoes.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhuma atribuição encontrada
                  </h3>
                  <p className="text-gray-600">
                    Use o formulário acima para atribuir bolsistas a responsáveis.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center">Responsável</TableHead>
                          <TableHead className="text-center">Bolsista</TableHead>
                          <TableHead className="text-center">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {atribuicoes.map((atribuicao, index) => (
                          <TableRow key={atribuicao.id}>
                            <TableCell className="text-center">
                              {atribuicaoEditando?.index === atribuicao.id ? (
                                // Modo de edição - Dropdown para Responsável
                                <div className="flex flex-col items-center space-y-2">
                                  <select 
                                    className="rounded border border-gray-300 p-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={novoResponsavelEdicao}
                                    onChange={(e) => setNovoResponsavelEdicao(e.target.value)}
                                  >
                                    <option value="">-- Selecione --</option>
                                    {users.filter(u => u.tipoUsuario === "responsavel" && u.status === "liberado").map((user) => (
                                      <option key={user.id} value={user.id}>{user.nomeCompleto}</option>
                                    ))}
                                  </select>
                                  <span className="text-xs text-gray-500">Responsável</span>
                                </div>
                              ) : (
                                // Modo de visualização
                                <div className="flex flex-col items-center space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Shield className="w-4 h-4 text-blue-600" />
                                    <span className="font-medium text-blue-900">
                                      {atribuicao.responsavelNome}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    Responsável
                                  </span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {atribuicaoEditando?.index === atribuicao.id ? (
                                // Modo de edição - Dropdown para Bolsista
                                <div className="flex flex-col items-center space-y-2">
                                  <select 
                                    className="rounded border border-gray-300 p-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={novoBolsistaEdicao}
                                    onChange={(e) => setNovoBolsistaEdicao(e.target.value)}
                                  >
                                    <option value="">-- Selecione --</option>
                                    {users.filter(u => u.tipoUsuario === "bolsista" && u.status === "liberado").map((user) => (
                                      <option key={user.id} value={user.matricula || user.id}>{user.nomeCompleto}</option>
                                    ))}
                                  </select>
                                  <span className="text-xs text-gray-500">Bolsista</span>
                                </div>
                              ) : (
                                // Modo de visualização
                                <div className="flex flex-col items-center space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Users className="w-4 h-4 text-green-600" />
                                    <span className="font-medium text-green-900">
                                      {atribuicao.bolsistaNome}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    Bolsista
                                  </span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center space-x-2">
                                {atribuicaoEditando?.index === atribuicao.id ? (
                                  // Botões de salvar/cancelar durante edição
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
                                  // Botões normais de editar/excluir
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
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Admin Panel</h2>
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

      {/* Overlay para mobile quando sidebar aberto */}
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
                  className="md:hidden p-2"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              )}
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                {activeView === "responsavel"
                  ? "Gerenciar Responsáveis"
                  : activeView === "bolsista"
                  ? "Gerenciar Bolsistas"
                  : "Atribuir Cargos"}
              </h1>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
                {responsavelUsers.length} responsáveis, {bolsistaUsers.length} bolsistas
              </span>
              <span className="text-xs text-gray-600 sm:hidden">
                {responsavelUsers.length + bolsistaUsers.length}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 py-4 sm:py-8 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Admin;
