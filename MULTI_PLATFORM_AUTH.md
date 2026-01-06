# 🔐 Arquitetura de Autenticação Multi-Plataforma

## 📖 Visão Geral

O backend de autenticação foi projetado para ser **centralizado e reutilizável** por múltiplas plataformas da TGOO. Cada plataforma (DressMe, Projeto2, etc.) usa o mesmo backend de autenticação, mas os usuários são isolados por plataforma.

## 🏗️ Arquitetura

```
                    auth.tgoo.eu (Backend Centralizado)
                              │
                              ├─── MySQL Database
                              │     ├─ platforms (dressme, projeto2, ...)
                              │     └─ users (vinculados a uma plataforma)
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   dressme.tgoo.eu     projeto2.tgoo.eu     projeto3.tgoo.eu
   (Frontend 1)         (Frontend 2)         (Frontend 3)
```

### Características:

✅ **Isolamento por Plataforma**: Usuários de plataformas diferentes são completamente independentes
✅ **Email Único por Plataforma**: `joao@email.com` pode existir no DressMe e no Projeto2 como contas separadas
✅ **SUPER_ADMIN**: Pode gerenciar todas as plataformas
✅ **ADMIN**: Pode gerenciar apenas sua plataforma
✅ **USER**: Acesso normal à plataforma

## 📊 Estrutura do Banco de Dados

### Tabela: `platforms`

| Campo       | Tipo    | Descrição                          |
|-------------|---------|------------------------------------|
| id          | INT     | Identificador único                |
| code        | STRING  | Código único (ex: `dressme`)       |
| name        | STRING  | Nome amigável (ex: `DressMe`)      |
| domain      | STRING? | Domínio (ex: `dressme.tgoo.eu`)    |
| description | TEXT?   | Descrição da plataforma            |
| isActive    | BOOLEAN | Se a plataforma está ativa         |

### Tabela: `users`

| Campo        | Tipo    | Descrição                              |
|--------------|---------|----------------------------------------|
| id           | INT     | Identificador único                    |
| email        | STRING  | Email do usuário                       |
| password     | STRING  | Senha hasheada (bcrypt)                |
| fullName     | STRING? | Nome completo                          |
| role         | ENUM    | USER, ADMIN, SUPER_ADMIN               |
| status       | ENUM    | PENDING, ACTIVE, BLOCKED               |
| platformId   | INT     | FK para platforms                      |
| geminiApiKey | TEXT?   | Chave API do Gemini (específica)       |

**Constraints:**
- `UNIQUE(email, platformId)`: Email único por plataforma
- `FK platformId → platforms.id ON DELETE CASCADE`

## 👥 Roles e Permissões

### 1. **USER** 🙂
- Acesso normal à plataforma
- Pode alterar própria senha
- Pode salvar/atualizar chave API do Gemini

### 2. **ADMIN** 👑
- Todas as permissões de USER
- Gerenciar usuários **apenas de sua plataforma**:
  - Listar usuários
  - Ativar/Bloquear usuários
  - Promover usuários para ADMIN
  - Criar novos usuários
  - Resetar senhas de usuários
- **NÃO PODE**:
  - Acessar usuários de outras plataformas
  - Promover para SUPER_ADMIN
  - Criar/editar plataformas

### 3. **SUPER_ADMIN** 👑👑
- Todas as permissões de ADMIN
- Gerenciar **todas as plataformas e usuários**:
  - Listar usuários de qualquer plataforma
  - Criar plataformas
  - Ativar/Desativar plataformas
  - Promover usuários para SUPER_ADMIN
  - Criar usuários em qualquer plataforma

## 🔌 API Endpoints

### Públicos (Sem Autenticação)

#### `GET /api/auth/platforms`
Lista plataformas ativas disponíveis.

**Response:**
```json
[
  {
    "id": 1,
    "code": "dressme",
    "name": "DressMe",
    "domain": "dressme.tgoo.eu",
    "description": "Plataforma de geração de looks com IA"
  }
]
```

