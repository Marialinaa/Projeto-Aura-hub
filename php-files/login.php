<?php
// login.php
require_once 'config.php';

// Função auxiliar para enviar erro e parar execução
function sendError($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $msg]);
    exit;
}

// Ler JSON do POST
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (!$input) {
    sendError("JSON inválido ou não enviado");
}

if (empty($input['email']) || empty($input['password'])) {
    sendError("Email e senha são obrigatórios");
}

$email = $input['email'];
$password = $input['password'];

try {
    $pdo = conectarBanco();

    // Buscar usuário pelo email
    $stmt = $pdo->prepare("SELECT id, nome, login, email, password, tipo, status FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        sendError("Usuário não encontrado. Verifique seu email.");
    }

    // Verificar se o usuário está aprovado (para admins, sempre permitir)
    if ($user['tipo'] !== 'admin' && $user['status'] !== 'aprovado') {
        $statusMsg = [
            'pendente' => 'Sua conta ainda está pendente de aprovação pelo administrador.',
            'rejeitado' => 'Sua conta foi rejeitada pelo administrador.'
        ];
        sendError($statusMsg[$user['status']] ?? 'Status da conta inválido');
    }

    // Verificar senha
    if (!password_verify($password, $user['password'])) {
        sendError("Senha incorreta");
    }

    // Atualizar último login
    $stmt = $pdo->prepare("UPDATE usuarios SET ultimo_login = CURRENT_TIMESTAMP WHERE id = ?");
    $stmt->execute([$user['id']]);

    // Preparar dados para enviar (sem a senha)
    unset($user['password']);

    // Gerar token simples (em produção use JWT)
    $token = base64_encode(json_encode([
        'user_id' => $user['id'],
        'email' => $user['email'],
        'tipo' => $user['tipo'],
        'timestamp' => time()
    ]));

    echo json_encode([
        'success' => true,
        'message' => 'Login efetuado com sucesso',
        'user' => $user,
        'token' => $token
    ]);

} catch (PDOException $e) {
    error_log("Erro no login: " . $e->getMessage());
    sendError("Erro no servidor: " . $e->getMessage(), 500);
}
?>
