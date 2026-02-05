# 🔐 TGOO Auth Backend

Backend de autenticação centralizado para todas as plataformas TGOO com suporte a **Plataforma Master** e **SUPER_ADMIN Universal**.

## ✨ Recursos Principais

- 🔐 **Autenticação Multi-Plataforma**: Cada plataforma tem seus próprios usuários
- 👑 **Plataforma Master**: Plataforma principal que gerencia os SUPER_ADMIN
- 🌐 **SUPER_ADMIN Universal**: Acesso a TODAS as plataformas com uma única conta
- 🛡️ **Hierarquia de Acesso**: Sistema de permissões em três níveis (USER, ADMIN, SUPER_ADMIN)
- 🔑 **JWT Authentication**: Tokens seguros com expiração
- 📊 **Gerenciamento Centralizado**: Controle total via API

## 🚀 Para Desenvolvedores

**Quer integrar sua aplicação?** Consulte o [📖 Guia de Integração](./INTEGRATION_GUIDE.md)

Exemplos práticos disponíveis em [`/examples`](./examples/):
- ⚛️ React + TypeScript
- 🟢 Vue 3 + Composition API
- 🐍 Python
- 🔧 cURL / Shell Script
- 📮 Postman Collection

## 🚀 Stack

- Node.js + Express
- TypeScript
- Prisma ORM
- MySQL 8.0
- JWT Authentication
- Docker Compose

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env
# Edite .env com suas configurações

# Iniciar banco de dados
docker-compose up -d

# Executar migrations
npm run prisma:migrate

# Popular banco (seed)
npm run prisma:seed

# ⚠️ IMPORTANTE: Configurar Plataforma Master e SUPER_ADMIN
node scripts/setup-master-platform.js

# Iniciar servidor
npm run dev
```

### 🔐 Configuração da Plataforma Master

O sistema utiliza uma **Plataforma Master** para gerenciar os SUPER_ADMIN que podem acessar todas as plataformas.

Execute o script de configuração:

```bash
node scripts/setup-master-platform.js
```

**Configuração padrão:**
- **Plataforma**: `auth_tgoo` (marcada como `isMaster: true`)
- **SUPER_ADMIN**: `admin@tgoo.eu` / `Senha@123`
- **Acesso**: O SUPER_ADMIN pode autenticar-se em QUALQUER plataforma

**Como funciona:**

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

**Fluxo de autenticação:**

1. ✅ Verifica se é SUPER_ADMIN da plataforma master (`auth_tgoo`)
2. ✅ Se SIM → Aprova o login na plataforma solicitada (`dressme`)
3. ⏭️ Se NÃO → Verifica se é usuário normal da plataforma (`dressme`)

Veja mais detalhes em [scripts/README.md](./scripts/README.md)

## 🔌 API Endpoints

### Públicos
- `GET /api/auth/platforms` - Listar plataformas
- `POST /api/auth/login` - Login
- `POST /api/auth/signup` - Registro

### Autenticados
- `GET /api/auth/profile` - Perfil do usuário
- `POST /api/password/change` - Alterar senha
- `GET /api/api-key/gemini` - Obter chave API
- `POST /api/api-key/gemini` - Salvar chave API

### Admin (ADMIN/SUPER_ADMIN)
- `GET /api/admin/users` - Listar usuários
- `POST /api/admin/users` - Criar usuário
- `PATCH /api/admin/users/:id` - Atualizar usuário
- `POST /api/admin/users/:id/reset-password` - Resetar senha

### Super Admin (SUPER_ADMIN)
- `GET /api/admin/platforms` - Listar plataformas
- `POST /api/admin/platforms` - Criar plataforma
- `PATCH /api/admin/platforms/:id` - Atualizar plataforma

## 📖 Documentação

### 🚀 Começando
- [⚡ Quick Start](./QUICKSTART.md) - **Comece em 5 minutos!**
- [🔌 Guia de Integração Completo](./INTEGRATION_GUIDE.md) - **Documentação detalhada**
- [📋 Resumo da Documentação](./INTEGRATION_SUMMARY.md) - Visão geral de todos os recursos

### 🏗️ Arquitetura e Deploy
- [👑 Sistema de Plataforma Master](./MASTER_PLATFORM.md) - **SUPER_ADMIN Universal**
- [🏢 Arquitetura Multi-Plataforma](./MULTI_PLATFORM_AUTH.md)
- [⚡ Deploy Automático (Quickstart)](./DEPLOY_QUICKSTART.md) - **GitHub Actions (5 min)**
- [📖 Deploy Automático (Completo)](./GITHUB_ACTIONS_SETUP.md) - **Guia detalhado**
- [✅ Checklist de Deploy](./.github/DEPLOY_CHECKLIST.md) - **Verificar configuração**
- [🚀 Deploy Manual](./DEPLOYMENT.md) - **Cloud Panel**
- [🔐 Variáveis de Ambiente](./ENV_VARIABLES.md) - **Configuração completa**

### 📝 Scripts e Administração
- [Scripts de Administração](./scripts/README.md) - Criação de usuários e configuração

### 💻 Exemplos Práticos
Todos os exemplos estão em [`/examples`](./examples/):
- ⚛️ [React + TypeScript](./examples/quickstart-react.tsx)
- 🟢 [Vue 3 + Composition API](./examples/quickstart-vue.js)
- 🐍 [Python](./examples/quickstart-python.py)
- 🔧 [cURL / Shell Script](./examples/quickstart-curl.sh)
- 📮 [Postman Collection](./examples/TGOO-Auth.postman_collection.json)
- 📖 [README dos Exemplos](./examples/README.md)

## 🌐 Deploy

### Deploy Automático com GitHub Actions

Este projeto está configurado com deploy automático via GitHub Actions + SSH:

- ⚡ [Guia Rápido (5 min)](./DEPLOY_QUICKSTART.md) - Começar agora!
- 📖 [Documentação Completa](./GITHUB_ACTIONS_SETUP.md) - Setup detalhado
- ✅ [Checklist de Configuração](./.github/DEPLOY_CHECKLIST.md) - Verificar tudo

**Como funciona:**
1. 🔨 Push para `main/master` → Deploy automático inicia
2. 🚀 GitHub Actions faz build e conecta via SSH
3. 🔄 Atualiza código, executa migrations e reinicia PM2
4. ✅ Aplicação atualizada em produção!

### Deploy Manual

Se preferir deploy manual, veja:
- 📘 [DEPLOYMENT.md](./DEPLOYMENT.md) - Guia de deploy para Cloud Panel
- 🔧 Script: `./deploy.sh` - Deploy manual no servidor

**Hospedar em:** `auth.tgoo.eu` ou `api.tgoo.eu`

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação ou abra uma issue.

---

**Desenvolvido por TGOO** 🚀
