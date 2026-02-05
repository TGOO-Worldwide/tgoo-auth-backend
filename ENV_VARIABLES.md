# 🔐 Variáveis de Ambiente - Documentação Completa

Este documento lista todas as variáveis de ambiente necessárias e opcionais para o **tgoo-auth-backend**.

## 📋 Criando o Arquivo .env

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# ===================================
# 🗄️ Database
# ===================================
DATABASE_URL="mysql://usuario:senha@localhost:3306/tgoo_auth_db"

# ===================================
# 🔑 JWT
# ===================================
JWT_SECRET="sua-chave-secreta-muito-forte-aqui-min-32-chars"

# ===================================
# 🌐 Frontend URL
# ===================================
FRONTEND_URL="http://localhost:5173"

# ===================================
# 🚀 Servidor
# ===================================
PORT=3001
NODE_ENV=development
```

## 🔑 Variáveis Obrigatórias

### DATABASE_URL
- **Tipo**: String
- **Formato**: `mysql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO`
- **Descrição**: URL de conexão com o banco de dados MySQL
- **Exemplo**: 
  - Desenvolvimento: `mysql://root:senha123@localhost:3306/tgoo_auth_dev`
  - Produção: `mysql://tgoo_user:senha_forte@localhost:3306/tgoo_auth_prod`

### JWT_SECRET
- **Tipo**: String
- **Tamanho mínimo**: 32 caracteres
- **Descrição**: Chave secreta para assinar e validar tokens JWT
- **Como gerar**:
  ```bash
  # Linux/Mac
  openssl rand -base64 32
  
  # Node.js
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- **⚠️ IMPORTANTE**: 
  - Use uma chave diferente para cada ambiente
  - NUNCA compartilhe ou commite esta chave
  - Se comprometida, gere uma nova imediatamente

### FRONTEND_URL
- **Tipo**: String (URL)
- **Descrição**: URL do frontend para configuração de CORS
- **Exemplos**:
  - Desenvolvimento: `http://localhost:5173`
  - Produção: `https://dressme.tgoo.eu`

## ⚙️ Variáveis Opcionais

### PORT
- **Tipo**: Number
- **Padrão**: `3001`
- **Descrição**: Porta onde o servidor vai rodar
- **Exemplo**: `3001`, `3000`, `8080`

### NODE_ENV
- **Tipo**: String
- **Valores permitidos**: `development`, `production`, `test`
- **Padrão**: `development`
- **Descrição**: Define o ambiente de execução
- **Impacto**:
  - `development`: Logs detalhados, CORS permissivo
  - `production`: Logs otimizados, segurança reforçada
  - `test`: Configurações para testes automatizados

### SHADOW_DATABASE_URL
- **Tipo**: String
- **Descrição**: Banco de dados auxiliar para Prisma migrations (desenvolvimento)
- **Exemplo**: `mysql://root:senha123@localhost:3306/tgoo_auth_shadow`
- **Quando usar**: Apenas em desenvolvimento

## 📧 Variáveis de Email (Recuperação de Senha)

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-de-app"
SMTP_FROM="noreply@tgoo.eu"
```

### SMTP_HOST
- **Tipo**: String
- **Descrição**: Servidor SMTP para envio de emails
- **Exemplos**: 
  - Gmail: `smtp.gmail.com`
  - Outlook: `smtp-mail.outlook.com`
  - SendGrid: `smtp.sendgrid.net`

### SMTP_PORT
- **Tipo**: Number
- **Valores comuns**: `587` (TLS), `465` (SSL), `25` (inseguro)
- **Recomendado**: `587`

### SMTP_USER
- **Tipo**: String
- **Descrição**: Email/usuário para autenticação SMTP

### SMTP_PASS
- **Tipo**: String
- **Descrição**: Senha ou senha de aplicativo para SMTP
- **⚠️ Gmail**: Use "Senhas de App", não sua senha normal

### SMTP_FROM
- **Tipo**: String (email)
- **Descrição**: Email remetente que aparecerá nos emails enviados

## 🤖 API Externa (Gemini)

```env
GEMINI_API_KEY="sua-chave-api-do-gemini"
```

### GEMINI_API_KEY
- **Tipo**: String
- **Descrição**: Chave de API do Google Gemini (se estiver usando)
- **Como obter**: https://makersuite.google.com/app/apikey

## 🔒 Segurança e Rate Limiting

```env
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

### RATE_LIMIT_ENABLED
- **Tipo**: Boolean
- **Padrão**: `false`
- **Descrição**: Habilita rate limiting nas APIs

### RATE_LIMIT_MAX_REQUESTS
- **Tipo**: Number
- **Padrão**: `100`
- **Descrição**: Número máximo de requisições por janela de tempo

### RATE_LIMIT_WINDOW_MS
- **Tipo**: Number (milissegundos)
- **Padrão**: `900000` (15 minutos)
- **Descrição**: Janela de tempo para rate limiting

