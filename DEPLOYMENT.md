# 🚀 Guia de Deploy - DressMe no CloudPanel

Este guia detalha como hospedar a aplicação DressMe no CloudPanel.

## 📋 Pré-requisitos

- Servidor com CloudPanel instalado
- Acesso SSH ao servidor
- Domínio ou subdomínio configurado (ex: `dressme.tgoo.eu`)
- Node.js 18+ instalado no servidor
- MySQL disponível

## 🏗️ Arquitetura de Deploy

A aplicação consiste em:
- **Frontend**: React + Vite (build estático)
- **Backend**: Node.js + Express + Prisma (API REST)
- **Banco de Dados**: MySQL

## 📝 Passo a Passo

### 1️⃣ Criar Site no CloudPanel

1. Acesse o CloudPanel
2. Vá em **Sites** → **Add Site**
3. Configure:
   - **Site Name**: dressme (ou seu domínio)
   - **Domain**: dressme.tgoo.eu (seu domínio)
   - **Site Type**: Node.js
   - **Node.js Version**: 18.x ou superior
   - **Document Root**: `/home/cloudpanel/htdocs/dressme.tgoo.eu` (ajuste conforme seu domínio)

### 2️⃣ Criar Banco de Dados MySQL

1. No CloudPanel, vá em **Databases** → **Add Database**
2. Configure:
   - **Database Name**: `dressme_db`
   - **Database User**: `dressme_user`
   - **Password**: Gere uma senha forte
   - Anote as credenciais!

### 3️⃣ Conectar via SSH e Preparar Ambiente

```bash
# Conectar ao servidor
ssh root@seu-servidor.com

# Ir para o diretório do site
cd /home/cloudpanel/htdocs/dressme.tgoo.eu

# Criar estrutura de diretórios
mkdir -p backend frontend
```

### 4️⃣ Fazer Upload/Clone do Código

**Opção A: Via Git (Recomendado)**

```bash
# Se o código está no GitHub
cd /home/cloudpanel/htdocs/dressme.tgoo.eu
git clone https://github.com/seu-usuario/dressme.git .

# Ou se preferir separar
git clone https://github.com/seu-usuario/dressme.git temp
mv temp/* .
rm -rf temp
```

**Opção B: Via SCP/SFTP**

```bash
# Do seu computador local
scp -r /home/junior/projetos/tgoo/dressme/* root@seu-servidor:/home/cloudpanel/htdocs/dressme.tgoo.eu/
```

### 5️⃣ Configurar Backend

```bash
cd /home/cloudpanel/htdocs/dressme.tgoo.eu/backend

# Instalar dependências
npm install

# Criar arquivo .env
cat > .env << 'EOF'
# Database
DATABASE_URL="mysql://dressme_user:SUA_SENHA_AQUI@localhost:3306/dressme_db"
SHADOW_DATABASE_URL="mysql://dressme_user:SUA_SENHA_AQUI@localhost:3306/dressme_shadow"

# JWT
JWT_SECRET="gere-uma-chave-secreta-muito-forte-aqui-min-32-chars"

# Frontend URL (seu domínio)
FRONTEND_URL="https://dressme.tgoo.eu"

# Node Environment
NODE_ENV=production

# Port
PORT=3001
EOF

# Criar banco shadow para migrations
mysql -u dressme_user -p -e "CREATE DATABASE IF NOT EXISTS dressme_shadow;"

# Executar migrations
npx prisma migrate deploy

# Gerar Prisma Client
npx prisma generate

# Build do backend
npm run build
```

### 6️⃣ Configurar Frontend

```bash
cd /home/junior/projetos/tgoo/dressme

# Criar arquivo .env para build
cat > .env << 'EOF'
VITE_API_URL=https://dressme.tgoo.eu/api
EOF

# Instalar dependências (se ainda não instalou)
npm install

# Build do frontend
npm run build
```

**Fazer upload do build para o servidor:**

```bash
# Do seu computador local
cd /home/junior/projetos/tgoo/dressme
scp -r dist/* root@seu-servidor:/home/cloudpanel/htdocs/dressme.tgoo.eu/frontend/
```

### 7️⃣ Instalar PM2 para Gerenciar Backend

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Ir para o diretório do backend
cd /home/cloudpanel/htdocs/dressme.tgoo.eu/backend

# Criar arquivo de configuração PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'dressme-backend',
    script: './dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Criar diretório de logs
mkdir -p logs

# Iniciar backend com PM2
pm2 start ecosystem.config.js

# Salvar configuração PM2
pm2 save

# Configurar PM2 para iniciar no boot
pm2 startup
# Execute o comando que o PM2 mostrar

# Verificar status
pm2 status
pm2 logs dressme-backend
```

### 8️⃣ Configurar Nginx como Reverse Proxy

**Criar arquivo de configuração do site:**

```bash
# Editar configuração do Nginx
nano /home/cloudpanel/sites/dressme.tgoo.eu/nginx/site.conf
```

**Adicionar esta configuração:**

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name dressme.tgoo.eu www.dressme.tgoo.eu;
    
    # Redirecionar para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name dressme.tgoo.eu www.dressme.tgoo.eu;
    
    # SSL (CloudPanel gerencia automaticamente)
    ssl_certificate /etc/letsencrypt/live/dressme.tgoo.eu/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dressme.tgoo.eu/privkey.pem;
    
    root /home/cloudpanel/htdocs/dressme.tgoo.eu/frontend;
    index index.html;
    
    # Logs
    access_log /home/cloudpanel/logs/dressme.tgoo.eu_access.log;
    error_log /home/cloudpanel/logs/dressme.tgoo.eu_error.log;
    
    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # API Backend - Reverse Proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers (caso necessário)
        add_header 'Access-Control-Allow-Origin' 'https://dressme.tgoo.eu' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        
        # Handle preflight
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
    
    # Frontend - SPA (React Router)
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache estático
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

**Testar e recarregar Nginx:**

```bash
# Testar configuração
nginx -t

