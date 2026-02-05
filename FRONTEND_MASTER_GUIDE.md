# 🎨 Guia de Desenvolvimento - Frontend da Plataforma Master

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Requisitos e Tecnologias](#-requisitos-e-tecnologias)
3. [Estrutura do Projeto](#-estrutura-do-projeto)
4. [Funcionalidades](#-funcionalidades)
5. [Telas e Componentes](#-telas-e-componentes)
6. [Integração com API](#-integração-com-api)
7. [Autenticação e Rotas](#-autenticação-e-rotas)
8. [Gerenciamento de Estado](#-gerenciamento-de-estado)
9. [Exemplos de Código](#-exemplos-de-código)
10. [UI/UX e Design](#-uiux-e-design)
11. [Segurança](#-segurança)
12. [Deploy e Configuração](#-deploy-e-configuração)

---

## 🎯 Visão Geral

### O que é a Plataforma Master?

A **Plataforma Master de Autenticação** é um painel administrativo web que permite ao **SUPER_ADMIN** gerenciar:

- ✅ **Usuários** de todas as plataformas do ecossistema TGOO
- ✅ **Plataformas** (criar, editar, ativar/desativar)
- ✅ **Configurações** globais do sistema de autenticação
- ✅ **Logs e auditoria** de acessos
- ✅ **Relatórios** de uso e estatísticas

### Objetivos

1. **Centralização**: Um único lugar para gerenciar todo o ecossistema
2. **Simplicidade**: Interface intuitiva e fácil de usar
3. **Segurança**: Acesso restrito apenas a SUPER_ADMIN
4. **Escalabilidade**: Suportar centenas de plataformas e milhares de usuários
5. **Responsividade**: Funcionar em desktop, tablet e mobile

### Público-Alvo

- **SUPER_ADMIN**: Administradores do ecossistema TGOO
- **Desenvolvedores**: Equipe técnica que precisa visualizar configurações

---

## 🛠️ Requisitos e Tecnologias

### Tecnologias Recomendadas

#### Stack Principal
```json
{
  "framework": "React 18+ com TypeScript",
  "build-tool": "Vite",
  "styling": "Tailwind CSS + Shadcn/ui",
  "state-management": "Zustand ou Context API",
  "routing": "React Router v6",
  "http-client": "Axios",
  "forms": "React Hook Form + Zod",
  "tables": "TanStack Table (React Table v8)",
  "charts": "Recharts ou Chart.js",
  "icons": "Lucide React",
  "notifications": "React Hot Toast"
}
```

#### Alternativas

**Vue.js:**
```json
{
  "framework": "Vue 3 + TypeScript + Composition API",
  "build-tool": "Vite",
  "styling": "Tailwind CSS + Headless UI",
  "state-management": "Pinia",
  "routing": "Vue Router 4",
  "forms": "VeeValidate + Zod"
}
```

**Next.js:**
```json
{
  "framework": "Next.js 14+ (App Router)",
  "styling": "Tailwind CSS + Shadcn/ui",
  "state-management": "Zustand",
  "forms": "React Hook Form + Zod"
}
```

### Requisitos Funcionais

#### 1. Autenticação
- [ ] Login como SUPER_ADMIN
- [ ] Persistência de sessão (localStorage/cookie)
- [ ] Renovação automática de token
- [ ] Logout
- [ ] Proteção de rotas

#### 2. Gerenciamento de Plataformas
- [ ] Listar todas as plataformas
- [ ] Criar nova plataforma
- [ ] Editar plataforma existente
- [ ] Ativar/Desativar plataforma
- [ ] Visualizar estatísticas por plataforma
- [ ] Pesquisar e filtrar plataformas

#### 3. Gerenciamento de Usuários
- [ ] Listar usuários de todas as plataformas
- [ ] Filtrar usuários por plataforma
- [ ] Criar novo usuário em qualquer plataforma
- [ ] Editar informações do usuário
- [ ] Alterar role (USER, ADMIN, SUPER_ADMIN)
- [ ] Alterar status (PENDING, ACTIVE, BLOCKED)
- [ ] Resetar senha do usuário
- [ ] Pesquisar usuários (email, nome, plataforma)

#### 4. Dashboard
- [ ] Visão geral do sistema
- [ ] Estatísticas principais (total de plataformas, usuários, etc.)
- [ ] Gráficos de crescimento
- [ ] Últimas atividades
- [ ] Alertas e notificações

#### 5. Configurações
- [ ] Perfil do SUPER_ADMIN
- [ ] Alterar senha
- [ ] Configurações de API
- [ ] Logs de acesso

### Requisitos Não-Funcionais

- **Performance**: Carregamento < 2s
- **Responsividade**: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- **Compatibilidade**: Chrome, Firefox, Safari, Edge (últimas 2 versões)
- **Acessibilidade**: WCAG 2.1 AA
- **Segurança**: HTTPS, tokens JWT, sanitização de inputs

---

## 📁 Estrutura do Projeto

### Estrutura Recomendada (React + TypeScript)

```
tgoo-auth-master-frontend/
├── public/
│   ├── favicon.ico
│   └── logo.svg
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── ui/                    # Componentes base (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   └── AuthLayout.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── ActivityChart.tsx
│   │   │   └── RecentActivity.tsx
│   │   ├── platforms/
│   │   │   ├── PlatformList.tsx
│   │   │   ├── PlatformCard.tsx
│   │   │   ├── PlatformForm.tsx
│   │   │   └── PlatformDialog.tsx
│   │   ├── users/
│   │   │   ├── UserList.tsx
│   │   │   ├── UserTable.tsx
│   │   │   ├── UserForm.tsx
│   │   │   ├── UserDialog.tsx
│   │   │   └── UserFilters.tsx
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── ConfirmDialog.tsx
│   │       └── StatusBadge.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Platforms.tsx
│   │   ├── Users.tsx
│   │   ├── Settings.tsx
│   │   └── NotFound.tsx
│   ├── services/
│   │   ├── api.ts              # Configuração do Axios
│   │   ├── auth.service.ts     # Serviços de autenticação
│   │   ├── platform.service.ts # Serviços de plataformas
│   │   └── user.service.ts     # Serviços de usuários
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePlatforms.ts
│   │   ├── useUsers.ts
│   │   └── useDebounce.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── platformStore.ts
│   │   └── userStore.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── platform.types.ts
│   │   ├── user.types.ts
│   │   └── api.types.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   ├── routes/
│   │   ├── index.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── PublicRoute.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .env.development
├── .env.production
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## ⚙️ Funcionalidades

### 1. Dashboard (Página Inicial)

**Objetivo**: Visão geral do ecossistema

**Elementos:**
- **Cards de Estatísticas**:
  - Total de Plataformas (Ativas / Inativas)
  - Total de Usuários (por role: USER, ADMIN, SUPER_ADMIN)
  - Novos usuários (últimos 7 dias)
  - Usuários pendentes de aprovação

- **Gráficos**:
  - Crescimento de usuários (linha do tempo)
  - Distribuição de usuários por plataforma (pizza)
  - Atividade de login (últimos 30 dias)

- **Atividade Recente**:
  - Últimos 10 usuários criados
  - Últimas plataformas adicionadas
  - Últimos logins de ADMIN/SUPER_ADMIN

- **Ações Rápidas**:
  - Criar nova plataforma
  - Adicionar usuário
  - Ver usuários pendentes
  - Ir para configurações

### 2. Gerenciamento de Plataformas

**Página: `/platforms`**

#### 2.1 Lista de Plataformas

**Tabela com colunas:**
- ID
- Código (code)
- Nome (name)
- Domínio (domain)
- Status (Ativa/Inativa)
- Master (Sim/Não)
- Total de Usuários
- Data de Criação
- Ações (Editar, Ativar/Desativar)

**Funcionalidades:**
- Pesquisar por código ou nome
- Filtrar por status (Todas, Ativas, Inativas)
- Ordenar por qualquer coluna
- Paginação (10, 25, 50, 100 por página)
- Ações em lote (ativar/desativar múltiplas)

#### 2.2 Criar/Editar Plataforma

**Formulário:**
```typescript
interface PlatformForm {
  code: string;          // Ex: "dressme"
  name: string;          // Ex: "DressMe"
  domain?: string;       // Ex: "dressme.tgoo.eu"
  description?: string;  // Descrição da plataforma
  isActive: boolean;     // Ativa/Inativa
  isMaster: boolean;     // Plataforma Master (apenas 1)
}
```

**Validações:**
- `code`: obrigatório, sem espaços, apenas letras minúsculas e underline
- `name`: obrigatório, mínimo 3 caracteres
- `domain`: formato de domínio válido (opcional)
- `isMaster`: avisar que só pode haver uma plataforma master

**Modal/Página:**
- Formulário em modal (para criar/editar rápido)
- Ou página dedicada (para edição detalhada)

#### 2.3 Detalhes da Plataforma

**Visualizar:**
- Informações completas da plataforma
- Lista de usuários desta plataforma
- Estatísticas (total de usuários por role)
- Logs de alterações
- Botão para adicionar usuário nesta plataforma

### 3. Gerenciamento de Usuários

**Página: `/users`**

#### 3.1 Lista de Usuários

**Tabela com colunas:**
- ID
- Email
- Nome Completo
- Plataforma (nome + código)
- Role (USER, ADMIN, SUPER_ADMIN)
- Status (PENDING, ACTIVE, BLOCKED)
- Data de Criação
- Último Login
- Ações (Editar, Resetar Senha, Ativar/Bloquear)

**Funcionalidades:**
- Pesquisar por email ou nome
- Filtrar por:
  - Plataforma (dropdown com todas)
  - Role (USER, ADMIN, SUPER_ADMIN, Todos)
  - Status (PENDING, ACTIVE, BLOCKED, Todos)
- Ordenar por qualquer coluna
- Paginação
- Ações em lote (aprovar múltiplos pendentes, bloquear, etc.)
- Exportar para CSV/Excel

#### 3.2 Criar/Editar Usuário

**Formulário:**
```typescript
interface UserForm {
  email: string;
  password?: string;      // Obrigatório na criação
  fullName?: string;
  platformId: number;     // Dropdown de plataformas
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'PENDING' | 'ACTIVE' | 'BLOCKED';
}
```

**Validações:**
- `email`: formato válido, único por plataforma
- `password`: mínimo 6 caracteres (criação)
- `platformId`: obrigatório
- `role`: avisar que SUPER_ADMIN só pode ser na plataforma master
- `status`: PENDING por padrão em novo usuário

**Recursos Especiais:**
- **Criar SUPER_ADMIN**: 
  - Só permitir se plataforma selecionada for master
  - Mostrar aviso de segurança
- **Editar Role**:
  - Confirmar antes de promover/rebaixar
- **Resetar Senha**:
  - Gerar senha temporária ou permitir definir nova

#### 3.3 Detalhes do Usuário

**Visualizar:**
- Informações completas
- Histórico de logins (últimos 20)
- Histórico de alterações
- Atividades recentes
- Chave API Gemini (se tiver)
- Botões de ação:
  - Editar informações
  - Alterar role
  - Alterar status
  - Resetar senha
  - Deletar usuário (com confirmação)

### 4. Configurações

**Página: `/settings`**

#### 4.1 Perfil do SUPER_ADMIN

- Ver informações pessoais
- Alterar nome completo
- Alterar senha
- Ver tokens ativos
- Logs de acesso pessoais

#### 4.2 Configurações do Sistema

- URL da API
- Timeout de sessão
- Tentativas de login permitidas
- Configurações de email (futuramente)

#### 4.3 Logs e Auditoria

- Visualizar logs de sistema
- Filtrar por:
  - Tipo de ação (login, create, update, delete)
  - Usuário
  - Plataforma
  - Data/período
- Exportar logs

---

## 🎨 Telas e Componentes

### Layout Principal

```typescript
// src/components/layout/MainLayout.tsx

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

### Sidebar

**Navegação:**
```
📊 Dashboard
🏢 Plataformas
👥 Usuários
⚙️ Configurações
🚪 Sair
```

**Funcionalidades:**
- Indicador de página ativa
- Collapse/Expand (mobile)
- Badges com contadores (ex: "5 usuários pendentes")
- Logo do TGOO no topo
- Informações do usuário logado no rodapé

### Header

**Elementos:**
- Título da página atual
- Breadcrumb (Home > Plataformas > Editar)
- Pesquisa global (buscar usuário/plataforma)
- Notificações (sino com badge)
- Avatar do usuário com dropdown:
  - Perfil
  - Configurações
  - Sair

### Cards de Estatísticas

```typescript
// src/components/dashboard/StatsCard.tsx

interface StatsCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'orange' | 'red';
}

export default function StatsCard({ title, value, subtitle, icon, trend, color = 'blue' }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className={`flex items-center mt-4 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          <span className="text-gray-500 ml-2">vs mês anterior</span>
        </div>
      )}
    </div>
  );
}
```

### Tabela de Dados

Usar **TanStack Table** (React Table v8) para tabelas complexas com:
- Ordenação
- Filtros
- Paginação
- Seleção de linhas
- Ações por linha
- Responsividade

```typescript
// src/components/users/UserTable.tsx

import { useReactTable, getCoreRowModel, /* ... */ } from '@tanstack/react-table';

export default function UserTable() {
  const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'fullName', header: 'Nome' },
    { 
      accessorKey: 'platform', 
      header: 'Plataforma',
      cell: ({ row }) => row.original.platform.name
    },
    { 
      accessorKey: 'role', 
      header: 'Role',
      cell: ({ row }) => <RoleBadge role={row.original.role} />
    },
    { 
      accessorKey: 'status', 
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => <UserActions user={row.original} />
    }
  ];
  
  // Implementação da tabela...
}
```

### Formulários

Usar **React Hook Form + Zod** para validação:

```typescript
// src/components/platforms/PlatformForm.tsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const platformSchema = z.object({
  code: z.string()
    .min(2, 'Código deve ter no mínimo 2 caracteres')
    .regex(/^[a-z_]+$/, 'Apenas letras minúsculas e underline'),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  domain: z.string().url('Domínio inválido').optional().or(z.literal('')),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type PlatformFormData = z.infer<typeof platformSchema>;

export default function PlatformForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<PlatformFormData>({
    resolver: zodResolver(platformSchema)
  });
  
  const onSubmit = async (data: PlatformFormData) => {
    // Chamar API
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Campos do formulário */}
    </form>
  );
}
```

### Badges de Status

```typescript
// src/components/common/StatusBadge.tsx

interface StatusBadgeProps {
  status: 'PENDING' | 'ACTIVE' | 'BLOCKED';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACTIVE: 'bg-green-100 text-green-800',
    BLOCKED: 'bg-red-100 text-red-800',
  };
  
  const labels = {
    PENDING: 'Pendente',
    ACTIVE: 'Ativo',
    BLOCKED: 'Bloqueado',
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
```

---

## 🔌 Integração com API

### Configuração do Axios

```typescript
// src/services/api.ts

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request: Adicionar token JWT
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response: Tratar erros
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      useAuthStore.getState().logout();
      toast.error('Sessão expirada. Faça login novamente.');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      toast.error('Você não tem permissão para essa ação.');
    } else if (error.response?.status >= 500) {
      toast.error('Erro no servidor. Tente novamente mais tarde.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### Serviço de Autenticação

```typescript
// src/services/auth.service.ts

import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
  platform: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    fullName: string | null;
    role: string;
    status: string;
    platform: {
      id: number;
      code: string;
      name: string;
    };
  };
}

export interface UserProfile {
  id: number;
  email: string;
  fullName: string | null;
  role: string;
  status: string;
  createdAt: string;
  platform: {
    id: number;
    code: string;
    name: string;
    domain: string | null;
  };
}

const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    return data;
  },
  
  // Obter perfil do usuário autenticado
  async getProfile(): Promise<UserProfile> {
    const { data } = await api.get<UserProfile>('/auth/profile');
    return data;
  },
  
  // Alterar senha
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/password/change', { currentPassword, newPassword });
  },
};

export default authService;
```

### Serviço de Plataformas

```typescript
// src/services/platform.service.ts

import api from './api';

export interface Platform {
  id: number;
  code: string;
  name: string;
  domain: string | null;
  description: string | null;
  isActive: boolean;
  isMaster: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
  };
}

export interface CreatePlatformDto {
  code: string;
  name: string;
  domain?: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdatePlatformDto extends Partial<CreatePlatformDto> {}

const platformService = {
  // Listar todas as plataformas
  async getAll(): Promise<Platform[]> {
    const { data } = await api.get<Platform[]>('/admin/platforms');
    return data;
  },
  
  // Obter uma plataforma por ID
  async getById(id: number): Promise<Platform> {
    const { data } = await api.get<Platform>(`/admin/platforms/${id}`);
    return data;
  },
  
  // Criar nova plataforma
  async create(platform: CreatePlatformDto): Promise<Platform> {
    const { data } = await api.post<Platform>('/admin/platforms', platform);
    return data;
  },
  
  // Atualizar plataforma
  async update(id: number, platform: UpdatePlatformDto): Promise<Platform> {
    const { data } = await api.patch<Platform>(`/admin/platforms/${id}`, platform);
    return data;
  },
  
  // Deletar plataforma (se implementado no backend)
  async delete(id: number): Promise<void> {
    await api.delete(`/admin/platforms/${id}`);
  },
};

export default platformService;
```

### Serviço de Usuários

```typescript
// src/services/user.service.ts

import api from './api';

export interface User {
  id: number;
  email: string;
  fullName: string | null;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'PENDING' | 'ACTIVE' | 'BLOCKED';
  platformId: number;
  createdAt: string;
  updatedAt: string;
  platform: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreateUserDto {
  email: string;
  password: string;
  fullName?: string;
  platform: string; // código da plataforma
  role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  status?: 'PENDING' | 'ACTIVE' | 'BLOCKED';
}

export interface UpdateUserDto {
  fullName?: string;
  role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  status?: 'PENDING' | 'ACTIVE' | 'BLOCKED';
}

export interface UserFilters {
  platform?: string;
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

const userService = {
  // Listar usuários com filtros
  async getAll(filters?: UserFilters): Promise<{ users: User[]; total: number }> {
    const { data } = await api.get('/admin/users', { params: filters });
    return data;
  },
  
  // Obter usuário por ID
  async getById(id: number): Promise<User> {
    const { data } = await api.get<User>(`/admin/users/${id}`);
    return data;
  },
  
  // Criar novo usuário
  async create(user: CreateUserDto): Promise<User> {
    const { data } = await api.post<User>('/admin/users', user);
    return data;
  },
  
  // Atualizar usuário
  async update(id: number, user: UpdateUserDto): Promise<User> {
    const { data } = await api.patch<User>(`/admin/users/${id}`, user);
    return data;
  },
  
  // Resetar senha do usuário
  async resetPassword(id: number, newPassword: string): Promise<void> {
    await api.post(`/admin/users/${id}/reset-password`, { newPassword });
  },
  
  // Deletar usuário
  async delete(id: number): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },
};

export default userService;
```

---

## 🔐 Autenticação e Rotas

### Store de Autenticação (Zustand)

```typescript
// src/store/authStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService, { LoginCredentials, LoginResponse, UserProfile } from '@/services/auth.service';

interface AuthState {
  token: string | null;
  user: LoginResponse['user'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loadProfile: () => Promise<void>;
  updateProfile: (user: Partial<LoginResponse['user']>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(credentials);
          
          set({
            token: response.token,
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },
      
      loadProfile: async () => {
        try {
          const profile = await authService.getProfile();
          set({ 
            user: profile as any, // Ajustar tipos se necessário
            isAuthenticated: true 
          });
        } catch (error) {
          get().logout();
          throw error;
        }
      },
      
      updateProfile: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
```

### Rotas Protegidas

```typescript
// src/routes/ProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function ProtectedRoute() {
  const { isAuthenticated, user } = useAuthStore();
  
  // Verificar autenticação
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // Verificar se é SUPER_ADMIN
  if (user.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
          <p className="text-gray-600 mt-2">Apenas SUPER_ADMIN pode acessar esta plataforma.</p>
        </div>
      </div>
    );
  }
  
  return <Outlet />;
}
```

### Configuração de Rotas

```typescript
// src/routes/index.tsx

import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Platforms from '@/pages/Platforms';
import Users from '@/pages/Users';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthLayout><Login /></AuthLayout>,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'platforms', element: <Platforms /> },
          { path: 'users', element: <Users /> },
          { path: 'settings', element: <Settings /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
```

### App Principal

```typescript
// src/App.tsx

import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './routes';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}
```

---

## 📦 Gerenciamento de Estado

### Store de Plataformas

```typescript
// src/store/platformStore.ts

import { create } from 'zustand';
import platformService, { Platform } from '@/services/platform.service';

interface PlatformState {
  platforms: Platform[];
  selectedPlatform: Platform | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchPlatforms: () => Promise<void>;
  selectPlatform: (platform: Platform | null) => void;
  createPlatform: (data: any) => Promise<Platform>;
  updatePlatform: (id: number, data: any) => Promise<Platform>;
  deletePlatform: (id: number) => Promise<void>;
}

export const usePlatformStore = create<PlatformState>((set) => ({
  platforms: [],
  selectedPlatform: null,
  isLoading: false,
  error: null,
  
  fetchPlatforms: async () => {
    set({ isLoading: true, error: null });
    try {
      const platforms = await platformService.getAll();
      set({ platforms, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  selectPlatform: (platform) => {
    set({ selectedPlatform: platform });
  },
  
  createPlatform: async (data) => {
    const newPlatform = await platformService.create(data);
    set((state) => ({
      platforms: [...state.platforms, newPlatform],
    }));
    return newPlatform;
  },
  
  updatePlatform: async (id, data) => {
    const updated = await platformService.update(id, data);
    set((state) => ({
      platforms: state.platforms.map((p) => 
        p.id === id ? updated : p
      ),
    }));
    return updated;
  },
  
  deletePlatform: async (id) => {
    await platformService.delete(id);
    set((state) => ({
      platforms: state.platforms.filter((p) => p.id !== id),
    }));
  },
}));
```

### Custom Hooks

```typescript
// src/hooks/usePlatforms.ts

import { useEffect } from 'react';
import { usePlatformStore } from '@/store/platformStore';

export function usePlatforms() {
  const { platforms, isLoading, error, fetchPlatforms } = usePlatformStore();
  
  useEffect(() => {
    fetchPlatforms();
  }, []);
  
  return { platforms, isLoading, error, refetch: fetchPlatforms };
}
```

```typescript
// src/hooks/useDebounce.ts

import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}
```

---

## 💻 Exemplos de Código

### Página de Login

```typescript
// src/pages/Login.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  platform: z.string().default('auth_tgoo'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      platform: 'auth_tgoo', // Plataforma master
    },
  });
  
  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">TGOO Auth</h1>
          <p className="text-gray-600 mt-2">Plataforma Master de Autenticação</p>
        </div>
        
        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@tgoo.eu"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        
        {/* Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Acesso restrito a SUPER_ADMIN</p>
        </div>
      </div>
    </div>
  );
}
```

### Página de Dashboard

```typescript
// src/pages/Dashboard.tsx

import { useEffect, useState } from 'react';
import { usePlatforms } from '@/hooks/usePlatforms';
import { userService } from '@/services/user.service';
import StatsCard from '@/components/dashboard/StatsCard';
import { Users, Building2, UserCheck, Clock } from 'lucide-react';

interface Stats {
  totalPlatforms: number;
  activePlatforms: number;
  totalUsers: number;
  pendingUsers: number;
  totalAdmins: number;
  totalSuperAdmins: number;
}

export default function Dashboard() {
  const { platforms, isLoading: platformsLoading } = usePlatforms();
  const [stats, setStats] = useState<Stats>({
    totalPlatforms: 0,
    activePlatforms: 0,
    totalUsers: 0,
    pendingUsers: 0,
    totalAdmins: 0,
    totalSuperAdmins: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadStats() {
      try {
        // Carregar estatísticas de usuários
        const { users } = await userService.getAll();
        
        setStats({
          totalPlatforms: platforms.length,
          activePlatforms: platforms.filter(p => p.isActive).length,
          totalUsers: users.length,
          pendingUsers: users.filter(u => u.status === 'PENDING').length,
          totalAdmins: users.filter(u => u.role === 'ADMIN').length,
          totalSuperAdmins: users.filter(u => u.role === 'SUPER_ADMIN').length,
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (!platformsLoading) {
      loadStats();
    }
  }, [platforms, platformsLoading]);
  
  if (isLoading) {
    return <div>Carregando...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do sistema de autenticação</p>
      </div>
      
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Plataformas"
          value={stats.totalPlatforms}
          subtitle={`${stats.activePlatforms} ativas`}
          icon={<Building2 className="w-6 h-6 text-blue-600" />}
          color="blue"
        />
        
        <StatsCard
          title="Total de Usuários"
          value={stats.totalUsers}
          subtitle={`${stats.totalAdmins} admins`}
          icon={<Users className="w-6 h-6 text-green-600" />}
          color="green"
        />
        
        <StatsCard
          title="Usuários Pendentes"
          value={stats.pendingUsers}
          subtitle="Aguardando aprovação"
          icon={<Clock className="w-6 h-6 text-orange-600" />}
          color="orange"
        />
        
        <StatsCard
          title="SUPER_ADMIN"
          value={stats.totalSuperAdmins}
          subtitle="Administradores globais"
          icon={<UserCheck className="w-6 h-6 text-purple-600" />}
          color="purple"
        />
      </div>
      
      {/* Atividades Recentes, Gráficos, etc. */}
      {/* ... */}
    </div>
  );
}
```

### Página de Plataformas

```typescript
// src/pages/Platforms.tsx

import { useState } from 'react';
import { usePlatforms } from '@/hooks/usePlatforms';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import PlatformCard from '@/components/platforms/PlatformCard';
import PlatformDialog from '@/components/platforms/PlatformDialog';

export default function Platforms() {
  const { platforms, isLoading, refetch } = usePlatforms();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  
  const handleCreate = () => {
    setSelectedPlatform(null);
    setIsDialogOpen(true);
  };
  
  const handleEdit = (platform: any) => {
    setSelectedPlatform(platform);
    setIsDialogOpen(true);
  };
  
  if (isLoading) {
    return <div>Carregando plataformas...</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plataformas</h1>
          <p className="text-gray-600 mt-1">
            Gerencie todas as plataformas do ecossistema TGOO
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Plataforma
        </Button>
      </div>
      
      {/* Lista de Plataformas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => (
          <PlatformCard
            key={platform.id}
            platform={platform}
            onEdit={() => handleEdit(platform)}
          />
        ))}
      </div>
      
      {/* Dialog de Criar/Editar */}
      <PlatformDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        platform={selectedPlatform}
        onSuccess={() => {
          setIsDialogOpen(false);
          refetch();
        }}
      />
    </div>
  );
}
```

---

## 🎨 UI/UX e Design

### Paleta de Cores

```css
/* Cores Principais */
--primary: #3B82F6;      /* Azul */
--primary-dark: #2563EB;
--primary-light: #60A5FA;

/* Cores Secundárias */
--success: #10B981;      /* Verde */
--warning: #F59E0B;      /* Laranja */
--danger: #EF4444;       /* Vermelho */
--info: #8B5CF6;         /* Roxo */

/* Neutros */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-600: #4B5563;
--gray-900: #111827;
```

### Tipografia

```css
/* Fontes */
font-family: 'Inter', sans-serif;

/* Tamanhos */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
```

### Espaçamento

```css
/* Spacing (Tailwind) */
p-2  /* 0.5rem - 8px */
p-4  /* 1rem - 16px */
p-6  /* 1.5rem - 24px */
p-8  /* 2rem - 32px */

/* Gaps */
gap-4  /* 1rem - 16px */
gap-6  /* 1.5rem - 24px */
```

### Componentes Base (Shadcn/ui)

Instalar componentes necessários:

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add table
npx shadcn-ui@latest add select
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add toast
```

### Responsividade

```typescript
// Breakpoints Tailwind
sm: '640px'   // Tablets
md: '768px'   // Tablets landscape
lg: '1024px'  // Laptops
xl: '1280px'  // Desktops
2xl: '1536px' // Large desktops

// Exemplo de uso
<div className="
  grid 
  grid-cols-1      /* Mobile: 1 coluna */
  md:grid-cols-2   /* Tablet: 2 colunas */
  lg:grid-cols-3   /* Desktop: 3 colunas */
  gap-6
">
  {/* Cards */}
</div>
```

### Dark Mode (Opcional)

Se quiser implementar dark mode:

```typescript
// src/hooks/useDarkMode.ts

import { useEffect, useState } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);
  
  return { isDark, toggleDark: () => setIsDark(!isDark) };
}
```

---

## 🔒 Segurança

### Boas Práticas

#### 1. Sanitização de Inputs

```typescript
import DOMPurify from 'dompurify';

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input);
}
```

#### 2. Validação no Frontend E Backend

```typescript
// Sempre validar no frontend (UX)
// E também no backend (Segurança)

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});
```

#### 3. HTTPS Obrigatório

```typescript
// vite.config.ts (desenvolvimento)
export default defineConfig({
  server: {
    https: true,
    // ... certificados
  },
});
```

#### 4. Content Security Policy

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';">
```

