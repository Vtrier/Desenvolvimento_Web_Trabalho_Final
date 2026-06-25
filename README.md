# TaskFlow

Sistema completo de gerenciamento de tarefas construído com **Next.js 14**, **TypeScript**, **Firebase** e **Tailwind CSS**. Inclui autenticação completa, CRUD de tarefas com subtarefas, dashboard com gráficos, quadro Kanban com drag-and-drop e calendário de vencimentos.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Firebase](https://img.shields.io/badge/Firebase-10-orange)

---

## Índice

- [Funcionalidades](#funcionalidades)
- [Stack tecnológico](#stack-tecnológico)
- [Pré-requisitos](#pré-requisitos)
- [Guia de instalação passo a passo](#guia-de-instalação-passo-a-passo)
- [Configuração do Firebase](#configuração-do-firebase)
- [Scripts disponíveis](#scripts-disponíveis)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Deploy na Vercel](#deploy-na-vercel)
- [Solução de problemas comuns](#solução-de-problemas-comuns)

---

## Funcionalidades

- ✅ Cadastro de usuário com validação de senha forte (Zod + React Hook Form)
- ✅ Login por e-mail/senha com verificação obrigatória de e-mail
- ✅ Login social via Google e GitHub
- ✅ Exclusão de conta com re-autenticação
- ✅ CRUD completo de tarefas (criar, listar, editar, excluir)
- ✅ Subtarefas com barra de progresso calculada automaticamente
- ✅ Dashboard com métricas e gráficos (status, prioridade, atividade recente)
- ✅ Quadro Kanban com drag-and-drop (Dnd Kit)
- ✅ Calendário de vencimentos (FullCalendar)
- ✅ Landing page responsiva com animações (Framer Motion)
- ✅ Tema escuro em toda a aplicação

---

## Stack tecnológico

| Categoria | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript |
| Backend / Auth | Firebase Authentication + Firestore |
| Estilização | Tailwind CSS |
| Formulários | React Hook Form + Zod |
| Gráficos | Recharts |
| Drag & Drop | Dnd Kit |
| Calendário | FullCalendar |
| Animações | Framer Motion |
| Ícones | Lucide React |
| Notificações | Sonner |

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** versão 18 ou superior → [nodejs.org](https://nodejs.org)
- **npm** (já vem com o Node.js)
- **Git** → [git-scm.com](https://git-scm.com)
- Uma conta Google para criar o projeto no **Firebase Console**

Verifique sua versão do Node.js:

```bash
node -v
```

---

## Guia de instalação passo a passo

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/taskflow.git
cd taskflow
```

### 2. Instalar as dependências

```bash
npm install
```

Isso instala todas as dependências listadas no `package.json`, incluindo Firebase, React Hook Form, Zod, Tailwind, Dnd Kit, FullCalendar, Framer Motion e Recharts.

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
touch .env.local
```

Cole o conteúdo abaixo, substituindo pelos valores do seu projeto Firebase (veja a seção [Configuração do Firebase](#configuração-do-firebase) para saber onde encontrá-los):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

> ⚠️ **Nunca** faça commit do `.env.local`. Ele já está incluído no `.gitignore` padrão do Next.js.

### 4. Executar o projeto localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador. Você deve ser redirecionado automaticamente para a tela de login.

---

## Configuração do Firebase

### 4.1 Criar o projeto

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **"Adicionar projeto"**
3. Dê um nome (ex: `taskflow`) e siga os passos (Google Analytics é opcional)

### 4.2 Registrar um app Web

1. Na tela inicial do projeto, clique no ícone **`</>`** (Web)
2. Dê um nome ao app (ex: `taskflow-web`) e clique em **"Registrar app"**
3. Copie o objeto `firebaseConfig` exibido — esses valores vão para o seu `.env.local`

Esses valores também podem ser encontrados depois em:
**Configurações do projeto → Geral → Seus apps → SDK e configuração**

### 4.3 Ativar o Firestore Database

1. Menu lateral → **Build → Firestore Database**
2. Clique em **"Criar banco de dados"**
3. Selecione o modo **Produção** (ou Teste, para desenvolvimento)
4. Escolha a região mais próxima (ex: `southamerica-east1`)

### 4.4 Ativar a Authentication

No menu lateral, vá em **Build → Authentication → Sign-in method** e ative os seguintes provedores:

**Email/Senha**
1. Clique em "Email/senha"
2. Ative a primeira opção
3. Salve

**Google**
1. Clique em "Google"
2. Ative e informe um e-mail de suporte
3. Salve

**GitHub**
1. Acesse [github.com/settings/developers](https://github.com/settings/developers) → **New OAuth App**
2. Preencha:
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** copie a URL exibida pelo Firebase ao clicar em "GitHub" na lista de provedores
3. Gere o **Client Secret**
4. Cole o **Client ID** e **Client Secret** de volta no Firebase Console
5. Salve

### 4.5 Autorizar domínios

Em **Authentication → Settings → Authorized domains**, confirme que `localhost` está na lista (já vem por padrão). Ao publicar em produção, adicione também o domínio da Vercel (ex: `taskflow.vercel.app`).

### 4.6 Índice composto do Firestore

A consulta de tarefas usa `where("userId") + orderBy("createdAt")`, que exige um índice composto. Na primeira execução, um erro no console do navegador vai trazer um link direto para criar esse índice automaticamente. Basta clicar nele e confirmar.

Alternativamente, crie manualmente em **Firestore → Indexes → Composite → Add index**:

| Campo | Ordem |
|---|---|
| `userId` | Ascending |
| `createdAt` | Descending |

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento em `localhost:3000` |
| `npm run build` | Gera a build de produção |
| `npm run start` | Executa a build de produção localmente |
| `npm run lint` | Executa o linter do projeto |

---

## Estrutura de pastas

```
src/
├── app/                      # Rotas (Next.js App Router)
│   ├── layout.tsx             # Layout raiz (AuthProvider + TasksProvider)
│   ├── globals.css            # Estilos globais e tema dark
│   ├── login/                 # Tela de login
│   ├── register/              # Tela de cadastro
│   ├── dashboard/              # Dashboard com métricas e gráficos
│   ├── tasks/                  # CRUD completo de tarefas
│   ├── kanban/                 # Quadro Kanban
│   └── calendar/                # Calendário de vencimentos
│
├── components/
│   ├── auth/                   # Login, cadastro, exclusão de conta
│   ├── tasks/                   # Card, formulário, filtros, subtarefas
│   ├── dashboard/                # Stats, gráficos, tarefas recentes/vencidas
│   ├── kanban/                   # Coluna, card, modal
│   ├── calendar/                  # View do calendário, modal
│   └── landing/                    # Navbar, hero, features, footer
│
├── services/                   # Acesso a dados (Firebase)
│   ├── auth.service.ts
│   └── task.service.ts
│
├── lib/
│   ├── firebase.ts              # Inicialização do SDK
│   └── validations.ts            # Schemas Zod
│
├── hooks/
│   └── useAuthActions.ts
│
├── types/
│   ├── user.ts
│   └── task.ts
│
├── contexts/
│   ├── AuthContext.tsx           # Estado global de autenticação
│   └── TasksContext.tsx           # Estado global de tarefas
│
└── middleware.ts                  # Proteção de rotas
```

---

## Deploy na Vercel

1. Conecte o repositório GitHub na [Vercel](https://vercel.com) (**Add New Project**)
2. Em **Settings → Environment Variables**, adicione as mesmas variáveis do seu `.env.local`
3. No Firebase Console, adicione o domínio gerado pela Vercel em **Authorized domains**
4. Se estiver usando login via GitHub, atualize a **Authorization callback URL** do OAuth App para incluir:
   ```
   https://seu-projeto.firebaseapp.com/__/auth/handler
   ```
5. Faça o deploy e teste login, cadastro e CRUD em produção

---

## Solução de problemas comuns

| Erro | Causa provável | Solução |
|---|---|---|
| `auth/configuration-not-found` | `.env.local` ausente ou incorreto | Verifique se o arquivo existe e foi salvo corretamente |
| `auth/unauthorized-domain` | Domínio não autorizado no Firebase | Adicione o domínio em Authentication → Settings → Authorized domains |
| Popup do Google fecha sem logar | Bloqueio de popup do navegador | Permita popups para o domínio nas configurações do navegador |
| Página 404 ao acessar `/` | Falta o arquivo `src/app/page.tsx` | Crie a página raiz com redirect para `/login` |
| CSS não aplica / aparece sem estilo | `globals.css` incorreto ou `postcss.config.js` ausente | Verifique se ambos os arquivos existem na raiz/app conforme a estrutura |
| Gráficos com texto preto no fundo escuro | Falta `darkMode: "class"` no Tailwind | Adicione no `tailwind.config.ts` e a classe `dark` no `<html>` |
| Erro de índice no Firestore | Consulta composta sem índice criado | Clique no link de erro no console para criar automaticamente |

---

## Feito por:

João Bernardo Porto, João Gabriel de Araújo e Vítor Hugo Trierveiler
