import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleListUsers,
  handleUpdateUserStatus,
  handleGetUser,
} from "./routes/users";
import { handleLogin, handleRegister } from "./routes/auth";
import { 
  handleCreateXpto, 
  handleListXpto, 
  handleGetFoto, 
  handleDeleteXpto,
  uploadFoto 
} from "./routes/xpto";
import {
  handleListAtribuicoes,
  handleCreateAtribuicao,
  handleUpdateAtribuicao,
  handleDeleteAtribuicao
} from "./routes/atribuicoes";
import { inicializarEmail } from "./email";

export function createServer() {
  const app = express();

  // Inicializar serviço de email
  inicializarEmail();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/login", handleLogin);
  app.post("/api/register", handleRegister);

  // User management routes
  app.get("/api/users", handleListUsers);
  app.put("/api/users", handleUpdateUserStatus);
  app.get("/api/users/:id", handleGetUser);

  // Atribuições routes
  app.get("/api/atribuicoes", handleListAtribuicoes);
  app.post("/api/atribuicoes", handleCreateAtribuicao);
  app.put("/api/atribuicoes/:id", handleUpdateAtribuicao);
  app.delete("/api/atribuicoes/:id", handleDeleteAtribuicao);

  // XPTO routes
  app.post("/api/xpto", uploadFoto, handleCreateXpto);
  app.get("/api/xpto", handleListXpto);
  app.get("/api/xpto/:id/foto", handleGetFoto);
  app.delete("/api/xpto/:id", handleDeleteXpto);

  return app;
}
