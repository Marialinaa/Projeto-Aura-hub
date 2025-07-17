-- Script para criar tabela de atribuições
-- Execute este script no MySQL/phpMyAdmin para criar a tabela atribuicoes

USE `projeto_ufla`;

-- Tabela para Atribuições (Responsável -> Bolsista)
CREATE TABLE IF NOT EXISTS `atribuicoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `responsavel_id` int(11) NOT NULL,
  `bolsista_matricula` varchar(20) NOT NULL,
  `data_atribuicao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('ativa','inativa') DEFAULT 'ativa',
  `observacoes` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `responsavel_bolsista_unique` (`responsavel_id`, `bolsista_matricula`),
  INDEX `idx_responsavel` (`responsavel_id`),
  INDEX `idx_bolsista` (`bolsista_matricula`),
  INDEX `idx_status` (`status`),
  FOREIGN KEY (`responsavel_id`) REFERENCES `responsaveis`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`bolsista_matricula`) REFERENCES `bolsistas`(`matricula`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir alguns dados de exemplo (opcional)
INSERT INTO `atribuicoes` (`responsavel_id`, `bolsista_matricula`, `observacoes`) VALUES
(3, '22202587', 'Primeira atribuição de teste');

-- Verificar se a tabela foi criada
DESCRIBE `atribuicoes`;

-- Listar atribuições
SELECT 
  a.id,
  r.nome as responsavel_nome,
  b.nome as bolsista_nome,
  a.data_atribuicao,
  a.status
FROM atribuicoes a
JOIN responsaveis r ON a.responsavel_id = r.id
JOIN bolsistas b ON a.bolsista_matricula = b.matricula
ORDER BY a.data_atribuicao DESC;
