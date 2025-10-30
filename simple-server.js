const express = require('express');
const app = express();
const PORT = 3005;

app.use(express.json());

// Middleware para log de todas as requisições
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('📋 Headers:', req.headers);
  // tentar logar raw body caso exista
  if (req.rawBody) {
    console.log('📦 RawBody (truncated):', req.rawBody.slice(0, 1000));
  }
  console.log('📦 Parsed Body:', req.body);
  next();
});

// Rota de teste simples
app.get('/api/test', (req, res) => {
  console.log('✅ Rota /api/test acessada');
  res.json({
    success: true,
    message: 'API funcionando!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Rota de login
app.post('/api/auth/login', (req, res) => {
  console.log('🔐 Login tentativa:', req.body);
  const { email, password } = req.body;
  
  if (email === 'admin@example.com' && password === '123456') {
    res.json({
      success: true,
      message: 'Login bem-sucedido!',
      user: { email, name: 'Admin' },
      token: 'fake-token-123'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Credenciais inválidas'
    });
  }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🚀 Servidor rodando em http://localhost:${PORT}
🔍 Teste: http://localhost:${PORT}/api/test
🔐 Login: http://localhost:${PORT}/api/auth/login
  `);
});

// Tratamento de erros
process.on('uncaughtException', (err) => {
  console.error('❌ Erro não capturado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejeitada:', reason);
});

module.exports = app;
