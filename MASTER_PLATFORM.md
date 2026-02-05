# 👑 Sistema de Plataforma Master e SUPER_ADMIN Universal

## 📋 Visão Geral

O TGOO Auth Backend implementa um sistema hierárquico onde existe uma **Plataforma Master** que gerencia usuários **SUPER_ADMIN** com acesso universal a todas as plataformas do ecossistema.

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    Plataforma Master                        │
│                    (auth_tgoo)                              │
│                    isMaster: true                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  👤 SUPER_ADMIN                                             │
│     Email: admin@tgoo.eu                                    │
│     Role: SUPER_ADMIN                                       │
│     Acesso: TODAS as plataformas                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Pode autenticar em:
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
  ┌──────────┐        ┌──────────┐        ┌──────────┐
  │ DressMe  │        │  Outro   │        │  Outro   │
  │ Platform │        │ Projeto  │        │ Projeto  │
  └──────────┘        └──────────┘        └──────────┘
```

## 🔐 Fluxo de Autenticação

### 1. Usuário SUPER_ADMIN autenticando

```javascript
POST /api/auth/login
{
  "email": "admin@tgoo.eu",
  "password": "Senha@123",
  "platform": "dressme"  // Plataforma de destino
}
```

**Fluxo interno:**

```
1. Buscar plataforma master (isMaster: true)
   ↓
2. Verificar se admin@tgoo.eu existe na plataforma master
   ↓
3. Verificar se role === 'SUPER_ADMIN'
   ↓ SIM
4. Validar senha
   ↓ VÁLIDA
5. ✅ APROVAR LOGIN na plataforma "dressme"
   ↓
6. Gerar token JWT com:
   - id: ID do usuário SUPER_ADMIN
   - email: admin@tgoo.eu
   - role: SUPER_ADMIN
   - platformId: ID da plataforma master
   - targetPlatform: "dressme"
   - isSuperAdminAccess: true
```

### 2. Usuário normal autenticando

```javascript
POST /api/auth/login
{
  "email": "user@dressme.com",
  "password": "senha123",
  "platform": "dressme"
}
```

**Fluxo interno:**

```
1. Buscar plataforma master
   ↓
2. Verificar se user@dressme.com é SUPER_ADMIN da master
   ↓ NÃO
3. Buscar user@dressme.com na plataforma "dressme"
   ↓ ENCONTRADO
4. Validar senha
   ↓ VÁLIDA
5. ✅ APROVAR LOGIN na plataforma "dressme"
   ↓
6. Gerar token JWT normal
```

## 🚀 Configuração Inicial

### 1. Executar Script de Configuração

```bash
cd backend
node scripts/setup-master-platform.js
```

### 2. Configuração Interativa

O script irá perguntar:

```
📋 Dados da Plataforma Principal:

Código da plataforma (auth_tgoo): 
Nome da plataforma (TGOO Auth): 
Domínio da plataforma (opcional): auth.tgoo.eu
Descrição da plataforma (opcional): Plataforma Master para gerenciamento de SUPER_ADMIN

👤 Dados do SUPER_ADMIN:

Email do SUPER_ADMIN (admin@tgoo.eu): 
Senha do SUPER_ADMIN (Senha@123): 
Nome completo do SUPER_ADMIN (opcional): Administrador TGOO
```

### 3. Configuração via Variáveis de Ambiente

```bash
MASTER_PLATFORM_CODE=auth_tgoo \
MASTER_PLATFORM_NAME="TGOO Auth" \
MASTER_ADMIN_EMAIL=admin@tgoo.eu \
MASTER_ADMIN_PASSWORD=Senha@123 \
node scripts/setup-master-platform.js
```

## 📊 Modelo de Dados

### Platform

```prisma
model Platform {
  id          Int      @id @default(autoincrement())
  code        String   @unique
  name        String
  domain      String?
  description String?  @db.Text
  isActive    Boolean  @default(true)
  isMaster    Boolean  @default(false)  // ⭐ Marca a plataforma master
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  users       User[]
}
```

### User

```prisma
model User {
  id           Int      @id @default(autoincrement())
  email        String
  password     String
  fullName     String?
  role         Role     @default(USER)
  status       Status   @default(PENDING)
  platformId   Int
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  platform     Platform @relation(fields: [platformId])
  
  @@unique([email, platformId])
}

