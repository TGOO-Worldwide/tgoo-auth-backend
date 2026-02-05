# ✅ Checklist de Deploy - GitHub Actions via SSH

Use esta checklist para garantir que tudo está configurado corretamente.

## 🔐 1. Configuração SSH

- [ ] **Chave SSH gerada**
  ```bash
  ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy_key
  ```
  - [ ] Arquivo `~/.ssh/github_deploy_key` criado (privada)
  - [ ] Arquivo `~/.ssh/github_deploy_key.pub` criado (pública)

- [ ] **Chave pública adicionada ao servidor**
  ```bash
  ssh-copy-id -i ~/.ssh/github_deploy_key.pub root@SEU_SERVIDOR
  ```

- [ ] **Conexão SSH testada e funcionando**
  ```bash
  ssh -i ~/.ssh/github_deploy_key root@SEU_SERVIDOR
  ```

## 🔒 2. GitHub Secrets

- [ ] **Todos os secrets adicionados** (Settings → Secrets → Actions)
  - [ ] `SSH_HOST` - IP ou domínio do servidor
  - [ ] `SSH_USERNAME` - Usuário SSH (geralmente `root`)
  - [ ] `SSH_PRIVATE_KEY` - Conteúdo completo de `~/.ssh/github_deploy_key`
  - [ ] `SSH_PORT` - Porta SSH (padrão: 22)
  - [ ] `PROJECT_PATH` - Caminho absoluto do projeto no servidor

- [ ] **Chave privada completa copiada**
  - [ ] Incluindo `-----BEGIN OPENSSH PRIVATE KEY-----`
  - [ ] Incluindo `-----END OPENSSH PRIVATE KEY-----`
  - [ ] Sem espaços extras no início ou fim

## 🖥️ 3. Servidor - Setup Inicial

- [ ] **Node.js instalado** (versão 18+)
  ```bash
  node --version
  ```

- [ ] **MySQL/MariaDB instalado e rodando**
  ```bash
  systemctl status mysql
  ```

- [ ] **Banco de dados criado**
  ```bash
  mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS tgoo_auth_db;"
  mysql -u root -p -e "CREATE USER IF NOT EXISTS 'tgoo_user'@'localhost' IDENTIFIED BY 'senha_forte';"
  mysql -u root -p -e "GRANT ALL PRIVILEGES ON tgoo_auth_db.* TO 'tgoo_user'@'localhost';"
  mysql -u root -p -e "FLUSH PRIVILEGES;"
  ```

- [ ] **Projeto clonado no servidor**
  ```bash
  cd /home/cloudpanel/htdocs
  git clone https://github.com/SEU_USUARIO/tgoo-auth-backend.git auth.tgoo.eu
  ```

- [ ] **Arquivo .env criado no servidor**
  ```bash
  cd /home/cloudpanel/htdocs/auth.tgoo.eu
  nano .env
  ```
  - [ ] `DATABASE_URL` configurado corretamente
  - [ ] `JWT_SECRET` gerado (32+ caracteres)
  - [ ] `FRONTEND_URL` definido
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3001`

- [ ] **PM2 instalado globalmente**
  ```bash
  npm install -g pm2
  pm2 --version
  ```

- [ ] **Primeiro build manual bem-sucedido**
  ```bash
  npm ci --production
  npx prisma generate
  npx prisma migrate deploy
  npm run build
  ```

- [ ] **Aplicação rodando com PM2**
  ```bash
  pm2 start ecosystem.config.js
  pm2 save
  pm2 startup
  # Executar o comando mostrado pelo PM2
  ```

- [ ] **PM2 configurado para iniciar no boot**
  ```bash
  pm2 status  # Verificar se está rodando
  ```

## 📁 4. Arquivos do Projeto

- [ ] **Workflow do GitHub Actions existe**
  - [ ] Arquivo `.github/workflows/deploy.yml` criado
  - [ ] Workflow está ativo no GitHub

- [ ] **ecosystem.config.js configurado**
  - [ ] Nome da aplicação: `tgoo-auth-backend`
  - [ ] Script apontando para `./dist/index.js`
  - [ ] Configurações de logs definidas

- [ ] **.gitignore atualizado**
  - [ ] `.env` está no .gitignore
  - [ ] Chaves SSH não serão commitadas
  - [ ] `node_modules/` ignorado
  - [ ] `dist/` ignorado

## 🔐 5. Segurança

- [ ] **JWT_SECRET único e forte**
  - [ ] Mínimo 32 caracteres
  - [ ] Gerado com `openssl rand -base64 32`
  - [ ] Diferente em dev/staging/prod

- [ ] **Senhas de banco fortes**
  - [ ] Senha do banco com 16+ caracteres
  - [ ] Combinação de letras, números e símbolos

- [ ] **Chaves SSH seguras**
  - [ ] Chave privada NUNCA commitada no git
  - [ ] Chave privada apenas no GitHub Secrets
  - [ ] Permissões corretas (600) no servidor

- [ ] **Firewall configurado**
  - [ ] Apenas portas necessárias abertas (22, 80, 443)
  - [ ] Porta 3001 (backend) não exposta publicamente

## 🌐 6. Nginx/Web Server

- [ ] **Reverse proxy configurado**
  - [ ] Rota `/api` apontando para `http://localhost:3001`
  - [ ] CORS headers configurados
  - [ ] Frontend servido corretamente