# Se OK, recarregar
systemctl reload nginx
```

### 9️⃣ Configurar SSL (HTTPS)

No CloudPanel, vá em **Sites** → **Seu Site** → **SSL** e ative o Let's Encrypt.

Ou via terminal:

```bash
# Instalar certbot se não estiver instalado
apt install certbot python3-certbot-nginx

# Obter certificado
certbot --nginx -d dressme.tgoo.eu -d www.dressme.tgoo.eu

# Renovação automática (já configurado pelo certbot)
certbot renew --dry-run
```

### 🔟 Criar Primeiro Usuário Admin

```bash
cd /home/cloudpanel/htdocs/dressme.tgoo.eu/backend

# Executar Prisma Studio (temporariamente)
npx prisma studio --port 5555

# Ou via script Node.js
cat > scripts/create-admin.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@tgoo.eu';
  const password = 'Admin@123456'; // MUDE ISSO!
  const fullName = 'Administrador';
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  
  console.log('Admin criado:', admin);
  process.exit(0);
}

createAdmin().catch(console.error);
EOF

node scripts/create-admin.js
```

## 🔄 Script de Deploy Automatizado

Crie um script para facilitar deploys futuros:

```bash
cat > /home/cloudpanel/htdocs/dressme.tgoo.eu/deploy.sh << 'EOF'
#!/bin/bash

echo "🚀 Iniciando deploy do DressMe..."

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Diretório base
BASE_DIR="/home/cloudpanel/htdocs/dressme.tgoo.eu"

# 1. Atualizar código (se usando git)
echo -e "${BLUE}📦 Atualizando código...${NC}"
cd $BASE_DIR
git pull origin main

# 2. Backend
echo -e "${BLUE}🔧 Atualizando backend...${NC}"
cd $BASE_DIR/backend
npm install --production
npx prisma migrate deploy
npx prisma generate
npm run build

# 3. Reiniciar backend
echo -e "${BLUE}🔄 Reiniciando backend...${NC}"
pm2 restart dressme-backend

# 4. Frontend (fazer upload do build localmente e depois copiar)
echo -e "${GREEN}✅ Deploy concluído!${NC}"
echo -e "${BLUE}📊 Status do backend:${NC}"
pm2 status dressme-backend

EOF

chmod +x /home/cloudpanel/htdocs/dressme.tgoo.eu/deploy.sh
```

## 📊 Monitoramento

```bash
# Ver logs do backend
pm2 logs dressme-backend

# Ver logs do Nginx
tail -f /home/cloudpanel/logs/dressme.tgoo.eu_access.log
tail -f /home/cloudpanel/logs/dressme.tgoo.eu_error.log

# Status do PM2
pm2 status

# Monit do PM2
pm2 monit
```

## 🐛 Troubleshooting

### Backend não inicia

```bash
# Verificar logs
pm2 logs dressme-backend

# Verificar se a porta está livre
netstat -tulpn | grep 3001

# Reiniciar PM2
pm2 restart dressme-backend
```

### Erro de conexão com banco de dados

```bash
# Testar conexão
mysql -u dressme_user -p -e "SHOW DATABASES;"

# Verificar DATABASE_URL no .env
cat backend/.env | grep DATABASE_URL
```

### CORS errors

- Verifique se `FRONTEND_URL` no backend/.env está correto
- Verifique as configurações de CORS no Nginx
- Verifique o arquivo `backend/src/index.ts` (configuração CORS)

### 404 em rotas do React

- Certifique-se que `try_files $uri $uri/ /index.html;` está no Nginx
- Recarregue o Nginx: `systemctl reload nginx`

## 🔒 Segurança

1. **Firewall**: Certifique-se que apenas as portas 80, 443 e 22 (SSH) estão abertas
2. **JWT_SECRET**: Use uma chave forte e única
3. **Senhas de Banco**: Use senhas fortes
4. **Atualizações**: Mantenha o sistema atualizado
   ```bash
   apt update && apt upgrade -y
   ```
5. **Backups**: Configure backups automáticos do banco de dados
   ```bash
   # Backup manual
   mysqldump -u dressme_user -p dressme_db > backup_$(date +%Y%m%d).sql
   
   # Restaurar
   mysql -u dressme_user -p dressme_db < backup_20240105.sql
   ```

## 📱 Variáveis de Ambiente - Resumo

**Backend (.env):**
```
DATABASE_URL=mysql://user:pass@localhost:3306/dressme_db
SHADOW_DATABASE_URL=mysql://user:pass@localhost:3306/dressme_shadow
JWT_SECRET=sua-chave-secreta-aqui
FRONTEND_URL=https://dressme.tgoo.eu
NODE_ENV=production
PORT=3001
```

**Frontend (build time):**
```
VITE_API_URL=https://dressme.tgoo.eu/api
```

## ✅ Checklist Final

- [ ] Banco de dados criado e configurado
- [ ] Backend rodando com PM2
- [ ] Frontend buildado e servido pelo Nginx
- [ ] SSL/HTTPS configurado
- [ ] Primeiro admin criado
- [ ] Logs funcionando
- [ ] CORS configurado corretamente
- [ ] Domínio apontando para o servidor
- [ ] Backup configurado

## 🎉 Pronto!

Acesse: `https://dressme.tgoo.eu`

**Login Admin:**
- Email: admin@tgoo.eu
- Senha: (a que você definiu)

---

**Suporte:** Se encontrar problemas, verifique os logs e a documentação do CloudPanel.

