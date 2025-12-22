#!/bin/bash

# Script de Deploy Completo do Backend - ClinicaRafaBarros
# Data: 22/12/2025
# Autor: Armando de Barros

set -e  # Parar em caso de erro

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
VPS_IP="69.62.103.58"
VPS_USER="root"
VPS_DIR="/root/clinicrafabarros"
BACKEND_DIR="backend"
APP_NAME="clinicrafabarros-api"

echo ""
echo -e "${BLUE}🚀 DEPLOY DO BACKEND - ClinicaRafaBarros${NC}"
echo "=============================================="
echo ""

# Verificar se estamos no diretório correto
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Erro: Diretório backend não encontrado!${NC}"
    echo "Execute este script a partir do diretório raiz do projeto."
    exit 1
fi

# Passo 1: Verificar configurações locais
echo -e "${YELLOW}📋 Passo 1/8: Verificando configurações locais...${NC}"
cd $BACKEND_DIR

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json não encontrado!${NC}"
    exit 1
fi

if [ ! -f "tsconfig.json" ]; then
    echo -e "${RED}❌ tsconfig.json não encontrado!${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Configurações locais OK"
echo ""

# Passo 2: Instalar dependências
echo -e "${YELLOW}📦 Passo 2/8: Instalando dependências...${NC}"
if [ ! -d "node_modules" ]; then
    npm install
else
    echo -e "${GREEN}✓${NC} Dependências já instaladas"
fi
echo ""

# Passo 3: Gerar Prisma Client
echo -e "${YELLOW}🗄️  Passo 3/8: Gerando Prisma Client...${NC}"
npx prisma generate
echo -e "${GREEN}✓${NC} Prisma Client gerado"
echo ""

# Passo 4: Build do projeto
echo -e "${YELLOW}🔨 Passo 4/8: Compilando TypeScript...${NC}"
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build falhou! Diretório dist não foi criado.${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Build concluído com sucesso"
echo ""

# Passo 5: Criar pacote de deploy
echo -e "${YELLOW}📦 Passo 5/8: Criando pacote de deploy...${NC}"

# Criar arquivo temporário com lista de arquivos
cat > /tmp/backend-files.txt << EOF
dist/
node_modules/
prisma/
package.json
package-lock.json
.env.production.example
EOF

# Criar tarball
tar -czf ../backend-deploy-$(date +%Y%m%d-%H%M%S).tar.gz \
    dist/ \
    node_modules/ \
    prisma/ \
    package.json \
    package-lock.json \
    .env.production.example

DEPLOY_FILE=$(ls -t ../backend-deploy-*.tar.gz | head -1)
DEPLOY_SIZE=$(du -h "$DEPLOY_FILE" | cut -f1)

echo -e "${GREEN}✓${NC} Pacote criado: $(basename $DEPLOY_FILE) ($DEPLOY_SIZE)"
echo ""

# Voltar ao diretório raiz do projeto
cd ..

# Passo 6: Upload para VPS
echo -e "${YELLOW}📤 Passo 6/8: Fazendo upload para VPS...${NC}"
echo "Conectando em $VPS_USER@$VPS_IP..."
echo ""

# Usar caminho absoluto para o arquivo
DEPLOY_FILE_FULL=$(ls -t backend-deploy-*.tar.gz | head -1)

scp "$DEPLOY_FILE" $VPS_USER@$VPS_IP:/tmp/

echo -e "${GREEN}✓${NC} Upload concluído"
echo ""

# Passo 7: Instalar no VPS
echo -e "${YELLOW}🔧 Passo 7/8: Instalando no VPS...${NC}"
echo ""

ssh $VPS_USER@$VPS_IP << 'ENDSSH'
set -e

# Cores no SSH
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}→ Criando diretório de backup...${NC}"
mkdir -p /root/backups

# Backup do backend atual (se existir)
if [ -d "/root/clinicrafabarros" ]; then
    echo -e "${YELLOW}→ Fazendo backup do backend atual...${NC}"
    tar -czf /root/backups/clinicrafabarros-backup-$(date +%Y%m%d-%H%M%S).tar.gz \
        -C /root clinicrafabarros/ 2>/dev/null || true
    echo -e "${GREEN}✓${NC} Backup criado"
fi

# Criar/recriar diretório
echo -e "${YELLOW}→ Preparando diretório...${NC}"
mkdir -p /root/clinicrafabarros
cd /root/clinicrafabarros

