# Relatório de Duplicação de Código - Projeto Aura-Hub

**Data da Análise:** 30 de outubro de 2025  
**Repositório:** Projeto-Aura-hub (main branch)

---

## 📊 Sumário Executivo

### Problemas Identificados

✅ **Total de arquivos duplicados:** 35+ grupos de arquivos idênticos  
⚠️ **Gravidade:** ALTA - Duplicação completa entre `server/` e `server/back-end-aura-hubb/`  
🎯 **Impacto:** Manutenção duplicada, inconsistências potenciais, espaço desperdiçado  

---

## 🔍 Análise Detalhada

### 1. Duplicação Total: `server/` vs `server/back-end-aura-hubb/`

**Grau de Similaridade:** 100% (arquivos idênticos - hash MD5 corresponde)

A pasta `server/back-end-aura-hubb/` é uma **cópia completa** da estrutura `server/`, contendo arquivos absolutamente idênticos.

#### 1.1 Arquivos de Configuração Duplicados

| Arquivo | Localização 1 | Localização 2 | Tamanho | Hash MD5 |
|---------|--------------|---------------|---------|-----------|
| `config.ts` | `server/config/` | `server/back-end-aura-hubb/config/` | 751 bytes | b9bbbf1120479d09e909fc1e6527a599 |
| `email.ts` | `server/config/` | `server/back-end-aura-hubb/config/` | 942 bytes | 1de505b7e9412e72b8a09c5dd06f0205 |
| `emailTemplates.ts` | `server/config/` | `server/back-end-aura-hubb/config/` | 5.27 KB | 90fd62e087c04c33ad745798cbf88998 |
| `database.ts` | `server/config/` | `server/back-end-aura-hubb/config/` | Idênticos | - |

#### 1.2 Controllers Duplicados

| Arquivo | Localização 1 | Localização 2 | Tamanho | Hash MD5 |
|---------|--------------|---------------|---------|-----------|
| `atribuicoesController.ts` | `server/controllers/` | `server/back-end-aura-hubb/controllers/` | 3.54 KB | 06f2f3f9e32f3f0a1b71b46f32cc3f5e |
| `authController.ts` | `server/controllers/` | `server/back-end-aura-hubb/controllers/` | 8.66 KB | 32f19c3466df977e7fe7b74b891aee3c |
| `horariosController.ts` | `server/controllers/` | `server/back-end-aura-hubb/controllers/` | 6.47 KB | 88e0335ae4a16ee75e052f2da75542be |
| `usuariosController.ts` | `server/controllers/` | `server/back-end-aura-hubb/controllers/` | 7.00 KB | 45a498be3641036973d9e179dca03e53 |

#### 1.3 Routes Duplicados

| Arquivo | Localização 1 | Localização 2 | Tamanho | Hash MD5 |
|---------|--------------|---------------|---------|-----------|
| `atribuicoes.ts` | `server/routes/` | `server/back-end-aura-hubb/routes/` | 8.78 KB | 5dea9af806714f247b9c1652bc160128 |
| `atribuicoesRoutes.ts` | `server/routes/` | `server/back-end-aura-hubb/routes/` | 463 bytes | 077aeb90a72ffb5b2b856af3d607db56 |
| `auth.ts` | `server/routes/` | `server/back-end-aura-hubb/routes/` | 18.6 KB | 005ac24eca8c2b6f878630bf8d2cdfe0 |
| `authRoutes.ts` | `server/routes/` | `server/back-end-aura-hubb/routes/` | 580 bytes | 380eaa6ca21c5f6630deb8c81245ca4c |
| `auth_new.ts` | `server/routes/` | `server/back-end-aura-hubb/routes/` | 6.13 KB | e8b6cee9f25b3e1158c3c8218801fc09 |
| `horariosRoutes.ts` | `server/routes/` | `server/back-end-aura-hubb/routes/` | 669 bytes | ffd4b30295c5c4e4d951949dfaa831e8 |
| `index.ts` | `server/routes/` | `server/back-end-aura-hubb/routes/` | 2.05 KB | c1c4280adac9d8446f38daf1f0adc4dd |
| `users.ts` | `server/routes/` | `server/back-end-aura-hubb/routes/` | 8.40 KB | a74f2cc552b13ab4aeb11c4b6313fa91 |
| `users_new.ts` | `server/routes/` | `server/back-end-aura-hubb/routes/` | 5.16 KB | f0142863f7fbe59380e79f8e1c91e97a |
| `usuariosRoutes.ts` | `server/routes/` | `server/back-end-aura-hubb/routes/` | 750 bytes | 7a3cc6d670dd8ab8be6c8bb9f93e74c8 |
| `usuariosRoutes.test.ts` | `server/routes/` | `server/back-end-aura-hubb/routes/` | 290 bytes | a1da8ec8f63b8d6c954e67072db559d1 |

