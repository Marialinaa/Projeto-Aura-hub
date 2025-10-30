import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import routes from "./routes";
import { testDatabaseConnection } from "./config/database";
import { verificarConfiguracao } from "./config/email";

// Carregar variáveis de ambiente
dotenv.config();

// Criar aplicação Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de segurança
app.use(helmet());

// Configurar CORS
// Suporta CORS_ORIGIN como lista separada por vírgulas e adiciona localhost em dev
const rawCors = process.env.CORS_ORIGIN || "";
const allowedOrigins = rawCors
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

if (process.env.NODE_ENV !== 'production') {
  // permitir Vite dev server em desenvolvimento
  allowedOrigins.push('http://localhost:5173');
  allowedOrigins.push('http://127.0.0.1:5173');
}

app.use(
  cors({
    origin: (origin, callback) => {
      // requests sem origin (curl, server-side) devem ser permitidos
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // fallback: se CORS_ORIGIN foi vazio, permitir tudo (cautela)
      if (!rawCors) return callback(null, true);
      return callback(new Error('CORS not allowed'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Logging de requisições
app.use(morgan("dev"));

// Parser para JSON (captura rawBody para debug e possível reparo)
app.use(
  express.json({
    verify: (req: any, _res, buf: Buffer) => {
      try {
        req.rawBody = buf.toString();
      } catch (e) {
        req.rawBody = undefined;
      }
    },
  })
);

// Parser para dados de formulário
app.use(express.urlencoded({ extended: true }));

// Middleware resiliente para detectar e reparar JSON duplamente-serializado
app.use((req: any, res, next) => {
  try {
    const ct = (req.headers['content-type'] || '').toString();
    if (ct.includes('application/json')) {
      // Se o body chegou como string, tentar parse
      if (typeof req.body === 'string') {
        try {
          req.body = JSON.parse(req.body);
        } catch (err) {
          // tentar reparar sequências de escape extras (ex: \")
          const raw = req.rawBody || req.body;
          if (typeof raw === 'string') {
            const cleaned = raw.replace(/\\+/g, '\\');
            try {
              req.body = JSON.parse(cleaned);
              console.log('🧹 Repaired double-encoded JSON body (cleaned)');
            } catch (err2) {
              console.warn('⚠️ Failed to parse JSON body after cleaning. rawBody (truncated)=', (raw || '').slice(0, 400));
            }
          }
        }
      }
    }
  } catch (e) {
    console.error('Error in JSON repair middleware:', e);
  }
  next();
});

// Rota de teste
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "API funcionando normalmente",
    timestamp: new Date().toISOString(),
  });
});

// Usar rotas da API
app.use("/api", routes);

// Rota de fallback
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Rota não encontrada",
  });
});

// Iniciar servidor
const startServer = async () => {
  // Retry configurável para conexões ao DB (útil em cloud / provisionamento lento)
  const maxRetries = Number(process.env.DB_CONNECT_RETRIES || 5);
  const retryDelayMs = Number(process.env.DB_CONNECT_RETRY_DELAY_MS || 3000);

  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      attempt++;
      console.log(`🧪 Testando conexão com o banco (tentativa ${attempt}/${maxRetries})`);
      await testDatabaseConnection();
      // Verificar configuração de email
      await verificarConfiguracao();

      // Iniciar servidor Express
      const HOST = "0.0.0.0"; // aceita conexões de qualquer lugar
      const PORT_NUM = Number(PORT) || 3001;

      app.listen(PORT_NUM, HOST, () => {
        console.log("=======================================================");
        console.log(`🚀 Servidor rodando na porta ${PORT_NUM}`);
        console.log(`📝 Localhost:     http://localhost:${PORT_NUM}/api/health`);
        console.log(`📝 Emulador AVD:  http://10.0.2.2:${PORT_NUM}/api/health`);
        console.log(`📝 Rede Local:    http://192.168.x.x:${PORT_NUM}/api/health`);
        console.log("=======================================================");
      });

      // sucesso: sair do loop
      return;
    } catch (error) {
      console.error(`❌ Falha ao conectar (tentativa ${attempt}):`, error && (error as any).message ? (error as any).message : error);
      if (attempt > maxRetries) {
        console.error('🔚 Número máximo de tentativas atingido. Saindo.');
        process.exit(1);
      }
      console.log(`⏳ Aguardando ${retryDelayMs}ms antes da próxima tentativa...`);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, retryDelayMs));
    }
  }
};

startServer();

// Exportar a factory do app para reutilização (ex: node-build.ts)
export const createServer = () => app;
