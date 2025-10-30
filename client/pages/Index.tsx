import { Button } from "@/components/ui/button";
import "../formal-theme.css";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield, Zap, ArrowRight, UserPlus, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
  <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      {/* Header */}
  <header className="px-4 sm:px-8 py-4 flex justify-between items-center border-b border-gray-200 bg-white shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center shadow">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Sistema de Usuários</span>
        </div>

  <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/login")}
            className="hidden sm:flex items-center space-x-1 border-blue-700 text-blue-700 hover:bg-blue-50"
          >
            <LogIn className="w-4 h-4" />
            <span>Entrar</span>
          </Button>
          <Button
            size="sm"
            onClick={() => navigate("/signup")}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-1 shadow"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar</span>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 px-4 sm:px-8 py-8 sm:py-16 flex items-center justify-center bg-gray-100">
        <div className="max-w-3xl w-full mx-auto text-center bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
            <span className="text-blue-700">Sistema de Gestão</span>
            <br />
            <span className="text-gray-800">de Usuários</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Plataforma completa para gerenciar responsáveis e bolsistas com controle de acesso seguro e interface intuitiva.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-base sm:text-lg px-8 py-3 flex items-center justify-center space-x-2 shadow"
            >
              <UserPlus className="w-5 h-5" />
              <span>Solicitar acesso</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto text-base sm:text-lg px-8 py-3 flex items-center justify-center space-x-2 border-blue-700 text-blue-700 hover:bg-blue-50"
            >
              <LogIn className="w-5 h-5" />
              <span>Já tenho acesso</span>
            </Button>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="px-4 sm:px-8 py-6 border-t border-gray-300 bg-gray-900 text-gray-100">
        <div className="max-w-6xl mx-auto flex justify-center items-center">
          {/* Rodapé limpo */
          }
        </div>
      </footer>
    </div>
  );
};

export default Index;
