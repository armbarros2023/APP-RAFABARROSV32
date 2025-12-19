#!/bin/bash

# Script para fazer deploy do backend para a VPS
# Execute: bash deploy-to-vps.sh

VPS_HOST="srv919827.hstgr.cloud"
VPS_USER="root"
VPS_PATH="/var/www/clinicrafabarros-backend"

echo "🚀 Iniciando deploy do backend para VPS..."
echo ""

# Criar tar.gz com os arquivos
echo "📦 Compactando arquivos..."
cd "$(dirname "$0")"
tar -czf backend-deploy.tar.gz \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.env' \
  --exclude='deploy-to-vps.sh' \
  --exclude='backend-deploy.tar.gz' \
  .

echo "📤 Enviando para VPS..."
scp backend-deploy.tar.gz ${VPS_USER}@${VPS_HOST}:/tmp/

echo "📂 Extraindo na VPS..."
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
cd /var/www/clinicrafabarros-backend
tar -xzf /tmp/backend-deploy.tar.gz
rm /tmp/backend-deploy.tar.gz
echo "✅ Arquivos extraídos com sucesso!"
ls -la
ENDSSH

# Limpar arquivo local
rm backend-deploy.tar.gz

echo ""
echo "🎉 Deploy concluído!"
echo ""
echo "Próximos passos na VPS:"
echo "1. cd /var/www/clinicrafabarros-backend"
echo "2. npm install"
echo "3. npx prisma generate"
echo "4. npx prisma migrate deploy"
echo "5. npm run prisma:seed"
echo "6. npm run dev"
