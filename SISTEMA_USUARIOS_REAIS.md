# Sistema de Gerenciamento de Usuários - Configuração

## 🚀 Como ativar o sistema para mostrar usuários reais

### 1. Configurar o Backend PHP

1. **Iniciar o XAMPP**
   - Abra o XAMPP Control Panel
   - Inicie os serviços **Apache** e **MySQL**

2. **Criar o banco de dados**
   - Abra o phpMyAdmin (http://localhost/phpmyadmin)
   - Execute o arquivo `criar_tabela_usuarios.sql` para criar a estrutura do banco

3. **Colocar os arquivos PHP na pasta correta**
   - Copie os arquivos da pasta `php-files/` para `C:\xampp\htdocs\Projeto-Ufla\`
   - Arquivos necessários:
     - `config.php`
     - `login.php`
     - `register.php` (novo)
     - `usuarios.php` (novo)

### 2. Verificar a configuração

1. **Testar conexão com o banco**
   - Acesse: http://localhost/Projeto-Ufla/usuarios.php
   - Deve retornar um JSON com `success: true` e lista vazia se não houver usuários

2. **Verificar se o servidor Node.js está rodando**
   ```bash
   cd aura-hub
   npm run dev
   ```

### 3. Como funciona agora

1. **Usuários se cadastram** na página `/signup` 
   - Os dados são salvos no banco de dados MySQL
   - Status inicial: "pendente"

2. **Admin visualiza as solicitações** na página `/admin`
   - Lista todos os usuários do banco de dados (não mais dados fictícios)
   - Pode aprovar ou rejeitar cada solicitação

3. **Sistema em tempo real**
   - Todos os dados vêm do banco de dados
   - Nenhum dado fictício é usado
   - Changes são persistidas no MySQL

### 4. Estrutura do banco de dados

A tabela `usuarios` tem os seguintes campos:
- `id` - ID único do usuário
- `nome` - Nome completo
- `endereco` - Endereço
- `email` - Email (único)
- `login` - Login (único)
- `password` - Senha criptografada
- `tipo` - 'admin' ou 'usuario'
- `status` - 'pendente', 'aprovado', 'rejeitado'
- `data_criacao` - Quando se cadastrou
- `data_aprovacao` - Quando foi aprovado/rejeitado

### 5. Resolução de problemas

**❌ "Nenhum usuário encontrado"**
- Verifique se o XAMPP está rodando
- Confirme que os arquivos PHP estão na pasta correta
- Teste se há usuários cadastrados no banco

**❌ "Servidor PHP não está rodando"**
- Inicie o Apache no XAMPP
- Verifique se a porta 80 não está sendo usada por outro programa

**❌ "Erro ao conectar com o servidor"**
- Verifique se o arquivo `usuarios.php` existe
- Confirme as configurações do banco em `config.php`

### 6. Dados de teste

Para criar um usuário admin de teste:
- Email: admin@admin.com
- Senha: password

O arquivo SQL já cria este usuário automaticamente.

## 📧 Próximos passos

- [ ] Implementar envio de email automático ao aprovar/rejeitar
- [ ] Adicionar logs de auditoria
- [ ] Implementar paginação para muitos usuários
- [ ] Adicionar filtros e busca na lista de usuários
