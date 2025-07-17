<?php
// Script para criar usuário admin na tabela responsaveis

// Configurações do banco (copiadas do servidor Node.js)
$host = 'localhost';
$username = 'root';
$password = '9728';
$database = 'projeto_ufla';

try {
    // Conectar ao banco
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "🔌 Conectado ao banco de dados com sucesso!\n";
    
    // Verificar se já existe um admin
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM responsaveis WHERE funcao = 'admin'");
    $stmt->execute();
    $adminCount = $stmt->fetchColumn();
    
    if ($adminCount > 0) {
        echo "⚠️  Admin já existe na tabela responsaveis!\n";
        
        // Mostrar admins existentes
        $stmt = $pdo->prepare("SELECT id, nome, funcao, email, login, status FROM responsaveis WHERE funcao = 'admin'");
        $stmt->execute();
        $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "👥 Admins encontrados:\n";
        foreach ($admins as $admin) {
            echo "   ID: {$admin['id']}, Nome: {$admin['nome']}, Email: {$admin['email']}, Status: {$admin['status']}\n";
        }
    } else {
        // Criar hash da senha "admin123"
        $senhaHash = password_hash('admin123', PASSWORD_DEFAULT);
        
        // Inserir admin
        $stmt = $pdo->prepare("
            INSERT INTO responsaveis (nome, funcao, email, login, senha, status, data_solicitacao) 
            VALUES (?, ?, ?, ?, ?, 'liberado', CURRENT_TIMESTAMP)
        ");
        
        $stmt->execute([
            'Administrador do Sistema',
            'admin',
            'admin@sistema.com',
            'admin',
            $senhaHash
        ]);
        
        echo "✅ Admin criado com sucesso!\n";
        echo "📧 Email: admin@sistema.com\n";
        echo "🔑 Senha: admin123\n";
        
        // Verificar se foi criado
        $stmt = $pdo->prepare("SELECT id, nome, funcao, email, login, status FROM responsaveis WHERE funcao = 'admin'");
        $stmt->execute();
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($admin) {
            echo "👤 Admin criado com ID: {$admin['id']}\n";
        }
    }
    
} catch (PDOException $e) {
    echo "❌ Erro: " . $e->getMessage() . "\n";
}
?>