#### 1.4 Models Duplicados

| Arquivo | Localização 1 | Localização 2 | Tamanho | Hash MD5 |
|---------|--------------|---------------|---------|-----------|
| `Atribuicao.ts` | `server/models/` | `server/back-end-aura-hubb/models/` | 2.51 KB | b9a89b4e44612bbbf10d79ded0f9b6ce |
| `Horario.ts` | `server/models/` | `server/back-end-aura-hubb/models/` | 4.19 KB | 8b8d81ac3bbaf3a34b6e1c086143d534 |
| `User.ts` | `server/models/` | `server/back-end-aura-hubb/models/` | 5.41 KB | b36abe1bbf317cd270c09ee217536261 |

#### 1.5 Middleware Duplicados

| Arquivo | Localização 1 | Localização 2 | Tamanho | Hash MD5 |
|---------|--------------|---------------|---------|-----------|
| `authMiddleware.js` | `server/middleware/` | `server/back-end-aura-hubb/middleware/` | 725 bytes | 4c233a77060c582e05fce4a686689476 |
| `authMiddleware.ts` | `server/middleware/` | `server/back-end-aura-hubb/middleware/` | 2.00 KB | beaa643bb9cd83059cb7493074ec2af8 |

#### 1.6 Utils Duplicados

| Arquivo | Localização 1 | Localização 2 | Tamanho | Hash MD5 |
|---------|--------------|---------------|---------|-----------|
| `emailTemplates.js` | `server/utils/` | `server/back-end-aura-hubb/utils/` | 3.14 KB | 6f6495ff54f3a88ecb3beae3cecc1911 |
| `errorHandler.ts` | `server/utils/` | `server/back-end-aura-hubb/utils/` | 2.36 KB | b2a582bc602cb370aaa5f8615338c9b7 |
| `logger.ts` | `server/utils/` | `server/back-end-aura-hubb/utils/` | 2.49 KB | f6e6321055bc68e6c487e181437b7e2b |
| `utils.ts` | `server/utils/` | `server/back-end-aura-hubb/utils/` | 6.12 KB | 09d219a0eea7545d861cc137cd6834d7 |

#### 1.7 Scripts e Arquivos Raiz Duplicados

| Arquivo | Localização 1 | Localização 2 | Tamanho | Hash MD5 |
|---------|--------------|---------------|---------|-----------|
| `create_solicitacoes_table.js` | `server/` | `server/back-end-aura-hubb/` | 1.04 KB | 2792ba87cfa5628027fcaab432156948 |
| `database.ts` | `server/` | `server/back-end-aura-hubb/` | 333 bytes | fc4c1a210cf280f4f43e94573d1bf2c0 |
| `email.ts` | `server/` | `server/back-end-aura-hubb/` | 2.72 KB | 56804f43b05e11016c2bdc18607c9544 |
| `jest.config.js` | `server/` | `server/back-end-aura-hubb/` | 347 bytes | 53cf7ea6799e905a504cacc7d2fd7f87 |
| `smoke_test.js` | `server/` | `server/back-end-aura-hubb/` | 3.31 KB | ca9be642f0222d416274355ddcd9c950 |
| `test_tcp.js` | `server/` | `server/back-end-aura-hubb/` | 419 bytes | 166726cea76469c023e3fa6c33bb6ac2 |
| `vite-env.d.ts` | `server/` | `server/back-end-aura-hubb/` | 577 bytes | bf43a02d45d647ec9f0927a70e3f0007 |

