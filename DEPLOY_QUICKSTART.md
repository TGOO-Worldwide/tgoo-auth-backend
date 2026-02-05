# ⚡ Deploy Rápido - Guia Express

Guia rápido para configurar o deploy automático com GitHub Actions em 5 minutos.

## 🚀 Início Rápido

### 1. Gerar Chave SSH (2 min)

```bash
# Gerar chave
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy_key

# Adicionar ao servidor
ssh-copy-id -i ~/.ssh/github_deploy_key.pub root@SEU_SERVIDOR

# Testar
ssh -i ~/.ssh/github_deploy_key root@SEU_SERVIDOR
```

### 2. Configurar GitHub Secrets (2 min)

**GitHub → Settings → Secrets → Actions → New secret**

Adicione:

```
SSH_HOST = 123.456.789.10 (ou seu-dominio.com)
SSH_USERNAME = root
SSH_PRIVATE_KEY = (conteúdo de ~/.ssh/github_deploy_key)
SSH_PORT = 22
PROJECT_PATH = /home/cloudpanel/htdocs/auth.tgoo.eu
```

**Como pegar a chave privada:**

```bash
cat ~/.ssh/github_deploy_key
```

Copie TUDO (incluindo `-----BEGIN` e `-----END`).

### 3. Setup Inicial no Servidor (1 min)

```bash
# Conectar
ssh root@SEU_SERVIDOR

# Ir para o diretório
cd /home/cloudpanel/htdocs/auth.tgoo.eu

# Clonar (se ainda não fez)
git clone https://github.com/SEU_USUARIO/tgoo-auth-backend.git .

# Criar .env
nano .env
```

**Mínimo necessário no .env:**

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/tgoo_auth_db"
JWT_SECRET="gere-com-openssl-rand-base64-32"
FRONTEND_URL="https://seu-dominio.com"
NODE_ENV=production
PORT=3001
```

```bash
# Instalar e iniciar
npm ci --production
npx prisma generate
npx prisma migrate deploy
npm run build
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Testar Deploy (30 seg)

```bash
# No seu PC
git add .
git commit -m "test: deploy automático"
git push origin main
```

**Acompanhar:** GitHub → Actions → Ver workflow rodando

## ✅ Pronto!

Agora todo push para `main` faz deploy automático! 🎉

## 🔍 Verificar

```bash
# No servidor
pm2 status
pm2 logs tgoo-auth-backend
curl http://localhost:3001/health
```

## 📚 Documentação Completa

- **Setup detalhado**: [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)
- **Variáveis de ambiente**: [ENV_VARIABLES.md](./ENV_VARIABLES.md)
- **Deploy manual**: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🆘 Problemas Comuns

### "Permission denied (publickey)"

```bash
# Verificar chave no servidor
ssh root@SEU_SERVIDOR "cat ~/.ssh/authorized_keys | grep github-deploy"
```

### "PM2 not found"

```bash
ssh root@SEU_SERVIDOR "npm install -g pm2"
```

### "Build failed"

```bash
# Testar build local
npm run build
```

---

**Dúvidas?** Veja [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md) para troubleshooting detalhado.
