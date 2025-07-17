# 🌟 Aura Hub - Sistema de Gerenciamento Web Completo

> Sistema web moderno e robusto desenvolvido com React/TypeScript, Node.js e PHP, oferecendo uma plataforma completa para gerenciamento de usuários e dados empresariais.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📋 Sobre o Projeto

O **Aura Hub** é uma aplicação web full-stack moderna que combina as melhores tecnologias atuais para criar uma experiência de usuário excepcional e um sistema de gerenciamento eficiente. Desenvolvido como projeto acadêmico na **UFLA (Universidade Federal de Lavras)**, o sistema demonstra a implementação de práticas modernas de desenvolvimento web.

## 🚀 Funcionalidades Principais

### ✨ Interface de Usuário
- 🎨 **Design Moderno**: Interface clean e intuitiva construída com React e Tailwind CSS
- 📱 **Totalmente Responsivo**: Adaptável para desktop, tablet e mobile
- 🌙 **Modo Escuro/Claro**: Tema customizável para melhor experiência
- ⚡ **Performance Otimizada**: Carregamento rápido com Vite e otimizações

### 👥 Sistema de Usuários
- 📝 **Cadastro Inteligente**: Formulário com validação em tempo real
- 🔐 **Autenticação Segura**: Login com JWT e hash de senhas bcrypt
- � **Notificações Automáticas**: Emails para aprovação/rejeição de cadastros
- 👤 **Perfis Personalizáveis**: Dashboard individual para cada usuário

### �️ Painel Administrativo
- 📊 **Dashboard Analítico**: Estatísticas e métricas em tempo real
- ✅ **Aprovação de Usuários**: Sistema de moderação com um clique
- �️ **CRUD Completo**: Gerenciamento total de dados e usuários
- 📈 **Relatórios Dinâmicos**: Insights sobre o uso do sistema

### 🔒 Segurança Avançada
- �️ **Proteção XSS**: Headers de segurança configurados
- 🔐 **SQL Injection Safe**: Prepared statements em todas as consultas
- 🌐 **CORS Configurado**: Controle rigoroso de acesso entre domínios
- 🔑 **Criptografia**: Dados sensíveis protegidos com algoritmos modernos

## 🛠️ Stack Tecnológica

### 🎨 Frontend
- **React 18** - Framework JavaScript moderno
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool de alta performance
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI acessíveis e customizáveis
- **React Router** - Roteamento declarativo
- **Axios** - Cliente HTTP baseado em promises

### ⚙️ Backend
- **Node.js** - Runtime JavaScript no servidor
- **Express.js** - Framework web minimalista e flexível
- **TypeScript** - Desenvolvimento backend type-safe
- **PHP 7.4+** - Scripts de servidor para MySQL
- **MySQL 8.0** - Sistema de banco de dados relacional
- **bcrypt** - Hash de senhas seguro

### 📧 Sistema de Email
- **PHPMailer** - Envio de emails via SMTP
- **Nodemailer** - Alternativa Node.js para emails
- **Gmail SMTP** - Integração com serviços Google

### 🚀 DevOps & Deploy
- **Netlify** - Hosting e deploy contínuo
- **Git** - Controle de versão distribuído
- **npm** - Gerenciamento de pacotes
- **PowerShell** - Scripts de automação

## 📦 Estrutura Detalhada do Projeto

## ⚡ Instalação e Configuração

### 📋 Pré-requisitos
- **Node.js** 18+ 
- **XAMPP** (Apache + MySQL + PHP)
- **npm** ou **yarn**

### 🔧 Configuração Rápida

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/aura-hub.git
   cd aura-hub
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o ambiente**
   ```bash
   # Windows PowerShell
   .\private\setup-dev.ps1
   ```
   
   Ou configure manualmente:
   - Copie `private/config.example.php` para `php-files/config.php`
   - Copie `private/database.example.ts` para `server/database.ts`
   - Configure suas credenciais nos arquivos

4. **Configure o banco de dados**
   - Inicie o XAMPP (Apache + MySQL)
   - Execute o arquivo `criar_tabela_usuarios.sql` no phpMyAdmin
   - Execute o arquivo `criar_tabela_xpto.sql` no phpMyAdmin

5. **Inicie o projeto**
   ```bash
   npm run dev
   ```

6. **Acesse o sistema**
   - Frontend: http://localhost:8080
   - Login admin: `admin@sistema.com` / `123456`

## 📁 Estrutura do Projeto