#### 5. Rate Limiting no Frontend

```typescript
// Limitar tentativas de login
let loginAttempts = 0;
const MAX_ATTEMPTS = 5;

async function handleLogin() {
  if (loginAttempts >= MAX_ATTEMPTS) {
    toast.error('Muitas tentativas. Aguarde 5 minutos.');
    return;
  }
  
  try {
    await login();
    loginAttempts = 0; // Reset on success
  } catch (error) {
    loginAttempts++;
  }
}
```

#### 6. XSS Protection

```typescript
// Nunca usar dangerouslySetInnerHTML sem sanitizar
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
```

#### 7. Token Storage

```typescript
// ✅ BOM: Store em localStorage/sessionStorage com cuidado
// ❌ RUIM: Expor token em URLs ou logs

// Preferir httpOnly cookies se possível
// Ou localStorage com expiração
```

---

## 🚀 Deploy e Configuração

### Variáveis de Ambiente

```bash
# .env.example

# API
VITE_API_URL=https://auth.tgoo.eu/api

# Plataforma Master
VITE_PLATFORM_CODE=auth_tgoo

# Outras
VITE_APP_NAME="TGOO Auth Master"
VITE_APP_VERSION=1.0.0
```

```bash
# .env.development
VITE_API_URL=http://localhost:3001/api
VITE_PLATFORM_CODE=auth_tgoo
```

