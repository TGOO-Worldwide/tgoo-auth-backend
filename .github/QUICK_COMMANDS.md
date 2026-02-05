# ⚡ Comandos Rápidos - Deploy

Referência rápida de comandos mais usados no dia a dia.

---

## 🚀 Deploy

### Deploy Automático
```bash
# Fazer deploy (push para main)
git push origin main

# Ver status do deploy
# GitHub → Actions → Ver último workflow
```

### Deploy Manual via GitHub
```bash
# GitHub → Actions → "Deploy Automático via SSH" → Run workflow
```

### Deploy Manual no Servidor
```bash
ssh root@SEU_SERVIDOR
cd /home/cloudpanel/htdocs/auth.tgoo.eu
./deploy.sh
```

---

## 🔐 Configuração Inicial (Uma vez)

### 1. Gerar e Configurar SSH
```bash
# Gerar chave
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy_key

# Adicionar ao servidor
ssh-copy-id -i ~/.ssh/github_deploy_key.pub root@SEU_SERVIDOR

# Copiar chave privada (para GitHub Secret)
cat ~/.ssh/github_deploy_key
```

### 2. Testar Conexão
```bash
ssh -i ~/.ssh/github_deploy_key root@SEU_SERVIDOR
```

### 3. Adicionar Secrets no GitHub
```
GitHub → Settings → Secrets → Actions → New secret

SSH_HOST = seu-servidor.com
SSH_USERNAME = root
SSH_PRIVATE_KEY = [conteúdo de ~/.ssh/github_deploy_key]
SSH_PORT = 22
PROJECT_PATH = /home/cloudpanel/htdocs/auth.tgoo.eu
```

---

## 📊 Monitoramento

### Ver Logs
```bash
# Logs em tempo real
pm2 logs tgoo-auth-backend

# Últimas 50 linhas
pm2 logs tgoo-auth-backend --lines 50

# Apenas erros
pm2 logs tgoo-auth-backend --err

# Logs salvos
cat /home/cloudpanel/htdocs/auth.tgoo.eu/logs/combined.log
tail -f /home/cloudpanel/htdocs/auth.tgoo.eu/logs/combined.log
```

### Status
```bash
# Status do PM2
pm2 status

# Detalhes da aplicação
pm2 show tgoo-auth-backend

# Monitoramento em tempo real
pm2 monit
```

### Testar API
```bash
# Health check
curl http://localhost:3001/health

# Com domínio
curl https://seu-dominio.com/api/health
```

---

## 🔄 Gerenciar PM2

### Comandos Básicos
```bash
# Reiniciar
pm2 restart tgoo-auth-backend

# Parar
pm2 stop tgoo-auth-backend

# Iniciar
pm2 start tgoo-auth-backend

# Remover do PM2
pm2 delete tgoo-auth-backend
```

### Reconfigurar
```bash
# Se mudou ecosystem.config.js
pm2 reload ecosystem.config.js

# Salvar configuração
pm2 save

# Atualizar startup script
pm2 startup
```

---

## 🗃️ Banco de Dados

### Migrations
```bash
# Executar migrations (produção)
npx prisma migrate deploy

# Criar nova migration (dev)
npx prisma migrate dev --name nome_da_migration

# Resetar banco (⚠️ CUIDADO!)
npx prisma migrate reset
```

### Prisma Studio
```bash
# Abrir interface visual do banco
npx prisma studio --port 5555
```

### Backup
```bash
# Criar backup
mysqldump -u usuario -p tgoo_auth_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
mysql -u usuario -p tgoo_auth_db < backup_20260205_120000.sql
```

---

## 🛠️ Desenvolvimento

### Build Local
```bash
# Build
npm run build

# Build + watch
npm run build -- --watch
```

### Desenvolvimento
```bash
# Modo dev (com hot reload)
npm run dev

# Prisma Studio
npm run prisma:studio
```

### Prisma
```bash
# Gerar Prisma Client
npm run prisma:generate

# Validar schema
npx prisma validate

# Formatar schema
npx prisma format
```

---

## 🔒 Segurança

### Gerar Secrets
```bash
# JWT_SECRET
openssl rand -base64 32

# Senha forte
openssl rand -base64 24

# UUID
uuidgen
```