```
aura-hub/
├── 🎨 client/                    # Frontend React/TypeScript
│   ├── components/ui/            # Componentes shadcn/ui
│   ├── pages/                    # Páginas da aplicação
│   │   ├── Login.tsx            # Página de autenticação
│   │   ├── Dashboard.tsx        # Dashboard do usuário
│   │   ├── Admin.tsx            # Painel administrativo
│   │   └── SignUp.tsx           # Cadastro de usuários
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # Serviços de API
│   └── global.css              # Estilos globais
├── ⚙️ server/                    # Backend Node.js/TypeScript
│   ├── routes/                  # Rotas da API REST
│   │   ├── auth.ts             # Autenticação
│   │   ├── users.ts            # Gerenciamento de usuários
│   │   └── xpto.ts             # Módulo específico
│   ├── database.ts             # Configuração MySQL
│   └── index.ts                # Servidor principal
├── 🐘 php-files/                # Scripts PHP
│   ├── config.php              # Configurações do sistema
│   └── login.php               # Autenticação PHP
├── 🗄️ Database/                 # Scripts SQL
│   ├── criar_tabela_usuarios.sql
│   └── criar_admin.sql
├── 🚀 netlify/                  # Deploy e Serverless
│   └── functions/api.ts        # API Netlify Functions
├── 🔐 private/                  # Configurações privadas
│   ├── config.example.php      # Template de configuração
│   └── setup-dev.ps1           # Script de setup
└── 📁 shared/                   # Código compartilhado
    ├── types.ts                # Tipagens TypeScript
    └── api.ts                  # Configurações de API
```

## ⚡ Instalação e Configuração

### 📋 Pré-requisitos Detalhados
- **Node.js** 18.0.0 ou superior
- **npm** 8.0.0 ou superior  
- **MySQL** 8.0 ou superior
- **PHP** 7.4 ou superior
- **Apache** ou **Nginx** (recomendado XAMPP)
- **Git** para controle de versão

### 🚀 Guia de Instalação Passo a Passo

#### 1️⃣ **Clone e Configure o Repositório**
```bash
# Clone o projeto
git clone https://github.com/Marialinaa/Projeto-Ufla.git
cd Projeto-Ufla

# Instale as dependências
npm install
```

#### 2️⃣ **Configure o Ambiente de Desenvolvimento**
```bash
# Para Windows (PowerShell)
.\private\setup-dev.ps1

# Para Linux/Mac
chmod +x private/setup-dev.sh
./private/setup-dev.sh
```

#### 3️⃣ **Configuração Manual (Alternativa)**
```bash
# Copie os arquivos de exemplo
cp private/config.example.php php-files/config.php
cp server/database.example.ts server/database.ts
cp private/email.example.ts server/email.ts
```

#### 4️⃣ **Configure o Banco de Dados MySQL**
1. **Inicie o XAMPP** (Apache + MySQL)
2. **Acesse phpMyAdmin**: `http://localhost/phpmyadmin`
3. **Crie um banco de dados**: `aura_hub_db`
4. **Execute os scripts SQL**:
   ```sql
   -- Execute na ordem:
   source criar_tabela_usuarios.sql;
   source criar_admin.sql;
   source criar_tabela_xpto.sql;
   ```

#### 5️⃣ **Configure as Credenciais**

**📄 Edite `php-files/config.php`:**
```php
// 🗄️ Banco de dados
$usuario = 'root';                    // Usuário MySQL
$senha = '';                          // Senha MySQL (vazio no XAMPP)
$banco = 'aura_hub_db';              // Nome do banco

// 📧 Email SMTP (Gmail)
define('SMTP_USER', 'seu_email@gmail.com');
define('SMTP_PASS', 'sua_senha_de_app_gmail');
define('ADMIN_EMAIL', 'admin@seusite.com');

// 🔐 Segurança
define('JWT_SECRET', 'sua_chave_jwt_super_secreta');
define('ENCRYPT_KEY', 'sua_chave_de_criptografia');
```

**📄 Edite `server/database.ts`:**
```typescript
export const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'aura_hub_db',
  port: 3306
};
```

#### 6️⃣ **Inicie o Sistema**
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

#### 7️⃣ **Acesse o Sistema**
- 🌐 **Frontend**: `http://localhost:8080`
- 🔧 **API**: `http://localhost:3000`
- 🗄️ **phpMyAdmin**: `http://localhost/phpmyadmin`

