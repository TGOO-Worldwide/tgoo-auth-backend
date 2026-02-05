# 🚀 Guia de Configuração - Deploy Automático com GitHub Actions

Este guia detalha como configurar o deploy automático do **tgoo-auth-backend** usando GitHub Actions via SSH para um servidor Cloud Panel.

## 📋 Índice

1. [Pré-requisitos](#-pré-requisitos)
2. [Configuração do Servidor](#-configuração-do-servidor)
3. [Configuração do GitHub](#-configuração-do-github)
4. [Como Funciona](#-como-funciona)
5. [Testando o Deploy](#-testando-o-deploy)
6. [Troubleshooting](#-troubleshooting)

---

## 📦 Pré-requisitos

- ✅ Servidor Cloud Panel configurado e rodando
- ✅ Projeto já configurado no servidor (pelo menos uma vez manualmente)
- ✅ Git instalado no servidor
- ✅ Node.js 18+ instalado no servidor
- ✅ PM2 instalado no servidor
- ✅ Repositório no GitHub
- ✅ Acesso SSH ao servidor

---

## 🔧 Configuração do Servidor

### 1️⃣ Gerar Chave SSH (no seu computador local)

```bash
# Gerar nova chave SSH para deploy
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy_key

# Isso vai criar dois arquivos:
# ~/.ssh/github_deploy_key (chave PRIVADA - vai para o GitHub)
# ~/.ssh/github_deploy_key.pub (chave PÚBLICA - vai para o servidor)
```

### 2️⃣ Adicionar Chave Pública ao Servidor

```bash
# Copiar chave pública para o servidor
ssh-copy-id -i ~/.ssh/github_deploy_key.pub root@seu-servidor.com

# Ou manualmente:
cat ~/.ssh/github_deploy_key.pub
# Copie o conteúdo e adicione em: /root/.ssh/authorized_keys no servidor
```

### 3️⃣ Testar Conexão SSH

```bash
# Testar se consegue conectar com a chave
ssh -i ~/.ssh/github_deploy_key root@seu-servidor.com

# Se funcionar, você está pronto!
```

### 4️⃣ Configurar o Projeto no Servidor (Setup Inicial)

Se ainda não configurou o projeto no servidor, faça o setup inicial:

```bash
# Conectar ao servidor
ssh root@seu-servidor.com

# Navegar para o diretório do CloudPanel
cd /home/cloudpanel/htdocs

# Criar diretório do projeto (ajuste o nome conforme seu domínio)
mkdir -p auth.tgoo.eu
cd auth.tgoo.eu

# Clonar o repositório
git clone https://github.com/seu-usuario/tgoo-auth-backend.git .

# Configurar o .env
nano .env
```

**Exemplo de .env:**

```env
# Database
DATABASE_URL="mysql://usuario:senha@localhost:3306/tgoo_auth_db"

# JWT
JWT_SECRET="sua-chave-secreta-muito-forte-aqui-min-32-chars"

# Frontend URLs (ajuste conforme suas plataformas)
FRONTEND_URL="https://dressme.tgoo.eu"

# Node Environment
NODE_ENV=production

# Port
PORT=3001
```

Continuar a configuração:

```bash
# Instalar dependências
npm ci --production

# Gerar Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate deploy

# Build
npm run build

# Instalar PM2 (se não estiver instalado)
npm install -g pm2

# Iniciar com PM2
pm2 start ecosystem.config.js

# Salvar configuração do PM2
pm2 save

# Configurar PM2 para iniciar no boot
pm2 startup
# Execute o comando que o PM2 mostrar

# Verificar status
pm2 status
```

---

## 🔐 Configuração do GitHub

### 1️⃣ Adicionar Secrets ao Repositório

Acesse seu repositório no GitHub:
1. Vá em **Settings** → **Secrets and variables** → **Actions**
2. Clique em **New repository secret**
3. Adicione os seguintes secrets:

| Secret Name | Descrição | Exemplo |
|------------|-----------|---------|
| `SSH_HOST` | IP ou domínio do servidor | `123.456.789.10` ou `servidor.tgoo.eu` |
| `SSH_USERNAME` | Usuário SSH (geralmente `root`) | `root` |
| `SSH_PRIVATE_KEY` | Chave privada SSH | Conteúdo do arquivo `~/.ssh/github_deploy_key` |
| `SSH_PORT` | Porta SSH (opcional, padrão 22) | `22` |
| `PROJECT_PATH` | Caminho absoluto do projeto no servidor | `/home/cloudpanel/htdocs/auth.tgoo.eu` |

### 2️⃣ Como Obter a Chave Privada

```bash
# No seu computador local
cat ~/.ssh/github_deploy_key

# Copie TODO o conteúdo, incluindo:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ... conteúdo ...
# -----END OPENSSH PRIVATE KEY-----
```

**⚠️ IMPORTANTE:** 
- A chave PRIVADA (`github_deploy_key`) vai para o GitHub Secrets
- A chave PÚBLICA (`github_deploy_key.pub`) vai para o servidor
- NUNCA compartilhe ou commite a chave privada no repositório!

### 3️⃣ Verificar Configuração dos Secrets

Depois de adicionar todos os secrets, você deve ter algo assim:

```
SSH_HOST ••••••••
SSH_USERNAME ••••••••
SSH_PRIVATE_KEY ••••••••
SSH_PORT ••••••••
PROJECT_PATH ••••••••
```

---

## ⚙️ Como Funciona

### Workflow Automático

O GitHub Actions está configurado para fazer deploy automático quando:

1. **Push para branch main/master**: Todo commit na branch principal dispara o deploy
2. **Manual**: Você pode disparar manualmente via interface do GitHub

### Fluxo do Deploy

```mermaid
graph TD
    A[Push para main/master] --> B[GitHub Actions inicia]
    B --> C[Checkout do código]
    C --> D[Instala Node.js]
    D --> E[Instala dependências npm ci]
    E --> F[Build do projeto npm run build]
    F --> G[Conecta via SSH ao servidor]
    G --> H[Backup do .env]
    H --> I[Atualiza código git pull]
    I --> J[Restaura .env]
    J --> K[Instala dependências no servidor]
    K --> L[Gera Prisma Client]
    L --> M[Executa migrations]
    M --> N[Build no servidor]
    N --> O[Reinicia PM2]
    O --> P[Deploy concluído! 🎉]
```

### Etapas Detalhadas

1. **Checkout**: Baixa o código do repositório
2. **Build Local**: Valida que o projeto compila corretamente
3. **Conexão SSH**: Conecta ao servidor usando as credenciais configuradas
4. **Backup**: Salva o arquivo `.env` atual
5. **Atualização**: Faz `git pull` do código mais recente
6. **Dependências**: Instala pacotes necessários
7. **Database**: Executa migrations do Prisma
8. **Build**: Compila o TypeScript para JavaScript
9. **Restart**: Reinicia a aplicação com PM2
10. **Verificação**: Checa o status da aplicação

---

## 🧪 Testando o Deploy

### 1️⃣ Deploy via Push (Automático)

```bash
# No seu computador local
cd /home/junior/projetos/tgoo/tgoo-auth-backend

# Fazer alguma mudança
echo "# Teste de deploy" >> README.md

# Commit e push
git add .
git commit -m "test: testando deploy automático"
git push origin main
```

### 2️⃣ Deploy Manual (via GitHub Interface)

1. Acesse seu repositório no GitHub
2. Vá em **Actions**
3. Selecione o workflow **🚀 Deploy Automático via SSH**
4. Clique em **Run workflow**
5. Selecione a branch (main/master)
6. Clique em **Run workflow** novamente

### 3️⃣ Acompanhar o Deploy

1. Na aba **Actions**, você verá o workflow em execução
2. Clique no workflow para ver os logs em tempo real
3. Cada etapa mostrará seu progresso e resultado

### 4️⃣ Verificar no Servidor

```bash
# Conectar ao servidor
ssh root@seu-servidor.com

# Verificar status do PM2
pm2 status tgoo-auth-backend

# Ver logs
pm2 logs tgoo-auth-backend --lines 50

# Testar a API
curl http://localhost:3001/health
```

---

## 🐛 Troubleshooting

### Erro: "Permission denied (publickey)"

**Problema**: GitHub Actions não consegue conectar ao servidor

**Solução**:
```bash
# Verificar se a chave pública está no servidor
ssh root@seu-servidor.com
cat ~/.ssh/authorized_keys | grep github-actions-deploy

# Se não estiver, adicionar novamente
ssh-copy-id -i ~/.ssh/github_deploy_key.pub root@seu-servidor.com
```

### Erro: "Diretório não encontrado"

**Problema**: `PROJECT_PATH` está incorreto

**Solução**:
```bash
# No servidor, verificar o caminho correto
ssh root@seu-servidor.com
pwd  # Mostra o diretório atual
ls -la /home/cloudpanel/htdocs/

# Atualizar o secret PROJECT_PATH no GitHub com o caminho correto
```

### Erro: "PM2 not found"

**Problema**: PM2 não está instalado no servidor

**Solução**:
```bash
# Conectar ao servidor
ssh root@seu-servidor.com

# Instalar PM2 globalmente
npm install -g pm2

# Verificar instalação
pm2 --version
```

### Erro: "Build failed"

**Problema**: Erros de compilação do TypeScript

**Solução**:
```bash
# No seu computador local, testar o build
cd /home/junior/projetos/tgoo/tgoo-auth-backend
npm run build

# Se houver erros, corrigir antes de fazer push
```

### Erro: "Prisma migration failed"

**Problema**: Erro nas migrations do banco de dados

**Solução**:
```bash
# Conectar ao servidor
ssh root@seu-servidor.com
cd /home/cloudpanel/htdocs/auth.tgoo.eu

# Verificar conexão com banco
mysql -u usuario -p -e "SHOW DATABASES;"

# Verificar DATABASE_URL no .env
cat .env | grep DATABASE_URL

# Executar migrations manualmente
npx prisma migrate deploy --schema=./prisma/schema.prisma
```

### Deploy Manual de Emergência

Se o GitHub Actions falhar, você pode fazer deploy manualmente:

```bash
# Conectar ao servidor
ssh root@seu-servidor.com

# Navegar para o projeto
cd /home/cloudpanel/htdocs/auth.tgoo.eu

# Executar o script de deploy manual
chmod +x deploy.sh
./deploy.sh
```

---

## 📊 Monitoramento

### Ver Logs do GitHub Actions

1. Acesse **Actions** no seu repositório
2. Cada execução mostra:
   - ✅ Status (sucesso/falha)
   - ⏱️ Duração
   - 📝 Logs detalhados de cada etapa

### Ver Logs no Servidor

```bash
# Logs do PM2 em tempo real
pm2 logs tgoo-auth-backend

# Logs salvos
cat /home/cloudpanel/htdocs/auth.tgoo.eu/logs/combined.log

# Status da aplicação
pm2 status

# Monitoramento em tempo real
pm2 monit
```

---

## 🔒 Segurança

### Boas Práticas

1. ✅ **Chaves SSH separadas**: Use uma chave SSH específica para deploy
2. ✅ **Secrets do GitHub**: Nunca commite credenciais no código
3. ✅ **Backup do .env**: O workflow faz backup automático
4. ✅ **Permissões mínimas**: Use usuário com permissões necessárias apenas
5. ✅ **Logs seguros**: Não logue informações sensíveis

### Proteger Branches

1. Vá em **Settings** → **Branches**
2. Adicione regra de proteção para `main`
3. Configure:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date

---

## 📚 Recursos Adicionais

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [CloudPanel Documentation](https://www.cloudpanel.io/docs/)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)

---

## ✅ Checklist de Configuração

- [ ] Chave SSH gerada
- [ ] Chave pública adicionada ao servidor
- [ ] Secrets configurados no GitHub
- [ ] Projeto configurado no servidor (setup inicial)
- [ ] PM2 instalado e configurado
- [ ] .env criado no servidor
- [ ] Primeiro deploy manual bem-sucedido
- [ ] Deploy automático testado
- [ ] Logs monitorados

---

## 🎉 Pronto!

Agora, toda vez que você fizer push para a branch main/master, o deploy será automático!

```bash
# Workflow típico de desenvolvimento
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
# 🚀 Deploy automático inicia!
```

**Dúvidas?** Verifique os logs do GitHub Actions e do PM2 no servidor.

---

**Última atualização**: 05/02/2026
