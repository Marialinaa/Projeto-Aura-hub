-- Script para criar tabela de bolsistas
-- Execute este script no MySQL/phpMyAdmin para criar a tabela bolsistas

USE `projeto-ufla`;

-- Tabela para Bolsistas
CREATE TABLE IF NOT EXISTS `bolsistas` (
  `matricula` varchar(20) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `curso` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `login` varchar(100) NOT NULL UNIQUE,
  `senha` varchar(255) NOT NULL,
  `status` enum('pendente','liberado','bloqueado') DEFAULT 'pendente',
  `data_solicitacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`matricula`),
  INDEX `idx_email` (`email`),
  INDEX `idx_login` (`login`),
  INDEX `idx_status` (`status`),
  INDEX `idx_nome` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir dados de exemplo (opcional)
INSERT INTO `bolsistas` (`matricula`, `nome`, `curso`, `email`, `login`, `senha`, `status`) VALUES
('202012345', 'Ana Costa', 'Ciência da Computação', 'ana.costa@estudante.ufla.br', 'ana.costa', '$2y$10$example_hash_here', 'liberado'),
('202067890', 'Pedro Oliveira', 'Engenharia de Software', 'pedro.oliveira@estudante.ufla.br', 'pedro.oliveira', '$2y$10$example_hash_here', 'pendente'),
('202098765', 'Carla Ferreira', 'Sistemas de Informação', 'carla.ferreira@estudante.ufla.br', 'carla.ferreira', '$2y$10$example_hash_here', 'pendente');

-- Verificar se a tabela foi criada
DESCRIBE `bolsistas`;
