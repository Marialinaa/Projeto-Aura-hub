import React, { useState, useEffect } from "react";
import "../formal-theme.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Eye, EyeOff, LogIn, Settings, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import config from "../src/config";
import { useToast } from "@/hooks/use-toast"; // ajuste o caminho conforme seu projeto

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showDebugConsole, setShowDebugConsole] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [formData, setFormData] = useState({ login: "", senha: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    console.log("🔍 Executando diagnósticos...");

    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      currentURL: window.location.href,
  apiURL: (config.API_URL || '').replace(/\/$/, ''),
      environment: {
        NODE_ENV: import.meta?.env?.NODE_ENV,
        MODE: import.meta?.env?.MODE,
        VITE_API_URL: import.meta?.env?.VITE_API_URL,
      },
      network: {
        online: navigator.onLine,
        userAgent: navigator.userAgent,
      },
      localStorage: {
        hasToken: !!localStorage.getItem("token"),
        hasUser: !!localStorage.getItem("usuario"),
      },
    };

    try {
      const connectivityTest = await authService.testConnectivity();
      diagnostics.connectivity = connectivityTest;
    } catch (error: any) {
      diagnostics.connectivity = { success: false, error: error.message };
    }

    try {
      const response = await fetch(`${diagnostics.apiURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: "teste", senha: "teste123" }),
      });

      diagnostics.endpointTests = {
        "/auth/login": {
          status: response.status,
          statusText: response.statusText,
          accessible: response.ok,
        },
      };
    } catch (error: any) {
      diagnostics.endpointTests = {
        "/auth/login": {
          accessible: false,
          error: error.message,
        },
      };
    }

    setDebugInfo(diagnostics);
    console.log("📊 Diagnósticos completos:", diagnostics);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { login, senha } = formData;
    if (!login || !senha) {
      toast({ title: "❌ Preencha login e senha" });
      return;
    }

    console.log("Tentando fazer login:", { login, senha });
    setIsLoading(true);
    setMessage("");

    try {
      const response = await authService.login(login, senha);
      console.log("Login bem-sucedido:", response.data);

      if (response.data?.success) {
        const { token, usuario, redirect } = response.data.data;

        // Salva no localStorage
        if (token) localStorage.setItem("token", token);
        if (usuario) localStorage.setItem("usuario", JSON.stringify(usuario));

        setMessage(`✅ Login realizado com sucesso! Bem-vindo, ${usuario?.nome_completo || "usuário"}!`);

        // Redireciona para o painel ou rota da API
        navigate(redirect || "/painel");
      } else {
        setMessage("❌ Credenciais inválidas. Verifique seu login e senha.");
      }
    } catch (err: any) {
      console.error("Erro no login:", err);
      setMessage("❌ Erro ao tentar logar. Tente novamente mais tarde.");
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
                <Label htmlFor="login">Login</Label>
                <Input
                  id="login"
                  name="login"
                  type="text"
                  required
                  value={formData.login}
                  onChange={handleChange}
                  placeholder="Digite seu login"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Input
                    id="senha"
                    name="senha"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="Digite sua senha"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {message && (
                <Alert
                  className={message.includes("✅") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}
                >
                  <AlertDescription
                    className={message.includes("✅") ? "text-green-700" : "text-red-700"}
                  >
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 sm:h-14 text-base sm:text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
