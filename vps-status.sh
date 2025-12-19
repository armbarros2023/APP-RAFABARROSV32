#!/bin/bash

# ============================================
# COMANDOS RÁPIDOS - VPS HOSTINGER
# Execute estes comandos quando estiver logado na VPS
# ============================================

echo "🚀 Iniciando verificação e preparação da VPS..."
echo ""

# ============================================
# 1. INFORMAÇÕES DO SISTEMA
# ============================================
echo "📊 === INFORMAÇÕES DO SISTEMA ==="
echo ""
echo "Sistema Operacional:"
cat /etc/os-release | grep PRETTY_NAME
echo ""
echo "Kernel:"
uname -r
echo ""
echo "Arquitetura:"
uname -m
echo ""

# ============================================
# 2. RECURSOS DISPONÍVEIS
# ============================================
echo "💾 === RECURSOS DISPONÍVEIS ==="
echo ""
echo "Espaço em Disco:"
df -h / | tail -1
echo ""
echo "Memória RAM:"
free -h | grep Mem
echo ""
echo "CPU:"
lscpu | grep "Model name"
lscpu | grep "CPU(s):"
echo ""

# ============================================
# 3. VERIFICAR SOFTWARE INSTALADO
# ============================================
echo "📦 === SOFTWARE INSTALADO ==="
echo ""

# PostgreSQL
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL: $(psql --version)"
else
    echo "❌ PostgreSQL: NÃO INSTALADO"
fi

# Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js: NÃO INSTALADO"
fi

# NPM
if command -v npm &> /dev/null; then
    echo "✅ NPM: $(npm --version)"
else
    echo "❌ NPM: NÃO INSTALADO"
fi

# PM2
if command -v pm2 &> /dev/null; then
    echo "✅ PM2: $(pm2 --version)"
else
    echo "❌ PM2: NÃO INSTALADO"
fi

# Nginx
if command -v nginx &> /dev/null; then
    echo "✅ Nginx: $(nginx -v 2>&1)"
else
    echo "❌ Nginx: NÃO INSTALADO"
fi

# Git
if command -v git &> /dev/null; then
    echo "✅ Git: $(git --version)"
else
    echo "❌ Git: NÃO INSTALADO"
fi

echo ""

# ============================================
# 4. SERVIÇOS RODANDO
# ============================================
echo "🔄 === SERVIÇOS RODANDO ==="
echo ""

if systemctl is-active --quiet postgresql; then
    echo "✅ PostgreSQL: ATIVO"
else
    echo "❌ PostgreSQL: INATIVO"
fi

if systemctl is-active --quiet nginx; then
    echo "✅ Nginx: ATIVO"
else
    echo "❌ Nginx: INATIVO"
fi

echo ""

# ============================================
# 5. PROCESSOS PM2 (se existir)
# ============================================
if command -v pm2 &> /dev/null; then
    echo "📋 === PROCESSOS PM2 ==="
    pm2 list
    echo ""
fi

# ============================================
# 6. BANCOS DE DADOS POSTGRESQL (se existir)
# ============================================
if command -v psql &> /dev/null; then
    echo "🗄️  === BANCOS DE DADOS POSTGRESQL ==="
    sudo -u postgres psql -c "\l" 2>/dev/null || echo "⚠️  Sem permissão para listar bancos"
    echo ""
fi

# ============================================
# 7. PORTAS EM USO
# ============================================
echo "🔌 === PORTAS EM USO ==="
echo ""
echo "Porta 80 (HTTP):"
sudo netstat -tlnp | grep :80 || echo "Livre"
echo ""
echo "Porta 443 (HTTPS):"
sudo netstat -tlnp | grep :443 || echo "Livre"
echo ""
echo "Porta 5432 (PostgreSQL):"
sudo netstat -tlnp | grep :5432 || echo "Livre"
echo ""
echo "Porta 5000 (Backend padrão):"
sudo netstat -tlnp | grep :5000 || echo "Livre"
echo ""

# ============================================
# 8. FIREWALL
# ============================================
echo "🔥 === FIREWALL ==="
if command -v ufw &> /dev/null; then
    sudo ufw status
else
    echo "UFW não instalado"
fi
echo ""

# ============================================
# 9. RESUMO E RECOMENDAÇÕES
# ============================================
echo "============================================"
echo "📝 RESUMO E PRÓXIMOS PASSOS"
echo "============================================"
echo ""

# Verificar o que falta instalar
MISSING=()

if ! command -v psql &> /dev/null; then
    MISSING+=("PostgreSQL 17")
fi

if ! command -v node &> /dev/null; then
    MISSING+=("Node.js 20+")
fi

if ! command -v npm &> /dev/null; then
    MISSING+=("NPM")
fi

if ! command -v pm2 &> /dev/null; then
    MISSING+=("PM2")
fi

if ! command -v nginx &> /dev/null; then
    MISSING+=("Nginx")
fi

if ! command -v git &> /dev/null; then
    MISSING+=("Git")
fi

if [ ${#MISSING[@]} -eq 0 ]; then
    echo "✅ Todos os componentes necessários estão instalados!"
    echo ""
    echo "Próximos passos:"
    echo "1. Criar banco de dados PostgreSQL"
    echo "2. Fazer upload do backend"
    echo "3. Configurar Nginx"
    echo "4. Deploy da aplicação"
else
    echo "⚠️  Componentes faltando:"
    for item in "${MISSING[@]}"; do
        echo "   - $item"
    done
    echo ""
    echo "Execute o script de instalação para instalar os componentes faltantes."
fi

echo ""
echo "============================================"
echo "Verificação concluída!"
echo "============================================"
