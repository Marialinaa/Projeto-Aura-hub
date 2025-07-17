<?php
// Script para verificar dados do sistema e diagnóstico de atribuições
include 'php-files/config.php';

// Configurações do banco (copiadas do servidor Node.js)
$host = 'localhost';
$username = 'root';
$password = '9728';
$database = 'projeto_ufla';

try {
    // Conectar ao banco
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "🔌 Conectado ao banco de dados com sucesso!\n\n";
    
    // Verificar responsáveis
    echo "👥 RESPONSÁVEIS:\n";
    echo "==================\n";
    $stmt = $pdo->prepare("SELECT id, nome, funcao, email, status FROM responsaveis ORDER BY status, nome");
    $stmt->execute();
    $responsaveis = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($responsaveis) === 0) {
        echo "❌ Nenhum responsável encontrado!\n";
    } else {
        foreach ($responsaveis as $resp) {
            $statusIcon = $resp['status'] === 'liberado' ? '✅' : ($resp['status'] === 'pendente' ? '⏳' : '❌');
            echo "{$statusIcon} ID: {$resp['id']} | {$resp['nome']} | {$resp['funcao']} | Status: {$resp['status']}\n";
        }
    }
    
    echo "\n🎓 BOLSISTAS:\n";
    echo "================\n";
    $stmt = $pdo->prepare("SELECT matricula, nome, curso, email, status FROM bolsistas ORDER BY status, nome");
    $stmt->execute();
    $bolsistas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($bolsistas) === 0) {
        echo "❌ Nenhum bolsista encontrado!\n";
    } else {
        foreach ($bolsistas as $bolsista) {
            $statusIcon = $bolsista['status'] === 'liberado' ? '✅' : ($bolsista['status'] === 'pendente' ? '⏳' : '❌');
            echo "{$statusIcon} Matrícula: {$bolsista['matricula']} | {$bolsista['nome']} | {$bolsista['curso']} | Status: {$bolsista['status']}\n";
        }
    }
    
    // Contar usuários liberados
    echo "\n📊 RESUMO:\n";
    echo "=============\n";
    
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM responsaveis WHERE status = 'liberado'");
    $stmt->execute();
    $responsaveisLiberados = $stmt->fetchColumn();
    
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM bolsistas WHERE status = 'liberado'");
    $stmt->execute();
    $bolsistasLiberados = $stmt->fetchColumn();
    
    echo "✅ Responsáveis liberados: $responsaveisLiberados\n";
    echo "✅ Bolsistas liberados: $bolsistasLiberados\n";
    
    if ($responsaveisLiberados === 0) {
        echo "\n⚠️  PROBLEMA: Não há responsáveis liberados para atribuição!\n";
        echo "💡 Solução: Aprove pelo menos um responsável no painel admin.\n";
    }
    
    if ($bolsistasLiberados === 0) {
        echo "\n⚠️  PROBLEMA: Não há bolsistas liberados para atribuição!\n";
        echo "💡 Solução: Aprove pelo menos um bolsista no painel admin.\n";
    }
    
    if ($responsaveisLiberados > 0 && $bolsistasLiberados > 0) {
        echo "\n✅ Sistema pronto para atribuições!\n";
    }
    
    // Verificar se existe tabela de atribuições
    echo "\n🔗 ATRIBUIÇÕES:\n";
    echo "==================\n";
    
    try {
        $stmt = $pdo->prepare("SHOW TABLES LIKE 'atribuicoes'");
        $stmt->execute();
        $tabelaAtribuicoes = $stmt->fetch();
        
        if ($tabelaAtribuicoes) {
            echo "✅ Tabela de atribuições existe\n";
            
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM atribuicoes");
            $stmt->execute();
            $totalAtribuicoes = $stmt->fetchColumn();
            echo "📊 Total de atribuições: $totalAtribuicoes\n";
        } else {
            echo "❌ Tabela de atribuições NÃO existe\n";
            echo "💡 As atribuições estão sendo armazenadas apenas no frontend (temporário)\n";
        }
    } catch (Exception $e) {
        echo "❌ Erro ao verificar tabela de atribuições: " . $e->getMessage() . "\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Erro: " . $e->getMessage() . "\n";
}
?>
