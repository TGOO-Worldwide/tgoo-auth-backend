# 🔐 DressMe Auth Backend

Backend de autenticação centralizado para todas as plataformas TGOO.

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

- [Arquitetura Multi-Plataforma](./MULTI_PLATFORM_AUTH.md)
- [Deploy](./DEPLOYMENT.md)

## 🌐 Deploy

Hospedar em domínio dedicado: `auth.tgoo.eu` ou `api.tgoo.eu`

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação ou abra uma issue.

---

**Desenvolvido por TGOO** 🚀
