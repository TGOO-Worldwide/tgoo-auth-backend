# 📝 Scripts de Administração

## 🔐 Configurar Plataforma Principal (Master)

**IMPORTANTE:** Execute este script PRIMEIRO para configurar a plataforma principal que gerencia os SUPER_ADMIN.

### Script de Configuração Rápida

```bash
cd backend
node scripts/setup-master-platform.js
```

Este script irá:

1. Criar ou atualizar a plataforma principal (master)
2. Criar o usuário SUPER_ADMIN da plataforma principal
3. Permitir que o SUPER_ADMIN acesse TODAS as plataformas

**Valores padrão:**
- Plataforma: `auth_tgoo` (ID: 100 ou próximo disponível)
- Nome: `TGOO Auth`
- Email SUPER_ADMIN: `admin@tgoo.eu`
- Senha SUPER_ADMIN: `Senha@123`
- Role: `SUPER_ADMIN`
- Status: `ACTIVE`

**Variáveis de ambiente opcionais:**

```bash
MASTER_PLATFORM_CODE=auth_tgoo \
MASTER_PLATFORM_NAME="TGOO Auth" \
MASTER_ADMIN_EMAIL=admin@tgoo.eu \
MASTER_ADMIN_PASSWORD=Senha@123 \
node scripts/setup-master-platform.js
```

### Como funciona a hierarquia de autenticação:

1. **Plataforma Principal (Master)**: `auth_tgoo` com `isMaster: true`
2. **SUPER_ADMIN**: Usuário com role `SUPER_ADMIN` na plataforma master
3. **Autenticação Universal**: O SUPER_ADMIN pode se autenticar em QUALQUER plataforma

**Exemplo de autenticação:**

```bash
# SUPER_ADMIN autenticando na plataforma "dressme"
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tgoo.eu",
    "password": "Senha@123",
    "platform": "dressme"
  }'
```

O sistema irá:
1. ✓ Verificar se `admin@tgoo.eu` é SUPER_ADMIN da plataforma master
2. ✓ Se SIM → Aprovar login na plataforma `dressme`
3. ✗ Se NÃO → Verificar se é usuário da plataforma `dressme`

## 🎯 Criar Usuários Admin/SUPER_ADMIN

### Método 1: Via Linha de Comando (Recomendado)

```bash
cd backend
node scripts/create-admin-simple.js <email> <senha> "<nome>" <plataforma> <role>
```

**Exemplo - Criar SUPER_ADMIN:**

```bash
node scripts/create-admin-simple.js admin@tgoo.eu Senha@123 "Admin TGOO" dressme SUPER_ADMIN
```

**Exemplo - Criar ADMIN:**

```bash
node scripts/create-admin-simple.js admin@dressme.eu Senha123 "Admin DressMe" dressme ADMIN
```

**Exemplo - Criar USER:**

```bash
node scripts/create-admin-simple.js user@test.com Senha123 "Usuário Teste" dressme USER
```

#### Roles Disponíveis:

- `USER` - Usuário comum
- `ADMIN` - Administrador da plataforma
- `SUPER_ADMIN` - Super administrador (gerencia todas as plataformas)

#### Plataformas Disponíveis:

- `dressme` - Plataforma DressMe
- (Outras plataformas criadas pelo SUPER_ADMIN)

### Método 2: Via NPM Script

```bash
cd backend
npm run create-admin:simple admin@tgoo.eu Senha123 "Admin" dressme SUPER_ADMIN
```

### Método 3: Interativo (Opcional - pode ter problemas com stdin)

```bash
cd backend
node scripts/create-admin.js
```

**Nota:** O método interativo pode não funcionar em todos os ambientes. Use o método 1 se tiver problemas.

## 🔍 Verificar Usuários Criados

### Via Prisma Studio:

```bash
cd backend
npm run prisma:studio
```

Acesse `http://localhost:5555` e navegue para a tabela `users`.

### Via MySQL:

```bash
docker exec -it dressme-mysql mysql -u dressme_user -pdressme_pass dressme
```

```sql
SELECT u.id, u.email, u.fullName, u.role, u.status, p.name AS platform
FROM users u
JOIN platforms p ON u.platformId = p.id;
```

## 🧪 Testar Login

Após criar o usuário, teste o login:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tgoo.eu",
    "password": "Senha@123",
    "platform": "dressme"
  }'
```

Resposta esperada:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@tgoo.eu",
    "fullName": "Admin TGOO",
    "role": "SUPER_ADMIN",
    "status": "ACTIVE",
    "platform": {
      "id": 1,
      "code": "dressme",
      "name": "DressMe"
    }
  }
}
```

## 🚨 Troubleshooting

### Erro: "Plataforma não encontrada"

Execute o seed para criar a plataforma DressMe:

```bash
cd backend
npm run prisma:seed
```

### Erro: "Email já cadastrado"

Esse email já existe nesta plataforma. Use outro email ou faça login com as credenciais existentes.

### Erro: "Senha deve ter no mínimo 6 caracteres"

A senha deve ter pelo menos 6 caracteres.

## 💡 Dicas

1. **Primeiro Usuário**: Sempre crie um SUPER_ADMIN primeiro
2. **Senhas Fortes**: Use senhas fortes em produção
3. **Backup**: Anote as credenciais do SUPER_ADMIN em local seguro
4. **Reset de Senha**: SUPER_ADMIN pode resetar senhas de qualquer usuário via API

