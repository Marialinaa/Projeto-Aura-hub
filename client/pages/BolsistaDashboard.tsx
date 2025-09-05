import { getRegistrosEntrada } from '@/services/api';
import { useAppContext } from '../context/AppContext';
import { User } from '../types';
import { useEffect, useState } from 'react';

type RegistroEntradaLocal = {
  id: number;
  usuario_id: number;
  data_entrada: string;
  hora_entrada: string;
  hora_saida?: string | null;
};

import "../formal-theme.css";
import config from "../src/config";
export default function BolsistaDashboard() {
  const [registros, setRegistros] = useState<RegistroEntradaLocal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [atividadeIniciada, setAtividadeIniciada] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState<string>('/placeholder.svg');
  const [mensagemResponsavel, setMensagemResponsavel] = useState('');
  const [enviandoMsg, setEnviandoMsg] = useState(false);
  const [usuario, setUsuario] = useState<User | null>(null);

  const { users } = useAppContext();
  const usuarioContext: User | undefined = users && users.length > 0 ? users[0] : undefined;

  // Função para obter usuário a partir do JWT armazenado no localStorage
  function getUsuarioDoToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      return {
        id: payload.sub,
        tipo_usuario: payload.type,
        username: payload.username
      };
    } catch (err) {
      console.error('Erro ao decodificar token:', err);
      return null;
    }
  }

  // Upload de foto de perfil
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setFotoPerfil(ev.target?.result as string);
      reader.readAsDataURL(file);
      // Aqui você pode enviar para o backend se quiser salvar
    }
  };

  // Enviar mensagem ao responsável
  const handleEnviarMensagem = async () => {
    if (!mensagemResponsavel.trim()) return;
    setEnviandoMsg(true);
    setTimeout(() => {
      setMensagem('Mensagem enviada ao responsável!');
      setMensagemResponsavel('');
      setEnviandoMsg(false);
    }, 1200);
  };

  // Carregar registros
  useEffect(() => {
    async function carregarRegistros() {
      try {
        const data = await getRegistrosEntrada();
        setRegistros(data);
        if (data.some((r: RegistroEntradaLocal) => !r.hora_saida)) setAtividadeIniciada(true);
      } catch (error) {
        console.error('Erro ao carregar registros:', error);
      } finally {
        setIsLoading(false);
      }
    }
    carregarRegistros();
  }, []);

  // Pegar usuário do JWT
  useEffect(() => {
    const tokenUser = getUsuarioDoToken();
    if (tokenUser) {
      // Supondo que exista um endpoint para buscar usuário pelo id
  fetch(`${config.API_URL.replace(/\/$/, '')}/get_usuario.php?id=${tokenUser.id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
        .then(res => res.json())
        .then(data => setUsuario(data))
        .catch(() => setUsuario(null));
    }
  }, []);

  // Encerrar atividade
  const handleEncerrarAtividade = async () => {
    // Pegar usuário do JWT
    const usuario = getUsuarioDoToken();
    if (!usuario) {
      setMensagem("Usuário não autenticado.");
      return;
    }

    // Encontrar o último registro sem hora_saida
    const ultimoRegistro = registros
      .filter(r => !r.hora_saida)
      .sort(
        (a, b) =>
          new Date(b.data_entrada + " " + b.hora_entrada).getTime() -
          new Date(a.data_entrada + " " + a.hora_entrada).getTime()
      )[0];

    if (!ultimoRegistro) {
      setMensagem("Nenhum registro de entrada ativo encontrado.");
      return;
    }

    // Hora de saída atual
    const hora_saida = new Date().toLocaleTimeString("pt-BR", { hour12: false });

    // Payload correto
    const payload = {
      usuario_id: usuario.id,
      hora_saida,
      data_entrada: ultimoRegistro.data_entrada // usa a data exata do registro
    };


    try {
  const res = await fetch(`${config.API_URL.replace(/\/$/, '')}/encerrar_atividade.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setMensagem("Atividade encerrada e saída registrada!");
        // Atualiza o registro local
        setRegistros(prev =>
          prev.map(r =>
            r.id === ultimoRegistro.id ? { ...r, hora_saida } : r
          )
        );
        setAtividadeIniciada(false);
        setTimeout(() => window.location.href = "/login", 1200);
      } else {
        setMensagem("Erro: " + (data.message || "Erro desconhecido"));
      }
    } catch (err: any) {
      setMensagem("Erro: " + (err.message || "Erro desconhecido"));
    }
  };



  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f7f7' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: '#1e293b',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 0',
        boxShadow: '2px 0 8px #0001'
      }}>
        <h2 style={{ marginBottom: 32, fontWeight: 700, fontSize: 22 }}>Painel Bolsista</h2>
        <button
          style={{
            width: '90%',
            padding: '12px',
            background: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            cursor: atividadeIniciada ? 'pointer' : 'not-allowed',
            opacity: atividadeIniciada ? 1 : 0.6,
            transition: 'background 0.2s',
          }}
          onClick={handleEncerrarAtividade}
          disabled={!atividadeIniciada}
        >
          Encerrar atividade
        </button>
        <div style={{ marginTop: 40, fontSize: 14, color: '#cbd5e1', textAlign: 'center' }}>
          {mensagem}
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main style={{ flex: 1, padding: '32px 48px' }}>
        {/* Credenciais do usuário */}
        <div style={{
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 8px #0001',
          padding: '24px 32px',
          marginBottom: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 32
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <img src={fotoPerfil} alt="Avatar" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
            <label htmlFor="fotoPerfil" style={{ fontSize: 13, color: '#64748b', cursor: 'pointer', marginTop: 4 }}>Alterar foto</label>
            <input id="fotoPerfil" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFotoChange} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{usuario?.nome_completo || 'Nome não disponível'}</div>
            <div style={{ fontSize: 16, color: '#64748b' }}>Login: <b>{usuario?.login || '---'}</b></div>
            <div style={{ fontSize: 15, color: '#22c55e', fontWeight: 600 }}>{usuario?.tipo_usuario?.toUpperCase() || '---'}</div>
            <div style={{ marginTop: 16 }}>
              <label htmlFor="mensagemResp" style={{ fontSize: 14, color: '#334155', fontWeight: 500 }}>Enviar mensagem ao responsável:</label>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <input
                  id="mensagemResp"
                  type="text"
                  value={mensagemResponsavel}
                  onChange={e => setMensagemResponsavel(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  style={{ flex: 1, padding: '8px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14 }}
                  disabled={enviandoMsg}
                />
                <button
                  onClick={handleEnviarMensagem}
                  disabled={enviandoMsg || !mensagemResponsavel.trim()}
                  style={{ padding: '8px 16px', borderRadius: 6, background: '#2563eb', color: '#fff', border: 'none', fontWeight: 600, cursor: enviandoMsg || !mensagemResponsavel.trim() ? 'not-allowed' : 'pointer' }}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Registros de entrada */}
        <div>
          <h3 style={{ fontWeight: 600, fontSize: 22, marginBottom: 16 }}>Meus Registros de Entrada</h3>
          {isLoading ? (
            <p>Carregando...</p>
          ) : registros.length > 0 ? (
            <table style={{ width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #0001', borderCollapse: 'collapse', marginBottom: 24 }}>
              <thead>
                <tr style={{ background: '#e2e8f0' }}>
                  <th style={{ padding: '10px 8px', textAlign: 'left' }}>Data</th>
                  <th style={{ padding: '10px 8px', textAlign: 'left' }}>Hora de Entrada</th>
                  <th style={{ padding: '10px 8px', textAlign: 'left' }}>Hora de Saída</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((registro) => (
                  <tr key={registro.id}>
                    <td style={{ padding: '8px' }}>{new Date(registro.data_entrada).toLocaleDateString()}</td>
                    <td style={{ padding: '8px' }}>{registro.hora_entrada}</td>
                    <td style={{ padding: '8px' }}>{registro.hora_saida || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nenhum registro encontrado.</p>
          )}
        </div>
      </main>
    </div>
  );
}
