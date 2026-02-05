# 🤖 GitHub Actions - tgoo-auth-backend

Esta pasta contém a configuração de CI/CD (Integração e Deploy Contínuo) para o projeto.

---

## 📁 Estrutura

```
.github/
├── workflows/
│   ├── deploy.yml              # 🚀 Deploy automático via SSH
│   └── ci.yml                  # 🧪 CI para pull requests
├── DEPLOY_CHECKLIST.md         # ✅ Checklist de configuração
├── QUICK_COMMANDS.md           # ⚡ Comandos rápidos
└── README.md                   # 📖 Este arquivo
```

---

## 🚀 Workflows

### 1. Deploy Automático (`deploy.yml`)

**Quando roda:**
- ✅ Automaticamente: Push para `main` ou `master`
- ✅ Manualmente: GitHub → Actions → Run workflow

**O que faz:**
1. Valida o build localmente
2. Conecta via SSH ao servidor
3. Atualiza o código no servidor
4. Executa migrations do Prisma
5. Faz build no servidor
6. Reinicia a aplicação com PM2

**Duração:** ~2-3 minutos

### 2. CI - Integração Contínua (`ci.yml`)

**Quando roda:**
- ✅ Pull requests para `main`, `master` ou `develop`
- ✅ Push para `develop`

**O que faz:**
1. Valida Prisma schema
2. Gera Prisma Client
3. Valida que o build funciona
4. Verifica integridade dos arquivos

**Duração:** ~1-2 minutos

---

## ⚙️ Configuração

Para usar os workflows, você precisa configurar **5 secrets** no GitHub:

### Secrets Necessários

**GitHub → Settings → Secrets → Actions → New secret**

| Secret | O que é | Como obter |
|--------|---------|------------|
| `SSH_HOST` | IP/domínio do servidor | Ex: `123.456.789.10` |
| `SSH_USERNAME` | Usuário SSH | Geralmente `root` |
| `SSH_PRIVATE_KEY` | Chave privada SSH | `cat ~/.ssh/github_deploy_key` |
| `SSH_PORT` | Porta SSH | Geralmente `22` |
| `PROJECT_PATH` | Caminho no servidor | Ex: `/home/cloudpanel/htdocs/auth.tgoo.eu` |

### Como Gerar SSH_PRIVATE_KEY

```bash
# 1. Gerar par de chaves
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy_key

# 2. Adicionar chave PÚBLICA ao servidor
ssh-copy-id -i ~/.ssh/github_deploy_key.pub root@SEU_SERVIDOR

# 3. Copiar chave PRIVADA para o GitHub Secret
cat ~/.ssh/github_deploy_key
# Copie TODO o conteúdo (incluindo BEGIN e END)
```

---

## 📊 Usando os Workflows

### Ver Workflows em Execução

1. Vá para a aba **Actions** no GitHub
2. Veja todos os workflows (passados e em execução)
3. Clique em um para ver logs detalhados

### Executar Deploy Manual

1. **Actions** → **🚀 Deploy Automático via SSH**
2. **Run workflow** (botão azul no canto direito)
3. Selecione a branch (main/master)
4. **Run workflow**

### Status dos Workflows

- ✅ **Verde**: Sucesso
- ❌ **Vermelho**: Falha (ver logs para detalhes)
- 🟡 **Amarelo**: Em execução
- ⚪ **Cinza**: Aguardando ou cancelado

---

## 🎯 Badges (Opcional)

Adicione badges ao README.md para mostrar status dos workflows:

```markdown
![Deploy](https://github.com/SEU_USUARIO/tgoo-auth-backend/actions/workflows/deploy.yml/badge.svg)
![CI](https://github.com/SEU_USUARIO/tgoo-auth-backend/actions/workflows/ci.yml/badge.svg)
```

---

## 🔒 Segurança

### ✅ Boas Práticas Implementadas

- Chave SSH dedicada apenas para deploy
- Secrets protegidos e criptografados pelo GitHub
- Chave privada NUNCA commitada no repositório
- Backup automático do .env antes de atualizar
- Validação de build antes de fazer deploy

### ⚠️ NUNCA Faça Isso

- ❌ Commitar a chave privada no git
- ❌ Compartilhar secrets em mensagens/emails
- ❌ Usar a mesma chave SSH para múltiplos projetos
- ❌ Deixar secrets em arquivos de código
- ❌ Usar senhas simples ou padrão

---

## 📚 Documentação Completa

- [⚡ Deploy Quickstart](../DEPLOY_QUICKSTART.md) - **5 minutos**
- [📖 Setup Completo](../GITHUB_ACTIONS_SETUP.md) - **Guia detalhado**
- [✅ Checklist](./DEPLOY_CHECKLIST.md) - **Verificar tudo**
- [⚡ Comandos Rápidos](./QUICK_COMMANDS.md) - **Referência**
- [🔐 Variáveis](../ENV_VARIABLES.md) - **Environment vars**

---

## 🆘 Problemas Comuns

### "Permission denied (publickey)"

**Causa**: Chave SSH não configurada corretamente

**Solução**:
```bash
# Verificar se a chave está no servidor
ssh root@SEU_SERVIDOR "cat ~/.ssh/authorized_keys | grep github-deploy"

# Se não estiver, adicionar
ssh-copy-id -i ~/.ssh/github_deploy_key.pub root@SEU_SERVIDOR
```

### "PM2 not found"

**Causa**: PM2 não instalado no servidor

**Solução**:
```bash
ssh root@SEU_SERVIDOR "npm install -g pm2"
```

### "Build failed"

**Causa**: Erros de TypeScript ou dependências

**Solução**:
```bash
# Testar build localmente
npm run build

# Se falhar, corrigir os erros antes de fazer push
```

### "Database connection failed"

**Causa**: DATABASE_URL incorreto no .env do servidor

**Solução**:
```bash
ssh root@SEU_SERVIDOR
cd /home/cloudpanel/htdocs/auth.tgoo.eu
nano .env  # Verificar DATABASE_URL
```

---

## 🔄 Fluxo Típico de Trabalho

```bash
# 1. Desenvolver localmente
git checkout -b feature/nova-funcionalidade
# ... fazer mudanças ...

# 2. Testar localmente
npm run build
npm run dev

# 3. Commit e push
git add .
git commit -m "feat: nova funcionalidade"
git push origin feature/nova-funcionalidade

# 4. Criar Pull Request
# → CI roda automaticamente
# → Se passar, fazer merge para main

# 5. Merge para main
# → Deploy automático inicia!
# → Aplicação atualizada em ~2-3 min
```

---

## 📊 Monitoramento

### No GitHub
```
Actions → Ver workflows em execução
        → Ver histórico de deploys
        → Ver logs detalhados
```

### No Servidor
```bash
pm2 status                     # Status da aplicação
pm2 logs tgoo-auth-backend     # Logs em tempo real
pm2 monit                      # Monitoramento interativo
```

---

## 🎉 Pronto!

Os workflows estão configurados e prontos para uso.

**Próximo passo:** [DEPLOY_QUICKSTART.md](../DEPLOY_QUICKSTART.md) para configurar tudo em 5 minutos!

---

**Dúvidas?** Consulte a [documentação completa](../GITHUB_ACTIONS_SETUP.md) ou a [checklist](./DEPLOY_CHECKLIST.md).
