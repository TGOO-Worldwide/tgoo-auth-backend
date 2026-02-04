# 🚀 Início Rápido - TGOO Auth

Comece a usar o sistema de autenticação TGOO em 5 minutos!

---

## ⚡ Setup em 3 Passos

### 1️⃣ Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do seu projeto:

```env
# URL do backend de autenticação
VITE_API_URL=https://auth.tgoo.eu/api

# Código da sua plataforma
VITE_PLATFORM_CODE=dressme
```

> 💡 **Não tem código de plataforma?** Contate um SUPER_ADMIN ou consulte: `curl https://auth.tgoo.eu/api/auth/platforms`

---

### 2️⃣ Escolha Seu Stack

#### ⚛️ React + TypeScript

```bash
# Instalar dependências
npm install axios

# Copiar exemplo
curl -o src/auth.tsx https://raw.githubusercontent.com/.../quickstart-react.tsx

# Usar no App
import { AuthProvider } from './auth';

<AuthProvider>
  <App />
</AuthProvider>
```

#### 🟢 Vue 3 + Composition API

```bash
# Instalar dependências
npm install axios pinia

# Copiar store
curl -o src/stores/auth.js https://raw.githubusercontent.com/.../quickstart-vue.js

# Usar em componente
import { useAuth } from '@/stores/auth';
const auth = useAuth();
```

#### 🐍 Python

```bash
# Instalar dependências
pip install requests

# Copiar client
curl -o auth_client.py https://raw.githubusercontent.com/.../quickstart-python.py

# Usar no código
from auth_client import TGOOAuthClient
auth = TGOOAuthClient()
```

---

### 3️⃣ Teste a Integração

#### Teste 1: Login

**JavaScript/TypeScript:**
```typescript
const result = await authService.login({
  email: 'user@example.com',
  password: 'senha123'
});
console.log('Token:', result.token);
console.log('Usuário:', result.user);
```

**Python:**
```python
result = auth.login('user@example.com', 'senha123')
print(f"Token: {result['token']}")
print(f"Usuário: {result['user']['email']}")
```

**cURL:**
```bash
curl -X POST https://auth.tgoo.eu/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "senha123",
    "platform": "dressme"
  }'
```

---

#### Teste 2: Obter Perfil

**JavaScript/TypeScript:**
```typescript
const profile = await authService.getProfile();
console.log('Perfil:', profile);
```

**Python:**
```python
profile = auth.get_profile()
print(f"Perfil: {profile}")
```

**cURL:**
```bash
curl -X GET https://auth.tgoo.eu/api/auth/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🎯 Fluxo Básico

```
1. Usuário preenche formulário de login
   ↓
2. App chama POST /api/auth/login
   ↓
3. Backend valida credenciais
   ↓
4. Backend retorna { token, user }
   ↓
5. App salva token (localStorage/AsyncStorage/etc)
   ↓
6. App redireciona para dashboard
   ↓
7. Requisições subsequentes incluem: 
   Authorization: Bearer <token>
```

---

## 📋 Checklist Mínimo

Antes de ir para produção, certifique-se:

- [x] ✅ Login funcionando
- [x] ✅ Token sendo salvo
- [x] ✅ Token sendo enviado nas requisições
- [x] ✅ Rotas protegidas implementadas
- [x] ✅ Logout funcionando (limpar token)
- [x] ✅ Tratamento de erro 401 (token expirado)
- [x] ✅ HTTPS em produção

---

## 🔧 Ferramentas de Teste

### Opção 1: Script cURL Interativo

```bash
# Baixar script
curl -o test-auth.sh https://raw.githubusercontent.com/.../quickstart-curl.sh
chmod +x test-auth.sh

# Executar
./test-auth.sh
```

### Opção 2: Postman

1. Baixar [TGOO-Auth.postman_collection.json](./examples/TGOO-Auth.postman_collection.json)
2. Importar no Postman
3. Configurar variáveis (baseUrl, platformCode)
4. Testar endpoints

---

## 📚 Próximos Passos

### Para Funcionalidade Completa
- 📖 Leia: [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- 💻 Use os exemplos em: [/examples](./examples/)

### Para Entender Arquitetura
- 🏗️ Leia: [MULTI_PLATFORM_AUTH.md](./MULTI_PLATFORM_AUTH.md)

### Para Deploy do Backend
- 🚀 Leia: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🆘 Problemas Comuns

### "Plataforma inválida"
```bash
# Listar plataformas disponíveis
curl https://auth.tgoo.eu/api/auth/platforms
```
Verifique se o código da plataforma está correto no `.env`

### "Token inválido ou expirado"
```typescript
// Limpar token e pedir login novamente
localStorage.removeItem('authToken');
window.location.href = '/login';
```

### "Conta pendente de aprovação"
Contate um ADMIN para aprovar sua conta:
```bash
PATCH /api/admin/users/:id
{ "status": "ACTIVE" }
```

### CORS Error
Em desenvolvimento, configure proxy:
```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'https://auth.tgoo.eu'
    }
  }
}
```

---

## 📞 Precisa de Ajuda?

1. **Documentação Completa:** [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
2. **Exemplos de Código:** [/examples](./examples/)
3. **Troubleshooting:** [INTEGRATION_GUIDE.md#troubleshooting](./INTEGRATION_GUIDE.md)
4. **Suporte:** suporte@tgoo.eu

---

## 💡 Dicas Rápidas

### ✅ FAÇA
- Use HTTPS em produção
- Valide token ao carregar app
- Trate erros 401/403
- Use variáveis de ambiente

### ❌ NÃO FAÇA
- Não commite tokens no git
- Não use HTTP em produção
- Não armazene senhas
- Não ignore erros de autenticação

---

## 🎓 Exemplos de Código Mínimo

### React (Mínimo)
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://auth.tgoo.eu/api'
});

// Login
async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', {
    email, password, platform: 'dressme'
  });
  localStorage.setItem('token', data.token);
  return data.user;
}

// Get Profile
async function getProfile() {
  const token = localStorage.getItem('token');
  const { data } = await api.get('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}
```

### Python (Mínimo)
```python
import requests

API_URL = "https://auth.tgoo.eu/api"

# Login
def login(email, password):
    response = requests.post(f"{API_URL}/auth/login", json={
        "email": email,
        "password": password,
        "platform": "dressme"
    })
    return response.json()

# Get Profile
def get_profile(token):
    response = requests.get(
        f"{API_URL}/auth/profile",
        headers={"Authorization": f"Bearer {token}"}
    )
    return response.json()
```

---

**Pronto!** 🎉 Sua aplicação agora está integrada com o sistema de autenticação TGOO.

Para recursos avançados, consulte a [📖 Documentação Completa](./INTEGRATION_GUIDE.md).

---

**Desenvolvido por TGOO** 🚀

