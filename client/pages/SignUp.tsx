import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  Mail,
  UserCheck,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService  from "../services/authService";
import axios from 'axios';
import config from "../src/config";


import "../formal-theme.css";
const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    funcao: "", // Para responsáveis
    matricula: "", // Para bolsistas
    curso: "", // Para bolsistas
    email: "",
    login: "",
    senha: "",
    confirmarSenha: "",
    tipoUsuario: "bolsista" as "responsavel" | "bolsista",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTipoUsuarioChange = (value: string) => {
    setFormData({ ...formData, tipoUsuario: value as "responsavel" | "bolsista" });
  };

  // Função para limpar campos
  const limparCampos = () => {
    setFormData({
      nomeCompleto: "",
      funcao: "",
      matricula: "",
      curso: "",
      email: "",
      login: "",
      senha: "",
      confirmarSenha: "",
      tipoUsuario: "bolsista",
    });
  };

  const handleCancel = () => {
    limparCampos();
    setMessage("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Implementar debounce para evitar múltiplos cliques
    if (isSubmitting || isLoading) {
      console.log('Submissão já em andamento, ignorando...');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    
    try {
      console.log('Enviando solicitação de acesso:', formData);

      // Adicionar validação dos campos
      if (!formData.nomeCompleto || !formData.email || !formData.login || !formData.senha || !formData.tipoUsuario) {
        setError('Todos os campos obrigatórios devem ser preenchidos');
        return;
      }

      // Validar se as senhas coincidem
      if (formData.senha !== formData.confirmarSenha) {
        setError('As senhas não coincidem');
        return;
      }

      // Converter tipo_usuario para o valor esperado pelo backend
      const tipo_usuario = formData.tipoUsuario === 'bolsista' ? 'bolsista' : 'responsavel';

      // Enviar apenas os campos esperados pela API
      const dadosRegistro = {
        nome: formData.nomeCompleto,
        email: formData.email,
        senha: formData.senha,
        tipo_usuario,
        login: formData.login,
      };

      console.log(`Enviando solicitação de acesso para ${tipo_usuario}:`, dadosRegistro);

      // Enviar dados usando o serviço de API
      const response = await authService.register(dadosRegistro);

      console.log("Resposta do servidor:", response.data);

      // Backend retorna status 201 para sucesso, não campo 'success'
      if (response.status === 201) {
        const statusMsg =
          response.data.status || "Solicitação enviada com sucesso!";
        const avisoMsg = response.data.aviso
          ? `\n⚠️ ${response.data.aviso}`
          : "";

        setMessage(
          `✅ ${statusMsg}${avisoMsg}\n\n📧 O administrador foi notificado por email e analisará sua solicitação em breve.`,
        );
        limparCampos();
      } else {
        setMessage(
          response.data.erro ||
            response.data.message ||
            "Erro ao enviar solicitação. Tente novamente.",
        );
      }
    } catch (error: any) {
      console.error("Erro detalhado:", error);

      // Tratamento específico de erros
      if (error.code === "ECONNABORTED") {
        setMessage(
          "Timeout na conexão. Verifique se o servidor está rodando e tente novamente.",
        );
      } else if (error.response) {
        // Erro retornado pelo servidor
        const status = error.response.status;
        const data = error.response.data;

        // Backend retorna campo 'message' para mensagens de erro
        const errorMessage = data.message || data.erro || "Erro no servidor";

        switch (status) {
          case 400:
            setMessage(`❌ ${errorMessage}`);
            break;
          case 405:
            setMessage(
              "❌ Método não permitido. Verifique a configuração do servidor.",
            );
            break;
          case 409:
            setMessage(`❌ ${errorMessage}`);
            break;
          case 500:
            setMessage(`❌ Erro interno do servidor: ${errorMessage}`);
            break;
          default:
            setMessage(`❌ ${errorMessage} (Status: ${status})`);
        }
      } else if (error.request) {
        // Erro de rede/conexão
        setMessage(
          "⚠️ Erro de conexão com o servidor. Verifique:\n" +
           "• Se o servidor backend Node está rodando (ex: " + ((config && config.API_URL) ? (config.API_URL as string) : (import.meta.env.VITE_API_URL || 'NÃO CONFIGURADA')) + ")\n" +
            "• Se o endpoint /api/usuarios está acessível\n" +
            "• Se não há bloqueio de CORS",
        );
      } else {
        setMessage(`Erro inesperado: ${error.message || "Erro desconhecido"}`);
      }
    } finally {
      setIsLoading(false);
      // Permitir nova submissão após um intervalo para evitar spam
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000); // 2 segundos
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Sistema de Usuários
            </span>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
              Solicitação de Acesso
            </CardTitle>
            <p className="text-gray-600 mt-2 sm:mt-3 text-base sm:text-lg">
              Preencha seus dados para solicitar acesso ao sistema
            </p>
          </CardHeader>

          <CardContent className="space-y-6 sm:space-y-8 px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* User Type Section - Moved to top */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                  <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
                  Tipo de Usuário
                </h3>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Primeiro, selecione seu tipo de usuário:
                  </Label>
                  <RadioGroup
                    value={formData.tipoUsuario}
                    onValueChange={handleTipoUsuarioChange}
                    className="flex flex-col space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                      <RadioGroupItem value="responsavel" id="responsavel" />
                      <Label 
                        htmlFor="responsavel" 
                        className="flex-1 cursor-pointer text-sm font-medium"
                      >
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-blue-600" />
                          Responsável
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Responsável por projeto ou laboratório (Professor, Coordenador, etc.)
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                      <RadioGroupItem value="bolsista" id="bolsista" />
                      <Label 
                        htmlFor="bolsista" 
                        className="flex-1 cursor-pointer text-sm font-medium"
                      >
                        <div className="flex items-center">
                          <UserCheck className="w-4 h-4 mr-2 text-green-600" />
                          Bolsista
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Estudante com bolsa ou membro da equipe
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              {/* Personal Information Section */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                  Informações Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="nomeCompleto"
                      className="text-sm font-medium text-gray-700"
                    >
                      Nome Completo
                    </Label>
                    <Input
                      id="nomeCompleto"
                      name="nomeCompleto"
                      type="text"
                      required
                      value={formData.nomeCompleto}
                      onChange={handleChange}
                      className="h-10 sm:h-12 text-sm sm:text-base"
                      placeholder="Digite seu nome completo"
                    />
                  </div>

                  {/* Campos condicionais baseados no tipo de usuário */}
                  {formData.tipoUsuario === "responsavel" ? (
                    <div className="space-y-2">
                      <Label
                        htmlFor="funcao"
                        className="text-sm font-medium text-gray-700"
                      >
                        <Briefcase className="w-4 h-4 inline mr-1" />
                        Função
                      </Label>
                      <Input
                        id="funcao"
                        name="funcao"
                        type="text"
                        required
                        value={formData.funcao}
                        onChange={handleChange}
                        className="h-10 sm:h-12 text-sm sm:text-base"
                        placeholder="Sua função ou cargo"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label
                        htmlFor="matricula"
                        className="text-sm font-medium text-gray-700"
                      >
                        <User className="w-4 h-4 inline mr-1" />
                        Matrícula
                      </Label>
                      <Input
                        id="matricula"
                        name="matricula"
                        type="text"
                        required
                        value={formData.matricula}
                        onChange={handleChange}
                        className="h-10 sm:h-12 text-sm sm:text-base"
                        placeholder="Digite sua matrícula"
                      />
                    </div>
                  )}
                </div>

                {/* Campo Curso apenas para bolsistas */}
                {formData.tipoUsuario === "bolsista" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="curso"
                      className="text-sm font-medium text-gray-700"
                    >
                      <Briefcase className="w-4 h-4 inline mr-1" />
                      Curso
                    </Label>
                    <Input
                      id="curso"
                      name="curso"
                      type="text"
                      required
                      value={formData.curso}
                      onChange={handleChange}
                      className="h-10 sm:h-12 text-sm sm:text-base"
                      placeholder="Digite seu curso"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    <Mail className="w-4 h-4 inline mr-1" />
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="h-10 sm:h-12 text-sm sm:text-base"
                    placeholder="Digite seu e-mail"
                  />
                </div>
              </div>

              {/* Access Information Section */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                  <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                  Dados de Acesso
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="login"
                      className="text-sm font-medium text-gray-700"
                    >
                      Login
                    </Label>
                    <Input
                      id="login"
                      name="login"
                      type="text"
                      required
                      value={formData.login}
                      onChange={handleChange}
                      className="h-10 sm:h-12 text-sm sm:text-base"
                      placeholder="Escolha um nome de usuário"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="senha"
                        className="text-sm font-medium text-gray-700"
                      >
                        Senha
                      </Label>
                      <div className="relative">
                        <Input
                          id="senha"
                          name="senha"
                          type={showPassword ? "text" : "password"}
                          required
                          onChange={handleChange}
                          className="h-12 pr-12"
                          placeholder="Digite sua senha"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmarSenha"
                        className="text-sm font-medium text-gray-700"
                      >
                        Confirmar Senha
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmarSenha"
                          name="confirmarSenha"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          onChange={handleChange}
                          className="h-12 pr-12"
                          placeholder="Confirme sua senha"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Type Section */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                  <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                  Confirmação do Tipo de Usuário
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Selecionado:</strong> {formData.tipoUsuario === "responsavel" ? "Responsável" : "Bolsista"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.tipoUsuario === "responsavel" 
                      ? "Você será cadastrado como responsável no sistema" 
                      : "Você será cadastrado como bolsista no sistema"}
                  </p>
                </div>
              </div>

              {/* Status Message */}
              {message && (
                <Alert
                  className={
                    message.includes("Erro") || message.includes("erro")
                      ? "border-red-200 bg-red-50"
                      : "border-green-200 bg-green-50"
                  }
                >
                  <AlertDescription
                    className={
                      message.includes("Erro") || message.includes("erro")
                        ? "text-red-700"
                        : "text-green-700"
                    }
                  >
                    {message}
                  </AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-700">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 h-14 text-lg"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="default"
                  className="flex-1 h-14 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Solicitar acesso"}
                </Button>
              </div>
            </form>

            {/* Footer */}
            <div className="text-center pt-6 border-t">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{" "}
                <button
                  onClick={() => navigate("/")}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Voltar ao início
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Sua solicitação será analisada pelo administrador. Você receberá
                um email com o resultado.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