enum Role {
  USER
  ADMIN
  SUPER_ADMIN  // ⭐ Apenas na plataforma master
}
```

## 🔑 Estrutura do Token JWT

### Token de SUPER_ADMIN (acesso universal)

```javascript
{
  "id": 1,
  "email": "admin@tgoo.eu",
  "role": "SUPER_ADMIN",
  "platformId": 100,              // ID da plataforma master
  "platform": "auth_tgoo",        // Código da plataforma master
  "targetPlatform": "dressme",    // Plataforma que está acessando
  "isSuperAdminAccess": true      // Flag de acesso universal
}
```

### Token de usuário normal

```javascript
{
  "id": 42,
  "email": "user@dressme.com",
  "role": "USER",
  "platformId": 2,
  "platform": "dressme"
}
```

## 🎯 Casos de Uso

### 1. SUPER_ADMIN gerenciando múltiplas plataformas

```javascript
// Login na plataforma DressMe
const responseDressMe = await fetch('http://auth.tgoo.eu/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@tgoo.eu',
    password: 'Senha@123',
    platform: 'dressme'
  })
});

const { token: tokenDressMe } = await responseDressMe.json();

// Login em outra plataforma
const responseProjeto2 = await fetch('http://auth.tgoo.eu/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@tgoo.eu',
    password: 'Senha@123',
    platform: 'projeto2'
  })
});

const { token: tokenProjeto2 } = await responseProjeto2.json();

// Usar tokens para acessar APIs específicas de cada plataforma
```

### 2. Criar nova plataforma (apenas SUPER_ADMIN)

```javascript
const response = await fetch('http://auth.tgoo.eu/api/admin/platforms', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${tokenSuperAdmin}`
  },
  body: JSON.stringify({
    code: 'novo_projeto',
    name: 'Novo Projeto',
    domain: 'novoprojeto.tgoo.eu',
    description: 'Descrição do novo projeto'
  })
});
```

### 3. Gerenciar usuários de qualquer plataforma

```javascript
// Listar usuários da plataforma "dressme"
const response = await fetch('http://auth.tgoo.eu/api/admin/users?platform=dressme', {
  headers: {
    'Authorization': `Bearer ${tokenSuperAdmin}`
  }
});

const users = await response.json();
```

## 🔒 Segurança

### Restrições

1. **Apenas uma plataforma master**: Somente uma plataforma pode ter `isMaster: true`
2. **SUPER_ADMIN exclusivo**: Role `SUPER_ADMIN` só pode existir na plataforma master
3. **Validação de senha**: Mesmo SUPER_ADMIN precisa fornecer senha correta
4. **Status de conta**: SUPER_ADMIN deve estar com `status: ACTIVE`

### Boas Práticas

- ✅ Use senhas fortes para SUPER_ADMIN
- ✅ Mantenha backup das credenciais do SUPER_ADMIN
- ✅ Limite o número de usuários com role SUPER_ADMIN
- ✅ Monitore logs de acesso do SUPER_ADMIN
- ✅ Use HTTPS em produção
- ✅ Configure expiração adequada dos tokens JWT

## 🧪 Testando

### 1. Verificar plataforma master

```bash
# Via Prisma Studio
npm run prisma:studio

# Ou via MySQL
docker exec -it dressme-mysql mysql -u dressme_user -pdressme_pass dressme

SELECT id, code, name, isMaster FROM platforms WHERE isMaster = 1;
```

### 2. Testar login SUPER_ADMIN em diferentes plataformas

```bash
# Login na plataforma master
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tgoo.eu",
    "password": "Senha@123",
    "platform": "auth_tgoo"
  }'

# Login em outra plataforma (acesso universal)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tgoo.eu",
    "password": "Senha@123",
    "platform": "dressme"
  }'
```

### 3. Verificar token JWT

Use [jwt.io](https://jwt.io) para decodificar o token e verificar os campos:
- `isSuperAdminAccess: true`
- `targetPlatform`: plataforma acessada

## 📝 Referências

- [README Principal](./README.md)
- [Scripts de Administração](./scripts/README.md)
- [Guia de Integração](./INTEGRATION_GUIDE.md)
- [Arquitetura Multi-Plataforma](./MULTI_PLATFORM_AUTH.md)

---

**Desenvolvido por TGOO** 🚀
