# Projeto Aura Hub

Repositório do projeto "Projeto-Aura-hub" — aplicação web fullstack construída com Vite, React (TypeScript) no cliente e Node/Express/TypeScript no servidor.

## Visão rápida

- Frontend: `client/` (React + TypeScript, Vite)
- Backend: `server/` (Node + Express + TypeScript)

## Pré-requisitos

- Node.js v16+ e npm ou pnpm
- Git

## Instalação (modo rápido)

1. Instale dependências na raiz (se houver scripts específicos no monorepo):

```bash
cd C:\Users\maria\Downloads\aura-hubb
npm install
```

2. Para rodar o cliente em modo de desenvolvimento:

```bash
cd client
npm install
npm run dev
```

3. Para rodar o servidor em desenvolvimento:

```bash
cd server
npm install
npm run dev
```

Consulte `package.json` na raiz e nas pastas `client/` e `server/` para scripts disponíveis.

## Estrutura principal

- `client/` - aplicativo React + componentes
- `server/` - API e lógica do backend
- `public/` - ativos estáticos

## Licença

Sem licença especificada. Se quiser, posso adicionar um `LICENSE` (MIT, Apache-2.0, etc.).

## Observações

Este README é minimalista. Posso expandi-lo com instruções de testes, deploy (Netlify/Heroku/Vercel), ambiente `.env` e um `.gitignore` se desejar.
# AURA-HUBB

Plataforma de gerenciamento para bolsistas e responsáveis de projetos acadêmicos.

## Sobre o Projeto

AURA-HUBB é uma aplicação web desenvolvida para facilitar a administração de projetos acadêmicos, gerenciamento de bolsistas e atribuições de atividades.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

- **Frontend**: Interface de usuário desenvolvida com React e TypeScript
- **Backend**: API REST desenvolvida com Node.js, Express e TypeScript

## Tecnologias Utilizadas

### Frontend
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- Vite

### Backend
- Node.js
- Express
- TypeScript
- MySQL

## Funcionalidades Principais

- Autenticação e gerenciamento de usuários
- Dashboard para bolsistas
- Dashboard para responsáveis de projetos
- Sistema de atribuições de tarefas
- Registro e controle de horários
- Interface administrativa

## Requisitos

- Node.js 16+
- MySQL 8+
- npm ou yarn

## Como Instalar

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/aura-hubb.git
cd aura-hubb
```

2. Instale as dependências do projeto principal:
```bash
npm install
```

3. Instale as dependências do servidor:
```bash
cd server
npm install
cd ..
```

## Configuração

1. Crie um arquivo `.env` na pasta raiz do projeto para configurações do cliente:
```
PORT=3004
```

2. Crie um arquivo `.env` na pasta `server` para configurações do servidor:
```
PORT=3005
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=nome_do_banco
JWT_SECRET=seu_token_secreto
```

## Como Executar

### Modo Desenvolvimento

1. Inicie o servidor:
```bash
cd server
npm run dev
```

2. Em outro terminal, inicie o cliente:
```bash
npm run dev
```

### Modo Produção

1. Construa o cliente:
```bash
npm run build:client
```

2. Construa o servidor:
```bash
cd server
npm run build
```

3. Execute o servidor em produção:
```bash
npm start
```

## Estrutura de Arquivos

```
├── client/             # Código fonte do frontend
├── server/             # Código fonte do backend
│   ├── controllers/    # Controladores da API
│   ├── middleware/     # Middleware do Express
│   ├── models/         # Modelos de dados
│   ├── routes/         # Rotas da API
│   └── utils/          # Utilitários
├── public/             # Arquivos estáticos
└── dist/               # Build de produção
```

## Licença

Este projeto é licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT).

## Contato

Para mais informações, entre em contato com os mantedores do projeto.
