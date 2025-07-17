import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Eye, EyeOff, LogIn, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Tentando fazer login:", { email: formData.email });

      const response = await authService.login(
        formData.email,
        formData.password,
      );

      console.log("Resposta do login:", response.data);

      if (response.data.success) {
        // Salvar dados do usuário (backend retorna em response.data.user)
        const userData = (response.data as any).user;
        if (userData) {
          localStorage.setItem("user", JSON.stringify(userData));
        }

        setMessage(
          `✅ Login realizado com sucesso! Bem-vindo, ${userData?.nome || "usuário"}!`,
        );

        // Redirecionar baseado no tipo de usuário
        if (userData?.tipo === "admin") {
          setTimeout(() => navigate("/admin"), 1500);
        } else {
          setTimeout(() => navigate("/dashboard"), 1500);
        }
      } else {
        setMessage("❌ Credenciais inválidas. Verifique seu email e senha.");
      }
    } catch (error: any) {
      console.error("Erro no login:", error);

      if (error.response) {
        const errorMessage =
          error.response.data.message || error.response.data.erro;

        switch (error.response.status) {
          case 400:
            setMessage("❌ Email e senha são obrigatórios.");
            break;
          case 404:
            setMessage("��� Usuário não encontrado. Verifique seu email.");
            break;
          case 401:
            setMessage("❌ Senha incorreta. Tente novamente.");
            break;
          case 500:
            setMessage("❌ Erro interno do servidor. Contate o administrador.");
            break;
          default:
            setMessage(`❌ ${errorMessage || "Erro ao fazer login."}`);
        }
      } else if (error.request) {
        setMessage(
          "⚠️ Erro de conexão com o servidor.\n\n" +
            "Verifique se:\n" +
            "• XAMPP está rodando\n" +
            "• Apache está ativo\n" +
            "• URL: http://localhost/Projeto-Ufla/login.php está acessível",
        );
      } else {
        setMessage(`❌ Erro inesperado: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
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
              <LogIn className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Fazer Login
            </span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
              Entre na sua conta
            </CardTitle>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Digite suas credenciais para acessar o sistema
            </p>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="h-10 sm:h-12 text-sm sm:text-base"
                  placeholder="Digite seu email"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="h-10 sm:h-12 pr-10 sm:pr-12 text-sm sm:text-base"
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

              {/* Status Message */}
              {message && (
                <Alert
                  className={
                    message.includes("✅")
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }
                >
                  <AlertDescription
                    className={
                      message.includes("✅") ? "text-green-700" : "text-red-700"
                    }
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 sm:h-14 text-base sm:text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            {/* Footer Links */}
            <div className="text-center pt-4 sm:pt-6 border-t space-y-2 sm:space-y-3">
              <p className="text-xs sm:text-sm text-gray-600">
                Não tem uma conta?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Solicitar acesso
                </button>
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                <button
                  onClick={() => navigate("/")}
                  className="font-medium text-gray-500 hover:text-gray-700"
                >
                  Voltar ao início
                </button>
              </p>
            </div>

            {/* Test Users Info */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-xs sm:text-sm">
              <h4 className="font-semibold text-gray-700 mb-1 sm:mb-2">
                💡 Para teste:
              </h4>
              <p className="text-gray-600">
                Use as credenciais que você criou durante o cadastro, ou
                verifique com o administrador se sua conta foi aprovada.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