#### 1.8 Shared Types Duplicados

| Arquivo | Localização 1 | Localização 2 | Tamanho | Hash MD5 |
|---------|--------------|---------------|---------|-----------|
| `types.ts` | `server/shared/` | `server/back-end-aura-hubb/shared/` | 209 bytes | 5abc72a2ae687aeeb2329c7fcfbb804b |
| `api.ts` | `server/shared/` | `server/back-end-aura-hubb/shared/` | - | - |

---

### 2. Duplicação Frontend: Arquivos App.tsx

**Grau de Similaridade:** ~95% (pequenas variações)

| Arquivo | Localização | Observação |
|---------|-------------|-----------|
| `App.tsx` | `client/` | Versão ativa com mais rotas |
| `App-original.tsx` | `client/` | Versão anterior com menos rotas |
| `App-teste.tsx` | `client/` | **VAZIO** - pode ser removido |

**Diferenças entre App.tsx e App-original.tsx:**
- `App.tsx`: Inclui rotas para `BolsistaDashboard`, `ResponsavelDashboard`, `TesteComponents`, `TesteAdminOriginal`
- `App-original.tsx`: Versão mais simples com componente `NotFound`
- Ambos usam a mesma estrutura e providers

---

### 3. Arquivos de Configuração com Redundância

#### 3.1 Configurações Vite

| Arquivo | Função | Observação |
|---------|--------|-----------|
| `vite.config.ts` | Build do frontend (porta 3000, alias `@` para `./src`) | ⚠️ Conflito de alias |
| `vite.config.js` | Build do frontend (porta 5173, alias `@` para `./client`) | ⚠️ Conflito de alias |
| `vite.config.server.ts` | Build do servidor Node.js | ✅ Propósito específico |

**Problema:** Dois arquivos de config do Vite com configurações conflitantes (portas diferentes, alias diferentes)

#### 3.2 Configurações Jest

| Arquivo | Localização | Hash MD5 |
|---------|-------------|-----------|
| `jest.config.js` | Raiz | Ambiente jsdom (frontend) |
| `jest.config.js` | `server/` | Ambiente node (backend) - DUPLICADO |
| `jest.config.js` | `server/back-end-aura-hubb/` | Ambiente node (backend) - DUPLICADO |

**Problema:** 2 configurações Jest idênticas no backend

---

### 4. Duplicação de Pastas Estruturais

#### 4.1 `src/` vs `client/`

**Estrutura Atual:**
```
src/
  components/ (VAZIA)
  types/ (VAZIA)

client/
  components/ (POPULADA: icons.tsx, NotFound.tsx, atribuicoes/, ui/)
  types/ (POPULADA: index.ts com interfaces completas)
  src/
    config.ts
  ...
```

**Problema:** A pasta `src/` raiz está vazia enquanto todo o código frontend está em `client/`

#### 4.2 Configurações Duplicadas

| Tipo | Localização 1 | Localização 2 | Diferença |
|------|--------------|---------------|-----------|
| API Config | `client/src/config.ts` | `server/config/config.ts` | Frontend vs Backend (legítimo) |
| Database Config | `server/config/database.ts` | `server/back-end-aura-hubb/config/database.ts` | 100% duplicado |
| Email Config | `server/config/email.ts` | `server/back-end-aura-hubb/config/email.ts` | 100% duplicado |

---

## 🎯 Recomendações de Refatoração

