import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Button,
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input
} from "@/components/ui";
import { 
  BarChart3,
  Calendar,
  Home,
  LogOut,
  UserCheck
} from 'lucide-react';
import { 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Bar,
  ResponsiveContainer 
} from 'recharts';

import "../formal-theme.css";
import config from "../src/config";
const API_URL = config.API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Bolsista {
  id: string;
  nome_completo: string;
}

interface DadosGrafico {
  data: string;
  horas: number;
}

export default function ResponsavelDashboard() {
  const [selectedBolsista, setSelectedBolsista] = useState("");
    const [dadosGrafico, setDadosGrafico] = useState<DadosGrafico[]>([]);
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [bolsistas, setBolsistas] = useState<Bolsista[]>([]);

  // --------------------------
  // Função para obter usuário do token JWT
  // --------------------------
  function getUsuarioDoToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      return {
        id: payload.sub,
        tipo_usuario: payload.type,
        username: payload.username,
        nome_completo: payload.nome_completo || "Responsável"
      };
    } catch (err) {
      console.error('Erro ao decodificar token:', err);
      return null;
    }
  }

  const user = getUsuarioDoToken();

  // --------------------------
  // Logout
  // --------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // --------------------------
  // Buscar bolsistas atribuídos ao responsável
  // --------------------------
  useEffect(() => {
    const fetchBolsistas = async () => {
      const usuario = getUsuarioDoToken();
      if (!usuario) {
        navigate("/login");
        return;
      }
      try {
        const response = await fetch(`${API_URL}/usuarios?tipo=bolsista`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        const users = data.data || data || [];
        setBolsistas(users);
        if (users.length > 0) setSelectedBolsista(users[0].id);
      } catch (error) {
        console.error("Erro ao carregar bolsistas:", error);
      }
    };
    fetchBolsistas();
  }, []);
  useEffect(() => {
    if (!selectedBolsista) {
      setDadosGrafico([]);
      return;
    }
    const fetchEntradas = async () => {
      try {
        const res = await fetch(`${API_URL}/horarios/bolsista/${selectedBolsista}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const result = await res.json();
        const registros = result.data || result || [];
        if (Array.isArray(registros)) {
          // Agrupar por data_entrada e somar horas
          const agrupado: Record<string, number> = {};
          registros.forEach((reg: { data_entrada: string; hora_entrada: string; hora_saida: string }) => {
            if (!reg.hora_saida) return;
            const entrada = new Date(`1970-01-01T${reg.hora_entrada}`);
            const saida = new Date(`1970-01-01T${reg.hora_saida}`);
            const diffHoras = (saida.getTime() - entrada.getTime()) / (1000 * 60 * 60);
            if (!agrupado[reg.data_entrada]) agrupado[reg.data_entrada] = 0;
            agrupado[reg.data_entrada] += diffHoras;
          });
          const dados: DadosGrafico[] = Object.entries(agrupado).map(([data, horas]) => ({ data, horas: Number(horas) }));
          setDadosGrafico(dados);
        } else {
          setDadosGrafico([]);
        }
      } catch (err) {
        setDadosGrafico([]);
      }
    };
    fetchEntradas();
  }, [selectedBolsista]);

  // --------------------------
  // Atualizar gráfico automaticamente sempre que mudar bolsista ou datas
  // --------------------------

  // --------------------------
  // Atualizar relógio
  // --------------------------
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --------------------------
  // Render
  // --------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="p-2">
              <Home className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <UserCheck className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Análise de Dados - Bolsistas</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Bem-vindo, {user?.nome_completo || "Responsável"}!
              </p>
              <p className="text-xs text-gray-500">
                {currentTime.toLocaleString('pt-BR')}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Filtros de Análise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Bolsista */}
                <div className="space-y-2">
                  <Label>Bolsista</Label>
                  <Select value={selectedBolsista} onValueChange={setSelectedBolsista}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um bolsista" />
                    </SelectTrigger>
                    <SelectContent>
                      {bolsistas.map((b) => (
                        <SelectItem key={b.id} value={String(b.id)}>
                          {b.nome_completo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico */}
          <Card>
            <CardHeader>
              <CardTitle>Horas por Dia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {dadosGrafico.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosGrafico}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="data" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="horas" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <BarChart3 className="w-20 h-20 mb-4" />
                    <span>Selecione um bolsista para exibir o gráfico</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