### Verificar .env
```bash
# Ver variáveis (SEM valores)
grep "^[A-Z]" .env | cut -d'=' -f1

# Verificar se DATABASE_URL existe
grep DATABASE_URL .env
```

---

## 🐛 Troubleshooting

### Reiniciar Tudo
```bash
# Parar PM2
pm2 stop tgoo-auth-backend

# Limpar cache do Node
rm -rf node_modules dist

# Reinstalar
npm ci --production
npm run build

# Iniciar
pm2 start ecosystem.config.js
```

### Verificar Processos
```bash
# Processos Node.js
ps aux | grep node

# Verificar porta 3001
netstat -tulpn | grep 3001
lsof -i :3001
```

### Verificar Banco
```bash
# Conectar ao MySQL
mysql -u usuario -p

# Ver bancos
SHOW DATABASES;

# Ver usuários
SELECT user, host FROM mysql.user;

# Testar conexão
mysql -u usuario -p tgoo_auth_db -e "SELECT 1;"
```

### Limpar Logs
```bash
# Limpar logs do PM2
pm2 flush

# Limpar arquivos de log
cd /home/cloudpanel/htdocs/auth.tgoo.eu
rm -f logs/*.log
```

---

## 📦 Dependências

### Atualizar
```bash
# Ver outdated
npm outdated

# Atualizar todas (cuidado!)
npm update

# Atualizar uma específica
npm update express

# Audit de segurança
npm audit
npm audit fix
```

---

## 🔄 Git

### Commits
```bash
# Status
git status

# Adicionar tudo
git add .

# Commit
git commit -m "feat: nova funcionalidade"

# Push (dispara deploy automático!)
git push origin main
```

### Rollback
```bash
# Ver último commit
git log -1

# Reverter último commit (cria novo commit)
git revert HEAD
git push origin main

# Voltar para commit específico
git reset --hard COMMIT_HASH
git push origin main --force  # ⚠️ CUIDADO!
```

### Branches
```bash
# Criar branch
git checkout -b feature/nova-funcionalidade

# Push da branch
git push origin feature/nova-funcionalidade

# Merge para main
git checkout main
git merge feature/nova-funcionalidade
git push origin main  # ← Deploy automático!
```

---

## 🌐 Nginx

### Testar Configuração
```bash
# Testar sintaxe
nginx -t

# Recarregar (sem downtime)
systemctl reload nginx

# Reiniciar (com downtime)
systemctl restart nginx

# Status
systemctl status nginx
```

### Ver Logs
```bash
# Access log
tail -f /home/cloudpanel/logs/auth.tgoo.eu_access.log

# Error log
tail -f /home/cloudpanel/logs/auth.tgoo.eu_error.log

# Nginx error log geral
tail -f /var/log/nginx/error.log
```

---

## 📱 Comandos Úteis do Sistema

### Espaço em Disco
```bash
# Ver espaço
df -h

# Tamanho de diretórios
du -sh /home/cloudpanel/htdocs/*

# Arquivos grandes
find . -type f -size +100M -exec ls -lh {} \;
```

### Memória
```bash
# Uso de memória
free -h

# Top processos
top
htop  # se instalado
```

### Processos
```bash
# Processos Node
ps aux | grep node

# Matar processo por porta
lsof -ti:3001 | xargs kill -9
```

---

## 🎯 Atalhos Úteis

### SSH com Alias
```bash
# Adicionar ao ~/.ssh/config (no seu PC)
Host tgoo-server
    HostName seu-servidor.com
    User root
    IdentityFile ~/.ssh/github_deploy_key
    Port 22

# Agora pode conectar assim:
ssh tgoo-server
```

### Aliases
```bash
# Adicionar ao ~/.bashrc (no servidor)
alias pm2-tgoo='pm2 logs tgoo-auth-backend'
alias deploy-tgoo='cd /home/cloudpanel/htdocs/auth.tgoo.eu && ./deploy.sh'
alias logs-tgoo='tail -f /home/cloudpanel/htdocs/auth.tgoo.eu/logs/combined.log'

# Recarregar
source ~/.bashrc
```

---

## 📚 Links Úteis

- [GitHub Actions Docs](https://docs.github.com/actions)
- [PM2 Docs](https://pm2.keymetrics.io/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Express Docs](https://expressjs.com/)

---

**💡 Dica**: Salve este arquivo nos favoritos para acesso rápido!
