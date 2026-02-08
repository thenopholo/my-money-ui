# 💸 My Money UI

Frontend do [**My Money**](https://github.com/thenopholo/my-money) — um planejador financeiro pessoal que resolve um problema real: **saber quanto entra, quanto sai e quanto sobra no fim do mês**.

Sem dashboards mirabolantes cheios de indicadores que só um analista financeiro entenderia. Sem KPIs obscuros. Sem dezenas de features que você nunca vai usar. Aqui a proposta é simples: você registra suas contas, lança receitas e despesas, e o app te mostra o cenário. Ponto.

> **Nota:** Este repositório contém apenas o **frontend** (React + TypeScript). O backend em Go está em [thenopholo/my-money](https://github.com/thenopholo/my-money).

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura — MVVM](#-arquitetura--mvvm)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Exemplos de Código](#-exemplos-de-código)
- [Design System](#-design-system)
- [Roteamento e Proteção de Rotas](#-roteamento-e-proteção-de-rotas)
- [Como Rodar](#-como-rodar)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Roadmap](#-roadmap)

---

## 🎯 Visão Geral

O My Money nasceu de uma frustração pessoal: a maioria dos apps financeiros são complexos demais para quem só quer responder três perguntas:

1. **Quanto eu ganho?**
2. **Quanto eu gasto?**
3. **Sobra alguma coisa?**

O frontend consome uma API REST escrita em Go (com PostgreSQL, sqlc e autenticação JWT) e apresenta tudo em uma interface dark-mode, limpa e direta.

---

## ✨ Funcionalidades

| Módulo               | O que faz                                                        |
| -------------------- | ---------------------------------------------------------------- |
| **Dashboard**        | Resumo do mês: saldo total, receitas, despesas e taxa de economia |
| **Contas Bancárias** | CRUD de contas (corrente/poupança) com saldo individual          |
| **Transações**       | Lançamento de receitas e despesas por conta                      |
| **Cartões de Crédito** | Cadastro de cartões, faturas e transações parceladas           |
| **Categorias**       | Categorias customizáveis com cores e ícones                      |
| **Receitas Planejadas** | Receitas recorrentes (salário, freelance, etc.)               |
| **Despesas Planejadas** | Despesas fixas (aluguel, internet, etc.)                      |
| **Autenticação**     | Login/registro com JWT e rotas protegidas                        |

---

## 🛠 Stack Tecnológica

| Tecnologia              | Versão   | Papel                                         |
| ----------------------- | -------- | ---------------------------------------------- |
| **React**               | 19       | Biblioteca de UI                               |
| **TypeScript**          | ~5.9     | Tipagem estática com strict mode               |
| **Vite**                | 7        | Build tool e dev server                        |
| **Tailwind CSS**        | 4        | Estilização utility-first com `@theme`         |
| **React Router DOM**    | 7        | Roteamento SPA                                 |
| **Lucide React**        | 0.563+   | Ícones SVG                                     |
| **ESLint**              | 9        | Linting (sem Prettier — ESLint cuida de tudo)  |

**Zero dependências de estado externo** — sem Redux, sem Zustand, sem Jotai. O gerenciamento de estado usa apenas `useState`, `useContext` e `useCallback` nativos do React.

**Zero dependências de HTTP externo** — sem Axios, sem Ky. O cliente HTTP é um wrapper tipado sobre a Fetch API nativa.

---

## 🏛 Arquitetura — MVVM

O projeto segue o padrão **MVVM (Model-View-ViewModel)** adaptado para React, com separação clara de responsabilidades em 4 camadas:

```
Views → ViewModels → Services → Models
  ↓                      ↓
  └─── Components   Utils (transversal)
```

### Models (`src/models/`)

Tipos puros. Nenhuma lógica. Definem o contrato de dados entre frontend e backend.

- `entities.ts` — entidades de domínio (`User`, `BankAccount`, `Transaction`, `CreditCard`, etc.)
- `dtos.ts` — DTOs de request/response (`LoginRequest`, `CreateAccountRequest`, `ApiError`, etc.)
- `enums.ts` — union types de domínio (`AccountType`, `TransactionType`, `InvoiceStatus`, `Recurrence`)

### Services (`src/services/`)

Comunicação HTTP pura. Funções stateless que recebem dados tipados e retornam `Promise<T>`.

- `http-client.ts` — cliente HTTP centralizado com `get<T>`, `post<T>`, `put<T>`, `del<T>`, autenticação Bearer automática e classe de erro customizada `ApiRequestError`.
- Um arquivo por domínio: `auth.service.ts`, `accounts.service.ts`, `transactions.service.ts`, etc.

### ViewModels (`src/viewmodels/`)

Lógica de tela implementada como **custom hooks**. Orquestram estado, chamadas a services e tratamento de erros.

- `useLoginViewModel`, `useDashboardViewModel`, `useAccountsViewModel`, etc.
- `auth.viewmodel.tsx` — caso especial: contém o `AuthProvider` (Context API) e o hook `useAuth` para autenticação global.

### Views (`src/views/`)

Camada puramente visual. Views são "burras" — delegam toda lógica ao ViewModel.

- `pages/` — páginas completas (`DashboardPage`, `AccountsPage`, `LoginPage`, etc.)
- `components/` — componentes reutilizáveis (`SummaryCard`, `ProtectedRoute`, `CreditCardVisual`, etc.)
- `layouts/` — layouts de página (`AppLayout`, `AuthLayout`, `Header`, `Sidebar`)

### Regra de Ouro

> **Views nunca importam Services. Services nunca importam ViewModels. A dependência flui sempre para baixo.**

---

## 📁 Estrutura de Pastas

```
my-money-ui/
├── public/
├── src/
│   ├── App.tsx                          # Componente raiz — definição de rotas
│   ├── main.tsx                         # Entrypoint — monta App com AuthProvider
│   ├── index.css                        # Tema Tailwind v4 (@theme)
│   ├── models/
│   │   ├── entities.ts                  # Entidades de domínio
│   │   ├── dtos.ts                      # DTOs de request/response
│   │   └── enums.ts                     # Union types
│   ├── services/
│   │   ├── http-client.ts               # Cliente HTTP centralizado (fetch)
│   │   ├── auth.service.ts              # Autenticação
│   │   ├── accounts.service.ts          # Contas bancárias
│   │   ├── transactions.service.ts      # Transações
│   │   ├── credit-cards.service.ts      # Cartões de crédito
│   │   ├── credit-card-transactions.service.ts
│   │   ├── invoices.service.ts          # Faturas
│   │   ├── categories.service.ts        # Categorias
│   │   ├── planned-incomes.service.ts   # Receitas planejadas
│   │   ├── planned-expenses.service.ts  # Despesas planejadas
│   │   └── user.service.ts              # Usuário
│   ├── viewmodels/
│   │   ├── auth.viewmodel.tsx           # AuthProvider + useAuth (Context)
│   │   ├── login.viewmodel.ts
│   │   ├── register.viewmodel.ts
│   │   ├── dashboard.viewmodel.ts
│   │   ├── accounts.viewmodel.ts
│   │   ├── categories.viewmodel.ts
│   │   ├── credit-cards.viewmodel.ts
│   │   ├── planned-incomes.viewmodel.ts
│   │   └── planned-expenses.viewmodel.ts
│   ├── views/
│   │   ├── pages/                       # 9 páginas
│   │   ├── components/                  # 12 componentes reutilizáveis
│   │   └── layouts/                     # AppLayout, AuthLayout, Header, Sidebar
│   └── utils/
│       ├── currency.ts                  # Formatação de moeda (pt-BR / BRL)
│       ├── date.ts                      # Utilitários de data
│       ├── card-brands.ts               # Mapeamento de bandeiras de cartão
│       ├── category-colors.ts           # Cores de categorias
│       ├── category-icons.ts            # Ícones de categorias
│       └── recurrence.ts               # Labels de recorrência
├── eslint.config.js
├── tsconfig.json / tsconfig.app.json
├── vite.config.ts
└── package.json
```

---

## 💡 Exemplos de Código

### HTTP Client — Fetch API tipado e centralizado

O coração da comunicação com a API. Sem dependência externa, sem Axios — apenas `fetch` nativo com generics TypeScript para segurança de tipos:

```typescript
// src/services/http-client.ts

export class ApiRequestError extends Error {
  status: number;
  body: ApiError;

  constructor(status: number, body: ApiError) {
    super(body.error);
    this.name = "ApiRequestError";
    this.status = status;
    this.body = body;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }
  const body = await response.json();
  if (!response.ok) {
    throw new ApiRequestError(response.status, body as ApiError);
  }
  return body as T;
}

export async function get<T>(path: string, authenticated = true): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: buildHeaders(authenticated),
  });
  return handleResponse<T>(response);
}
```

**Destaques técnicos:**
- Generics `<T>` garantem tipagem end-to-end do service até a view
- `ApiRequestError` customizado carrega o `status` HTTP e o `body` da API, permitindo tratamento granular no ViewModel
- `buildHeaders` injeta automaticamente o Bearer token do `localStorage`
- Parâmetro `authenticated` permite desabilitar auth para rotas públicas (`/auth/login`, `/auth/register`)

---

### Service — Funções stateless e tipadas

Cada domínio tem seu service com funções puras que mapeiam 1:1 para endpoints da API:

```typescript
// src/services/accounts.service.ts

import { del, get, post, put } from "./http-client.ts";
import type { CreateAccountRequest, UpdateAccountRequest } from "../models/dtos.ts";
import type { BankAccount } from "../models/entities.ts";

export function createAccount(data: CreateAccountRequest): Promise<BankAccount> {
  return post<BankAccount>("/api/accounts", data);
}

export function listAccounts(): Promise<BankAccount[]> {
  return get<BankAccount[]>("/api/accounts");
}

export function updateAccount(id: string, data: UpdateAccountRequest): Promise<BankAccount> {
  return put<BankAccount>(`/api/accounts/${id}`, data);
}

export function deleteAccount(id: string): Promise<void> {
  return del(`/api/accounts/${id}`);
}
```

**Destaques técnicos:**
- Zero estado. Zero hooks. Zero React. Puro TypeScript.
- Retorno sempre `Promise<T>` com tipo explícito — sem `any` em nenhum lugar
- `import type` separa importações de tipos (habilitado via `verbatimModuleSyntax`)

---

### ViewModel — Custom Hook com padrão loading/error/data

ViewModels encapsulam toda lógica de tela. A view nunca toca em services diretamente:

```typescript
// src/viewmodels/accounts.viewmodel.ts

export function useAccountsViewModel() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadAccounts = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const data = await listAccounts();
      setAccounts(data);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("Erro ao carregar contas.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  // ... handleCreate, handleUpdate, handleDelete

  return { accounts, loading, saving, error, loadAccounts, handleCreate, handleUpdate, handleDelete };
}
```

**Destaques técnicos:**
- Padrão consistente `loading`/`error`/`data` em todos os viewmodels
- Tratamento de erro tipado com `instanceof ApiRequestError`
- `useCallback` para estabilidade referencial (evita re-renders desnecessários)
- A view recebe apenas dados prontos e callbacks — nunca lida com `try/catch`

---

### Autenticação — Context API com Provider e Hook tipado

O `AuthProvider` gerencia o estado global de autenticação com Context API puro:

```typescript
// src/viewmodels/auth.viewmodel.tsx

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadStoredUser);

  const login = useCallback(async (data: LoginRequest) => {
    const res = await authService.login(data);
    setToken(res.token);
    const u: User = { id: res.id, name: res.name, email: res.email, created_at: "", updated_at: "" };
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext value={{ user, isLoading: false, login, register, logout }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
```

**Destaques técnicos:**
- `createContext<T | null>(null)` com hook de acesso que valida presença do Provider
- Persistência de sessão via `localStorage` (token + dados do usuário)
- Callbacks memoizados com `useCallback` para evitar re-renders em consumers
- Interface `AuthContextValue` tipada — qualquer componente sabe exatamente o que pode consumir

---

### View — Componente "burro" que delega ao ViewModel

A página apenas consome o hook do ViewModel e renderiza. Sem lógica de negócio:

```tsx
// src/views/pages/DashboardPage.tsx

export function DashboardPage() {
  const {
    accounts, recentTransactions, totalBalance,
    monthIncome, monthExpense, savingsRate,
    creditCards, spentByCard, cardSpendingByCategory, loading,
  } = useDashboardViewModel();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Saldo Total" value={formatCurrency(totalBalance)} icon={<DollarSign />} color="text-primary" />
        <SummaryCard title="Receitas do Mês" value={formatCurrency(monthIncome)} icon={<TrendingUp />} color="text-income" />
        <SummaryCard title="Despesas do Mês" value={formatCurrency(monthExpense)} icon={<TrendingDown />} color="text-expense" />
        <SummaryCard title="Taxa de Economia" value={`${savingsRate.toFixed(1)}%`} icon={<Percent />} color="text-primary" />
      </div>
      {/* ... seções de contas, cartões e transações recentes */}
    </div>
  );
}
```

---

## 🎨 Design System

O projeto é **dark-only** por design, com tema customizado via Tailwind CSS v4 `@theme`:

```css
/* src/index.css */
@theme {
  --font-sans: "Kode Mono", monospace;

  --color-background: #0b0b0f;     /* Fundo principal */
  --color-surface: #14141a;         /* Cards, sidebar, header */
  --color-surface-hover: #1c1c24;   /* Hover em superfícies */
  --color-surface-light: #23232e;   /* Inputs, itens de lista */

  --color-primary: #22c55e;         /* Verde — ações positivas, receitas */
  --color-danger: #ef4444;          /* Vermelho — erros, despesas */

  --color-text-primary: #f1f1f1;
  --color-text-secondary: #a1a1aa;
  --color-text-muted: #52525b;

  --color-income: #22c55e;          /* Verde — receitas */
  --color-expense: #ef4444;         /* Vermelho — despesas */
  --color-border: #27272a;
}
```

**Padrões visuais:**

| Elemento         | Classes Tailwind                                                                     |
| ---------------- | ------------------------------------------------------------------------------------ |
| Card             | `rounded-xl bg-surface border border-border p-6`                                    |
| Input            | `w-full rounded-lg bg-surface-light border border-border px-4 py-2.5 text-sm`       |
| Botão primário   | `rounded-lg bg-primary hover:bg-primary-hover text-background font-semibold py-2.5` |
| Spinner          | `h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent`    |
| Texto de erro    | `text-sm text-danger`                                                                |

---

## 🗺 Roteamento e Proteção de Rotas

Rotas definidas centralizadamente em `App.tsx` com **React Router DOM v7**:

```
/ (fallback) → redireciona para /dashboard
├── Rotas públicas (AuthLayout)
│   ├── /login
│   └── /register
└── Rotas protegidas (ProtectedRoute → AppLayout)
    ├── /dashboard
    ├── /accounts
    ├── /transactions
    ├── /credit-cards
    ├── /categories
    ├── /planned-incomes
    └── /planned-expenses
```

O `ProtectedRoute` verifica o estado de autenticação via `useAuth()`. Se não há usuário logado, redireciona para `/login` com `replace` (sem poluir o histórico):

```tsx
// src/views/components/ProtectedRoute.tsx

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
```

---

## 🚀 Como Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [npm](https://www.npmjs.com/) 9+
- Backend [my-money](https://github.com/thenopholo/my-money) rodando na porta `4235` (ou configurar `VITE_API_BASE_URL`)

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/thenopholo/my-money-ui.git
cd my-money-ui

# Instalar dependências
npm install

# Criar arquivo de ambiente (opcional — fallback é localhost:4235)
echo "VITE_API_BASE_URL=http://localhost:4235" > .env

# Iniciar dev server
npm run dev
```

O app estará disponível em `http://localhost:3000`.

---

## 📜 Scripts Disponíveis

| Script           | Comando              | Descrição                                          |
| ---------------- | -------------------- | -------------------------------------------------- |
| `npm run dev`    | `vite`               | Inicia o dev server com HMR na porta 3000          |
| `npm run build`  | `tsc -b && vite build` | Type-check + build de produção                   |
| `npm run lint`   | `eslint .`           | Verifica erros de lint no projeto inteiro           |
| `npm run preview`| `vite preview`       | Serve o build de produção localmente               |

---

## 🔐 Variáveis de Ambiente

| Variável               | Obrigatória | Default                   | Descrição                    |
| ---------------------- | ----------- | ------------------------- | ---------------------------- |
| `VITE_API_BASE_URL`   | Não         | `http://localhost:4235`   | URL base da API backend      |

> Variáveis client-side no Vite precisam do prefixo `VITE_`. Nunca exponha secrets aqui.


## 🔗 Repositórios Relacionados

| Repositório | Descrição |
| ----------- | --------- |
| [**my-money**](https://github.com/thenopholo/my-money) | API REST em Go — PostgreSQL, sqlc, JWT, Docker |
| **my-money-ui** (este) | Frontend React — TypeScript, Tailwind, MVVM |

---

<p align="center">
  Feito com ☕ e <code>useState</code> por <a href="https://github.com/thenopholo">@thenopholo</a>
</p>
