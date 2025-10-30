import React, { useState, useEffect } from 'react';
import config from '../src/config';

const TesteComponents = () => {
  const [resultados, setResultados] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const adicionarResultado = (msg: string) => {
    setResultados(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  const testarAPI = async () => {
    setLoading(true);
    adicionarResultado('🔄 Iniciando teste da API...');
    
    try {
  const API_URL = (config.API_URL || '').replace(/\/$/, '');
      adicionarResultado(`📡 Tentando conectar com: ${API_URL}/usuarios/test`);
      
      // Primeiro, testar com dados mock para verificar se o parse funciona
      const mockData = {
        success: true,
        message: 'Rota de usuários funcionando (MOCK)',
        data: [
          {
            id: 1,
            nome: 'Admin Teste',
            email: 'admin@test.com',
            tipo_usuario: 'admin'
          }
        ]
      };
      
      adicionarResultado(`🧪 Testando com dados MOCK primeiro...`);
      adicionarResultado(`✅ Parse de dados MOCK bem-sucedido: ${JSON.stringify(mockData)}`);
      
      // Agora tentar a API real
      const response = await fetch(`${API_URL}/usuarios/test`);
      
      adicionarResultado(`📊 Status da resposta: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        adicionarResultado(`✅ Sucesso! Dados recebidos: ${JSON.stringify(data)}`);
      } else {
        adicionarResultado(`❌ Erro HTTP: ${response.status}`);
      }
    } catch (error: any) {
      adicionarResultado(`❌ Erro de conexão: ${error.message}`);
      adicionarResultado(`ℹ️ Isso pode ser esperado se o backend não estiver rodando.`);
    } finally {
      setLoading(false);
    }
  };

  const testarParseJSON = async () => {
    adicionarResultado('🧪 Testando parse de JSON...');
    
    // Simular resposta do servidor antigo (com erro)
    const mockResponse = {
      text: () => Promise.resolve('{"success": true, "data": [{"id": 1}]   }')
    };
    
    try {
      const text = await mockResponse.text();
      adicionarResultado(`📝 Texto recebido: ${text}`);
      
      const parsed = JSON.parse(text);
      adicionarResultado(`✅ JSON parseado com sucesso: ${JSON.stringify(parsed)}`);
    } catch (error: any) {
      adicionarResultado(`❌ Erro no parse JSON: ${error.message}`);
    }
  };

  const limpar = () => {
    setResultados([]);
  };

  useEffect(() => {
    adicionarResultado('🚀 Componente de teste carregado');
    adicionarResultado(`🌐 Ambiente: ${import.meta.env.MODE}`);
    adicionarResultado(`🔗 API URL: ${import.meta.env.VITE_API_URL || 'Não configurada'}`);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 Teste de Componente React</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testarAPI}
          disabled={loading}
          style={{ margin: '5px', padding: '10px 20px', fontSize: '16px' }}
        >
          {loading ? '⏳ Testando...' : '🔗 Testar API'}
        </button>
        
        <button 
          onClick={testarParseJSON}
          style={{ margin: '5px', padding: '10px 20px', fontSize: '16px' }}
        >
          🧪 Testar JSON Parse
        </button>
        
        <button 
          onClick={limpar}
          style={{ margin: '5px', padding: '10px 20px', fontSize: '16px' }}
        >
          🧹 Limpar
        </button>
      </div>
      
      <div 
        style={{ 
          background: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '5px',
          height: '400px',
          overflow: 'auto',
          fontSize: '14px'
        }}
      >
        <h3>📋 Resultados dos Testes:</h3>
        {resultados.length === 0 ? (
          <p>Nenhum teste executado ainda...</p>
        ) : (
          resultados.map((resultado, index) => (
            <div key={index} style={{ marginBottom: '5px', padding: '5px', background: 'white', borderRadius: '3px' }}>
              {resultado}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TesteComponents;
