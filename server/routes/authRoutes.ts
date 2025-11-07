import express from 'express';
import { handleLogin, handleRegister } from './auth';

const router = express.Router();

// Rota de registro de usuário (vai para solicitacoes)
router.post('/register', handleRegister);

// Rota de login (apenas usuários aprovados)
router.post('/login', handleLogin);

export default router;
