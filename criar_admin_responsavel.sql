-- Script para criar usuário admin na tabela responsaveis
-- Execute este script no MySQL/phpMyAdmin para criar um admin

USE `projeto-ufla`;

-- Inserir admin na tabela responsaveis
-- A senha é "admin123" (hash gerado com bcrypt, 10 rounds)
INSERT INTO `responsaveis` (`nome`, `funcao`, `email`, `login`, `senha`, `status`) VALUES
('Administrador do Sistema', 'admin', 'admin@sistema.com', 'admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'liberado');

-- Verificar se o admin foi criado
SELECT id, nome, funcao, email, login, status FROM responsaveis WHERE funcao = 'admin';

-- Para testar o login:
-- Email: admin@sistema.com
-- Senha: admin123
