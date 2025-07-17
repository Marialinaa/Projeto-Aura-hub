<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responder a requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Permitir apenas POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido']);
    exit();
}

// Configuração do banco de dados
$servername = "localhost";
$username = "root";
$password = "9728";
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

    // Validações comuns
    $requiredFields = ['nome', 'email', 'login', 'senha', 'tipoUsuario'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            throw new Exception("Campo $field é obrigatório");
        }
    }

    // Hash da senha
    $senhaHash = password_hash($data['senha'], PASSWORD_BCRYPT);

    if ($data['tipoUsuario'] === 'responsavel') {
        // Validações específicas para responsável
        if (empty($data['funcao'])) {
            throw new Exception('Campo função é obrigatório para responsáveis');
        }

        // Verificar se email ou login já existem
        $stmt = $pdo->prepare("SELECT id FROM responsaveis WHERE email = ? OR login = ?");
        $stmt->execute([$data['email'], $data['login']]);
        if ($stmt->fetch()) {
            throw new Exception('Email ou login já cadastrados');
        }

        // Inserir responsável
        $stmt = $pdo->prepare("
            INSERT INTO responsaveis (nome, funcao, email, login, senha, status) 
            VALUES (?, ?, ?, ?, ?, 'pendente')
        ");
        $stmt->execute([
            $data['nome'],
            $data['funcao'],
            $data['email'],
            $data['login'],
            $senhaHash
        ]);

        $response = [
            'status' => 'Solicitação de responsável enviada com sucesso!',
            'tipo' => 'responsavel',
            'id' => $pdo->lastInsertId()
        ];

    } elseif ($data['tipoUsuario'] === 'bolsista') {
        // Validações específicas para bolsista
        if (empty($data['matricula']) || empty($data['curso'])) {
            throw new Exception('Campos matrícula e curso são obrigatórios para bolsistas');
        }

        // Verificar se matrícula, email ou login já existem
        $stmt = $pdo->prepare("SELECT matricula FROM bolsistas WHERE matricula = ? OR email = ? OR login = ?");
        $stmt->execute([$data['matricula'], $data['email'], $data['login']]);
        if ($stmt->fetch()) {
            throw new Exception('Matrícula, email ou login já cadastrados');
        }

        // Inserir bolsista
        $stmt = $pdo->prepare("
            INSERT INTO bolsistas (matricula, nome, curso, email, login, senha, status) 
            VALUES (?, ?, ?, ?, ?, ?, 'pendente')
        ");
        $stmt->execute([
            $data['matricula'],
            $data['nome'],
            $data['curso'],
            $data['email'],
            $data['login'],
            $senhaHash
        ]);

        $response = [
            'status' => 'Solicitação de bolsista enviada com sucesso!',
            'tipo' => 'bolsista',
            'matricula' => $data['matricula']
        ];

    } else {
        throw new Exception('Tipo de usuário inválido');
    }

    // TODO: Enviar email para o administrador
    if (isset($data['enviarEmailAdmin']) && $data['enviarEmailAdmin']) {
        // Aqui você pode implementar o envio de email
        $response['aviso'] = 'Email de notificação será enviado ao administrador';
    }

    http_response_code(201);
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
