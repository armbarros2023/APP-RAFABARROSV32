#!/bin/bash

# Script para finalizar deploy do backend e criar usuário admin
# Data: 22/12/2025

set -e

VPS_IP="69.62.103.58"
VPS_USER="root"

echo ""
echo "🚀 FINALIZANDO DEPLOY DO BACKEND"
echo "=================================="
echo ""

# Conectar ao VPS e executar comandos
ssh $VPS_USER@$VPS_IP << 'ENDSSH'

set -e

echo "📁 Verificando diretório do backend..."
cd /root/clinicrafabarros 2>/dev/null || {
    echo "❌ Diretório não existe. Criando..."
    mkdir -p /root/clinicrafabarros
    cd /root/clinicrafabarros
}

echo ""
echo "📦 Verificando pacote de deploy..."
if [ -f "/tmp/backend-deploy.tar.gz" ]; then
    echo "✓ Pacote encontrado, extraindo..."
    tar -xzf /tmp/backend-deploy.tar.gz
elif [ -f "/tmp/backend-deploy-20251222-103615.tar.gz" ]; then
    echo "✓ Pacote encontrado, extraindo..."
    tar -xzf /tmp/backend-deploy-20251222-103615.tar.gz
else
    echo "⚠️  Pacote não encontrado, usando arquivos existentes..."
fi

echo ""
echo "⚙️  Configurando .env..."
cat > .env << 'EOF'
# Environment
NODE_ENV=production

# Server
PORT=5000

# Database
DATABASE_URL=postgresql://clinicapp:Ra483220fa@localhost:5432/app-rafabarros

# JWT
JWT_SECRET=clinica-rafa-barros-secret-key-2025-production-$(date +%s)
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://clinica.iaaplicativos.com.br

# Admin Seed
ADMIN_NAME=Armando de Barros
ADMIN_EMAIL=armbrros2023@gmail.com
ADMIN_PASSWORD=483220
EOF

echo "✓ .env configurado"

echo ""
echo "🗄️  Gerando Prisma Client..."
npx prisma generate

echo ""
echo "📊 Executando migrations..."
npx prisma migrate deploy || echo "⚠️  Migrations já aplicadas"

echo ""
echo "👤 Criando usuário admin..."

# Script para criar usuário admin
node << 'ENDNODE'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        // Verificar se admin já existe
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'armbrros2023@gmail.com' }
        });

        if (existingAdmin) {
            console.log('✓ Usuário admin já existe');
            
            // Atualizar senha para garantir que está correta
            const hashedPassword = await bcrypt.hash('483220', 10);
            await prisma.user.update({
                where: { email: 'armbrros2023@gmail.com' },
                data: { password: hashedPassword }
            });
            console.log('✓ Senha do admin atualizada');
        } else {
            // Criar novo admin
            const hashedPassword = await bcrypt.hash('483220', 10);
            
            await prisma.user.create({
                data: {
                    name: 'Armando de Barros',
                    email: 'armbrros2023@gmail.com',
                    password: hashedPassword,
                    role: 'ADMIN',
                    active: true
                }
            });
            console.log('✓ Usuário admin criado com sucesso');
        }
    } catch (error) {
        console.error('❌ Erro ao criar admin:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
ENDNODE

echo ""
echo "🔄 Gerenciando processo PM2..."

# Parar processo antigo
pm2 delete clinicrafabarros-api 2>/dev/null || echo "Nenhum processo anterior"

# Iniciar novo processo
pm2 start dist/server.js --name clinicrafabarros-api

# Salvar configuração
pm2 save

# Configurar startup
pm2 startup systemd -u root --hp /root 2>/dev/null || true

echo ""
echo "✅ DEPLOY CONCLUÍDO!"
echo ""
echo "📊 Status do serviço:"
pm2 list

echo ""
echo "📋 Logs recentes:"
pm2 logs clinicrafabarros-api --lines 15 --nostream

echo ""
echo "🔍 Testando API..."
sleep 2
curl -s http://localhost:5000/api/health || echo "⚠️  API ainda não respondeu"

ENDSSH

echo ""
echo "=================================="
echo "✅ BACKEND CONFIGURADO COM SUCESSO!"
echo "=================================="
echo ""
echo "🌐 URLs de Acesso:"
echo "   • Frontend: https://clinica.iaaplicativos.com.br"
echo "   • API: http://$VPS_IP:5000/api"
echo "   • Health: http://$VPS_IP:5000/api/health"
echo ""
echo "🔐 Credenciais de Login:"
echo "   • Email: armbrros2023@gmail.com"
echo "   • Senha: 483220"
echo ""
echo "🧪 Teste agora:"
echo "   1. Acesse: https://clinica.iaaplicativos.com.br"
echo "   2. Faça login com as credenciais acima"
echo ""
