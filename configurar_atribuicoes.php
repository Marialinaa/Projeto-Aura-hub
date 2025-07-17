<?php
// Script para criar tabela de atribuições e configurar sistema
$host = 'localhost';
$username = 'root';
$password = '9728';
$database = 'projeto_ufla';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "🔌 Conectado ao banco de dados com sucesso!\n\n";
    
    // Criar tabela de atribuições
    echo "🏗️  Criando tabela de atribuições...\n";
    
    $sql = "
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
      INDEX `idx_status` (`status`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    $pdo->exec($sql);
    echo "✅ Tabela 'atribuicoes' criada com sucesso!\n\n";
    
    // Verificar se há usuários para atribuir
    $stmt = $pdo->prepare("SELECT id, nome FROM responsaveis WHERE status = 'liberado' AND funcao != 'admin' LIMIT 1");
    $stmt->execute();
    $responsavel = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $stmt = $pdo->prepare("SELECT matricula, nome FROM bolsistas WHERE status = 'liberado' LIMIT 1");
    $stmt->execute();
    $bolsista = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($responsavel && $bolsista) {
        echo "🔗 Criando atribuição de exemplo...\n";
        
        // Verificar se já existe
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM atribuicoes WHERE responsavel_id = ? AND bolsista_matricula = ?");
        $stmt->execute([$responsavel['id'], $bolsista['matricula']]);
        $existe = $stmt->fetchColumn();
        
        if ($existe == 0) {
            $stmt = $pdo->prepare("
                INSERT INTO atribuicoes (responsavel_id, bolsista_matricula, observacoes) 
                VALUES (?, ?, ?)
            ");
            $stmt->execute([
                $responsavel['id'], 
                $bolsista['matricula'], 
                'Atribuição de exemplo criada automaticamente'
            ]);
            
            echo "✅ Atribuição criada: {$responsavel['nome']} -> {$bolsista['nome']}\n";
        } else {
            echo "ℹ️  Atribuição já existe entre estes usuários\n";
        }
    }
    
    // Mostrar todas as atribuições
    echo "\n📋 ATRIBUIÇÕES ATUAIS:\n";
    echo "========================\n";
    
    $stmt = $pdo->prepare("
        SELECT 
          a.id,
          r.nome as responsavel_nome,
          b.nome as bolsista_nome,
          DATE_FORMAT(a.data_atribuicao, '%d/%m/%Y %H:%i') as data_formatada,
          a.status
        FROM atribuicoes a
        JOIN responsaveis r ON a.responsavel_id = r.id
        JOIN bolsistas b ON a.bolsista_matricula = b.matricula
        ORDER BY a.data_atribuicao DESC
    ");
    $stmt->execute();
    $atribuicoes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($atribuicoes) === 0) {
        echo "❌ Nenhuma atribuição encontrada\n";
    } else {
        foreach ($atribuicoes as $atr) {
            $statusIcon = $atr['status'] === 'ativa' ? '✅' : '❌';
            echo "{$statusIcon} {$atr['responsavel_nome']} -> {$atr['bolsista_nome']} ({$atr['data_formatada']})\n";
        }
    }
    
    echo "\n🚀 Sistema de atribuições configurado e pronto para uso!\n";
    echo "💡 Agora você pode fazer atribuições no painel admin.\n";
    
} catch (PDOException $e) {
    echo "❌ Erro: " . $e->getMessage() . "\n";
}
?>
