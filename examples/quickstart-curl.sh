#!/bin/bash

################################################################################
# TGOO Auth - Quick Start cURL
#
# Script de exemplo para testar a API de autenticação usando cURL
# Para documentação completa, consulte: INTEGRATION_GUIDE.md
#
# Uso:
#   chmod +x quickstart-curl.sh
#   ./quickstart-curl.sh
################################################################################

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# CONFIGURAÇÃO
# ============================================================================

API_URL="https://auth.tgoo.eu/api"
PLATFORM_CODE="dressme"

# Credenciais de teste (ajuste conforme necessário)
TEST_EMAIL="admin@tgoo.eu"
TEST_PASSWORD="Senha@123"

# Arquivo temporário para armazenar o token
TOKEN_FILE=".tgoo_token"

# ============================================================================
# FUNÇÕES AUXILIARES
# ============================================================================

print_header() {
    echo ""
    echo -e "${BLUE}================================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# ============================================================================
# TESTES DA API
# ============================================================================

# Teste 1: Listar Plataformas
test_list_platforms() {
    print_header "1. LISTAR PLATAFORMAS DISPONÍVEIS"
    
    echo "GET $API_URL/auth/platforms"
    echo ""
    
    response=$(curl -s -w "\n%{http_code}" \
        -X GET \
        -H "Content-Type: application/json" \
        "$API_URL/auth/platforms")
    
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ]; then
        print_success "Plataformas listadas com sucesso!"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        print_error "Erro ao listar plataformas (HTTP $http_code)"
        echo "$body"
    fi
}

# Teste 2: Criar Conta (Signup)
test_signup() {
    print_header "2. CRIAR NOVA CONTA (SIGNUP)"
    
    local email="${1:-teste_$(date +%s)@example.com}"
    local password="${2:-senha123}"
    local fullName="${3:-Usuário Teste}"
    
    print_info "Criando conta para: $email"
    echo ""
    echo "POST $API_URL/auth/signup"
    echo ""
    
    response=$(curl -s -w "\n%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$email\",
            \"password\": \"$password\",
            \"fullName\": \"$fullName\",
            \"platform\": \"$PLATFORM_CODE\"
        }" \
        "$API_URL/auth/signup")
    
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 201 ]; then
        print_success "Conta criada com sucesso!"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
        print_info "Status: PENDING - Aguarde aprovação do administrador"
    else
        print_error "Erro ao criar conta (HTTP $http_code)"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    fi
}

# Teste 3: Login
test_login() {
    print_header "3. FAZER LOGIN"
    
    local email="${1:-$TEST_EMAIL}"
    local password="${2:-$TEST_PASSWORD}"
    
    print_info "Fazendo login: $email"
    echo ""
    echo "POST $API_URL/auth/login"
    echo ""
    
    response=$(curl -s -w "\n%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$email\",
            \"password\": \"$password\",
            \"platform\": \"$PLATFORM_CODE\"
        }" \
        "$API_URL/auth/login")
    
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ]; then
        print_success "Login realizado com sucesso!"
        
        # Extrair e salvar token
        token=$(echo "$body" | jq -r '.token' 2>/dev/null)
        if [ -n "$token" ] && [ "$token" != "null" ]; then
            echo "$token" > "$TOKEN_FILE"
            print_success "Token salvo em $TOKEN_FILE"
            echo ""
            echo "Token (primeiros 50 chars): ${token:0:50}..."
            echo ""
            echo "Dados do usuário:"
            echo "$body" | jq '.user' 2>/dev/null || echo "$body"
        else
            echo "$body"
        fi
    else
        print_error "Erro ao fazer login (HTTP $http_code)"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
        
        if [ "$http_code" -eq 403 ]; then
            print_info "Dica: Verifique se a conta está ACTIVE (não PENDING ou BLOCKED)"
        elif [ "$http_code" -eq 401 ]; then
            print_info "Dica: Verifique email e senha"
        fi
    fi
}

# Teste 4: Obter Perfil
test_get_profile() {
    print_header "4. OBTER PERFIL DO USUÁRIO"
    
    # Verificar se existe token salvo
    if [ ! -f "$TOKEN_FILE" ]; then
        print_error "Token não encontrado. Faça login primeiro!"
        return 1
    fi
    
    token=$(cat "$TOKEN_FILE")
    
    echo "GET $API_URL/auth/profile"
    echo ""
    
    response=$(curl -s -w "\n%{http_code}" \
        -X GET \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        "$API_URL/auth/profile")
    
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ]; then
        print_success "Perfil obtido com sucesso!"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        print_error "Erro ao obter perfil (HTTP $http_code)"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
        
        if [ "$http_code" -eq 401 ]; then
            print_info "Token inválido ou expirado. Faça login novamente."
            rm -f "$TOKEN_FILE"
        fi
    fi
}

