#!/bin/bash

# 👑 Exemplo de Uso do Sistema de Plataforma Master e SUPER_ADMIN Universal
# Este script demonstra como o SUPER_ADMIN pode acessar múltiplas plataformas

API_URL="http://localhost:3001"
SUPER_ADMIN_EMAIL="admin@tgoo.eu"
SUPER_ADMIN_PASSWORD="Senha@123"

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  👑 Demonstração: SUPER_ADMIN Universal                      ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# 1. Listar plataformas disponíveis
echo "📋 1. Listando plataformas disponíveis..."
echo ""
curl -s -X GET "$API_URL/api/auth/platforms" | jq '.'
echo ""
echo "────────────────────────────────────────────────────────────────"
echo ""

# 2. Login SUPER_ADMIN na plataforma master (auth_tgoo)
echo "🔐 2. Login do SUPER_ADMIN na plataforma MASTER (auth_tgoo)..."
echo ""
RESPONSE_MASTER=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$SUPER_ADMIN_EMAIL"'",
    "password": "'"$SUPER_ADMIN_PASSWORD"'",
    "platform": "auth_tgoo"
  }')

echo "$RESPONSE_MASTER" | jq '.'
TOKEN_MASTER=$(echo "$RESPONSE_MASTER" | jq -r '.token')
echo ""
echo "✅ Token obtido: ${TOKEN_MASTER:0:50}..."
echo ""
echo "────────────────────────────────────────────────────────────────"
echo ""

# 3. Login SUPER_ADMIN em outra plataforma (dressme)
echo "🌐 3. Login do SUPER_ADMIN na plataforma DRESSME (acesso universal)..."
echo ""
RESPONSE_DRESSME=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$SUPER_ADMIN_EMAIL"'",
    "password": "'"$SUPER_ADMIN_PASSWORD"'",
    "platform": "dressme"
  }')

echo "$RESPONSE_DRESSME" | jq '.'
TOKEN_DRESSME=$(echo "$RESPONSE_DRESSME" | jq -r '.token')
echo ""
echo "✅ Token obtido: ${TOKEN_DRESSME:0:50}..."
echo ""
echo "📝 Observe que o token inclui 'accessingPlatform' indicando acesso cruzado!"
echo ""
echo "────────────────────────────────────────────────────────────────"
echo ""

# 4. Verificar perfil com o token da plataforma master
echo "👤 4. Verificando perfil com token da plataforma MASTER..."
echo ""
curl -s -X GET "$API_URL/api/auth/profile" \
  -H "Authorization: Bearer $TOKEN_MASTER" | jq '.'
echo ""
echo "────────────────────────────────────────────────────────────────"
echo ""

# 5. Listar usuários usando token do SUPER_ADMIN
echo "📊 5. Listando usuários da plataforma DRESSME (como SUPER_ADMIN)..."
echo ""
curl -s -X GET "$API_URL/api/admin/users?platform=dressme" \
  -H "Authorization: Bearer $TOKEN_MASTER" | jq '.'
echo ""
echo "────────────────────────────────────────────────────────────────"
echo ""

# 6. Decodificar token JWT para ver estrutura
echo "🔍 6. Estrutura do Token JWT (SUPER_ADMIN acessando outra plataforma)..."
echo ""
echo "Token Header e Payload (sem verificação de assinatura):"
echo ""

# Extrair payload do JWT (segunda parte entre os pontos)
PAYLOAD=$(echo "$TOKEN_DRESSME" | cut -d'.' -f2)
# Adicionar padding se necessário
PADDING_LENGTH=$((4 - ${#PAYLOAD} % 4))
if [ $PADDING_LENGTH -ne 4 ]; then
  PAYLOAD="$PAYLOAD$(printf '%*s' $PADDING_LENGTH | tr ' ' '=')"
fi
# Decodificar base64
echo "$PAYLOAD" | base64 -d 2>/dev/null | jq '.'
echo ""
echo "📝 Campos importantes:"
echo "   - isSuperAdminAccess: true (indica acesso universal)"
echo "   - targetPlatform: plataforma que está sendo acessada"
echo "   - platform: plataforma master (auth_tgoo)"
echo "   - role: SUPER_ADMIN"
echo ""
echo "────────────────────────────────────────────────────────────────"
echo ""

echo "✅ Demonstração concluída!"
echo ""
echo "📖 O que aprendemos:"
echo "   1. SUPER_ADMIN está cadastrado na plataforma master (auth_tgoo)"
echo "   2. Pode fazer login em QUALQUER plataforma com as mesmas credenciais"
echo "   3. O token JWT inclui informações sobre o acesso cruzado"
echo "   4. Mantém todos os privilégios de SUPER_ADMIN em todas as plataformas"
echo ""
echo "🔐 Segurança:"
echo "   - Senha ainda é validada (não é acesso sem senha)"
echo "   - Conta precisa estar ATIVA"
echo "   - Apenas usuários com role SUPER_ADMIN da plataforma master têm esse privilégio"
echo ""
