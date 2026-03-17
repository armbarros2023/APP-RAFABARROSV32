# Redesign Clinico Premium com Shell Profissional

Data: 2026-03-17
Projeto: `app-rafabarrosv32`
Status: aprovado para especificacao

## 1. Contexto

O projeto atual combina um frontend React/Vite com um backend Node/Express/Prisma no mesmo repositorio. O sistema compila, mas a experiencia visual e de produto ainda transmite sinais de prototipo:

- shell visual inconsistente entre telas
- dashboard com cards e blocos sem hierarquia forte
- base HTML com artefatos de prototipacao
- paginas com estilos heterogeneos
- varios modulos ainda suportados por `mock` e `localStorage`

O objetivo desta rodada nao e concluir a migracao funcional completa para backend. O foco e elevar o frontend para um nivel visual e experiencial mais profissional, moderno e coerente.

## 2. Decisoes validadas com o usuario

Direcao visual escolhida:

- linguagem visual: `Clinico Premium`
- estrutura de interface: `Shell Profissional`

Interpretacao pratica dessas decisoes:

- atmosfera sofisticada, limpa e humana
- identidade de saude premium, sem parecer sistema generico
- navegacao lateral refinada e persistente
- area principal com mais respiro, composicao editorial e cards mais nobres
- foco em legibilidade, clareza de uso e sensacao de produto maduro

## 3. Objetivos desta rodada

1. Modernizar o app shell para dar unidade visual ao sistema.
2. Redesenhar as telas de maior impacto percebido:
   - login
   - dashboard
   - sidebar e navegacao
   - componentes base de UI
3. Corrigir detalhes que reduzem a percepcao de qualidade:
   - referencia quebrada a `index.css`
   - resquicios de prototipacao no `index.html`
   - estados de loading pouco trabalhados
   - contraste e espacamento inconsistentes
4. Melhorar a experiencia para testes e iteracao visual local, deixando a interface mais fluida.

## 4. Nao objetivos desta rodada

Os itens abaixo sao importantes, mas nao serao tratados como eixo principal nesta fase:

- migrar todos os modulos de `mock/localStorage` para API real
- reestruturar completamente o backend
- concluir autenticacao Google
- eliminar toda a divida tecnica do repositorio
- redesenhar todas as paginas secundarias com o mesmo nivel de profundidade do dashboard

Esses pontos podem receber ajustes pontuais quando impactarem diretamente o redesign.

## 5. Diagnostico sintetico do estado atual

### Frontend

- `App.tsx` define a navegacao principal e ja usa lazy loading, mas o shell atual tem pouca identidade.
- `components/navigation/Sidebar.tsx` funciona, porem ainda transmite um visual simples demais para o objetivo do produto.
- `pages/DashboardPage.tsx` mistura blocos operacionais com mock visual pouco refinado.
- `pages/LoginPage.tsx` usa um layout funcional, mas com acabamento visual limitado.
- `index.html` ainda carrega configuracoes e artefatos de prototipacao, inclusive `index.css` inexistente.

### Backend e integracao

- o backend esta funcionalmente separado em `backend/`
- o frontend conversa com parte da API, mas varios modulos seguem em persistencia local
- isso limita o ganho funcional desta rodada, entao o redesign precisa priorizar consistencia de experiencia

## 6. Direcao de design

### 6.1 Identidade visual

Paleta base:

- teal/verde clinico como cor principal
- fundos claros com profundidade suave
- acentos frios para informacao e destaque
- uso restrito de cores de alerta para status reais

Tom visual:

- institucional e contemporaneo
- acolhedor sem ficar infantil
- premium sem parecer luxuoso demais

### 6.2 Composicao

- sidebar fixa com acabamento superior ao atual
- topo contextual com titulo, subtitulo e acoes rapidas
- cards com sombras suaves, bordas limpas e densidade controlada
- hero leve no dashboard para elevar a primeira impressao
- metricas com mais hierarquia visual e leitura imediata

### 6.3 Tipografia e microinteracao

- evitar aparencia padrao de prototipo
- melhorar escala tipografica entre labels, titulos, KPIs e textos auxiliares
- hover, foco e transicoes mais suaves e intencionais
- loaders com aparencia de produto, nao apenas fallback tecnico

## 7. Escopo tecnico de implementacao

### 7.1 Arquivos principais a revisar

- `index.html`
- `App.tsx`
- `components/navigation/Sidebar.tsx`
- `components/ui/Card.tsx`
- `components/ui/Button.tsx`
- `components/ui/Input.tsx`
- `components/ui/Select.tsx`
- `pages/LoginPage.tsx`
- `pages/DashboardPage.tsx`
- componentes auxiliares de contexto/tema, se necessario

### 7.2 Mudancas estruturais previstas

1. Consolidar tokens visuais na base Tailwind/configuracao HTML.
2. Reorganizar o shell principal para melhor leitura e navegacao.
3. Criar componentes reutilizaveis mais fortes para:
   - metric card
   - section header
   - quick action
   - panel container
4. Atualizar o dashboard de admin e terapeuta para a nova linguagem.
5. Refinar a tela de login para parecer parte do mesmo produto.
6. Remover ou neutralizar sinais de prototipo obvios no HTML base.

## 8. Fluxo e experiencia

### Login

- entrada mais elegante e confiavel
- melhor distribuicao visual entre formulario, identidade e mensagens
- foco em clareza de acesso

### Navegacao autenticada

- sidebar com estado ativo mais claro
- rodape e area de usuario mais refinados
- melhor leitura da filial ativa e acoes globais

### Dashboard

- hero sutil com contexto da clinica/filial
- KPIs com visual premium e leitura rapida
- agenda, avisos e acoes rapidas organizados por prioridade
- versao de terapeuta mais leve, menos improvisada e mais profissional

## 9. Tratamento de risco

### Risco 1: visual novo em cima de base funcional heterogenea

Mitigacao:

- concentrar o redesign em shell, dashboard e componentes base
- evitar prometer consistencia funcional total em modulos ainda mockados

### Risco 2: regressao visual em telas existentes

Mitigacao:

- reaproveitar componentes base em vez de estilizar tela por tela sem criterio
- validar com build ao final

### Risco 3: excesso de estetica e perda de usabilidade

Mitigacao:

- priorizar legibilidade, contraste e acesso rapido
- usar hero e efeitos com moderacao

## 10. Testes e validacao

Validacoes minimas desta rodada:

1. `npm run build` no frontend
2. revisao visual dos fluxos principais:
   - login
   - dashboard admin
   - dashboard terapeuta
   - navegacao lateral
3. verificacao de responsividade basica em layout principal

Limitacoes conhecidas:

- o repositorio nao possui suite de testes frontend estruturada
- parte relevante dos dados ainda e local/mock

## 11. Entregavel esperado

Ao final desta rodada, o aplicativo deve:

- parecer um produto profissional e moderno
- transmitir mais confianca no primeiro acesso
- ter uma navegacao mais coesa e elegante
- possuir dashboard e login significativamente melhores
- reduzir sinais visuais de prototipo

## 12. Proxima etapa apos aprovacao desta spec

Implementar o redesign priorizando:

1. base visual e shell
2. sidebar e navegacao
3. login
4. dashboard
5. limpeza dos artefatos visuais quebrados

