# Sistema de Notificações por Email

## ✅ Funcionalidade Implementada

### 📧 Email para Administrador (Solicitação de Acesso)

Quando um usuário solicita acesso através do formulário de registro:

1. **Frontend envia dados** incluindo flag `enviarEmailAdmin: true`
2. **Backend deve processar** no arquivo `register.php`:
   - Salvar dados do usuário no banco
   - Enviar email para o administrador informando nova solicitação
3. **Dados enviados ao backend**:
   ```json
   {
     "nome": "Nome do Usuario",
     "endereco": "Endereço do usuário",
     "email": "email@usuario.com",
     "login": "username",
     "senha": "password_hash",
     "enviarEmailAdmin": true
   }
   ```

### 📧 Email para Usuário (Aprovação/Rejeição)

Quando o administrador aprova ou bloqueia um usuário:

1. **Frontend chama API** `aprovar` ou `rejeitar`
2. **Backend deve processar** no arquivo `usuarios.php`:
   - Atualizar status do usuário no banco
   - Enviar email para o usuário informando decisão
3. **Ações disponíveis**:
   - `acao: "aprovar"` → Status "liberado" + email de aprovação
   - `acao: "rejeitar"` → Status "bloqueado" + email de rejeição

## 🔧 Configuração Necessária no Backend

### Arquivo: `register.php`

```php
<?php
// Receber dados JSON
$input = json_decode(file_get_contents('php://input'), true);

if ($input['enviarEmailAdmin']) {
    // Enviar email para administrador
    $adminEmail = "admin@sistema.com";
    $assunto = "Nova Solicitação de Acesso";
    $mensagem = "Usuário {$input['nome']} ({$input['email']}) solicitou acesso ao sistema.";

    mail($adminEmail, $assunto, $mensagem);
}

// Resposta JSON
echo json_encode([
    'success' => true,
    'message' => 'Solicitação enviada! Administrador notificado por email.'
]);
?>
```

### Arquivo: `usuarios.php`

```php
<?php
// Para aprovação/rejeição
$input = json_decode(file_get_contents('php://input'), true);

if ($input['acao'] === 'aprovar') {
    // Atualizar banco e enviar email
    $user = getUserById($input['id']);
    $assunto = "Acesso Liberado";
    $mensagem = "Olá {$user['nome']}, seu acesso foi aprovado!";

    mail($user['email'], $assunto, $mensagem);
}
?>
```

## 🚀 URLs dos Endpoints

- **Registro**: `POST http://localhost/Projeto-Ufla/register.php`
- **Usuários**: `GET/PUT http://localhost/Projeto-Ufla/usuarios.php`
- **Login**: `POST http://localhost/Projeto-Ufla/login.php`

## ⚡ Status de Implementação

✅ **Frontend Completo**:

- Formulário de registro com flag de email
- Admin panel com aprovação/rejeição
- Integração com API usando Axios
- Tratamento de erros e feedback visual
- Tipos TypeScript para API

⏳ **Backend Necessário**:

- Implementar `register.php` com envio de email
- Implementar `usuarios.php` com CRUD e emails
- Configurar servidor de email (SMTP)
- Configurar banco de dados MySQL

## 📋 Fluxo Completo

1. **Usuário** → Preenche formulário → "Solicitar Acesso"
2. **Sistema** → Salva no banco → Email para admin
3. **Admin** → Recebe email → Acessa painel
4. **Admin** → Aprova/Rejeita → Email para usuário
5. **Usuário** → Recebe decisão por email

## 🛠️ Dependências Instaladas

- `axios ^1.6.2` - Cliente HTTP
- Tipos TypeScript para APIs
- Tratamento de erros de rede/CORS
- Interceptors para autenticação