#### 8️⃣ **Login Inicial**
```
👤 Admin:
   Email: admin@sistema.com
   Senha: 123456

🆕 Ou crie uma nova conta através do sistema de cadastro
```
│   └── services/           # Serviços de API
├── 🔧 server/              # Backend Node.js
│   ├── routes/             # Rotas da API
│   └── database.ts         # Configuração do banco
├── 🐘 php-files/           # Backend PHP
│   ├── config.php          # Configurações
│   └── *.php               # APIs específicas
├── 🔒 private/             # Arquivos sensíveis (não commitados)
│   ├── credentials.md      # Credenciais padrão
│   ├── *.example.*         # Templates de configuração
│   └── setup-dev.ps1       # Script de configuração
└── 📊 shared/              # Tipos compartilhados
```

## 🎯 Como Usar

### 👤 Fluxo do Usuário
1. Acesse a página inicial
2. Clique em "Sign Up" 
3. Preencha o formulário de cadastro
4. Aguarde aprovação do administrador
5. Receba email de confirmação
6. Faça login no sistema

### 🔧 Fluxo do Administrador
1. Acesse `/login` 
2. Entre com credenciais de admin
3. Vá para o painel administrativo
4. Aprove/rejeite usuários pendentes
5. Gerencie conteúdo na seção CRUD

## 📱 Páginas e Funcionalidades

### 🏠 **Página Inicial (Index.tsx)**
- Landing page com apresentação do sistema
- Call-to-action para cadastro/login
- Design responsivo e moderno

### 🔐 **Sistema de Autenticação**
- **Login (Login.tsx)**: Autenticação segura com validação
- **Cadastro (SignUp.tsx)**: Formulário inteligente com verificação em tempo real
- **Recuperação de senha**: Sistema de reset via email

### 📊 **Dashboard do Usuário (Dashboard.tsx)**
- Visão geral personalizada
- Estatísticas pessoais
- Acesso rápido às funcionalidades
- Notificações em tempo real

### 🛠️ **Painel Administrativo (Admin.tsx)**
- Dashboard com métricas completas
- Gerenciamento de usuários (CRUD)
- Sistema de aprovação/rejeição
- Configurações do sistema
- Logs de auditoria

### 📋 **Módulo XPTO (Xpto.tsx)**
- Funcionalidade específica do sistema
- Demonstração de CRUD avançado
- Interface customizada

### 📧 **Sistema de Email (TestEmail.tsx)**
- Teste de configurações SMTP
- Envio de emails de notificação
- Templates personalizados

## 🔗 API Endpoints

### 🔐 **Autenticação (`/api/auth`)**
```typescript
POST   /api/auth/login      # Login de usuário
POST   /api/auth/register   # Cadastro de usuário  
POST   /api/auth/logout     # Logout do sistema
POST   /api/auth/refresh    # Renovar token JWT
POST   /api/auth/reset      # Reset de senha
```

### 👥 **Usuários (`/api/users`)**
```typescript
GET    /api/users           # Listar todos os usuários
GET    /api/users/:id       # Obter usuário específico
POST   /api/users           # Criar novo usuário
PUT    /api/users/:id       # Atualizar usuário
DELETE /api/users/:id       # Deletar usuário
PATCH  /api/users/:id/approve # Aprovar usuário
```

### 📊 **Dashboard (`/api/dashboard`)**
```typescript
GET    /api/dashboard/stats    # Estatísticas gerais
GET    /api/dashboard/users    # Dados de usuários
GET    /api/dashboard/activity # Atividade recente
```

### 🗂️ **XPTO Module (`/api/xpto`)**
```typescript
GET    /api/xpto           # Listar itens XPTO
POST   /api/xpto           # Criar item XPTO
PUT    /api/xpto/:id       # Atualizar item XPTO
DELETE /api/xpto/:id       # Deletar item XPTO
```

## 🧪 Testes e Qualidade

### 🔍 **Executar Testes**
```bash
# Todos os testes
npm test

# Testes com cobertura
npm run test:coverage

# Testes em watch mode
npm run test:watch

# Testes de integração
npm run test:integration
```

### 📊 **Linting e Formatação**
```bash
# ESLint
npm run lint

# Prettier
npm run format

# Type checking
npm run type-check
```

## 🚀 Deploy e Produção

### 🌐 **Deploy no Netlify**
1. Faça push para o repositório GitHub
2. Conecte o repositório ao Netlify
3. Configure as variáveis de ambiente:
   ```env
   VITE_API_URL=https://sua-api.netlify.app
   VITE_APP_NAME=Aura Hub
   ```
4. Deploy automático a cada push

### 🐳 **Docker (Opcional)**
```bash
# Build da imagem
docker build -t aura-hub .

