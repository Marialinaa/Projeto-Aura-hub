import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield, Zap, ArrowRight, UserPlus, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Sistema de Usuários
          </span>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/login")}
            className="hidden sm:flex items-center space-x-1"
          >
            <LogIn className="w-4 h-4" />
            <span>Entrar</span>
          </Button>
          <Button
            size="sm"
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center space-x-1"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar</span>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 py-8 sm:py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Sistema de Gestão
            </span>
            <br />
            <span className="text-slate-800">de Usuários</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Plataforma completa para gerenciar responsáveis e bolsistas com
            controle de acesso seguro e interface intuitiva.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Solicitar Acesso</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 flex items-center justify-center space-x-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Já tenho acesso</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