#### `POST /api/auth/signup`
Criar nova conta.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "senha123",
  "fullName": "Nome Completo",
  "platform": "dressme"
}
```

**Response:**
```json
{
  "message": "Conta criada com sucesso! Aguarde aprovação do administrador.",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "Nome Completo",
    "status": "PENDING",
    "platform": {
      "code": "dressme",
      "name": "DressMe"
    }
  }
}
```

#### `POST /api/auth/login`
Fazer login.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "senha123",
  "platform": "dressme"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "Nome Completo",
    "role": "USER",
    "status": "ACTIVE",
    "platform": {
      "id": 1,
      "code": "dressme",
      "name": "DressMe"
    }
  }
}
```

### Autenticados (Requerem Bearer Token)

#### `GET /api/auth/profile`
Obter perfil do usuário.

**Headers:**
```
Authorization: Bearer <token>
```

#### `GET /api/admin/users?platform=<code>`
Listar usuários (filtrado por plataforma para ADMIN, todas para SUPER_ADMIN).

#### `POST /api/admin/users`
Criar usuário.

**Body (ADMIN):**
```json
{
  "email": "novo@email.com",
  "password": "senha123",
  "fullName": "Nome",
  "role": "USER",
  "status": "ACTIVE"
}
```

**Body (SUPER_ADMIN - pode especificar plataforma):**
```json
{
  "email": "novo@email.com",
  "password": "senha123",
  "fullName": "Nome",
  "role": "ADMIN",
  "status": "ACTIVE",
  "platform": "projeto2"
}
```

#### `PATCH /api/admin/users/:id`
Atualizar usuário (status/role).

#### `POST /api/admin/users/:id/reset-password`
Resetar senha de usuário.

#### `GET /api/admin/platforms` (SUPER_ADMIN)
Listar todas as plataformas.

#### `POST /api/admin/platforms` (SUPER_ADMIN)
Criar nova plataforma.

#### `PATCH /api/admin/platforms/:id` (SUPER_ADMIN)
Atualizar plataforma.

## 🔑 JWT Payload

O token JWT inclui:

```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "USER",
  "platformId": 1,
  "platform": "dressme",
  "iat": 1234567890,
  "exp": 1234999999
}
```

## 🚀 Setup e Deploy

### 1. Criar Plataformas

Execute o seed:

```bash
cd backend
npx prisma db seed
```

Ou crie manualmente via API (SUPER_ADMIN):

```bash
POST /api/admin/platforms
{
  "code": "projeto2",
  "name": "Projeto 2",
  "domain": "projeto2.tgoo.eu",
  "description": "Descrição do Projeto 2"
}
```

### 2. Criar Primeiro SUPER_ADMIN

Use o script interativo:

```bash
cd backend
node ../scripts/create-admin.js
```

Escolha:
- Plataforma: `dressme` (ou outra)
- Role: `3` (SUPER_ADMIN)

### 3. Deploy do Backend

O backend deve ser hospedado em um domínio único (ex: `auth.tgoo.eu`) e usado por todos os frontends.

**Docker Compose (Produção):**

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    environment:
      DATABASE_URL: mysql://user:pass@mysql:3306/auth_db
      JWT_SECRET: your-super-secret-jwt-key
      NODE_ENV: production
      PORT: 3001
    ports:
      - "3001:3001"
    depends_on:
      - mysql

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: auth_db
      MYSQL_USER: auth_user
      MYSQL_PASSWORD: strong_password
      MYSQL_ROOT_PASSWORD: root_password
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

### 4. Configurar Frontends

Cada frontend deve apontar para o backend centralizado:

**`.env` (Frontend DressMe):**
```
VITE_API_URL=https://auth.tgoo.eu/api
```

**`.env` (Frontend Projeto2):**
```
VITE_API_URL=https://auth.tgoo.eu/api
```

### 5. Frontend: Especificar Plataforma

Cada frontend deve enviar o código da sua plataforma no login/signup:

```typescript
// DressMe
await api.signIn({ 
  email: 'user@email.com', 
  password: '123456', 
  platform: 'dressme' 
});

// Projeto2
await api.signIn({ 
  email: 'user@email.com', 
  password: '123456', 
  platform: 'projeto2' 
});
```

## 📱 Exemplo: Adicionar Nova Plataforma

### 1. Como SUPER_ADMIN, criar a plataforma:

