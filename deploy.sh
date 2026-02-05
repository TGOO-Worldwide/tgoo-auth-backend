#!/bin/bash

# Script de Deploy Manual para tgoo-auth-backend
# Este script pode ser executado manualmente no servidor se necessário

set -e  # Para de executar se houver erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir com cor
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║   🚀 Deploy tgoo-auth-backend        ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    print_error "package.json não encontrado! Execute o script no diretório raiz do projeto."
    exit 1
fi

print_info "Diretório atual: $(pwd)"

# Backup do .env
if [ -f .env ]; then
    print_info "Fazendo backup do .env..."
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    print_success "Backup do .env criado"
fi

# Atualizar código (se usando git)
if [ -d .git ]; then
    print_info "Atualizando código do repositório..."
    
    # Verificar branch atual
    CURRENT_BRANCH=$(git branch --show-current)
    print_info "Branch atual: $CURRENT_BRANCH"
    
    # Stash de mudanças locais (se houver)
    if [[ -n $(git status -s) ]]; then
        print_warning "Há mudanças locais. Fazendo stash..."
        git stash
    fi
    
    # Pull
    git pull origin $CURRENT_BRANCH
    print_success "Código atualizado"
else
    print_warning "Não é um repositório git. Pulando atualização..."
fi

# Instalar dependências
print_info "Instalando dependências..."
npm ci
print_success "Dependências instaladas"

# Gerar Prisma Client
print_info "Gerando Prisma Client..."
npx prisma generate
print_success "Prisma Client gerado"

# Executar migrations
print_info "Executando migrations do banco de dados..."
npx prisma migrate deploy
print_success "Migrations executadas"

# Build
print_info "Fazendo build do projeto..."
npm run build
print_success "Build concluído"

# Verificar se o build foi criado
if [ ! -d "dist" ]; then
    print_error "Pasta dist não foi gerada! Verifique os erros acima."
    exit 1
fi

# Reiniciar aplicação com PM2
print_info "Gerenciando aplicação com PM2..."

# Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    print_warning "PM2 não encontrado. Instalando globalmente..."
    npm install -g pm2
    print_success "PM2 instalado"
fi

# Verificar se a aplicação já está rodando
if pm2 list | grep -q "tgoo-auth-backend"; then
    print_info "Reiniciando aplicação..."
    pm2 restart tgoo-auth-backend
    print_success "Aplicação reiniciada"
else
    print_info "Iniciando aplicação pela primeira vez..."
    pm2 start ecosystem.config.js
    pm2 save
    print_success "Aplicação iniciada"
fi

# Aguardar um pouco para a aplicação iniciar
sleep 2

# Mostrar status
echo -e "\n${BLUE}📊 Status da aplicação:${NC}"
pm2 status tgoo-auth-backend

# Mostrar logs recentes
echo -e "\n${BLUE}📝 Logs recentes:${NC}"
pm2 logs tgoo-auth-backend --lines 10 --nostream

# Sucesso
echo -e "\n${GREEN}"
echo "╔═══════════════════════════════════════╗"
echo "║   🎉 Deploy concluído com sucesso!   ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

print_info "Para ver os logs em tempo real: pm2 logs tgoo-auth-backend"
print_info "Para ver o status: pm2 status"
print_info "Para reiniciar: pm2 restart tgoo-auth-backend"
