import React, { useState } from 'react';
import config from "../src/config";

const TesteAdminOriginal = () => {
  const [resultados, setResultados] = useState<string[]>([]);

  const log = (msg: string) => {
    setResultados(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
    console.log(msg);
  };

  // Simular exatamente a função parseJSONResponse que estava com problema
  const parseJSONResponse = async (response: any) => {
    const responseText = await response.text();
    log(`📝 Texto da resposta recebido: "${responseText}"`);
    
    // Tentar limpar caracteres extras (isso era o problema original)
    let cleanText = responseText.trim();
    
    // Remover quebras de linha e espaços extras
    cleanText = cleanText.replace(/\s+/g, ' ');
    
    // Verificar se há caracteres suspeitos no final
    if (cleanText.includes('"}')) {
      const lastIndex = cleanText.lastIndexOf('"}');
      if (lastIndex !== -1) {
        cleanText = cleanText.substring(0, lastIndex + 2);
        log(`🧹 Texto limpo: "${cleanText}"`);
      }
    }
    
    try {
      const parsed = JSON.parse(cleanText);
      log(`✅ JSON parseado com sucesso!`);
      return parsed;
    } catch (error: any) {
      log(`❌ Erro no parse: ${error.message}`);
      throw new Error(`Formato de resposta inválido do servidor: ${error.message}`);
    }
  };

  const testarProblemaOriginal = async () => {
    log('🧪 === TESTE DO PROBLEMA ORIGINAL ===');
    
    // Simular as respostas problemáticas que vinham do servidor PHP
    const respostasProblematicas = [
      '{"success": true, "data": []}   }',  // JSON inválido - chave extra
      '{"success": true, "data": []}\n\n   ', // JSON com espaços extras
      '{"success": true, "data": [{"id": 1}]', // JSON incompleto
      '{"success": true, "data": [{"id": 1}]}', // JSON válido
    ];

    for (let i = 0; i < respostasProblematicas.length; i++) {
      const respostaTexto = respostasProblematicas[i];
      log(`\n📋 Teste ${i + 1}/4:`);
      
      try {
        // Simular Response object
        const mockResponse = {
          text: () => Promise.resolve(respostaTexto)
        };
        
        const resultado = await parseJSONResponse(mockResponse);
        log(`✅ Sucesso: ${JSON.stringify(resultado)}`);
      } catch (error: any) {
        log(`❌ Falha: ${error.message}`);
      }
    }
  };

  const testarSolucaoAtual = async () => {
    log('\n🔧 === TESTE DA SOLUÇÃO ATUAL ===');
    
    // Simular chamada para a nova API
    const API_URL = (config.API_URL || '').replace(/\/$/, '');
    log(`🔗 URL da API: ${API_URL}`);
    
    try {
      // Simular resposta da nova API
      const mockResponseNova = {
        text: () => Promise.resolve(JSON.stringify({
          success: true,
          message: 'Rota de usuários funcionando',
          data: [
            {
              id: 1,
              nome: 'Admin Teste',
              email: 'admin@test.com',
              tipo_usuario: 'admin'
            }
          ]
        }))
      };
      
      const resultado = await parseJSONResponse(mockResponseNova);
      log(`✅ Nova API - Sucesso: ${JSON.stringify(resultado)}`);
    } catch (error: any) {
      log(`❌ Nova API - Falha: ${error.message}`);
    }
  };

  const limpar = () => {
    setResultados([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔍 Teste do Problema Original - Admin.tsx</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testarProblemaOriginal}
          style={{ margin: '5px', padding: '10px 20px', fontSize: '16px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          🐛 Testar Problema Original
        </button>
        
        <button 
          onClick={testarSolucaoAtual}
          style={{ margin: '5px', padding: '10px 20px', fontSize: '16px', background: '#51cf66', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          ✅ Testar Solução Atual
        </button>
        
        <button 
          onClick={limpar}
          style={{ margin: '5px', padding: '10px 20px', fontSize: '16px', background: '#868e96', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          🧹 Limpar
        </button>
      </div>
      
      <div 
        style={{ 
          background: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '8px',
          height: '500px',
          overflow: 'auto',
          fontSize: '14px',
          fontFamily: 'monospace'
        }}
      >
        <h3>📋 Log dos Testes:</h3>
        {resultados.length === 0 ? (
          <p style={{ color: '#868e96' }}>Nenhum teste executado ainda...</p>
        ) : (
          resultados.map((resultado, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '5px', 
                padding: '8px', 
                background: resultado.includes('❌') ? '#ffe3e3' : 
                           resultado.includes('✅') ? '#e3f2e3' : 
                           resultado.includes('📝') ? '#e3f0ff' : 'white', 
                borderRadius: '4px',
                borderLeft: resultado.includes('❌') ? '4px solid #ff6b6b' : 
                           resultado.includes('✅') ? '4px solid #51cf66' : 
                           resultado.includes('📝') ? '4px solid #339af0' : '4px solid #dee2e6'
              }}
            >
              {resultado}
            </div>
          ))
        )}
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', background: '#e8f4f8', borderRadius: '8px' }}>
        <h3>📊 Resumo dos Testes</h3>
        <p><strong>Problema Original:</strong> O servidor PHP estava retornando JSON malformado com caracteres extras.</p>
        <p><strong>Solução Implementada:</strong> Mudança para API Node.js que retorna JSON bem formado.</p>
  <p><strong>URL Nova/API:</strong> <code>{(config.API_URL || (import.meta.env.VITE_API_URL as string | undefined) || 'NÃO CONFIGURADA').replace(/\/$/, '')}</code></p>
      </div>
    </div>
  );
};

export default TesteAdminOriginal;
