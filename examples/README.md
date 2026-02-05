# 📚 Exemplos de Integração - TGOO Auth

Esta pasta contém exemplos práticos de como integrar sua aplicação com o sistema de autenticação TGOO.

## 📁 Arquivos Disponíveis

### 🌐 React + TypeScript
**Arquivo:** `quickstart-react.tsx`

Exemplo completo de integração com React, incluindo:
- ✅ Context API para gerenciamento de estado
- ✅ Hook `useAuth()` customizado
- ✅ Componentes de Login e Dashboard
- ✅ Rotas protegidas
- ✅ Interceptors do Axios

**Uso:**
```bash
# 1. Copie para seu projeto
cp quickstart-react.tsx src/auth/

# 2. Instale dependências
npm install axios react-router-dom

# 3. Configure .env
echo "VITE_API_URL=https://auth.tgoo.eu/api" > .env
echo "VITE_PLATFORM_CODE=dressme" >> .env

# 4. Use no seu App
import { AuthProvider } from './auth/quickstart-react';

<AuthProvider>
  <App />
</AuthProvider>
```

---

### 🐍 Python
**Arquivo:** `quickstart-python.py`

Cliente Python completo com:
- ✅ Classe `TGOOAuthClient` com todos os métodos
- ✅ Gerenciamento de sessão com arquivo
- ✅ Exemplos de uso práticos
- ✅ Tratamento de erros robusto

**Uso:**
```bash
# 1. Instalar dependências
pip install requests

# 2. Executar exemplo
python quickstart-python.py

# 3. Ou importar no seu código
from quickstart_python import TGOOAuthClient

auth = TGOOAuthClient(
    api_url="https://auth.tgoo.eu/api",
    platform="dressme"
)

result = auth.login("user@example.com", "senha123")
print(result)
```

---

### 🔧 cURL / Shell Script
**Arquivo:** `quickstart-curl.sh`

Script interativo para testar a API usando cURL:
- ✅ Menu interativo com todas as operações
- ✅ Coloração e formatação amigável
- ✅ Armazenamento automático de token
- ✅ Formatação JSON com jq (opcional)

**Uso:**
```bash
# 1. Dar permissão de execução
chmod +x quickstart-curl.sh

# 2. Executar menu interativo
./quickstart-curl.sh

# 3. Ou executar teste específico
./quickstart-curl.sh login
./quickstart-curl.sh platforms
./quickstart-curl.sh profile
./quickstart-curl.sh all  # Executar todos os testes
```

---

### 👑 SUPER_ADMIN Universal
**Arquivo:** `super-admin-example.sh`

Demonstração do sistema de Plataforma Master e acesso universal do SUPER_ADMIN:
- ✅ Login do SUPER_ADMIN na plataforma master
- ✅ Acesso universal a outras plataformas
- ✅ Decodificação do token JWT
- ✅ Demonstração de permissões administrativas

**Uso:**
```bash
# 1. Configurar plataforma master primeiro
cd ..
node scripts/setup-master-platform.js

# 2. Executar demonstração
cd examples
chmod +x super-admin-example.sh
./super-admin-example.sh
```

**O que demonstra:**
- Como SUPER_ADMIN pode autenticar em qualquer plataforma
- Estrutura do token JWT com `isSuperAdminAccess: true`
- Diferenças entre autenticação normal e SUPER_ADMIN
- Gerenciamento de usuários cross-platform

📖 **Mais informações:** [MASTER_PLATFORM.md](../MASTER_PLATFORM.md)

---

## 🎯 Guia Completo

Para documentação detalhada com mais linguagens, casos de uso especiais e melhores práticas, consulte:

**[📖 INTEGRATION_GUIDE.md](../INTEGRATION_GUIDE.md)**

O guia completo inclui:
- JavaScript/TypeScript (Frontend e Backend)
- Python (Desktop e Backend)
- PHP
- React Native
- Electron
- Next.js (Server-Side)
- E muito mais!

---

## 🚀 Quick Start Geral

### 1. Configuração Inicial

Todos os exemplos precisam de:

```env
# URL do backend de autenticação
API_URL=https://auth.tgoo.eu/api

# Código da sua plataforma
PLATFORM_CODE=dressme
```

