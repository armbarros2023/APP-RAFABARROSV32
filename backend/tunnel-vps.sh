#!/bin/bash

# Script para criar túnel SSH com a VPS
# Isso permite conectar ao PostgreSQL da VPS como se fosse localhost

echo "🔐 Criando túnel SSH com a VPS..."
echo "📍 VPS: 69.62.103.58"
echo "🔌 Porta local: 5433 -> VPS: 5433"
echo ""
echo "⚠️  Mantenha este terminal aberto enquanto estiver desenvolvendo"
echo "⚠️  Pressione Ctrl+C para fechar o túnel"
echo ""

ssh -L 5433:127.0.0.1:5433 root@69.62.103.58 -N