### Prioridade CRÍTICA 🔴

#### 1. Remover Pasta `server/back-end-aura-hubb/` Completamente

**Justificativa:**
- Duplicação 100% de todo o código backend
- Risco de editar apenas uma versão e criar inconsistências
- Desperdício de espaço e confusão na manutenção

**Ação:**
```bash
# Backup antes de remover (opcional)
mv server/back-end-aura-hubb server-backup-old

# Remover a pasta duplicada
rm -rf server/back-end-aura-hubb/
```

**Impacto:** Redução de ~50% do código backend, eliminação de 35+ arquivos duplicados

---

### Prioridade ALTA 🟠

#### 2. Consolidar Configurações Vite

**Problema Atual:**
- `vite.config.ts` (porta 3000, alias @ → ./src)
- `vite.config.js` (porta 5173, alias @ → ./client)

**Solução Recomendada:**

Manter apenas `vite.config.ts` com configuração unificada:

```typescript
// vite.config.ts (VERSÃO UNIFICADA)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: process.env.LOCAL_API_TARGET || 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})
```

**Ação:**
- Deletar `vite.config.js`
- Atualizar `vite.config.ts` com configuração unificada
- Verificar se há referências a `vite.config.js` em scripts

---

#### 3. Remover Arquivos App.tsx Redundantes

**Ação:**
```bash
# Remover arquivos desnecessários
rm client/App-teste.tsx
rm client/App-original.tsx
```

**Justificativa:**
- `App-teste.tsx` está vazio
- `App-original.tsx` é versão antiga
- Manter apenas `App.tsx` ativo

---

#### 4. Limpar Pasta `src/` Raiz

**Problema:** Pastas vazias `src/components/` e `src/types/` na raiz

**Solução:**
```bash
# Remover pasta src vazia da raiz
rm -rf src/
```

**Justificativa:** Todo código frontend está em `client/`, a pasta `src/` raiz está vazia e causa confusão

---

### Prioridade MÉDIA 🟡

#### 5. Unificar Utils entre Client e Server

**Problema Atual:**

```typescript
// client/lib/utils.ts
export function cn(...inputs: any[]): string { ... }
export function formatCurrency(value: number): string { ... }
export function formatDate(date: Date | string): string { ... }

// client/utils/helpers.ts
export const filterUsersByType = (users: User[], tipo: string) => { ... }
export const formatDate = (dateString: string): string { ... } // DUPLICADO

// server/utils/utils.ts
export const dateUtils = {
  formatDate: (date: Date): string => { ... } // DUPLICADO
  formatTime: (date: Date): string => { ... }
}
```

**Solução Recomendada:**

Criar módulo compartilhado `shared/utils/`:

```
shared/
  utils/
    dateUtils.ts    # Funções de data compartilhadas
    formatters.ts   # Formatadores compartilhados
    validators.ts   # Validações compartilhadas
```

**Implementação:**

```typescript
// shared/utils/dateUtils.ts
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
};

export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('pt-BR');
};

// Importar em client e server
// client/lib/utils.ts
import { formatDate } from '@shared/utils/dateUtils';
export { formatDate };

// server/utils/utils.ts
import { formatDate } from '../shared/utils/dateUtils';
export const dateUtils = { formatDate };
```

---

#### 6. Consolidar Configurações Jest

**Ação:**
- Manter `jest.config.js` raiz para testes frontend
- Manter `server/jest.config.js` para testes backend
- Remover `server/back-end-aura-hubb/jest.config.js` (será eliminado junto com a pasta)

---

### Prioridade BAIXA 🟢

#### 7. Revisar Arquivos de Email Duplicados

**Observação:** Há pequenas duplicações em:
- `server/utils/emailTemplates.js` vs `server/config/emailTemplates.ts`

**Recomendação:** Padronizar em TypeScript e manter apenas em `server/config/`

---

## 📋 Estrutura Otimizada Proposta

