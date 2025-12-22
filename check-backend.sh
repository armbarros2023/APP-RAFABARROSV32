#!/bin/bash

# Script para verificar configurações do backend antes do deploy
# Data: 22/12/2025

echo "🔍 VERIFICAÇÃO DO BACKEND - ClinicaRafaBarros"
echo "=============================================="
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar estrutura local
echo "📁 Verificando estrutura local..."
echo ""

if [ -d "backend" ]; then
    echo -e "${GREEN}✓${NC} Diretório backend existe"
else
    echo -e "${RED}✗${NC} Diretório backend não encontrado"
    exit 1
fi

# Verificar arquivos essenciais
echo ""
echo "📄 Verificando arquivos essenciais..."
echo ""

files=(
    "backend/package.json"
    "backend/tsconfig.json"
    "backend/src/server.ts"
    "backend/prisma/schema.prisma"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file não encontrado"
    fi
done

# Verificar dependências
echo ""
echo "📦 Verificando dependências..."
echo ""

cd backend

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules instalado"
else
    echo -e "${YELLOW}⚠${NC} node_modules não encontrado - executar npm install"
fi

# Verificar build
if [ -d "dist" ]; then
    echo -e "${GREEN}✓${NC} Build (dist) existe"
    echo "   Arquivos no dist:"
    ls -lh dist/ | tail -5
else
    echo -e "${YELLOW}⚠${NC} Build não encontrado - executar npm run build"
fi

# Verificar configurações de segurança
echo ""
echo "🔒 Verificando configurações de segurança..."
echo ""

# Verificar se helmet e rate-limit estão no package.json
if grep -q "helmet" package.json; then
    echo -e "${GREEN}✓${NC} Helmet instalado"
else
    echo -e "${RED}✗${NC} Helmet não instalado"
fi

if grep -q "express-rate-limit" package.json; then
    echo -e "${GREEN}✓${NC} Rate limiting instalado"
else
    echo -e "${RED}✗${NC} Rate limiting não instalado"
fi

# Verificar Prisma
echo ""
echo "🗄️  Verificando Prisma..."
echo ""

if [ -d "node_modules/.prisma" ]; then
    echo -e "${GREEN}✓${NC} Prisma Client gerado"
else
    echo -e "${YELLOW}⚠${NC} Prisma Client não gerado - executar npx prisma generate"
fi

cd ..

echo ""
echo "=============================================="
echo "✅ Verificação local concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Revisar configurações acima"
echo "2. Corrigir problemas se houver"
echo "3. Fazer deploy para VPS"
echo ""
