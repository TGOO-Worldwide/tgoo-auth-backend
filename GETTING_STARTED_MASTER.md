# 🚀 Guia Rápido - Plataforma Master

## ⚡ Início Rápido (5 minutos)

### 1. Configurar Plataforma Master

```bash
# Execute o script de configuração
node scripts/setup-master-platform.js
```

**Pressione Enter para usar os valores padrão:**
- Plataforma: `auth_tgoo`
- Email: `admin@tgoo.eu`
- Senha: `Senha@123`

### 2. Testar SUPER_ADMIN

```bash
# Testar login na plataforma master
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tgoo.eu",
    "password": "Senha@123",
    "platform": "auth_tgoo"
  }'
```

### 3. Testar Acesso Universal

```bash
# O mesmo SUPER_ADMIN pode fazer login em QUALQUER plataforma!
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tgoo.eu",
    "password": "Senha@123",
    "platform": "dressme"
  }'
```

### 4. Demonstração Completa

```bash
cd examples
chmod +x super-admin-example.sh
./super-admin-example.sh
```

## 🎯 O Que Mudou?

### Antes
```
Cada plataforma tinha seus próprios administradores.
Para gerenciar 5 plataformas, você precisava de 5 contas diferentes.
```

### Depois
```
Uma plataforma master (auth_tgoo) gerencia SUPER_ADMIN universal.
Com 1 conta SUPER_ADMIN, você acessa TODAS as plataformas!
```

## 🔄 Fluxo Simplificado

```
1. Usuário faz login com: admin@tgoo.eu
2. Sistema verifica: É SUPER_ADMIN da plataforma master?
   ├─ ✅ SIM: Aprova login em QUALQUER plataforma
   └─ ❌ NÃO: Verifica se é usuário da plataforma específica
```

## 📊 Estrutura

```
auth_tgoo (Plataforma Master, isMaster: true)
    │
    ├─ admin@tgoo.eu (SUPER_ADMIN)
    │   └─ Pode acessar:
    │       ├─ auth_tgoo ✅
    │       ├─ dressme ✅
    │       ├─ projeto2 ✅
    │       └─ qualquer_plataforma ✅
    │
    └─ Gerencia o ecossistema completo

dressme (Plataforma Normal, isMaster: false)
    │
    ├─ admin@dressme.com (ADMIN)
    │   └─ Pode acessar apenas: dressme
    │
    └─ user@dressme.com (USER)
        └─ Pode acessar apenas: dressme
```

## 🔑 Token JWT

### SUPER_ADMIN (acesso universal)
```json
{
  "id": 1,
  "email": "admin@tgoo.eu",
  "role": "SUPER_ADMIN",
  "platformId": 100,
  "platform": "auth_tgoo",
  "targetPlatform": "dressme",
  "isSuperAdminAccess": true
}
```

### Usuário Normal
```json
{
  "id": 42,
  "email": "user@dressme.com",
  "role": "USER",
  "platformId": 2,
  "platform": "dressme"
}
```

## 💡 Casos de Uso

### 1. Administrador gerenciando múltiplas plataformas

```javascript
// Login na primeira plataforma
const token1 = await login('admin@tgoo.eu', 'Senha@123', 'plataforma1');

// Mesmo usuário, mesma senha, outra plataforma!
const token2 = await login('admin@tgoo.eu', 'Senha@123', 'plataforma2');

// E mais outra!
const token3 = await login('admin@tgoo.eu', 'Senha@123', 'plataforma3');
```

### 2. Criar usuário em qualquer plataforma

```bash
# SUPER_ADMIN pode criar usuários em qualquer plataforma
curl -X POST http://localhost:3001/api/admin/users \
  -H "Authorization: Bearer $TOKEN_SUPER_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "novo@usuario.com",
    "password": "senha123",
    "fullName": "Novo Usuário",
    "platform": "qualquer_plataforma",
    "role": "USER"
  }'
```

### 3. Listar usuários de qualquer plataforma

```bash
# Ver usuários da plataforma A
curl http://localhost:3001/api/admin/users?platform=plataformaA \
  -H "Authorization: Bearer $TOKEN_SUPER_ADMIN"

# Ver usuários da plataforma B
curl http://localhost:3001/api/admin/users?platform=plataformaB \
  -H "Authorization: Bearer $TOKEN_SUPER_ADMIN"
```

## 🛡️ Segurança

### O que é verificado:
- ✅ Senha correta (não é acesso sem senha!)
- ✅ Conta ATIVA (não BLOCKED ou PENDING)
- ✅ Role = SUPER_ADMIN
- ✅ Plataforma master existe
- ✅ Token JWT válido e assinado

### Boas práticas:
- 🔐 Use senhas fortes para SUPER_ADMIN
- 🔐 Mantenha backup seguro das credenciais
- 🔐 Limite a 1-2 usuários SUPER_ADMIN
- 🔐 Monitore acessos do SUPER_ADMIN
- 🔐 Use HTTPS em produção

## 📖 Documentação Completa

- **Guia Completo:** [MASTER_PLATFORM.md](./MASTER_PLATFORM.md)
- **Mudanças:** [CHANGELOG_MASTER_PLATFORM.md](./CHANGELOG_MASTER_PLATFORM.md)
- **Resumo:** [SUMMARY_CHANGES.md](./SUMMARY_CHANGES.md)
- **Scripts:** [scripts/README.md](./scripts/README.md)
- **Exemplos:** [examples/README.md](./examples/README.md)

## ❓ FAQ Rápido

**P: Preciso reconfigurar meus clientes?**
R: Não! A mudança é transparente. Tudo continua funcionando.

**P: Posso ter vários SUPER_ADMIN?**
R: Sim, mas recomendamos apenas 1-2 para segurança.

**P: SUPER_ADMIN precisa de senha?**
R: SIM! A senha é sempre verificada.

**P: Posso mudar a plataforma master depois?**
R: Sim, execute o script novamente.

**P: E se eu esquecer a senha do SUPER_ADMIN?**
R: Execute o script novamente para redefinir.

## 🎉 Pronto!

Agora você tem:
- ✅ Plataforma master configurada
- ✅ SUPER_ADMIN com acesso universal
- ✅ Sistema hierárquico funcionando
- ✅ Gerenciamento centralizado

**Próximos passos:**
1. Teste o login em múltiplas plataformas
2. Explore os exemplos práticos
3. Leia a documentação completa
4. Configure em produção

---

**Desenvolvido por TGOO** 🚀

**Dúvidas?** Consulte [MASTER_PLATFORM.md](./MASTER_PLATFORM.md)
