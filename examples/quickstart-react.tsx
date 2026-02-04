/**
 * TGOO Auth - Quick Start React + TypeScript
 * 
 * Este é um exemplo minimalista de integração com o sistema de autenticação TGOO.
 * Para documentação completa, consulte: INTEGRATION_GUIDE.md
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const API_URL = import.meta.env.VITE_API_URL || 'https://auth.tgoo.eu/api';
const PLATFORM_CODE = import.meta.env.VITE_PLATFORM_CODE || 'dressme';

// ============================================================================
// TIPOS
// ============================================================================

interface User {
  id: number;
  email: string;
  fullName: string | null;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'PENDING' | 'ACTIVE' | 'BLOCKED';
  platform: {
    id: number;
    code: string;
    name: string;
  };
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// ============================================================================
// API CLIENT
// ============================================================================

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Lidar com token expirado
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
// AUTH CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário ao iniciar
  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const { data } = await api.get('/auth/profile');
          setUser(data);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', {
      email,
      password,
      platform: PLATFORM_CODE,
    });
    
    localStorage.setItem('authToken', data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem('authToken');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// ============================================================================
// COMPONENTE DE LOGIN
// ============================================================================

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
      <h1>Login</h1>
      
      {error && (
        <div style={{ padding: 10, background: '#fee', color: '#c00', marginBottom: 20 }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 10,
            background: '#007bff',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

// ============================================================================
// ROTA PROTEGIDA
// ============================================================================

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  return <>{children}</>;
};

// ============================================================================
// DASHBOARD EXEMPLO
// ============================================================================

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ maxWidth: 800, margin: '50px auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30 }}>
        <h1>Dashboard</h1>
        <button
          onClick={logout}
          style={{
            padding: '10px 20px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Sair
        </button>
      </div>

      <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 5 }}>
        <h2>Bem-vindo, {user?.fullName || user?.email}!</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        <p><strong>Status:</strong> {user?.status}</p>
        <p><strong>Plataforma:</strong> {user?.platform.name}</p>
      </div>

      {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? (
        <div style={{ marginTop: 30, padding: 20, background: '#fff3cd', borderRadius: 5 }}>
          <h3>🔑 Acesso Administrativo</h3>
          <p>Você tem permissões de administrador!</p>
        </div>
      ) : null}
    </div>
  );
};

// ============================================================================
// APP PRINCIPAL
// ============================================================================

export default function App() {
  return (
    <AuthProvider>
      {/* Suas rotas aqui - exemplo com React Router */}
      {/* 
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      */}
    </AuthProvider>
  );
}

// ============================================================================
// INSTRUÇÕES DE USO
// ============================================================================

/*

1. INSTALAR DEPENDÊNCIAS:
   npm install axios react-router-dom

2. CONFIGURAR .env:
   VITE_API_URL=https://auth.tgoo.eu/api
   VITE_PLATFORM_CODE=dressme

3. USAR NO SEU APP:
   
   import { AuthProvider } from './quickstart-react';
   
   <AuthProvider>
     <App />
   </AuthProvider>

4. DOCUMENTAÇÃO COMPLETA:
   Consulte INTEGRATION_GUIDE.md para recursos avançados:
   - Tratamento de erros robusto
   - Múltiplas linguagens
   - Casos de uso especiais
   - Testes automatizados
   - Melhores práticas de segurança

*/

