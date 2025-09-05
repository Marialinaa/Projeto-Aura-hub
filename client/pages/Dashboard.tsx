import React from "react";
import "../formal-theme.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, LogOut, Settings, Bell, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Obter dados do usuário do localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
  <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="p-2 text-blue-700"
            >
              <Home className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700 font-medium">
              Bem-vindo, <span className="text-blue-700">{user?.nome || "Usuário"}</span>!
            </span>
            <Button variant="outline" onClick={handleLogout} className="border-blue-700 text-blue-700 hover:bg-blue-50">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Card */}
          <Card className="border border-gray-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center text-blue-700">
                <User className="w-6 h-6 mr-2 text-blue-700" />
                Painel do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Suas Informações</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>Nome: <span className="font-medium text-black">{user?.nome || "-"}</span></p>
                    <p>Email: <span className="font-medium text-black">{user?.email || "-"}</span></p>
                    <p>Tipo: <span className="font-medium text-green-700">{user?.tipo || user?.tipoUsuario || "-"}</span></p>
                    <p>Login: <span className="font-medium text-black">{user?.login || "-"}</span></p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Status da Conta</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>Status: <span className="font-medium text-green-700">{user?.status || "Ativo"}</span></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
              <CardHeader className="text-center">
                <Settings className="w-12 h-12 text-blue-700 mx-auto mb-2" />
                <CardTitle className="text-lg text-gray-900">Configurações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center text-sm">Gerencie suas preferências e configurações de conta</p>
                <Button className="w-full mt-4" variant="outline" disabled>Em breve</Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
              <CardHeader className="text-center">
                <Bell className="w-12 h-12 text-blue-700 mx-auto mb-2" />
                <CardTitle className="text-lg text-gray-900">Notificações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center text-sm">Visualize suas notificações e atualizações</p>
                <Button className="w-full mt-4" variant="outline" disabled>Em breve</Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
              <CardHeader className="text-center">
                <User className="w-12 h-12 text-blue-700 mx-auto mb-2" />
                <CardTitle className="text-lg text-gray-900">Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center text-sm">Atualize suas informações pessoais</p>
                <Button className="w-full mt-4" variant="outline" disabled>Em breve</Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border border-gray-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-gray-900">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => navigate("/")} variant="outline" className="border-blue-700 text-blue-700 hover:bg-blue-50">
                  <Home className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Button>
                <Button onClick={handleLogout} variant="outline" className="border-blue-700 text-blue-700 hover:bg-blue-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Fazer Logout
                </Button>
                {user?.tipo === "admin" && (
                  <Button
                    onClick={() => navigate("/admin")}
                    className="bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    Painel Admin
                  </Button>
                )}
                {user?.tipoUsuario === "bolsista" && (
                  <Button
                    onClick={() => navigate("/bolsista")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Painel Bolsista
                  </Button>
                )}
                {user?.tipoUsuario === "responsavel" && (
                  <Button
                    onClick={() => navigate("/responsavel")}
                    className="bg-black hover:bg-gray-900 text-white"
                  >
                    Painel Responsável
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
