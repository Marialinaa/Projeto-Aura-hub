# 🔒 SECURITY.md - Política de Segurança

## 🚨 Arquivos Sensíveis Removidos

Este repositório foi limpo para **segurança pública**. Os seguintes arquivos contêm informações sensíveis e **NÃO** estão inclusos no Git:

### 🗄️ Configurações de Banco de Dados
- `server/database.ts` - Credenciais do banco MySQL
- `php-files/config.php` - Configurações PHP com senhas

### 🔑 Scripts com Credenciais
- `start-server.ps1` - Contém senhas de banco
- `update-password.js` - Script de atualização de senhas
- `generate-hash.js` - Utilitário de hash

### 📧 Arquivos de Teste
- `public/test-login.html` - Formulário de teste com credenciais
- `public/teste-login-node.html` - Teste Node.js com dados sensíveis

### 🛠️ Scripts de Sistema
- `configurar-sistema.ps1` - Script de configuração automática
- `instalar-php.bat` - Instalação com paths específicos
- `keep-server-running.ps1` - Script de monitoramento

### 📊 Banco de Dados
- `criar_admin.sql` - Criação de usuários admin com senhas
- `criar_tabela_usuarios.sql` - Estrutura com dados de exemplo
- `criar_tabela_xpto.sql` - Tabelas auxiliares

## ✅ Como Usar Este Projeto

### 1. 📁 Use os Templates
Na pasta `private/` você encontrará:
- `config.example.php` - Template para configuração PHP
- `database.example.ts` - Template para configuração Node.js
- `credentials.md` - Lista de credenciais padrão (DEV ONLY)
- `setup-dev.ps1` - Script de configuração automatizada

### 2. 🔧 Configuração Automática
Execute o script de configuração:
```powershell
.\private\setup-dev.ps1
```

### 3. ⚙️ Configuração Manual
1. Copie os arquivos `.example` 
2. Remova `.example` do nome
3. Configure suas credenciais
4. Execute o projeto

## 🛡️ Boas Práticas de Segurança

### ❌ NUNCA faça:
- Commitar senhas ou tokens no Git
- Usar credenciais de produção em desenvolvimento
- Compartilhar arquivos de configuração
- Deixar senhas padrão em produção

### ✅ SEMPRE faça:
- Use senhas fortes e únicas
- Configure 2FA quando possível
- Use variáveis de ambiente em produção
- Mantenha dependências atualizadas
- Configure SSL/HTTPS em produção

## 🔐 Credenciais Padrão (DESENVOLVIMENTO)

⚠️ **ESTAS SÃO APENAS PARA DESENVOLVIMENTO LOCAL!**

### Banco de Dados
- **Usuário**: root
- **Senha**: [configure no setup]
- **Host**: localhost
- **Database**: projeto_ufla

### Admin do Sistema
- **Email**: admin@sistema.com
- **Senha**: 123456

### Email SMTP
- **Host**: smtp.gmail.com
- **Porta**: 587
- **Usuário**: [configure no setup]
- **Senha**: [senha de app do Gmail]

## 🏭 Configuração de Produção

### 🔒 Segurança Obrigatória
1. **Altere TODAS as senhas padrão**
2. **Use usuário de banco específico** (não root)
3. **Configure SSL** para conexões seguras
4. **Use HTTPS** no frontend
5. **Configure firewall** adequadamente
6. **Monitore logs** de acesso e erro

### 🌐 Variáveis de Ambiente
```bash
# Exemplo de .env para produção
DB_HOST=seu-servidor-db.com
DB_USER=app_user
DB_PASS=senha_super_segura_123!@#
DB_NAME=aurahub_prod

SMTP_HOST=smtp.empresa.com
SMTP_USER=noreply@empresa.com
SMTP_PASS=senha_app_email

JWT_SECRET=chave_jwt_super_aleatoria
ENCRYPT_KEY=chave_criptografia_256_bits
```

## 🚨 Reportar Vulnerabilidades

Se você encontrar vulnerabilidades de segurança:

1. **NÃO** abra uma issue pública
2. **Envie email** para: security@aurahub.com
3. **Descreva** a vulnerabilidade detalhadamente
4. **Aguarde** nossa resposta (máximo 48h)
5. **Mantenha sigilo** até correção

## 📋 Checklist de Segurança

### Antes de fazer deploy:
- [ ] Senhas padrão alteradas
- [ ] SSL/HTTPS configurado
- [ ] Usuário de banco específico criado
- [ ] Variáveis de ambiente configuradas
- [ ] Logs de segurança ativados
- [ ] Backup automatizado configurado
- [ ] Firewall configurado
- [ ] Rate limiting ativado
- [ ] Headers de segurança configurados
- [ ] CORS configurado adequadamente

### Manutenção regular:
- [ ] Atualizações de segurança aplicadas
- [ ] Logs de acesso revisados
- [ ] Backups testados
- [ ] Certificados SSL renovados
- [ ] Senhas rotacionadas (90 dias)
- [ ] Auditoria de usuários ativos

## 📞 Contato

- **Security Team**: security@aurahub.com
- **Suporte Técnico**: suporte@aurahub.com
- **Documentação**: https://github.com/usuario/aura-hub/wiki

---

🔒 **A segurança é responsabilidade de todos. Use com consciência!**