```bash
POST https://auth.tgoo.eu/api/admin/platforms
Authorization: Bearer <super_admin_token>

{
  "code": "novaplataforma",
  "name": "Nova Plataforma",
  "domain": "novaplataforma.tgoo.eu",
  "description": "Descrição da nova plataforma"
}
```

### 2. Criar frontend da nova plataforma:

```bash
# Clone o frontend de exemplo
cp -r dressme-frontend novaplataforma-frontend

# Atualizar .env
echo "VITE_API_URL=https://auth.tgoo.eu/api" > .env

# Atualizar código para usar platform: 'novaplataforma'
```

### 3. Criar primeiro admin da nova plataforma:

```bash
node scripts/create-admin.js
# Escolher plataforma: novaplataforma
# Role: ADMIN
```

## 🔒 Segurança

### 1. JWT Secret

**NUNCA use o secret padrão em produção!**

Gere um secret forte:

```bash
openssl rand -base64 64
```

Coloque no `.env`:

```
JWT_SECRET=seu-secret-super-forte-aqui-min-32-caracteres
```

### 2. CORS

Configure CORS no backend para aceitar apenas domínios confiáveis:

```typescript
// backend/src/index.ts
const allowedOrigins = [
  'https://dressme.tgoo.eu',
  'https://projeto2.tgoo.eu',
  'https://novaplataforma.tgoo.eu',
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

### 3. HTTPS

**SEMPRE use HTTPS em produção!** Configure SSL/TLS com Let's Encrypt.

### 4. Rate Limiting

Implemente rate limiting para prevenir ataques de força bruta:

```typescript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: 'Muitas tentativas. Tente novamente em 15 minutos.'
});

app.use('/api/auth/login', authLimiter);
```

## 🧪 Testes

### Testar Login

```bash
curl -X POST https://auth.tgoo.eu/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "senha123",
    "platform": "dressme"
  }'
```

### Testar Profile

```bash
curl -X GET https://auth.tgoo.eu/api/auth/profile \
  -H "Authorization: Bearer <token>"
```

## 📊 Monitoramento

### Verificar Usuários por Plataforma

```sql
SELECT 
  p.name AS plataforma,
  u.role,
  COUNT(*) AS total
FROM users u
JOIN platforms p ON u.platformId = p.id
GROUP BY p.name, u.role
ORDER BY p.name, u.role;
```

### Usuários Ativos

```sql
SELECT 
  p.name AS plataforma,
  COUNT(*) AS usuarios_ativos
FROM users u
JOIN platforms p ON u.platformId = p.id
WHERE u.status = 'ACTIVE'
GROUP BY p.name;
```

## 🔄 Migração de Usuários Existentes

Se você já tem usuários no sistema antigo:

```sql
-- Todos os usuários existentes vão para a plataforma 'dressme'
UPDATE users SET platformId = 1 WHERE platformId IS NULL;
```

## 🆘 Troubleshooting

### Erro: "Plataforma inválida"

- Verifique se a plataforma existe: `SELECT * FROM platforms WHERE code = 'dressme';`
- Certifique-se que `isActive = true`
- Execute o seed se necessário: `npx prisma db seed`

### Erro: "Email já cadastrado nesta plataforma"

- Isso é correto! Mesmo email não pode existir 2x na mesma plataforma
- Se quiser usar o mesmo email em outra plataforma, faça login com `platform: 'outraplataforma'`

### ADMIN não vê usuários de outras plataformas

- Isso é o comportamento esperado!
- Apenas SUPER_ADMIN pode ver todas as plataformas
- Para tornar alguém SUPER_ADMIN, use outro SUPER_ADMIN ou o script `create-admin.js`

## ✅ Checklist de Implementação

- [x] Tabela `platforms` criada
- [x] Coluna `platformId` adicionada em `users`
- [x] Role `SUPER_ADMIN` implementada
- [x] Login validando plataforma
- [x] Middleware de autenticação atualizado
- [x] Rotas admin com filtro por plataforma
- [x] Frontend enviando plataforma no login/signup
- [x] Seed de plataformas
- [x] Script de criação de admin
- [x] Documentação completa

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do backend: `pm2 logs dressme-backend`
2. Verifique o banco de dados: `npx prisma studio`
3. Consulte esta documentação

---

**Desenvolvido por TGOO** 🚀

