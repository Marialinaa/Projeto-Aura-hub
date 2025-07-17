<?php
// Script para testar login do admin
$host = 'localhost';
$username = 'root';
$password = '9728';
$database = 'projeto_ufla';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "🔌 Conectado ao banco de dados com sucesso!\n\n";
    
    // Verificar admin específico
    echo "👤 TESTE DE LOGIN ADMIN:\n";
    echo "==========================\n";
    
    $email = 'admin@sistema.com';
    $senha = 'admin123';
    
    echo "📧 Email: $email\n";
    echo "🔑 Senha: $senha\n\n";
    
    // Buscar admin no banco
    $stmt = $pdo->prepare("SELECT id, nome, funcao, email, senha, status FROM responsaveis WHERE email = ?");
    $stmt->execute([$email]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        echo "✅ Admin encontrado no banco:\n";
        echo "   ID: {$admin['id']}\n";
        echo "   Nome: {$admin['nome']}\n";
        echo "   Função: {$admin['funcao']}\n";
        echo "   Email: {$admin['email']}\n";
        echo "   Status: {$admin['status']}\n";
        echo "   Hash da senha: " . substr($admin['senha'], 0, 20) . "...\n\n";
        
        // Verificar se a senha bate
        if (password_verify($senha, $admin['senha'])) {
            echo "✅ Senha correta!\n";
            echo "🎉 Login deve funcionar normalmente.\n";
        } else {
            echo "❌ Senha incorreta!\n";
            echo "🔧 Vou gerar um novo hash para a senha...\n";
            
            // Gerar novo hash
            $novoHash = password_hash($senha, PASSWORD_DEFAULT);
            
            // Atualizar no banco
            $stmt = $pdo->prepare("UPDATE responsaveis SET senha = ? WHERE email = ?");
            $stmt->execute([$novoHash, $email]);
            
            echo "✅ Hash da senha atualizado com sucesso!\n";
            echo "🎉 Agora o login deve funcionar.\n";
        }
    } else {
        echo "❌ Admin não encontrado no banco!\n";
        echo "🔧 Vou criar o admin...\n";
        
        $senhaHash = password_hash($senha, PASSWORD_DEFAULT);
        
        $stmt = $pdo->prepare("
            INSERT INTO responsaveis (nome, funcao, email, login, senha, status) 
            VALUES (?, ?, ?, ?, ?, 'liberado')
        ");
        $stmt->execute([
            'Administrador do Sistema',
            'admin',
            $email,
            'admin',
            $senhaHash
        ]);
        
        echo "✅ Admin criado com sucesso!\n";
        echo "🎉 Login deve funcionar agora.\n";
    }
    
    // Testar também se não há conflitos na tabela usuarios (caso ainda exista)
    echo "\n🔍 VERIFICANDO CONFLITOS:\n";
    echo "==========================\n";
    
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        $countUsuarios = $stmt->fetchColumn();
        
        if ($countUsuarios > 0) {
            echo "⚠️  Encontrado admin na tabela 'usuarios' também!\n";
            echo "💡 Isso pode causar conflitos. Vou remover...\n";
            
            $stmt = $pdo->prepare("DELETE FROM usuarios WHERE email = ?");
            $stmt->execute([$email]);
            
            echo "✅ Admin removido da tabela 'usuarios'.\n";
        } else {
            echo "✅ Nenhum conflito encontrado.\n";
        }
    } catch (Exception $e) {
        echo "ℹ️  Tabela 'usuarios' não existe (normal).\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Erro: " . $e->getMessage() . "\n";
}
?>
