# Sistema de Usuários com Tabelas Separadas

Este sistema foi modificado para usar tabelas separadas para **Responsáveis** e **Bolsistas**, com campos específicos para cada tipo de usuário.

## 📋 Estrutura das Tabelas

### Tabela `responsaveis`
- **id** (int, auto_increment, primary key)
- **nome** (varchar)
- **funcao** (varchar)
- **email** (varchar, unique)
- **login** (varchar, unique)
- **senha** (varchar, hash)
- **status** (enum: pendente, liberado, bloqueado)
- **data_solicitacao** (timestamp)
- **data_atualizacao** (timestamp)

### Tabela `bolsistas`
- **matricula** (varchar, primary key)
- **nome** (varchar)
- **curso** (varchar)
- **email** (varchar, unique)
- **login** (varchar, unique)
- **senha** (varchar, hash)
- **status** (enum: pendente, liberado, bloqueado)
- **data_solicitacao** (timestamp)
- **data_atualizacao** (timestamp)

## 🚀 Como Configurar

### 1. Criar as Tabelas no Banco
Execute os seguintes scripts SQL no MySQL/phpMyAdmin:

```bash
# Primeiro, crie a tabela de responsáveis
mysql -u root -p projeto-ufla < criar_tabela_responsaveis.sql

# Depois, crie a tabela de bolsistas
mysql -u root -p projeto-ufla < criar_tabela_bolsistas.sql
```

### 2. Configurar os Arquivos PHP
Coloque os seguintes arquivos na pasta do seu servidor Apache:

- `register_separate_tables.php` - Para cadastro de usuários
- `listar_usuarios_separados.php` - Para listar usuários
- `atualizar_status_usuario.php` - Para aprovar/bloquear usuários

**Caminho recomendado**: `C:\xampp\htdocs\Projeto-Ufla\`

### 3. Atualizar URLs no Frontend
No arquivo `client/services/api.ts`, certifique-se de que as URLs apontem para os novos arquivos PHP:

```typescript
const API_BASE_URL = "http://localhost/Projeto-Ufla";

// Endpoints
register: `${API_BASE_URL}/register_separate_tables.php`
listar: `${API_BASE_URL}/listar_usuarios_separados.php`
aprovar: `${API_BASE_URL}/atualizar_status_usuario.php`
```

## 📝 Campos do Formulário

### Para Responsáveis
- Nome Completo
- Função (cargo/responsabilidade)
- E-mail
- Login
- Senha

### Para Bolsistas
- Nome Completo
- Matrícula (chave primária)
- Curso
- E-mail
- Login
- Senha

## 🔄 Fluxo do Sistema

1. **Cadastro**: Usuário seleciona o tipo (responsável/bolsista) e preenche os campos apropriados
2. **Validação**: Sistema valida se matrícula/email/login já existem
3. **Armazenamento**: Dados são salvos na tabela correspondente com status "pendente"
4. **Aprovação**: Admin pode liberar ou bloquear através do painel administrativo
5. **Notificação**: Sistema pode enviar emails automáticos

## 🎯 Funcionalidades do Admin

O painel administrativo foi atualizado para trabalhar com as duas tabelas:

- **Responsáveis**: Lista todos os responsáveis cadastrados
- **Bolsistas**: Lista todos os bolsistas cadastrados  
- **Atribuir**: Permite promover usuários (funcionalidade futura)

## 🔍 Consultas Úteis

```sql
-- Ver todos os responsáveis
SELECT * FROM responsaveis ORDER BY data_solicitacao DESC;

-- Ver todos os bolsistas
SELECT * FROM bolsistas ORDER BY data_solicitacao DESC;

-- Contar usuários por status
SELECT 'responsaveis' as tipo, status, COUNT(*) as total 
FROM responsaveis GROUP BY status
UNION ALL
SELECT 'bolsistas' as tipo, status, COUNT(*) as total 
FROM bolsistas GROUP BY status;
```

## ⚠️ Observações Importantes

1. **Chave Primária**: Responsáveis usam ID auto-incremento, bolsistas usam matrícula
2. **Validação**: Email e login devem ser únicos em ambas as tabelas
3. **Senha**: Sempre salva com hash bcrypt
4. **Status**: Todos iniciam como "pendente" e precisam ser aprovados pelo admin
5. **Compatibilidade**: O sistema mantém compatibilidade com a interface existente

## 🛠️ Próximos Passos

- [ ] Implementar envio de emails automáticos
- [ ] Adicionar logs de auditoria
- [ ] Criar relatórios por curso/função
- [ ] Implementar autenticação JWT
- [ ] Adicionar perfis de usuário
