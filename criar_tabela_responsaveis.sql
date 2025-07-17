-- Script para criar tabela de responsáveis
-- Execute este script no MySQL/phpMyAdmin para criar a tabela responsaveis

CREATE DATABASE IF NOT EXISTS `projeto-ufla` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `projeto-ufla`;

-- Tabela para Responsáveis
CREATE TABLE IF NOT EXISTS `responsaveis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `funcao` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `login` varchar(100) NOT NULL UNIQUE,
  `senha` varchar(255) NOT NULL,
  `status` enum('pendente','liberado','bloqueado') DEFAULT 'pendente',
  `data_solicitacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_login` (`login`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir dados de exemplo (opcional)
INSERT INTO `responsaveis` (`nome`, `funcao`, `email`, `login`, `senha`, `status`) VALUES
('Dr. João Silva', 'Coordenador do Laboratório', 'joao.silva@ufla.br', 'joao.silva', '$2y$10$example_hash_here', 'liberado'),
('Profa. Maria Santos', 'Responsável pelo Projeto X', 'maria.santos@ufla.br', 'maria.santos', '$2y$10$example_hash_here', 'pendente');

-- Verificar se a tabela foi criada
DESCRIBE `responsaveis`;
