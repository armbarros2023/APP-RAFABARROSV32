#!/bin/bash

# Script de Deploy - ClinicaRafaBarros
# Executa deploy completo do backend na VPS

set -e  # Parar em caso de erro

echo "🚀 Iniciando deploy do ClinicaRafaBarros..."
echo ""

# Variáveis
VPS_IP="69.62.103.58"
VPS_USER="root"
DOMAIN="app.clinicarafabarros.com.br"
APP_DIR="/root/clinicrafabarros"

echo "📦 Passo 1: Preparando arquivos para deploy..."
cd "$(dirname "$0")/../backend"

# Criar pacote do backend
echo "  - Criando arquivo tar.gz..."
tar -czf ../backend-deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='.env' \
    .

echo ""
echo "📤 Passo 2: Transferindo arquivos para VPS..."
scp ../backend-deploy.tar.gz $VPS_USER@$VPS_IP:/tmp/

echo ""
echo "🔧 Passo 3: Configurando backend na VPS..."
ssh $VPS_USER@$VPS_IP << 'ENDSSH'
set -e

# Criar diretório
mkdir -p /root/clinicrafabarros
cd /root/clinicrafabarros

# Extrair arquivos
echo "  - Extraindo arquivos..."
tar -xzf /tmp/backend-deploy.tar.gz
rm /tmp/backend-deploy.tar.gz

# Instalar dependências
echo "  - Instalando dependências..."
npm install --production

# Build TypeScript
echo "  - Compilando TypeScript..."
npm run build

# Gerar Prisma Client
echo "  - Gerando Prisma Client..."
npx prisma generate

echo "✅ Backend configurado!"
ENDSSH

echo ""
echo "⚙️  Passo 4: Configurando PM2..."
ssh $VPS_USER@$VPS_IP << 'ENDSSH'
# Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo "  - Instalando PM2..."
    npm install -g pm2
fi

cd /root/clinicrafabarros

# Parar processo anterior se existir
pm2 delete clinicrafabarros-api 2>/dev/null || true

# Iniciar com PM2
echo "  - Iniciando aplicação com PM2..."
pm2 start dist/server.js --name clinicrafabarros-api

# Salvar configuração
pm2 save

# Configurar startup
pm2 startup | tail -n 1 | bash || true

echo "✅ PM2 configurado!"
ENDSSH

echo ""
echo "🌐 Passo 5: Verificando status..."
ssh $VPS_USER@$VPS_IP << 'ENDSSH'
pm2 status
ENDSSH

echo ""
echo "🎉 Deploy concluído!"
echo ""
echo "📊 Próximos passos:"
echo "  1. Configurar DNS: app.clinicarafabarros.com.br -> 69.62.103.58"
echo "  2. Configurar Nginx (ver FASE_3_DEPLOY.md)"
echo "  3. Configurar SSL com Certbot"
echo "  4. Deploy do frontend"
echo ""
echo "🔗 URLs:"
echo "  Backend: http://$VPS_IP:5000/api/health"
echo "  Logs: ssh $VPS_USER@$VPS_IP 'pm2 logs clinicrafabarros-api'"
echo ""