- [ ] **SSL/HTTPS configurado**
  - [ ] Certificado Let's Encrypt instalado
  - [ ] Redirecionamento HTTP → HTTPS
  - [ ] Certificado válido e não expirado

## 🧪 7. Testes

- [ ] **Build local funciona**
  ```bash
  npm run build
  # Deve criar a pasta dist/ sem erros
  ```

- [ ] **API responde no servidor**
  ```bash
  curl http://localhost:3001/health
  # Deve retornar: {"status":"ok","message":"..."}
  ```

- [ ] **Deploy manual funciona**
  ```bash
  ssh root@SEU_SERVIDOR
  cd /home/cloudpanel/htdocs/auth.tgoo.eu
  ./deploy.sh
  ```

- [ ] **Deploy automático testado**
  ```bash
  git commit -m "test: deploy automático" --allow-empty
  git push origin main
  # Acompanhar em: GitHub → Actions
  ```

## 📊 8. Monitoramento

- [ ] **Logs do PM2 acessíveis**
  ```bash
  pm2 logs tgoo-auth-backend
  ```

- [ ] **Status do PM2 ok**
  ```bash
  pm2 status
  # Deve mostrar status "online"
  ```

- [ ] **Aplicação acessível via domínio**
  ```bash
  curl https://seu-dominio.com/api/health
  ```

- [ ] **GitHub Actions funcionando**
  - [ ] Workflow aparece em Actions
  - [ ] Deploy bem-sucedido (✅ verde)
  - [ ] Logs não mostram erros

## 🔄 9. Backup e Recuperação

- [ ] **Backup do .env salvo em local seguro**
  - [ ] Não no repositório git
  - [ ] Em gerenciador de senhas ou arquivo criptografado

- [ ] **Backup do banco configurado**
  ```bash
  # Script de backup
  mysqldump -u tgoo_user -p tgoo_auth_db > backup_$(date +%Y%m%d).sql
  ```

- [ ] **Procedimento de rollback documentado**
  - [ ] Como voltar para versão anterior
  - [ ] Como restaurar backup do banco

## 📚 10. Documentação

- [ ] **README.md atualizado**
  - [ ] Instruções de setup
  - [ ] Informações de deploy

- [ ] **Documentação de deploy criada**
  - [ ] GITHUB_ACTIONS_SETUP.md
  - [ ] ENV_VARIABLES.md
  - [ ] DEPLOY_QUICKSTART.md

- [ ] **Equipe informada**
  - [ ] Processo de deploy documentado
  - [ ] Acesso aos secrets compartilhado (quando necessário)

## 🎯 11. Validação Final

- [ ] **API funciona via domínio público**
  ```bash
  curl https://seu-dominio.com/api/health
  ```

- [ ] **Frontend conecta com backend**
  - [ ] Login funciona
  - [ ] Requests não dão erro de CORS

- [ ] **Deploy automático comprovado**
  - [ ] Fazer mudança no código
  - [ ] Push para main
  - [ ] Verificar que deploy aconteceu
  - [ ] Verificar que mudança está no servidor

- [ ] **Logs não mostram erros críticos**
  ```bash
  pm2 logs tgoo-auth-backend --lines 50
  ```

## 📝 Notas Adicionais

### Comandos Úteis

```bash
# Ver status do deploy no GitHub
# GitHub → Actions → Ver workflow

# Ver logs em tempo real no servidor
pm2 logs tgoo-auth-backend

# Reiniciar manualmente
pm2 restart tgoo-auth-backend

# Deploy manual de emergência
ssh root@SEU_SERVIDOR
cd /home/cloudpanel/htdocs/auth.tgoo.eu
./deploy.sh

# Ver processos PM2
pm2 list

# Monitoramento em tempo real
pm2 monit
```

### Problemas Comuns

1. **"Permission denied"** → Verificar chave SSH no servidor
2. **"PM2 not found"** → `npm install -g pm2`
3. **"Build failed"** → Testar `npm run build` localmente
4. **"Database connection failed"** → Verificar `DATABASE_URL` no .env
5. **CORS errors** → Verificar `FRONTEND_URL` no .env

### Próximos Passos

Depois que tudo estiver funcionando:

- [ ] Configurar CI para pull requests
- [ ] Adicionar testes automatizados
- [ ] Configurar notificações de deploy (Slack/Discord)
- [ ] Configurar monitoramento (Sentry, New Relic)
- [ ] Configurar backup automático do banco

---

## 🎉 Parabéns!

Se todos os itens estão marcados, seu deploy automático está 100% configurado! 🚀

**Data de conclusão**: ___/___/______

**Configurado por**: _________________