# Salvar .env se existir
if [ -f ".env" ]; then
    echo -e "${YELLOW}→ Salvando .env atual...${NC}"
    cp .env /tmp/.env.backup
fi

# Extrair novo deploy
echo -e "${YELLOW}→ Extraindo arquivos...${NC}"
tar -xzf /tmp/backend-deploy-*.tar.gz -C /root/clinicrafabarros/

# Restaurar .env ou criar novo
if [ -f "/tmp/.env.backup" ]; then
    echo -e "${YELLOW}→ Restaurando .env...${NC}"
    cp /tmp/.env.backup .env
    rm /tmp/.env.backup
else
    echo -e "${YELLOW}→ Criando .env de produção...${NC}"
    cat > .env << 'EOF'
# Environment
NODE_ENV=production

# Server
PORT=5000

# Database
DATABASE_URL=postgresql://clinicapp:Ra483220fa@localhost:5432/app-rafabarros

# JWT - IMPORTANTE: Trocar este secret!
JWT_SECRET=seu-secret-super-seguro-aqui-mude-isso-em-producao-$(date +%s)

# JWT Expiration
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://clinica.iaaplicativos.com.br

# Admin Seed
ADMIN_NAME=Armando de Barros
ADMIN_EMAIL=armbrros2023@gmail.com
ADMIN_PASSWORD=483220
EOF
fi

# Gerar Prisma Client no VPS
echo -e "${YELLOW}→ Gerando Prisma Client...${NC}"
npx prisma generate

# Executar migrations
echo -e "${YELLOW}→ Executando migrations...${NC}"
npx prisma migrate deploy || echo "Migrations já aplicadas ou não necessárias"

echo -e "${GREEN}✓${NC} Instalação concluída"

ENDSSH

echo -e "${GREEN}✓${NC} Backend instalado no VPS"
echo ""

# Passo 8: Reiniciar serviço
echo -e "${YELLOW}🔄 Passo 8/8: Reiniciando serviço...${NC}"
echo ""

ssh $VPS_USER@$VPS_IP << 'ENDSSH'
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

cd /root/clinicrafabarros

# Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}→ Instalando PM2...${NC}"
    npm install -g pm2
fi

# Parar processo antigo se existir
echo -e "${YELLOW}→ Parando processo antigo...${NC}"
pm2 delete clinicrafabarros-api 2>/dev/null || echo "Nenhum processo anterior encontrado"

# Iniciar novo processo
echo -e "${YELLOW}→ Iniciando backend...${NC}"
pm2 start dist/server.js --name clinicrafabarros-api

# Salvar configuração PM2
pm2 save

# Configurar PM2 para iniciar no boot
pm2 startup systemd -u root --hp /root 2>/dev/null || true

echo ""
echo -e "${GREEN}✓${NC} Backend iniciado com sucesso!"
echo ""

# Mostrar status
echo "📊 Status do serviço:"
pm2 list

echo ""
echo "📋 Logs recentes:"
pm2 logs clinicrafabarros-api --lines 10 --nostream

ENDSSH

echo ""
echo "=============================================="
echo -e "${GREEN}✅ DEPLOY CONCLUÍDO COM SUCESSO!${NC}"
echo "=============================================="
echo ""
echo "📍 Informações do Deploy:"
echo "   • Servidor: $VPS_IP"
echo "   • Diretório: $VPS_DIR"
echo "   • Processo: $APP_NAME"
echo "   • Pacote: $(basename $DEPLOY_FILE) ($DEPLOY_SIZE)"
echo ""
echo "🌐 URLs de Acesso:"
echo "   • API: http://$VPS_IP:5000/api"
echo "   • Health: http://$VPS_IP:5000/api/health"
echo "   • Docs: http://$VPS_IP:5000/"
echo ""
echo "🔧 Comandos Úteis:"
echo "   • Ver logs: ssh $VPS_USER@$VPS_IP 'pm2 logs $APP_NAME'"
echo "   • Status: ssh $VPS_USER@$VPS_IP 'pm2 status'"
echo "   • Reiniciar: ssh $VPS_USER@$VPS_IP 'pm2 restart $APP_NAME'"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   1. Trocar JWT_SECRET no arquivo .env"
echo "   2. Testar a API: curl http://$VPS_IP:5000/api/health"
echo "   3. Verificar logs: ssh $VPS_USER@$VPS_IP 'pm2 logs $APP_NAME'"
echo ""
echo "📖 Mais informações: .agent/CREDENCIAIS_ACESSO.md"
echo ""
