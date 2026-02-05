# 🐛 Troubleshooting - Problemas Comuns

Soluções para os problemas mais comuns encontrados durante setup e deploy.

---

## 🏗️ Problemas de Build

### ❌ `tsc: not found`

**Erro completo:**
```
sh: 1: tsc: not found
```

**Causa:** TypeScript não está instalado. Acontece quando usa `npm ci --production` que ignora devDependencies.

**Solução:**

```bash
# Instalar TODAS as dependências
npm ci

# Agora o build funcionará
npm run build
```

**Por que acontece:**
- O TypeScript (`tsc`) está nas **devDependencies**
- `npm ci --production` instala apenas **dependencies**
- Mas precisamos do `tsc` para compilar TypeScript → JavaScript

**Solução permanente:**

Os scripts de deploy já foram atualizados para usar `npm ci` (sem `--production`), então isso não acontecerá mais.

---

### ❌ `Cannot find module '@prisma/client'`

**Causa:** Prisma Client não foi gerado.

**Solução:**

```bash
npx prisma generate
npm run build
```

---

### ❌ Erros de TypeScript durante build

**Exemplo:**
```
error TS2304: Cannot find name 'Express'
error TS2307: Cannot find module 'express'
```

**Solução:**

```bash
# Reinstalar dependências
rm -rf node_modules
npm ci
npm run build
```

---

## 🗄️ Problemas de Banco de Dados

### ❌ `P1001: Can't reach database server`

**Causa:** Banco de dados não está rodando ou DATABASE_URL está incorreto.

**Verificar:**

```bash
# MySQL está rodando?
systemctl status mysql

# Testar conexão
mysql -u usuario -p -e "SELECT 1;"

# Verificar DATABASE_URL
cat .env | grep DATABASE_URL
```

**Solução:**

```bash
# Iniciar MySQL
systemctl start mysql

# Se DATABASE_URL estiver errado, corrigir no .env
nano .env
# DATABASE_URL="mysql://usuario:senha@localhost:3306/tgoo_auth_db"
```

---

### ❌ `P1017: Server has closed the connection`

**Causa:** Muitas conexões ou timeout.

**Solução:**

```bash
# Reiniciar MySQL
systemctl restart mysql

# Verificar conexões
mysql -u root -p -e "SHOW PROCESSLIST;"
```

---

### ❌ `Error: P3009: migrate found failed migrations`

**Causa:** Migration anterior falhou.

**Solução:**

```bash
# Ver status das migrations
npx prisma migrate status

# Resetar migrations (⚠️ CUIDADO: apaga dados!)
npx prisma migrate reset

# Ou aplicar manualmente a migration que falhou
npx prisma migrate resolve --applied "20260105184740_init"
npx prisma migrate deploy
```

---

## 🔐 Problemas de SSH/GitHub Actions

### ❌ `Permission denied (publickey)`

**Causa:** Chave SSH não configurada corretamente.

**Verificar:**

```bash
# No servidor, ver authorized_keys
cat ~/.ssh/authorized_keys | grep github-deploy
```

**Solução:**

```bash
# No seu PC, adicionar chave novamente
ssh-copy-id -i ~/.ssh/github_deploy_key.pub root@SEU_SERVIDOR

# Testar conexão
ssh -i ~/.ssh/github_deploy_key root@SEU_SERVIDOR
```

**No GitHub:**
1. Verificar se `SSH_PRIVATE_KEY` está correto
2. Deve incluir `-----BEGIN OPENSSH PRIVATE KEY-----` e `-----END OPENSSH PRIVATE KEY-----`
3. Sem espaços extras no início ou fim

---

### ❌ `Host key verification failed`

**Causa:** Primeira conexão ou host key mudou.

**Solução no GitHub Actions:**

O workflow já está configurado para aceitar automaticamente. Se o erro persistir, adicione ao workflow:

```yaml
- name: Adicionar host às known_hosts
  run: |
    mkdir -p ~/.ssh
    ssh-keyscan ${{ secrets.SSH_HOST }} >> ~/.ssh/known_hosts
```

---

### ❌ `Diretório não encontrado` no deploy

**Causa:** `PROJECT_PATH` incorreto no GitHub Secret.

**Verificar:**

```bash
# No servidor, ver o caminho correto
ssh root@SEU_SERVIDOR
pwd
ls -la /home/cloudpanel/htdocs/
```

**Solução:**

Atualizar `PROJECT_PATH` no GitHub:
- GitHub → Settings → Secrets → Actions
- Editar `PROJECT_PATH`
- Use o caminho absoluto completo

---

## 🔄 Problemas com PM2

### ❌ `PM2 not found`

**Solução:**

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Verificar
pm2 --version
```

---

### ❌ PM2 não reinicia após reboot

**Solução:**

```bash
# Configurar startup
pm2 startup

# Copiar e executar o comando mostrado
# Exemplo: sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup...

# Salvar processos atuais
pm2 save
```

---

### ❌ `Application tgoo-auth-backend not found`

**Causa:** Aplicação não está registrada no PM2.

**Solução:**

```bash
# Listar aplicações
pm2 list

# Iniciar aplicação
cd /home/cloudpanel/htdocs/tgoo-auth-backend
pm2 start ecosystem.config.js

# Salvar
pm2 save
```

---

### ❌ PM2 mostra status "errored"

**Verificar logs:**

```bash
pm2 logs tgoo-auth-backend --lines 50
```

**Causas comuns:**
1. Porta já em uso
2. .env não configurado
3. Banco de dados inacessível
4. Erro no código

**Solução:**

```bash
# Ver porta em uso
lsof -i :3001

