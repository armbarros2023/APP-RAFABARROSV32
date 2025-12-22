#!/bin/bash

# Comandos para executar DENTRO do servidor VPS via SSH
# Copie e cole estes comandos no terminal SSH que está conectado

echo "🚀 CONFIGURAÇÃO RÁPIDA DO BACKEND"
echo "=================================="
echo ""

# 1. Ir para o diretório
echo "📁 Navegando para diretório do backend..."
cd /root/clinicrafabarros || mkdir -p /root/clinicrafabarros && cd /root/clinicrafabarros

# 2. Verificar se há pacote para extrair
echo ""
echo "📦 Verificando pacotes..."
if [ -f "/tmp/backend-deploy.tar.gz" ]; then
    echo "Extraindo /tmp/backend-deploy.tar.gz..."
    tar -xzf /tmp/backend-deploy.tar.gz
elif [ -f "/tmp/backend-deploy-20251222-103615.tar.gz" ]; then
    echo "Extraindo /tmp/backend-deploy-20251222-103615.tar.gz..."
    tar -xzf /tmp/backend-deploy-20251222-103615.tar.gz
else
    echo "⚠️  Nenhum pacote encontrado em /tmp/"
fi

# 3. Criar .env
echo ""
echo "⚙️  Criando arquivo .env..."
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://clinicapp:Ra483220fa@localhost:5432/app-rafabarros
JWT_SECRET=clinica-rafa-barros-secret-production-2025
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://clinica.iaaplicativos.com.br
ADMIN_NAME=Armando de Barros
ADMIN_EMAIL=armbrros2023@gmail.com
ADMIN_PASSWORD=483220
EOF

echo "✓ Arquivo .env criado"

# 4. Gerar Prisma Client
echo ""
echo "🗄️  Gerando Prisma Client..."
npx prisma generate

# 5. Executar migrations
echo ""
echo "📊 Executando migrations..."
npx prisma migrate deploy

# 6. Criar usuário admin
echo ""
echo "👤 Criando usuário admin..."
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

(async () => {
    try {
        const hashedPassword = await bcrypt.hash('483220', 10);
        
        const admin = await prisma.user.upsert({
            where: { email: 'armbrros2023@gmail.com' },
            update: { 
                password: hashedPassword,
                active: true 
            },
            create: {
                name: 'Armando de Barros',
                email: 'armbrros2023@gmail.com',
                password: hashedPassword,
                role: 'ADMIN',
                active: true
            }
        });
        
        console.log('✓ Admin configurado:', admin.email);
    } catch (error) {
        console.error('Erro:', error.message);
    } finally {
        await prisma.\$disconnect();
    }
})();
"

# 7. Parar processo antigo e iniciar novo
echo ""
echo "🔄 Gerenciando PM2..."
pm2 delete clinicrafabarros-api 2>/dev/null || echo "Nenhum processo anterior"
pm2 start dist/server.js --name clinicrafabarros-api
pm2 save

# 8. Mostrar status
echo ""
echo "✅ CONFIGURAÇÃO CONCLUÍDA!"
echo ""
echo "📊 Status:"
pm2 list

echo ""
echo "📋 Logs:"
pm2 logs clinicrafabarros-api --lines 10 --nostream

echo ""
echo "🧪 Testando API..."
sleep 2
curl http://localhost:5000/api/health

echo ""
echo ""
echo "🎯 PRONTO! Agora tente fazer login em:"
echo "   https://clinica.iaaplicativos.com.br"
echo ""
echo "   Email: armbrros2023@gmail.com"
echo "   Senha: 483220"
echo ""