### Estrutura Atual (Problemática)

```
aura-hubb/
├── src/                          # ❌ VAZIA
│   ├── components/               # ❌ VAZIA
│   └── types/                    # ❌ VAZIA
├── client/                       # ✅ Frontend ativo
│   ├── App.tsx                   # ✅ Versão principal
│   ├── App-original.tsx          # ❌ Redundante
│   ├── App-teste.tsx             # ❌ Vazio
│   ├── components/               # ✅
│   ├── types/                    # ✅
│   └── src/config.ts             # ⚠️ Aninhado
├── server/                       # ✅ Backend ativo
│   ├── config/                   # ✅
│   ├── controllers/              # ✅
│   ├── models/                   # ✅
│   ├── routes/                   # ✅
│   ├── utils/                    # ✅
│   └── back-end-aura-hubb/       # ❌ 100% DUPLICADO
│       ├── config/               # ❌ Cópia idêntica
│       ├── controllers/          # ❌ Cópia idêntica
│       ├── models/               # ❌ Cópia idêntica
│       ├── routes/               # ❌ Cópia idêntica
│       └── utils/                # ❌ Cópia idêntica
├── vite.config.ts                # ⚠️ Conflito com .js
└── vite.config.js                # ⚠️ Conflito com .ts
```

### Estrutura Otimizada Proposta

```
aura-hubb/
├── client/                       # ✅ Frontend
│   ├── App.tsx                   # ✅ Único arquivo
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── config.ts
├── server/                       # ✅ Backend
│   ├── config/
│   │   ├── config.ts
│   │   ├── database.ts
│   │   ├── email.ts
│   │   └── emailTemplates.ts
│   ├── controllers/
│   │   ├── atribuicoesController.ts
│   │   ├── authController.ts
│   │   ├── horariosController.ts
│   │   └── usuariosController.ts
│   ├── middleware/
│   │   └── authMiddleware.ts
│   ├── models/
│   │   ├── Atribuicao.ts
│   │   ├── Horario.ts
│   │   └── User.ts
│   ├── routes/
│   │   ├── index.ts
│   │   ├── atribuicoesRoutes.ts
│   │   ├── authRoutes.ts
│   │   ├── horariosRoutes.ts
│   │   └── usuariosRoutes.ts
│   ├── utils/
│   │   ├── errorHandler.ts
│   │   ├── logger.ts
│   │   └── utils.ts
│   ├── database.ts
│   ├── email.ts
│   └── index.ts
├── shared/                       # ✅ Código compartilhado
│   ├── types.ts
│   └── utils/
│       ├── dateUtils.ts
│       ├── formatters.ts
│       └── validators.ts
├── vite.config.ts                # ✅ Configuração única
└── jest.config.js                # ✅ Raiz para frontend
```

---

## 📊 Métricas de Impacto

### Antes da Refatoração

- **Total de arquivos de código:** ~150 arquivos
- **Arquivos duplicados:** 35+ arquivos (100% idênticos)
- **Taxa de duplicação:** ~23% do código backend
- **Pastas vazias:** 2 (`src/components/`, `src/types/`)
- **Arquivos mortos:** 2 (`App-original.tsx`, `App-teste.tsx`)

### Depois da Refatoração

- **Total de arquivos de código:** ~115 arquivos
- **Arquivos duplicados:** 0 arquivos
- **Taxa de duplicação:** 0%
- **Pastas vazias:** 0
- **Arquivos mortos:** 0
- **Redução de código:** ~23% (estimado)

---

## 🚀 Plano de Execução

### Fase 1: Backup e Preparação
1. ✅ Criar branch para refatoração: `git checkout -b refactor/remove-duplicates`
2. ✅ Commit do estado atual
3. ✅ Fazer backup da pasta `server/back-end-aura-hubb/`