```bash
# .env.production
VITE_API_URL=https://auth.tgoo.eu/api
VITE_PLATFORM_CODE=auth_tgoo
```

### Build para Produção

```bash
# Instalar dependências
npm install

# Build
npm run build

# Preview local
npm run preview

# Resultado: pasta dist/ pronta para deploy
```

### Deploy - Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

**vercel.json:**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "env": {
    "VITE_API_URL": "https://auth.tgoo.eu/api",
    "VITE_PLATFORM_CODE": "auth_tgoo"
  }
}
```

### Deploy - Netlify

```bash
# Build command
npm run build

# Publish directory
dist

# Redirects (_redirects file)
/*    /index.html   200
```

### Deploy - Docker

```dockerfile
# Dockerfile

FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf

server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Build e run
docker build -t tgoo-auth-master .
docker run -p 80:80 tgoo-auth-master
```

### Scripts package.json

```json
{
  "name": "tgoo-auth-master-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "zustand": "^4.4.7",
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2",
    "zod": "^3.22.4",
    "@tanstack/react-table": "^8.10.7",
    "lucide-react": "^0.294.0",
    "react-hot-toast": "^2.4.1",
    "recharts": "^2.10.0",
    "date-fns": "^2.30.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.42",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "@typescript-eslint/parser": "^6.13.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.54.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "postcss": "^8.4.31",
    "prettier": "^3.1.0",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.3.2",
    "vite": "^5.0.0"
  }
}
```

---

## 📚 Checklist de Implementação

### Fase 1: Setup Inicial (Semana 1)
- [ ] Criar projeto com Vite + React + TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Instalar Shadcn/ui
- [ ] Configurar rotas (React Router)
- [ ] Configurar Axios e interceptors
- [ ] Criar estrutura de pastas

### Fase 2: Autenticação (Semana 1-2)
- [ ] Página de login
- [ ] Store de autenticação (Zustand)
- [ ] Rotas protegidas
- [ ] Persistência de sessão
- [ ] Logout

### Fase 3: Layout e Navegação (Semana 2)
- [ ] Layout principal
- [ ] Sidebar com navegação
- [ ] Header com perfil
- [ ] Componentes base (buttons, inputs, etc.)
- [ ] Responsividade

### Fase 4: Dashboard (Semana 2-3)
- [ ] Cards de estatísticas
- [ ] Gráficos (Recharts)
- [ ] Atividade recente
- [ ] Ações rápidas

### Fase 5: Gerenciamento de Plataformas (Semana 3-4)
- [ ] Lista de plataformas
- [ ] Criar plataforma
- [ ] Editar plataforma
- [ ] Ativar/Desativar
- [ ] Pesquisa e filtros
- [ ] Detalhes da plataforma

### Fase 6: Gerenciamento de Usuários (Semana 4-5)
- [ ] Tabela de usuários (React Table)
- [ ] Criar usuário
- [ ] Editar usuário
- [ ] Alterar role/status
- [ ] Resetar senha
- [ ] Pesquisa e filtros avançados
- [ ] Paginação
- [ ] Detalhes do usuário

### Fase 7: Configurações (Semana 5)
- [ ] Perfil do SUPER_ADMIN
- [ ] Alterar senha
- [ ] Configurações do sistema
- [ ] Logs de auditoria

### Fase 8: Polimento (Semana 6)
- [ ] Loading states
- [ ] Error handling
- [ ] Toasts/Notifications
- [ ] Confirmações de ações críticas
- [ ] Validações completas
- [ ] Acessibilidade (a11y)
- [ ] Performance optimization

### Fase 9: Testes e Deploy (Semana 6-7)
- [ ] Testes E2E (Playwright)
- [ ] Testes unitários (Vitest)
- [ ] Build de produção
- [ ] Deploy (Vercel/Netlify)
- [ ] Documentação final

---

## 🎓 Recursos e Referências

### Documentação Oficial
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Hook Form](https://react-hook-form.com/)
- [TanStack Table](https://tanstack.com/table)
- [Recharts](https://recharts.org/)

### Inspiração de UI/UX
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://supabase.com/)
- [Tailwind UI](https://tailwindui.com/components)
- [Shadcn Examples](https://ui.shadcn.com/examples)

### API Backend
- [MASTER_PLATFORM.md](./MASTER_PLATFORM.md)
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- [Backend README.md](./README.md)

---

## 💡 Dicas Finais

### Performance
1. **Code Splitting**: Use lazy loading para rotas
2. **Memoization**: Use React.memo, useMemo, useCallback
3. **Virtualization**: Para listas grandes (react-virtual)
4. **Image Optimization**: Use formatos modernos (WebP)

### Manutenibilidade
1. **TypeScript**: Sempre tipar tudo
2. **Componentização**: Componentes pequenos e reutilizáveis
3. **Comentários**: Documente código complexo
4. **Testes**: Testar funcionalidades críticas

### UX
1. **Loading States**: Sempre mostrar quando carregando
2. **Error States**: Mensagens de erro amigáveis
3. **Empty States**: Telas vazias com CTAs
4. **Confirmações**: Confirmar ações destrutivas
5. **Feedback**: Toasts para sucesso/erro

---

## 📞 Suporte

Para dúvidas sobre:
- **Backend API**: Consulte [MASTER_PLATFORM.md](./MASTER_PLATFORM.md)
- **Integração**: Consulte [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- **React/TypeScript**: Documentação oficial
- **UI Components**: [Shadcn/ui Docs](https://ui.shadcn.com/)

---

**Desenvolvido por TGOO** 🚀

**Tempo Estimado**: 6-7 semanas para MVP completo

**Stack**: React + TypeScript + Tailwind + Shadcn/ui + Zustand

**Deploy**: Vercel, Netlify ou Docker

Boa sorte com o desenvolvimento! 🎉
