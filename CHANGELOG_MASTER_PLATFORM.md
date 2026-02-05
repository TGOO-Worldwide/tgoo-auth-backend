# 📝 Changelog - Sistema de Plataforma Master

## 🎉 Nova Funcionalidade: Plataforma Master e SUPER_ADMIN Universal

**Data:** 04 de Fevereiro de 2026

### 🆕 Novidades

#### 1. Plataforma Master
- Adicionado campo `isMaster` ao modelo `Platform`
- Apenas uma plataforma pode ser marcada como master
- Plataforma master gerencia os SUPER_ADMIN com acesso universal

#### 2. SUPER_ADMIN Universal
- SUPER_ADMIN da plataforma master pode autenticar em TODAS as plataformas
- Mantém todas as permissões administrativas em qualquer plataforma
- Sistema de autenticação hierárquico:
  1. ✅ Verifica se é SUPER_ADMIN da plataforma master
  2. ⏭️ Se não, verifica se é usuário da plataforma de destino

#### 3. Token JWT Aprimorado
- Novos campos no token para SUPER_ADMIN:
  - `targetPlatform`: plataforma sendo acessada
  - `isSuperAdminAccess`: flag indicando acesso universal
- Mantém campos originais para compatibilidade

### 🔧 Alterações Técnicas

#### Schema Prisma
```diff
model Platform {
  id          Int      @id @default(autoincrement())
  code        String   @unique
  name        String
  domain      String?
  description String?  @db.Text
  isActive    Boolean  @default(true)
+ isMaster    Boolean  @default(false)  // ⭐ NOVO
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  users       User[]
}
```

#### Migration
- **Arquivo:** `20260204204757_add_master_platform`
- Adiciona coluna `is_master` na tabela `platforms`
- Valor padrão: `false`

#### Rota de Login (`/api/auth/login`)
**Fluxo anterior:**
```
1. Verificar se plataforma existe
2. Buscar usuário na plataforma
3. Validar senha
4. Retornar token
```

**Novo fluxo:**
```
1. Verificar se plataforma existe
2. Buscar plataforma master
3. Verificar se é SUPER_ADMIN da plataforma master
   ├─ SIM: Validar senha e aprovar (acesso universal)
   └─ NÃO: Buscar usuário na plataforma de destino
4. Retornar token (com informações de acesso)
```

### 📦 Novos Arquivos

#### Scripts
- `scripts/setup-master-platform.js` - Configuração da plataforma master e SUPER_ADMIN

#### Documentação
- `MASTER_PLATFORM.md` - Guia completo do sistema de plataforma master
- `CHANGELOG_MASTER_PLATFORM.md` - Este arquivo
- `examples/super-admin-example.sh` - Demonstração prática

#### Atualizações
- `README.md` - Seção sobre plataforma master
- `scripts/README.md` - Instruções do novo script
- `examples/README.md` - Exemplo do SUPER_ADMIN

### 🚀 Guia de Migração

#### Para Instalações Existentes

1. **Executar Migration:**
```bash
npm run prisma:migrate
```

2. **Configurar Plataforma Master:**
```bash
node scripts/setup-master-platform.js
```

3. **Opcional - Converter SUPER_ADMIN existente:**
```sql
-- 1. Criar/Obter plataforma master
UPDATE platforms SET is_master = 1 WHERE code = 'auth_tgoo';

-- 2. Mover SUPER_ADMIN para plataforma master (se necessário)
-- Verificar se existe algum SUPER_ADMIN
SELECT * FROM users WHERE role = 'SUPER_ADMIN';

-- Se existir SUPER_ADMIN em outra plataforma, você pode:
-- a) Criar novo SUPER_ADMIN na master (recomendado)
-- b) Ou mover o existente (com cuidado devido a constraint unique)
```

#### Para Novas Instalações

1. **Setup normal:**
```bash
npm install
docker-compose up -d
npm run prisma:migrate
npm run prisma:seed
```

2. **Configurar master:**
```bash
node scripts/setup-master-platform.js
```

### 🔐 Impacto em Segurança

#### Melhorias
- ✅ Centralização do gerenciamento de SUPER_ADMIN
- ✅ Controle mais granular de acesso
- ✅ Auditoria facilitada (acesso do SUPER_ADMIN é rastreável)
- ✅ Separação clara entre plataforma de gerenciamento e plataformas de aplicação

#### Considerações
- ⚠️ SUPER_ADMIN tem acesso a todas as plataformas - proteja essas credenciais
- ⚠️ Recomenda-se ter apenas 1-2 usuários SUPER_ADMIN
- ⚠️ Mantenha backup das credenciais do SUPER_ADMIN
- ⚠️ Use senhas fortes e 2FA quando disponível

### 📊 Exemplos de Uso

#### Criar Plataforma Master
```bash
node scripts/setup-master-platform.js
```

#### Login SUPER_ADMIN em Qualquer Plataforma
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tgoo.eu",
    "password": "Senha@123",
    "platform": "qualquer_plataforma"
  }'
```

#### Verificar Token JWT
```bash
# O token incluirá:
{
  "id": 1,
  "email": "admin@tgoo.eu",
  "role": "SUPER_ADMIN",
  "platformId": 100,
  "platform": "auth_tgoo",
  "targetPlatform": "qualquer_plataforma",
  "isSuperAdminAccess": true
}
```

### 🧪 Testes

#### Testar Configuração
```bash
# 1. Verificar plataforma master existe
npm run prisma:studio
# Abrir tabela 'platforms' e verificar is_master = true

# 2. Verificar SUPER_ADMIN existe
# Abrir tabela 'users' e verificar role = SUPER_ADMIN

# 3. Testar login em múltiplas plataformas
./examples/super-admin-example.sh
```

### 📚 Documentação Relacionada

- [📖 README Principal](./README.md)
- [👑 Sistema de Plataforma Master](./MASTER_PLATFORM.md)
- [🔐 Scripts de Administração](./scripts/README.md)
- [📘 Guia de Integração](./INTEGRATION_GUIDE.md)
- [🏢 Arquitetura Multi-Plataforma](./MULTI_PLATFORM_AUTH.md)

### ❓ FAQ

**P: Posso ter múltiplas plataformas master?**
R: Não. O sistema permite apenas uma plataforma master. O script automaticamente remove o status master de qualquer plataforma existente.

**P: O que acontece se eu deletar a plataforma master?**
R: Os SUPER_ADMIN perderão o acesso universal. Configure uma nova plataforma master executando o script novamente.

**P: SUPER_ADMIN pode criar usuários em outras plataformas?**
R: Sim! Use a API `/api/admin/users` com o parâmetro `platform` para especificar a plataforma de destino.

**P: Como remover o status de SUPER_ADMIN de um usuário?**
R: Use a API `/api/admin/users/:id` (PATCH) e altere o `role` para `ADMIN` ou `USER`.

**P: Preciso atualizar meus clientes/frontends?**
R: Não necessariamente. A mudança é transparente para clientes existentes. Apenas se você quiser usar as novas funcionalidades (como criar usuários cross-platform).

### 🐛 Problemas Conhecidos

Nenhum problema conhecido no momento.

### 📞 Suporte

Para dúvidas ou problemas:
1. Consulte a [documentação completa](./MASTER_PLATFORM.md)
2. Verifique os [exemplos práticos](./examples/)
3. Abra uma issue no repositório

---

**Desenvolvido por TGOO** 🚀
