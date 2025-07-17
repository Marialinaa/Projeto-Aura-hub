<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responder a requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Permitir apenas PUT
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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

    // Ler dados JSON da requisição
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data) {
        throw new Exception('Dados JSON inválidos');
    }

    // Validações
    if (empty($data['id']) || empty($data['tipoUsuario']) || empty($data['status'])) {
        throw new Exception('ID, tipo de usuário e status são obrigatórios');
    }

    $id = $data['id'];
    $tipoUsuario = $data['tipoUsuario'];
    $novoStatus = $data['status']; // 'liberado' ou 'bloqueado'

    if (!in_array($novoStatus, ['liberado', 'bloqueado'])) {
        throw new Exception('Status inválido');
    }

    if ($tipoUsuario === 'responsavel') {
        // Atualizar status do responsável
        $stmt = $pdo->prepare("UPDATE responsaveis SET status = ? WHERE id = ?");
        $stmt->execute([$novoStatus, $id]);
        
        if ($stmt->rowCount() === 0) {
            throw new Exception('Responsável não encontrado');
        }

        // Buscar dados do responsável para email
        $stmt = $pdo->prepare("SELECT nome, email FROM responsaveis WHERE id = ?");
        $stmt->execute([$id]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    } elseif ($tipoUsuario === 'bolsista') {
        // Atualizar status do bolsista
        $stmt = $pdo->prepare("UPDATE bolsistas SET status = ? WHERE matricula = ?");
        $stmt->execute([$novoStatus, $id]);
        
        if ($stmt->rowCount() === 0) {
            throw new Exception('Bolsista não encontrado');
        }

        // Buscar dados do bolsista para email
        $stmt = $pdo->prepare("SELECT nome, email FROM bolsistas WHERE matricula = ?");
        $stmt->execute([$id]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    } else {
        throw new Exception('Tipo de usuário inválido');
    }

    // TODO: Enviar email para o usuário
    $acao = $novoStatus === 'liberado' ? 'liberado' : 'bloqueado';
    
    $response = [
        'success' => true,
        'message' => "Usuário {$usuario['nome']} foi {$acao} com sucesso!",
        'usuario' => $usuario,
        'novoStatus' => $novoStatus,
        'tipoUsuario' => $tipoUsuario
    ];

    http_response_code(200);
    echo json_encode($response);

} catch (PDOException $e) {
    error_log("Erro no banco de dados: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['erro' => 'Erro interno do servidor: ' . $e->getMessage()]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['erro' => $e->getMessage()]);
}
?>
