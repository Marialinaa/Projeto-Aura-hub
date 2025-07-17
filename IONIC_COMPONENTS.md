# Componentes Ionic para React

Este sistema agora inclui componentes inspirados no Ionic Framework, adaptados para React com Tailwind CSS.

## 🔽 IonicAccordion

### Uso Básico
```tsx
import { 
  IonicAccordionGroup, 
  IonicAccordion, 
  IonicAccordionTrigger, 
  IonicAccordionContent,
  IonicItem,
  IonicLabel
} from "@/components/ui/ionic-accordion";

<IonicAccordionGroup expand="inset">
  <IonicAccordion value="first">
    <IonicAccordionTrigger color="light">
      <IonicItem color="light">
        <IonicLabel>First Accordion</IonicLabel>
      </IonicItem>
    </IonicAccordionTrigger>
    <IonicAccordionContent>
      <div className="p-4">First Content</div>
    </IonicAccordionContent>
  </IonicAccordion>
  
  <IonicAccordion value="second">
    <IonicAccordionTrigger color="light">
      <IonicItem color="light">
        <IonicLabel>Second Accordion</IonicLabel>
      </IonicItem>
    </IonicAccordionTrigger>
    <IonicAccordionContent>
      <div className="p-4">Second Content</div>
    </IonicAccordionContent>
  </IonicAccordion>
</IonicAccordionGroup>
```

### Propriedades do Accordion
- `expand`: "inset" | "compact" - Estilo de expansão
- `color`: "light" | "medium" | "dark" - Cor do cabeçalho
- Baseado no Radix UI Accordion

## 🎛️ IonicToggle

### Uso Básico
```tsx
import { IonicToggle } from "@/components/ui/ionic-toggle";

// Toggle simples
<IonicToggle 
  checked={isEnabled} 
  onCheckedChange={setIsEnabled} 
/>

// Toggle com labels ON/OFF
<IonicToggle 
  checked={isEnabled} 
  onCheckedChange={setIsEnabled}
  enableOnOffLabels={true}
>
  Enable Notifications
</IonicToggle>
```

### Propriedades
- `enableOnOffLabels`: boolean - Mostra labels "ON" e "OFF" no toggle
- `children`: ReactNode - Texto do label ao lado do toggle
- Todas as propriedades do componente Switch do Radix UI

## 🔲 IonicButton

### Variantes Disponíveis
```tsx
import { IonicButton } from "@/components/ui/ionic-button";

// Default (preenchido)
<IonicButton>Default</IonicButton>
<IonicButton disabled={true}>Disabled</IonicButton>

// Outline (borda)
<IonicButton variant="outline">Outline</IonicButton>

// Clear (apenas texto)
<IonicButton variant="clear">Clear</IonicButton>

// Fill (preenchimento suave)
<IonicButton variant="fill">Fill</IonicButton>
```

### Cores Disponíveis
```tsx
// Cores do sistema
<IonicButton color="primary">Primary</IonicButton>
<IonicButton color="secondary">Secondary</IonicButton>
<IonicButton color="success">Success</IonicButton>
<IonicButton color="warning">Warning</IonicButton>
<IonicButton color="danger">Danger</IonicButton>
```

### Tamanhos
```tsx
<IonicButton size="small">Small</IonicButton>
<IonicButton size="default">Default</IonicButton>
<IonicButton size="large">Large</IonicButton>
```

## 📋 Exemplo no Admin Panel

### Seção Responsáveis
- **Toggle de Aprovados**: Verde quando ativo, mostra labels ON/OFF
- **Toggle de Pendentes**: Amarelo quando ativo, mostra labels ON/OFF
- **Controles Rápidos**: Botões Ionic para filtros rápidos
- **Tabela**: Botões Ionic para ações (Email, Aprovar, Bloquear)

### Seção Bolsistas
- **Mesma configuração da seção responsáveis**:
  - Toggle de Aprovados/Pendentes com ON/OFF
  - Controles rápidos com botões Ionic
  - Tabela com ações usando componentes Ionic

### Seção Atribuir
- **Header estilo Ionic**: Com botões para alternar entre views
- **Accordion Ionic**: Três seções expansíveis:
  1. **Promover para Responsável**: Lista usuários disponíveis
  2. **Gerenciar Bolsistas**: Visualiza bolsistas ativos
  3. **Relatório de Atribuições**: Estatísticas em cards
- **Footer estilo Ionic**: Com informações do sistema
- **Duas Views**:
  - **Atribuir**: Interface com accordion para atribuições
  - **Listar Atribuições**: Tabela completa de todas as atribuições

### Funcionalidades do Accordion
- **Expansão suave**: Animações CSS configuradas
- **Visual Ionic**: Cores e estilos fiéis ao framework
- **Badges informativos**: Contadores em cada seção
- **Botões integrados**: Atribuir/Cancelar lado a lado

## 🎨 Funcionalidades

### Lógica dos Filtros
1. **Ambos habilitados**: Mostra todos os responsáveis
2. **Apenas Aprovados**: Mostra só os com status "liberado"
3. **Apenas Pendentes**: Mostra só os com status "pendente"
4. **Ambos desabilitados**: Não mostra nada

### Estados Visuais
- **Toggle Verde**: Filtro de aprovados ativo
- **Toggle Amarelo**: Filtro de pendentes ativo
- **Toggle Cinza**: Filtro desabilitado
- **Labels ON/OFF**: Indicam claramente o estado

### Feedback Visual
- **Badges**: Mostram quais filtros estão ativos
- **Contador**: Mostra quantos itens estão sendo exibidos
- **Alerta**: Avisa quando todos os filtros estão desabilitados

## 🛠️ Como Implementar

1. **Importe os componentes**:
```tsx
import { IonicToggle } from "@/components/ui/ionic-toggle";
import { IonicButton } from "@/components/ui/ionic-button";
import { 
  IonicAccordionGroup, 
  IonicAccordion, 
  IonicAccordionTrigger, 
  IonicAccordionContent,
  IonicItem,
  IonicLabel
} from "@/components/ui/ionic-accordion";
```

2. **Use os toggles para filtros**:
```tsx
<IonicToggle 
  checked={showAprovados}
  onCheckedChange={setShowAprovados}
  enableOnOffLabels={true}
/>
```

3. **Use os botões para ações**:
```tsx
<IonicButton 
  variant="default" 
  color="success" 
  size="small"
  onClick={handleAction}
>
  Ação
</IonicButton>
```

4. **Use o accordion para organização**:
```tsx
<IonicAccordionGroup expand="inset">
  <IonicAccordion value="section1">
    <IonicAccordionTrigger color="light">
      <IonicItem>
        <IonicLabel>Seção 1</IonicLabel>
      </IonicItem>
    </IonicAccordionTrigger>
    <IonicAccordionContent>
      Conteúdo da seção
    </IonicAccordionContent>
  </IonicAccordion>
</IonicAccordionGroup>
```

## ✨ Vantagens

- **Visual Familiar**: Interface similar ao Ionic
- **Totalmente Funcional**: Estados, cores e variantes
- **Acessível**: Baseado nos componentes Radix UI
- **Customizável**: Usando Tailwind CSS
- **TypeScript**: Tipagem completa

Os componentes mantêm a estética do Ionic mas são totalmente compatíveis com o ecosistema React + Tailwind CSS do projeto!