# Matar processo na porta
lsof -ti:3001 | xargs kill -9

# Reiniciar
pm2 restart tgoo-auth-backend
```

---

## 🌐 Problemas de CORS

### ❌ `Access-Control-Allow-Origin error`

**Causa:** Frontend não está na lista de origens permitidas.

**Solução:**

```bash
# No servidor, editar .env
nano .env

# Adicionar URL do frontend
FRONTEND_URL="https://seu-frontend.com"

# Reiniciar
pm2 restart tgoo-auth-backend
```

**No código (`src/index.ts`):**

```typescript
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL || '',
  'https://seu-dominio.com'  // Adicionar aqui
].filter(origin => origin !== '');
```

---

## 📦 Problemas com Dependências

### ❌ `npm ERR! code EINTEGRITY`

**Causa:** Cache corrompido.

**Solução:**

```bash
# Limpar cache
npm cache clean --force

# Reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

### ❌ `gyp ERR! ... Python not found`

**Causa:** Algumas dependências precisam de Python para compilar.

**Solução (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install python3 python3-pip build-essential
```

---

## 🔒 Problemas de Permissão

### ❌ `EACCES: permission denied`

**Causa:** Sem permissão para escrever em diretórios.

**Solução:**

```bash
# Verificar dono dos arquivos
ls -la /home/cloudpanel/htdocs/tgoo-auth-backend

# Corrigir permissões (ajustar usuário conforme necessário)
sudo chown -R $USER:$USER /home/cloudpanel/htdocs/tgoo-auth-backend
```

---

### ❌ `Cannot write to logs/`

**Solução:**

```bash
# Criar diretório de logs
mkdir -p logs

# Dar permissões
chmod 755 logs
```

---

## 🚀 Problemas de Deploy

### ❌ Deploy fica "travado" no GitHub Actions

**Causas comuns:**
1. Comando aguardando input (ex: senha)
2. Processo em loop infinito
3. Timeout de rede

**Solução:**

1. **Cancelar workflow** no GitHub Actions
2. **Verificar logs** para ver onde travou
3. **Conectar via SSH** e verificar o servidor manualmente

```bash
ssh root@SEU_SERVIDOR
pm2 logs tgoo-auth-backend
```

---

### ❌ Build funciona localmente mas falha no servidor

**Causa:** Versões diferentes de Node.js ou dependências.

**Verificar:**

```bash
# No servidor
node --version
npm --version

# Localmente
node --version
npm --version
```

**Solução:**

```bash
# Instalar mesma versão do Node.js
# Usando nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

---

## 🔍 Problemas de Logs

### ❌ Logs muito grandes

**Solução:**

```bash
# Limpar logs do PM2
pm2 flush

# Limpar arquivos de log
cd /home/cloudpanel/htdocs/tgoo-auth-backend
rm -f logs/*.log

# Configurar rotação de logs no ecosystem.config.js
# Adicionar:
log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
max_size: '10M',
max_files: 5
```

---

## 🌍 Problemas de Nginx

### ❌ `502 Bad Gateway`

**Causa:** Backend não está rodando ou porta incorreta.

**Verificar:**

```bash
# Backend está rodando?
pm2 status

# Porta correta?
curl http://localhost:3001/health

# Nginx configurado corretamente?
nginx -t
```

**Solução:**

```bash
# Iniciar backend
pm2 start tgoo-auth-backend

# Recarregar Nginx
systemctl reload nginx
```

---

### ❌ `404 Not Found` em rotas da API

**Causa:** Configuração do Nginx não está fazendo proxy corretamente.

**Verificar configuração:**

```nginx
location /api {
    proxy_pass http://localhost:3001;
    # ... outras configurações
}
```

---

## 📊 Debug Geral

### Comandos Úteis de Debug

```bash
# Ver processos Node.js
ps aux | grep node

# Ver portas em uso
netstat -tulpn | grep LISTEN

# Ver uso de memória
free -h

# Ver espaço em disco
df -h

# Ver logs do sistema
journalctl -xe

# Ver logs do Nginx
tail -f /var/log/nginx/error.log

# Testar conexão com banco
mysql -u usuario -p -e "SELECT 1;"

# Ver variáveis de ambiente
pm2 show tgoo-auth-backend | grep env
```

---

## 🆘 Ainda com Problemas?

### 1. Verificar Checklist

Siga: [.github/DEPLOY_CHECKLIST.md](./.github/DEPLOY_CHECKLIST.md)

### 2. Ver Documentação Completa

- [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)
- [ENV_VARIABLES.md](./ENV_VARIABLES.md)

### 3. Comandos de Emergência

```bash
# Reiniciar tudo
pm2 restart tgoo-auth-backend
systemctl restart nginx
systemctl restart mysql

# Deploy manual
./deploy.sh

# Logs completos
pm2 logs tgoo-auth-backend --lines 100
```

### 4. Limpar e Reinstalar

```bash
# Backup do .env
cp .env .env.backup

# Limpar tudo
rm -rf node_modules dist

# Reinstalar
npm ci
npx prisma generate
npm run build

# Reiniciar
pm2 restart tgoo-auth-backend
```

---

**💡 Dica:** Sempre verifique os logs primeiro!

```bash
pm2 logs tgoo-auth-backend
```

A maioria dos problemas pode ser diagnosticada olhando os logs.
