# 🚀 COMECE AQUI - Deploy Automático Configurado!

## ✅ O Que Foi Configurado

Sistema completo de **deploy automático** usando **GitHub Actions** via **SSH** para seu servidor **Cloud Panel**.

---

## 🎯 Como Usar (3 Passos)

### 1️⃣ Configurar Secrets no GitHub (5 min)

**GitHub → Settings → Secrets → Actions**

Adicione estes 5 secrets:

```
SSH_HOST          = IP ou domínio do servidor
SSH_USERNAME      = root (ou seu usuário SSH)
SSH_PRIVATE_KEY   = Chave privada SSH (ver abaixo)
SSH_PORT          = 22
PROJECT_PATH      = /home/cloudpanel/htdocs/auth.tgoo.eu
```

**Como obter SSH_PRIVATE_KEY:**

```bash
# Gerar chave
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy_key

# Adicionar ao servidor
ssh-copy-id -i ~/.ssh/github_deploy_key.pub root@SEU_SERVIDOR

# Copiar para GitHub Secret
cat ~/.ssh/github_deploy_key
# Copie TUDO (incluindo -----BEGIN e -----END)
```

### 2️⃣ Setup Inicial no Servidor (5 min)

```bash
# Conectar
ssh root@SEU_SERVIDOR

# Ir para diretório
cd /home/cloudpanel/htdocs/auth.tgoo.eu

# Clonar (se ainda não fez)
git clone https://github.com/SEU_USUARIO/tgoo-auth-backend.git .

# Criar .env
nano .env
```

**Conteúdo mínimo do .env:**
```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/tgoo_auth_db"
JWT_SECRET="gere-com-openssl-rand-base64-32"
FRONTEND_URL="https://seu-dominio.com"
NODE_ENV=production
PORT=3001
```

**Continuar:**
```bash
npm ci --production
npx prisma generate
npx prisma migrate deploy
npm run build
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 3️⃣ Testar Deploy (1 min)

```bash
# No seu PC
git commit -m "test: deploy automático" --allow-empty
git push origin main

# Acompanhar: GitHub → Actions
```

---

## 🎉 Pronto!

Agora todo **push para main** faz **deploy automático**!

---

## 📚 Documentação Disponível

### 🚀 Para Começar (LEIA ESTES)

1. **[DEPLOY_QUICKSTART.md](./DEPLOY_QUICKSTART.md)**
   - ⚡ 5 minutos
   - Setup rápido
   - Comandos essenciais

2. **[.github/DEPLOY_CHECKLIST.md](./.github/DEPLOY_CHECKLIST.md)**
   - ✅ Checklist completa
   - 11 seções
   - Verificar tudo

### 📖 Documentação Completa

3. **[GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)**
   - 📖 Guia detalhado
   - Troubleshooting
   - Exemplos

4. **[ENV_VARIABLES.md](./ENV_VARIABLES.md)**
   - 🔐 Todas as variáveis
   - Como gerar secrets
   - Exemplos dev/prod

5. **[DEPLOY_SUMMARY.md](./DEPLOY_SUMMARY.md)**
   - 📋 Visão geral
   - Fluxo de deploy
   - Referências

### ⚡ Referência Rápida

6. **[.github/QUICK_COMMANDS.md](./.github/QUICK_COMMANDS.md)**
   - ⚡ Comandos do dia a dia
   - PM2, Git, SSH, etc
   - Troubleshooting

7. **[.github/README.md](./.github/README.md)**
   - 🤖 Sobre os workflows
   - Como funcionam
   - Status badges

---

## 🔄 Fluxo Visual

```
┌─────────────────────────────────────────────────────┐
│  👨‍💻 VOCÊ                                            │
│                                                     │
│  git add .                                          │
│  git commit -m "feat: nova funcionalidade"         │
│  git push origin main                              │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  🤖 GITHUB ACTIONS (Automático)                     │
│                                                     │
│  ✓ Checkout código                                 │
│  ✓ Build local                                     │
│  ✓ Conectar SSH                                    │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  🖥️ SERVIDOR                                        │
│                                                     │
│  ✓ Atualizar código (git pull)                     │
│  ✓ Instalar dependências                           │
│  ✓ Executar migrations                             │
│  ✓ Build                                           │
│  ✓ Reiniciar PM2                                   │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  🎉 APLICAÇÃO ATUALIZADA!                           │
│                                                     │
│  Duração: ~2-3 minutos                             │
│  Status: GitHub → Actions                          │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Arquivos Criados

```
✅ .github/workflows/deploy.yml       # Deploy automático
✅ .github/workflows/ci.yml           # CI para PRs
✅ .github/DEPLOY_CHECKLIST.md        # Checklist
✅ .github/QUICK_COMMANDS.md          # Comandos
✅ .github/README.md                  # Sobre workflows
✅ deploy.sh                          # Deploy manual
✅ GITHUB_ACTIONS_SETUP.md            # Guia completo
✅ DEPLOY_QUICKSTART.md               # Guia rápido
✅ DEPLOY_SUMMARY.md                  # Resumo
✅ ENV_VARIABLES.md                   # Variáveis
✅ START_HERE.md                      # Este arquivo
✅ .gitignore (atualizado)            # Segurança
✅ README.md (atualizado)             # Links
```

---

## 🎯 Próximos Passos

1. ✅ **Ler**: [DEPLOY_QUICKSTART.md](./DEPLOY_QUICKSTART.md)
2. ✅ **Configurar**: Secrets no GitHub
3. ✅ **Setup**: Servidor (primeira vez)
4. ✅ **Testar**: Push para main
5. ✅ **Verificar**: GitHub → Actions
6. 🎉 **Celebrar**: Deploy automático funcionando!

---

## 🆘 Precisa de Ajuda?

### Problemas Comuns

**"Permission denied"**
→ [Checklist](./.github/DEPLOY_CHECKLIST.md) seção 1

**"PM2 not found"**
→ `ssh root@SEU_SERVIDOR "npm install -g pm2"`

**"Build failed"**
→ Testar local: `npm run build`

**"Database error"**
→ Verificar .env no servidor

### Documentação

1. **Início rápido**: [DEPLOY_QUICKSTART.md](./DEPLOY_QUICKSTART.md)
2. **Troubleshooting**: [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md#-troubleshooting)
3. **Checklist**: [.github/DEPLOY_CHECKLIST.md](./.github/DEPLOY_CHECKLIST.md)

---

## ⚡ Comandos Mais Usados

```bash
# Ver status do deploy
# GitHub → Actions

# Ver logs no servidor
pm2 logs tgoo-auth-backend

# Deploy manual
ssh root@SEU_SERVIDOR
cd /home/cloudpanel/htdocs/auth.tgoo.eu
./deploy.sh

# Reiniciar aplicação
pm2 restart tgoo-auth-backend

# Ver status
pm2 status
```

Mais comandos: [.github/QUICK_COMMANDS.md](./.github/QUICK_COMMANDS.md)

---

## 💡 Dicas

- ✅ **Sempre testar localmente** antes de fazer push
- ✅ **Monitorar logs** após deploy: `pm2 logs`
- ✅ **Usar branches** para features: `git checkout -b feature/nome`
- ✅ **Pull requests** ativam CI automático
- ✅ **Backup do .env** antes de mudanças importantes

---

## 🎊 Parabéns!

Você agora tem um sistema de **deploy automático profissional**! 🚀

**Desenvolvido com ❤️ para facilitar sua vida**

---

**📝 Lembre-se**: Comece pelo [DEPLOY_QUICKSTART.md](./DEPLOY_QUICKSTART.md) - 5 minutos para configurar tudo!