# Teste 5: Alterar Senha
test_change_password() {
    print_header "5. ALTERAR SENHA"
    
    local old_password="${1}"
    local new_password="${2}"
    
    if [ -z "$old_password" ] || [ -z "$new_password" ]; then
        print_info "Uso: test_change_password <senha_antiga> <senha_nova>"
        return 1
    fi
    
    # Verificar se existe token salvo
    if [ ! -f "$TOKEN_FILE" ]; then
        print_error "Token não encontrado. Faça login primeiro!"
        return 1
    fi
    
    token=$(cat "$TOKEN_FILE")
    
    print_info "Alterando senha..."
    echo ""
    echo "POST $API_URL/password/change"
    echo ""
    
    response=$(curl -s -w "\n%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -d "{
            \"oldPassword\": \"$old_password\",
            \"newPassword\": \"$new_password\"
        }" \
        "$API_URL/password/change")
    
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ]; then
        print_success "Senha alterada com sucesso!"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        print_error "Erro ao alterar senha (HTTP $http_code)"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    fi
}

# Teste 6: Requisição com Token Inválido
test_invalid_token() {
    print_header "6. TESTAR TOKEN INVÁLIDO"
    
    print_info "Testando requisição com token inválido..."
    echo ""
    
    response=$(curl -s -w "\n%{http_code}" \
        -X GET \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer token_invalido_123" \
        "$API_URL/auth/profile")
    
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 401 ]; then
        print_success "Erro 401 retornado corretamente!"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        print_error "Esperado HTTP 401, mas recebeu $http_code"
        echo "$body"
    fi
}

# ============================================================================
# MENU INTERATIVO
# ============================================================================

show_menu() {
    echo ""
    print_header "TGOO AUTH - MENU DE TESTES"
    echo "1. Listar Plataformas"
    echo "2. Criar Nova Conta (Signup)"
    echo "3. Fazer Login"
    echo "4. Obter Perfil"
    echo "5. Alterar Senha"
    echo "6. Testar Token Inválido"
    echo "7. Executar Todos os Testes"
    echo "8. Limpar Token Salvo"
    echo "0. Sair"
    echo ""
    echo -n "Escolha uma opção: "
}

run_all_tests() {
    print_header "EXECUTANDO TODOS OS TESTES"
    
    test_list_platforms
    sleep 2
    
    test_login
    sleep 2
    
    if [ -f "$TOKEN_FILE" ]; then
        test_get_profile
        sleep 2
        
        test_invalid_token
    else
        print_info "Pulando testes autenticados (sem token)"
    fi
    
    print_header "TESTES CONCLUÍDOS"
}

# ============================================================================
# MAIN
# ============================================================================

main() {
    clear
    
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     🔐 TGOO Auth - Testes com cURL           ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
    echo ""
    
    print_info "API URL: $API_URL"
    print_info "Plataforma: $PLATFORM_CODE"
    
    # Verificar se jq está instalado
    if ! command -v jq &> /dev/null; then
        echo ""
        print_info "Dica: Instale 'jq' para formatação JSON melhorada"
        print_info "      sudo apt-get install jq  # Ubuntu/Debian"
        print_info "      brew install jq           # macOS"
    fi
    
    # Se argumentos foram passados, executar teste específico
    if [ $# -gt 0 ]; then
        case "$1" in
            "platforms") test_list_platforms ;;
            "signup") test_signup "$2" "$3" "$4" ;;
            "login") test_login "$2" "$3" ;;
            "profile") test_get_profile ;;
            "change-password") test_change_password "$2" "$3" ;;
            "all") run_all_tests ;;
            *)
                echo "Uso: $0 [platforms|signup|login|profile|change-password|all]"
                exit 1
                ;;
        esac
        exit 0
    fi
    
    # Menu interativo
    while true; do
        show_menu
        read -r option
        
        case $option in
            1) test_list_platforms ;;
            2)
                echo -n "Email (ou Enter para gerar): "
                read -r email
                echo -n "Senha [senha123]: "
                read -r password
                password=${password:-senha123}
                echo -n "Nome Completo [Usuário Teste]: "
                read -r fullName
                fullName=${fullName:-Usuário Teste}
                test_signup "$email" "$password" "$fullName"
                ;;
            3)
                echo -n "Email [$TEST_EMAIL]: "
                read -r email
                email=${email:-$TEST_EMAIL}
                echo -n "Senha: "
                read -rs password
                echo ""
                password=${password:-$TEST_PASSWORD}
                test_login "$email" "$password"
                ;;
            4) test_get_profile ;;
            5)
                echo -n "Senha Antiga: "
                read -rs old_pass
                echo ""
                echo -n "Senha Nova: "
                read -rs new_pass
                echo ""
                test_change_password "$old_pass" "$new_pass"
                ;;
            6) test_invalid_token ;;
            7) run_all_tests ;;
            8)
                if [ -f "$TOKEN_FILE" ]; then
                    rm "$TOKEN_FILE"
                    print_success "Token removido!"
                else
                    print_info "Nenhum token salvo"
                fi
                ;;
            0)
                echo ""
                print_info "Até logo!"
                exit 0
                ;;
            *)
                print_error "Opção inválida!"
                ;;
        esac
        
        echo ""
        echo -n "Pressione Enter para continuar..."
        read -r
        clear
    done
}

# Executar
main "$@"

