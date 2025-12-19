#!/bin/bash

# Script de deploy simplificado
VPS_HOST="69.62.103.58"
VPS_USER="root"
VPS_PASS="B075@#ax/980tec"
REMOTE_PATH="/var/www/clinicrafabarros-backend"

echo "🚀 Iniciando deploy do backend..."
echo ""

cd "$(dirname "$0")"

# Compactar apenas os arquivos necessários
echo "📦 Compactando arquivos..."
tar -czf /tmp/backend-deploy.tar.gz \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='*.tar.gz' \
  --exclude='deploy-*.sh' \
  --exclude='deploy-*.exp' \
  prisma/ src/ package.json tsconfig.json .env 2>/dev/null

if [ ! -f /tmp/backend-deploy.tar.gz ]; then
    echo "❌ Erro ao compactar arquivos"
    exit 1
fi

echo "✅ Arquivos compactados: $(du -h /tmp/backend-deploy.tar.gz | cut -f1)"
echo ""

# Copiar para VPS
echo "📤 Copiando para VPS..."
echo "   Quando pedir a senha, digite: $VPS_PASS"
echo ""

scp /tmp/backend-deploy.tar.gz ${VPS_USER}@${VPS_HOST}:/tmp/

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Arquivo enviado com sucesso!"
    echo ""
    echo "📂 Agora execute NA VPS:"
    echo ""
    echo "ssh root@${VPS_HOST}"
    echo "cd ${REMOTE_PATH}"
    echo "tar -xzf /tmp/backend-deploy.tar.gz"
    echo "rm /tmp/backend-deploy.tar.gz"
    echo "npm install"
    echo "npx prisma generate"
    echo "npx prisma db push"
    echo ""
else
    echo "❌ Erro ao enviar arquivo"
    exit 1
fi

# Limpar
rm /tmp/backend-deploy.tar.gz

echo "🎉 Deploy preparado! Execute os comandos acima na VPS."
