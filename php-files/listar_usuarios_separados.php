<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responder a requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Permitir apenas GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido']);
    exit();
}

// Configuração do banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "projeto-ufla";

try {
    // Conexão com o banco
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verificar qual tipo de usuário listar
    $tipo = $_GET['tipo'] ?? 'todos'; // responsavel, bolsista, ou todos

    $usuarios = [];

    if ($tipo === 'responsavel' || $tipo === 'todos') {
        // Buscar responsáveis
        $stmt = $pdo->prepare("
            SELECT id, nome, funcao, email, login, status, 
                   data_solicitacao as dataSolicitacao,
                   'responsavel' as tipoUsuario
            FROM responsaveis 
            ORDER BY data_solicitacao DESC
        ");
        $stmt->execute();
        $responsaveis = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($responsaveis as $resp) {
            $resp['dataSolicitacao'] = date('d/m/Y H:i', strtotime($resp['dataSolicitacao']));
            $usuarios[] = $resp;
        }
    }

    if ($tipo === 'bolsista' || $tipo === 'todos') {
        // Buscar bolsistas
        $stmt = $pdo->prepare("
            SELECT matricula as id, nome, curso, email, login, status, 
                   data_solicitacao as dataSolicitacao,
                   'bolsista' as tipoUsuario,
                   matricula
            FROM bolsistas 
            ORDER BY data_solicitacao DESC
        ");
        $stmt->execute();
        $bolsistas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($bolsistas as $bolsista) {
            $bolsista['dataSolicitacao'] = date('d/m/Y H:i', strtotime($bolsista['dataSolicitacao']));
            $usuarios[] = $bolsista;
        }
    }

    // Ordenar todos os usuários por data de solicitação
    usort($usuarios, function($a, $b) {
        return strtotime($b['dataSolicitacao']) - strtotime($a['dataSolicitacao']);
    });

    $response = [
        'success' => true,
        'data' => $usuarios,
        'total' => count($usuarios),
        'responsaveis' => count(array_filter($usuarios, function($u) { return $u['tipoUsuario'] === 'responsavel'; })),
        'bolsistas' => count(array_filter($usuarios, function($u) { return $u['tipoUsuario'] === 'bolsista'; }))
    ];

    http_response_code(200);
    echo json_encode($response);

} catch (PDOException $e) {
    error_log("Erro no banco de dados: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'erro' => 'Erro interno do servidor: ' . $e->getMessage()
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'erro' => $e->getMessage()
    ]);
}
?>