## 🎯 Master Platform

```env
MASTER_PLATFORM_URL="https://master.tgoo.eu"
MASTER_PLATFORM_API_KEY="chave-api-master-platform"
```

### MASTER_PLATFORM_URL
- **Tipo**: String (URL)
- **Descrição**: URL da plataforma master para integração

### MASTER_PLATFORM_API_KEY
- **Tipo**: String
- **Descrição**: Chave de API para comunicação com a master platform

## 🔧 Variáveis de Desenvolvimento

```env
DEBUG=true
ENABLE_CORS_ALL=true
LOG_LEVEL="debug"
```

### DEBUG
- **Tipo**: Boolean
- **Padrão**: `false`
- **Descrição**: Habilita logs de debug detalhados

### ENABLE_CORS_ALL
- **Tipo**: Boolean
- **Padrão**: `false`
- **Descrição**: Permite CORS de qualquer origem (⚠️ apenas desenvolvimento!)

### LOG_LEVEL
- **Tipo**: String
- **Valores**: `error`, `warn`, `info`, `debug`
- **Padrão**: `info`
- **Descrição**: Nível de detalhamento dos logs

## 📱 Webhooks e Notificações

```env
WEBHOOK_URL="https://discord.com/api/webhooks/..."
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
```

### WEBHOOK_URL
- **Tipo**: String (URL)
- **Descrição**: Webhook para notificações (Discord, etc)

### SLACK_WEBHOOK_URL
- **Tipo**: String (URL)
- **Descrição**: Webhook do Slack para notificações

## 📋 Exemplos de Configuração

### Desenvolvimento Local

```env
DATABASE_URL="mysql://root:senha123@localhost:3306/tgoo_auth_dev"
SHADOW_DATABASE_URL="mysql://root:senha123@localhost:3306/tgoo_auth_shadow"
JWT_SECRET="desenvolvimento-chave-secreta-123456789"
FRONTEND_URL="http://localhost:5173"
NODE_ENV=development
PORT=3001
DEBUG=true
ENABLE_CORS_ALL=true
```

### Produção (Cloud Panel)

```env
DATABASE_URL="mysql://tgoo_user:senha_forte_prod@localhost:3306/tgoo_auth_prod"
JWT_SECRET="producao-chave-secreta-muito-forte-e-aleatoria-32chars-min"
FRONTEND_URL="https://dressme.tgoo.eu"
NODE_ENV=production
PORT=3001
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

### Staging/Homologação

```env
DATABASE_URL="mysql://tgoo_user:senha_staging@localhost:3306/tgoo_auth_staging"
JWT_SECRET="staging-chave-secreta-diferente-da-producao"
FRONTEND_URL="https://staging.tgoo.eu"
NODE_ENV=production
PORT=3001
DEBUG=false
```

## 🔒 Segurança - Boas Práticas

### ✅ FAÇA

1. **Use senhas fortes e únicas**
   ```bash
   # Gerar senha aleatória
   openssl rand -base64 24
   ```

2. **Um .env para cada ambiente**
   - `.env.development` → desenvolvimento local
   - `.env.staging` → homologação
   - `.env.production` → produção

3. **Mantenha o .env fora do git**
   - Já está no `.gitignore`
   - Verifique antes de commitar

4. **Use gerenciadores de secrets**
   - GitHub Secrets (para CI/CD)
   - AWS Secrets Manager
   - HashiCorp Vault

5. **Rotação de chaves**
   - Troque JWT_SECRET periodicamente
   - Troque senhas de banco regularmente

### ❌ NÃO FAÇA

1. ❌ Commitar o arquivo `.env` no git
2. ❌ Compartilhar chaves em mensagens/emails
3. ❌ Usar a mesma JWT_SECRET em todos os ambientes
4. ❌ Usar valores de exemplo em produção
5. ❌ Expor variáveis de ambiente em logs

## 🛠️ Ferramentas Úteis

### Validar .env

```bash
# Verificar se todas as variáveis necessárias estão definidas
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL ? '✅ DATABASE_URL ok' : '❌ DATABASE_URL missing')"
```

### Gerar JWT_SECRET

```bash
# Método 1: OpenSSL
openssl rand -base64 32

# Método 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Método 3: Python
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Testar Conexão com Banco

```bash
# MySQL
mysql -h localhost -u usuario -p -e "SELECT 1;"

# Via Node.js (Prisma)
npx prisma db pull
```

## 📚 Referências

- [Prisma - Environment Variables](https://www.prisma.io/docs/guides/development-environment/environment-variables)
- [dotenv - Documentation](https://github.com/motdotla/dotenv)
- [JWT - Best Practices](https://jwt.io/introduction)
- [OWASP - Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

**⚠️ IMPORTANTE**: Nunca commite o arquivo `.env` no repositório. Use este documento como referência para criar seu próprio arquivo `.env` em cada ambiente.