### Fase 2: Remoção de Duplicatas Críticas
1. ❌ Remover `server/back-end-aura-hubb/` completamente
2. ❌ Atualizar imports se houver referências
3. ❌ Testar servidor backend
4. ❌ Commit: "Remove duplicated server/back-end-aura-hubb directory"

### Fase 3: Limpeza de Arquivos Frontend
1. ❌ Remover `client/App-teste.tsx`
2. ❌ Remover `client/App-original.tsx`
3. ❌ Remover pasta `src/` raiz vazia
4. ❌ Commit: "Clean up redundant frontend files"

### Fase 4: Consolidação de Configs
1. ❌ Remover `vite.config.js`
2. ❌ Atualizar `vite.config.ts` com configuração unificada
3. ❌ Testar build frontend
4. ❌ Commit: "Consolidate Vite configuration"

### Fase 5: Otimização de Utils (Opcional)
1. ❌ Criar `shared/utils/`
2. ❌ Mover funções compartilhadas
3. ❌ Atualizar imports em client e server
4. ❌ Testar ambos frontend e backend
5. ❌ Commit: "Unify shared utilities"

### Fase 6: Validação e Testes
1. ❌ Executar testes: `npm test`
2. ❌ Build frontend: `npm run build`
3. ❌ Build backend: `cd server && npm run build`
4. ❌ Smoke tests completos
5. ❌ Commit: "Validate refactored structure"

### Fase 7: Merge
1. ❌ Code review
2. ❌ Merge para main: `git checkout main && git merge refactor/remove-duplicates`
3. ❌ Deploy

---

## 📝 Checklist de Ações

### Ações Imediatas (CRÍTICAS)
- [ ] Deletar `server/back-end-aura-hubb/`
- [ ] Verificar se há imports referenciando `back-end-aura-hubb`
- [ ] Atualizar scripts em `package.json` se necessário

### Ações Importantes (ALTAS)
- [ ] Deletar `vite.config.js`
- [ ] Atualizar `vite.config.ts`
- [ ] Deletar `client/App-teste.tsx`
- [ ] Deletar `client/App-original.tsx`
- [ ] Deletar pasta `src/` raiz

### Ações Recomendadas (MÉDIAS)
- [ ] Criar `shared/utils/`
- [ ] Unificar funções de data
- [ ] Unificar funções de formatação
- [ ] Consolidar validadores

### Ações Opcionais (BAIXAS)
- [ ] Revisar estrutura de email templates
- [ ] Padronizar nomes de arquivos (kebab-case vs camelCase)
- [ ] Documentar arquitetura final

---

## ⚠️ Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Quebra de imports após remoção | Média | Alto | Busca global por `back-end-aura-hubb` antes de deletar |
| Conflito em deploy | Baixa | Médio | Testar build completo antes de merge |
| Perda de código ativo | Muito Baixa | Crítico | Fazer backup antes de qualquer remoção |
| Quebra de testes | Baixa | Médio | Executar suite de testes completa |

---

## 📚 Conclusão

O repositório **Projeto-Aura-hub** apresenta duplicação significativa de código, principalmente devido à presença da pasta `server/back-end-aura-hubb/` que é uma cópia completa de `server/`.

**Benefícios da Refatoração:**
- ✅ Redução de ~23% do código backend
- ✅ Eliminação de 35+ arquivos duplicados
- ✅ Manutenção mais simples e consistente
- ✅ Menor risco de inconsistências
- ✅ Estrutura mais clara e profissional

**Tempo Estimado:**
- Fase 1-2 (Crítico): 1-2 horas
- Fase 3-4 (Alto): 1 hora
- Fase 5 (Médio): 2-3 horas
- **Total:** 4-6 horas de trabalho

**Recomendação Final:** Proceder com a refatoração em branch separada, com testes completos antes do merge.

---

**Gerado por:** GitHub Copilot  
**Ferramenta de Análise:** Node.js + crypto (MD5 hash comparison)  
**Critério:** Comparação de conteúdo byte-a-byte (hash MD5)
