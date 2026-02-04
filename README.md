# 🔐 TGOO Auth Backend

Backend de autenticação centralizado para todas as plataformas TGOO.

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

# Criar primeiro SUPER_ADMIN
npm run create-admin:simple admin@tgoo.eu Senha@123 "Admin TGOO" dressme SUPER_ADMIN

# Iniciar servidor
npm run dev
```

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
- [🏢 Arquitetura Multi-Plataforma](./MULTI_PLATFORM_AUTH.md)
- [🚀 Deploy](./DEPLOYMENT.md)

### 💻 Exemplos Práticos
Todos os exemplos estão em [`/examples`](./examples/):
- ⚛️ [React + TypeScript](./examples/quickstart-react.tsx)
- 🟢 [Vue 3 + Composition API](./examples/quickstart-vue.js)
- 🐍 [Python](./examples/quickstart-python.py)
- 🔧 [cURL / Shell Script](./examples/quickstart-curl.sh)
- 📮 [Postman Collection](./examples/TGOO-Auth.postman_collection.json)
- 📖 [README dos Exemplos](./examples/README.md)

## 🌐 Deploy

Hospedar em domínio dedicado: `auth.tgoo.eu` ou `api.tgoo.eu`

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação ou abra uma issue.

---

**Desenvolvido por TGOO** 🚀