### 2. Fluxo Básico

```
1. Listar Plataformas (opcional)
   GET /api/auth/platforms

2. Criar Conta (se necessário)
   POST /api/auth/signup
   {
     "email": "user@example.com",
     "password": "senha123",
     "fullName": "Nome Completo",
     "platform": "dressme"
   }

3. Login
   POST /api/auth/login
   {
     "email": "user@example.com",
     "password": "senha123",
     "platform": "dressme"
   }
   
   → Retorna: { "token": "...", "user": {...} }

4. Usar Token
   Header: Authorization: Bearer <token>
   
5. Obter Perfil
   GET /api/auth/profile
   Header: Authorization: Bearer <token>
```

---

## 📊 Comparação dos Exemplos

| Recurso | React | Python | cURL |
|---------|-------|--------|------|
| Login/Signup | ✅ | ✅ | ✅ |
| Gerenciamento de Estado | ✅ | ✅ | ⚠️ (arquivo) |
| Rotas Protegidas | ✅ | ❌ | N/A |
| Tratamento de Erros | ✅ | ✅ | ✅ |
| UI Pronta | ✅ | ❌ | ❌ |
| Persistência de Sessão | ✅ | ✅ | ✅ |
| Melhor para | SPA | Backend/CLI | Testes/Debug |

---

## 🔍 Testando os Exemplos

### Teste 1: cURL (Mais Rápido)
```bash
# Testar se API está funcionando
./quickstart-curl.sh platforms

# Fazer login de teste
./quickstart-curl.sh login
```

### Teste 2: Python
```bash
# Executar exemplo Python
python quickstart-python.py

# Ou use no seu código
python3 -c "
from quickstart_python import TGOOAuthClient
auth = TGOOAuthClient()
print(auth.login('user@example.com', 'senha123'))
"
```

### Teste 3: React
```bash
# Criar novo projeto React (se necessário)
npm create vite@latest my-app -- --template react-ts
cd my-app

# Copiar exemplo
cp ../examples/quickstart-react.tsx src/

# Instalar e executar
npm install
npm run dev
```

---

## 💡 Dicas

### Para Desenvolvimento
1. **Use o exemplo cURL primeiro** para entender a API
2. **Depois adapte para sua linguagem** usando os exemplos
3. **Consulte o guia completo** para recursos avançados

### Para Produção
1. **Nunca comite tokens** no código ou git
2. **Use variáveis de ambiente** para configuração
3. **Implemente rate limiting** no frontend
4. **Valide token ao carregar app** para manter sessão
5. **Use HTTPS sempre** em produção

---

## 🛠️ Customização

### Adaptar para Sua Plataforma

Todos os exemplos usam variáveis configuráveis:

```typescript
// React
const PLATFORM_CODE = import.meta.env.VITE_PLATFORM_CODE;
```

```python
# Python
PLATFORM_CODE = os.getenv('PLATFORM_CODE', 'dressme')
```

```bash
# Shell
PLATFORM_CODE="dressme"
```

Basta alterar o código da plataforma!

---

## 📞 Suporte

Problemas com os exemplos?

1. **Verifique a configuração:**
   - URL da API está correta?
   - Código da plataforma existe?
   - Credenciais são válidas?

2. **Teste com cURL primeiro:**
   ```bash
   ./quickstart-curl.sh all
   ```

3. **Consulte a documentação:**
   - [INTEGRATION_GUIDE.md](../INTEGRATION_GUIDE.md)
   - [MULTI_PLATFORM_AUTH.md](../MULTI_PLATFORM_AUTH.md)

4. **Contate o suporte:**
   - Email: suporte@tgoo.eu

---

## 🎓 Próximos Passos

Depois de testar os exemplos:

1. ✅ Leia o [Guia de Integração Completo](../INTEGRATION_GUIDE.md)
2. ✅ Adapte o exemplo para seu caso de uso
3. ✅ Implemente tratamento de erros robusto
4. ✅ Adicione testes automatizados
5. ✅ Configure para produção (HTTPS, CORS, etc.)

---

**Desenvolvido por TGOO** 🚀

Última atualização: Janeiro 2026

