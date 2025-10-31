/**
 * Script para testar conectividade com o backend
 * Testa tanto servidor local quanto Render
 */

const LOCAL_API = 'http://localhost:3001/api';
const RENDER_API = 'https://server-zb16.onrender.com/api';

async function testBackend(url, name) {
  console.log(`\n🔍 Testando ${name}...`);
  console.log(`📍 URL: ${url}`);
  
  try {
    // Remove /api do final se existir para testar /health
    const baseUrl = url.replace(/\/api$/, '');
    const response = await fetch(`${baseUrl}/health`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${name} está online!`);
      console.log('📊 Resposta:', JSON.stringify(data, null, 2));
      return true;
    } else {
      console.log(`❌ ${name} retornou erro: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name} está offline ou inacessível`);
    console.log(`🔴 Erro: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  TESTE DE CONECTIVIDADE - AURA HUB    ║');
  console.log('╚════════════════════════════════════════╝');
  
  const localOnline = await testBackend(LOCAL_API, 'Backend LOCAL');
  const renderOnline = await testBackend(RENDER_API, 'Backend RENDER');
  
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║           RESUMO DO TESTE              ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`💻 Backend Local:  ${localOnline ? '✅ ONLINE' : '❌ OFFLINE'}`);
  console.log(`☁️  Backend Render: ${renderOnline ? '✅ ONLINE' : '❌ OFFLINE'}`);
  console.log('\n');
  
  if (localOnline || renderOnline) {
    console.log('🎉 Pelo menos um backend está disponível!');
  } else {
    console.log('⚠️  Nenhum backend está disponível. Verifique os servidores.');
  }
}

main();
