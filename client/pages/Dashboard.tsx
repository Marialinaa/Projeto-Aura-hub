import React from "react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="p-2"
            >
              <Home className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Bem-vindo, {user?.nome || "Usuário"}!
            </span>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <User className="w-6 h-6 mr-2 text-blue-600" />
                Painel do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Suas Informações
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Nome:</strong> {user?.nome || "N/A"}
                    </p>
                    <p>
                      <strong>Email:</strong> {user?.email || "N/A"}
                    </p>
                    <p>
                      <strong>Login:</strong> {user?.login || "N/A"}
                    </p>
                    <p>
                      <strong>Tipo:</strong> {user?.tipo || "Usuário"}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Status da Conta
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Conta ativa</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span>Acesso liberado</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <CardTitle className="text-lg">Configurações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center text-sm">
                  Gerencie suas preferências e configurações de conta
                </p>
                <Button className="w-full mt-4" variant="outline" disabled>
                  Em breve
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <CardTitle className="text-lg">Notificações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center text-sm">
                  Visualize suas notificações e atualizações
                </p>
                <Button className="w-full mt-4" variant="outline" disabled>
                  Em breve
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <CardTitle className="text-lg">Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center text-sm">
                  Atualize suas informações pessoais
                </p>
                <Button className="w-full mt-4" variant="outline" disabled>
                  Em breve
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => navigate("/")} variant="outline">
                  <Home className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Button>
                <Button onClick={handleLogout} variant="outline">
                  <LogOut className="w-4 h-4 mr-2" />
                  Fazer Logout
                </Button>
                {user?.tipo === "admin" && (
                  <Button
                    onClick={() => navigate("/admin")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Painel Admin
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