# Executar container
docker run -p 8080:8080 aura-hub
```

## ⚙️ Configurações Avançadas

### 📧 **Configuração de Email (Gmail)**
1. Acesse [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Gere uma senha de aplicativo
3. Use a senha gerada no `config.php`:
   ```php
   define('SMTP_PASS', 'sua_senha_de_app_aqui');
   ```

### 🔐 **Gerar Chaves de Segurança**
```bash
# JWT Secret (64 caracteres base64)
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Encryption Key (32 caracteres base64)  
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 🗄️ **Backup do Banco de Dados**
```bash
# Backup
mysqldump -u root -p aura_hub_db > backup.sql

# Restaurar
mysql -u root -p aura_hub_db < backup.sql
```

## 🐛 Solução de Problemas

### ❗ **Problemas Comuns**

**🔴 Erro de conexão com banco:**
- Verifique se o MySQL está rodando
- Confirme credenciais em `config.php` e `database.ts`
- Teste conexão no phpMyAdmin

**🔴 Emails não enviados:**
- Verifique configurações SMTP
- Confirme senha de app do Gmail
- Teste com `TestEmail.tsx`

**🔴 Erro de CORS:**
- Verifique headers em `config.php`
- Confirme URL da API no frontend

**🔴 Build falha:**
```bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Como Contribuir

### 🎯 **Para Contribuidores**
1. **Fork** o repositório
2. **Clone** seu fork: `git clone https://github.com/seu-usuario/Projeto-Ufla.git`
3. **Crie uma branch**: `git checkout -b feature/nova-funcionalidade`
4. **Desenvolva** seguindo os padrões do projeto
5. **Teste** suas alterações: `npm test`
6. **Commit**: `git commit -m "feat: adiciona nova funcionalidade"`
7. **Push**: `git push origin feature/nova-funcionalidade`
8. **Abra um Pull Request** com descrição detalhada

### 📝 **Convenções de Commit**
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação/estilo
refactor: refatoração
test: testes
chore: tarefas auxiliares
```

### 🎨 **Padrões de Código**
- **TypeScript** em todo o projeto
- **ESLint + Prettier** para formatação
- **Componentes funcionais** com hooks
- **Nomes descritivos** para variáveis e funções
- **Comentários JSDoc** em funções complexas

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

```
MIT License - Copyright (c) 2025 Maria Lina da Silva
```

## 👩‍💻 Sobre a Autora

<div align="center">

### **Maria Lina da Silva**
*Estudante de Ciência da Computação - UFLA*

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Marialinaa)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:maria.lina149@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](#)

</div>

**🎓 Formação:**
- Graduanda em Ciência da Computação - UFLA
- Especialização em Desenvolvimento Web Full-Stack
- Experiência em React, TypeScript, Node.js e PHP

**💡 Interesses:**
- Desenvolvimento Web Moderno
- Engenharia de Software
- Interface de Usuário (UI/UX)
- Sistemas de Gerenciamento

## 🙏 Agradecimentos

- **🏫 UFLA** - Universidade Federal de Lavras
- **👨‍🏫 Professores** do Departamento de Ciência da Computação
- **👥 Colegas** que contribuíram com feedback e sugestões
- **🌐 Comunidade Open Source** pelas ferramentas incríveis
- **📚 Documentações** das tecnologias utilizadas

## 📞 Suporte e Contato

### 🆘 **Precisa de Ajuda?**

1. **📖 Consulte a documentação** acima
2. **🔍 Verifique as [Issues](https://github.com/Marialinaa/Projeto-Ufla/issues)** existentes
3. **🆕 Abra uma nova issue** se necessário
4. **📧 Entre em contato**: maria.lina149@gmail.com

### 💬 **Discussões e Feedback**
- Use as **GitHub Discussions** para perguntas gerais
- **Issues** para bugs e melhorias específicas
- **Pull Requests** para contribuições de código

---

<div align="center">

### ⭐ **Se este projeto foi útil, considere dar uma estrela!** ⭐

### 💙 **Desenvolvido com carinho para a comunidade acadêmica** 💙

**🔗 [Aura Hub](https://github.com/Marialinaa/Projeto-Ufla) • 🏫 [UFLA](https://ufla.br) • 👩‍💻 [Maria Lina](https://github.com/Marialinaa)**

</div>
