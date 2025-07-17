-- ========================================
-- 🗄️ SCRIPT DE CONFIGURAÇÃO DO BANCO
-- ========================================

-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS projeto_ufla;
USE projeto_ufla;

-- Verificar se o banco foi criado
SELECT 'Banco projeto_ufla criado com sucesso!' as status;

-- Criar tabela de usuários (se não existir)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomeCompleto VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    login VARCHAR(100) UNIQUE NOT NULL,
    funcao VARCHAR(255),
    endereco TEXT,
    tipoUsuario ENUM('responsavel', 'bolsista') NOT NULL DEFAULT 'bolsista',
    status ENUM('pendente', 'liberado', 'bloqueado') NOT NULL DEFAULT 'pendente',
    dataSolicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataAprovacao TIMESTAMP NULL,
    senha VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir alguns usuários de teste
INSERT IGNORE INTO usuarios (nomeCompleto, email, login, funcao, tipoUsuario, status) VALUES
('Admin Sistema', 'admin@sistema.com', 'admin', 'Administrador', 'responsavel', 'liberado'),
('João Silva', 'joao@email.com', 'joao.silva', 'Bolsista de Pesquisa', 'bolsista', 'liberado'),
('Maria Santos', 'maria@email.com', 'maria.santos', 'Coordenadora', 'responsavel', 'pendente'),
('Pedro Oliveira', 'pedro@email.com', 'pedro.oliveira', 'Bolsista de Extensão', 'bolsista', 'pendente');

-- Verificar se os dados foram inseridos
SELECT 'Dados de teste inseridos!' as status;
SELECT COUNT(*) as total_usuarios FROM usuarios;

-- Mostrar todos os usuários
SELECT 
    id,
    nomeCompleto,
    email,
    tipoUsuario,
    status,
    dataSolicitacao
FROM usuarios
ORDER BY id;

-- Verificar configuração do usuário MySQL
SELECT 
    User,
    Host,
    authentication_string 
FROM mysql.user 
WHERE User = 'root';

SELECT 'Script executado com sucesso! ✅' as resultado;
