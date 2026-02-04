/**
 * TGOO Auth - Quick Start Vue 3 + Composition API
 * 
 * Este é um exemplo minimalista de integração com o sistema de autenticação TGOO.
 * Para documentação completa, consulte: INTEGRATION_GUIDE.md
 * 
 * Instalação:
 *   npm install axios pinia
 */

import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const API_URL = import.meta.env.VITE_API_URL || 'https://auth.tgoo.eu/api';
const PLATFORM_CODE = import.meta.env.VITE_PLATFORM_CODE || 'dressme';

// ============================================================================
// API CLIENT
// ============================================================================

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: Adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Lidar com token expirado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// PINIA STORE
// ============================================================================

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Computed
  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => {
    return user.value?.role === 'ADMIN' || user.value?.role === 'SUPER_ADMIN';
  });
  const isSuperAdmin = computed(() => user.value?.role === 'SUPER_ADMIN');

  // Actions
  async function loadUser() {
    try {
      loading.value = true;
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        user.value = null;
        return;
      }

      const { data } = await api.get('/auth/profile');
      user.value = data;
    } catch (err) {
      console.error('Erro ao carregar usuário:', err);
      localStorage.removeItem('authToken');
      user.value = null;
    } finally {
      loading.value = false;
    }
  }

  async function login(email, password) {
    try {
      loading.value = true;
      error.value = null;

      const { data } = await api.post('/auth/login', {
        email,
        password,
        platform: PLATFORM_CODE,
      });

      localStorage.setItem('authToken', data.token);
      user.value = data.user;

      return data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao fazer login';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function signup(email, password, fullName) {
    try {
      loading.value = true;
      error.value = null;

      const { data } = await api.post('/auth/signup', {
        email,
        password,
        fullName,
        platform: PLATFORM_CODE,
      });

      return data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao criar conta';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function changePassword(oldPassword, newPassword) {
    try {
      loading.value = true;
      error.value = null;

      await api.post('/password/change', {
        oldPassword,
        newPassword,
      });
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao alterar senha';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    localStorage.removeItem('authToken');
    user.value = null;
    error.value = null;
  }

  function clearError() {
    error.value = null;
  }

  return {
    // Estado
    user,
    loading,
    error,
    // Computed
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    // Actions
    loadUser,
    login,
    signup,
    changePassword,
    logout,
    clearError,
  };
});

// ============================================================================
// COMPOSABLE
// ============================================================================

export function useAuth() {
  return useAuthStore();
}

// ============================================================================
// COMPONENTE: Login.vue
// ============================================================================

/*
<template>
  <div class="login-container">
    <h1>Login</h1>

    <div v-if="authStore.error" class="error-message">
      {{ authStore.error }}
      <button @click="authStore.clearError">✕</button>
    </div>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>Email:</label>
        <input
          v-model="email"
          type="email"
          required
          :disabled="authStore.loading"
        />
      </div>

      <div class="form-group">
        <label>Senha:</label>
        <input
          v-model="password"
          type="password"
          required
          minlength="6"
          :disabled="authStore.loading"
        />
      </div>

      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>

    <p>
      Não tem conta? <router-link to="/signup">Criar conta</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');

async function handleLogin() {
  try {
    await authStore.login(email.value, password.value);
    router.push('/dashboard');
  } catch (error) {
    // Erro já está no store
    console.error('Erro no login:', error);
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
}

.error-message {
  padding: 10px;
  background-color: #fee;
  color: #c00;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
*/

// ============================================================================
// COMPONENTE: Signup.vue
// ============================================================================

/*
<template>
  <div class="signup-container">
    <h1>Criar Conta</h1>

    <div v-if="authStore.error" class="error-message">
      {{ authStore.error }}
      <button @click="authStore.clearError">✕</button>
    </div>

    <div v-if="success" class="success-message">
      {{ success }}
    </div>

    <form @submit.prevent="handleSignup">
      <div class="form-group">
        <label>Nome Completo:</label>
        <input
          v-model="fullName"
          type="text"
          :disabled="authStore.loading"
        />
      </div>

      <div class="form-group">
        <label>Email:</label>
        <input
          v-model="email"
          type="email"
          required
          :disabled="authStore.loading"
        />
      </div>

      <div class="form-group">
        <label>Senha (mín. 6 caracteres):</label>
        <input
          v-model="password"
          type="password"
          required
          minlength="6"
          :disabled="authStore.loading"
        />
      </div>

      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? 'Criando...' : 'Criar Conta' }}
      </button>
    </form>

    <p>
      Já tem conta? <router-link to="/login">Fazer login</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const fullName = ref('');
const success = ref('');

async function handleSignup() {
  try {
    success.value = '';
    await authStore.signup(email.value, password.value, fullName.value);
    
    success.value = 'Conta criada! Aguarde aprovação do administrador.';
    
    // Redirecionar após 3 segundos
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  } catch (error) {
    console.error('Erro no signup:', error);
  }
}
</script>
*/

// ============================================================================
// COMPONENTE: Dashboard.vue
// ============================================================================

/*
<template>
  <div class="dashboard-container">
    <header>
      <h1>Dashboard</h1>
      <button @click="handleLogout" class="logout-btn">
        Sair
      </button>
    </header>

    <div v-if="authStore.loading" class="loading">
      Carregando...
    </div>

    <div v-else-if="authStore.user" class="user-info">
      <h2>Bem-vindo, {{ authStore.user.fullName || authStore.user.email }}!</h2>
      
      <div class="info-card">
        <p><strong>Email:</strong> {{ authStore.user.email }}</p>
        <p><strong>Role:</strong> {{ authStore.user.role }}</p>
        <p><strong>Status:</strong> {{ authStore.user.status }}</p>
        <p><strong>Plataforma:</strong> {{ authStore.user.platform.name }}</p>
      </div>

      <div v-if="authStore.isAdmin" class="admin-badge">
        🔑 Acesso Administrativo
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  if (!authStore.user) {
    await authStore.loadUser();
  }
});

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.dashboard-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.logout-btn {
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.user-info {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.info-card {
  margin: 20px 0;
  padding: 15px;
  background-color: white;
  border-radius: 4px;
}

.admin-badge {
  margin-top: 30px;
  padding: 20px;
  background-color: #fff3cd;
  border-radius: 4px;
  font-weight: bold;
}
</style>
*/

// ============================================================================
// ROUTER GUARD
// ============================================================================

/*
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import Dashboard from '../views/Dashboard.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Carregar usuário se necessário
  if (!authStore.user && localStorage.getItem('authToken')) {
    await authStore.loadUser();
  }

  // Verificar autenticação
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login');
  }

  // Verificar se já está autenticado (redirect de login/signup)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next('/dashboard');
  }

  // Verificar permissão de admin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next('/dashboard');
  }

  next();
});

export default router;
*/

// ============================================================================
// MAIN.JS
// ============================================================================

/*
// main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount('#app');
*/

// ============================================================================
// INSTRUÇÕES DE USO
// ============================================================================

/*

1. INSTALAR DEPENDÊNCIAS:
   npm install axios pinia vue-router

2. CONFIGURAR .env:
   VITE_API_URL=https://auth.tgoo.eu/api
   VITE_PLATFORM_CODE=dressme

3. ESTRUTURA DE PASTAS:
   src/
   ├── stores/
   │   └── auth.js          (este arquivo)
   ├── views/
   │   ├── Login.vue
   │   ├── Signup.vue
   │   └── Dashboard.vue
   ├── router/
   │   └── index.js
   └── main.js

4. USAR NO APP:
   
   // Em qualquer componente
   <script setup>
   import { useAuth } from '@/stores/auth';
   
   const auth = useAuth();
   
   // Verificar se está logado
   if (auth.isAuthenticated) {
     console.log('Usuário:', auth.user);
   }
   </script>

5. DOCUMENTAÇÃO COMPLETA:
   Consulte INTEGRATION_GUIDE.md para recursos avançados

*/

export default {
  useAuthStore,
  useAuth,
  api,
};

