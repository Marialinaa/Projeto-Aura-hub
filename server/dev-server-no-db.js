#!/usr/bin/env node
// Lightweight development server for Android emulator / local dev
// - serves /api/test locally
// - provides a simple /api/auth/login test endpoint (accepts login/senha or email/password)
// - proxies any other /api requests to the configured REMOTE_API (Railway)

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3001;
const REMOTE_API = process.env.REMOTE_API || 'https://back-end-aura-hubb-production.up.railway.app';

// Allow connections from Android emulator (10.0.2.2) and localhost (Vite)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://10.0.2.2:5173',
  'http://10.0.2.2',
];

app.use(cors({ origin: function(origin, callback){
  // allow non-browser clients
  if(!origin) return callback(null, true);
  if(allowedOrigins.includes(origin)) return callback(null, true);
  // fallback allow for convenience in dev
  return callback(null, true);
}}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  console.log('Headers:', req.headers['content-type'] ? { 'content-type': req.headers['content-type'] } : {});
  if (req.body) {
    try { console.log('Body (truncated):', JSON.stringify(req.body).slice(0, 800)); } catch (e) {}
  }
  next();
});

// Simple health/test endpoint
app.get('/api/test', (_req, res) => {
  res.json({ success: true, message: 'Dev server running', port: PORT, remote: REMOTE_API });
});

// Simple login mock: accept { login, senha } or { email, password }
app.post('/api/auth/login', (req, res, next) => {
  const { login, senha, email, password } = req.body || {};
  // test credentials (convenience)
  if ((login === 'teste' && senha === 'teste123') || (email === 'admin@example.com' && password === '123456')) {
    return res.json({ success: true, message: 'Login mock OK', user: { email: email || 'teste' }, token: 'fake-jwt-token-dev' });
  }
  // else proxy to remote
  return next();
});

// Proxy all other /api requests to REMOTE_API
app.use('/api', createProxyMiddleware({
  target: REMOTE_API,
  changeOrigin: true,
  secure: true,
  logLevel: 'info',
  pathRewrite: (path) => path, // keep /api
  onProxyReq: (proxyReq, req, _res) => {
    // ensure JSON body forwarded when necessary
    if (req.body && Object.keys(req.body).length) {
      const contentType = proxyReq.getHeader('Content-Type') || 'application/json';
      proxyReq.setHeader('Content-Type', contentType);
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  }
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Dev server listening on http://0.0.0.0:${PORT} (emulator host: http://10.0.2.2:${PORT})`);
  console.log(`🔁 Proxying unknown /api routes to ${REMOTE_API}`);
});

// graceful shutdown
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
