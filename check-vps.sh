#!/bin/bash

# ============================================
# Script de Verificação VPS Hostinger
# ============================================

echo "🔍 Verificando conexão com VPS Hostinger..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar comando
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 está instalado"
        return 0
    else
        echo -e "${RED}✗${NC} $1 NÃO está instalado"
        return 1
    fi
}

# Verificar ferramentas necessárias localmente
echo "📦 Verificando ferramentas locais..."
check_command "ssh"
check_command "scp"
check_command "git"
check_command "node"
check_command "npm"

echo ""
echo "📋 Informações necessárias para deploy:"
echo ""
echo "Por favor, forneça as seguintes informações:"
echo ""
read -p "IP ou hostname da VPS Hostinger: " VPS_HOST
read -p "Usuário SSH: " VPS_USER
read -p "Porta SSH (padrão 22): " VPS_PORT
VPS_PORT=${VPS_PORT:-22}

echo ""
echo "🔐 Testando conexão SSH..."

# Testar conexão SSH
if ssh -p $VPS_PORT -o ConnectTimeout=10 -o BatchMode=yes $VPS_USER@$VPS_HOST exit 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Conexão SSH estabelecida com sucesso!"
    CONNECTED=true
else
    echo -e "${YELLOW}⚠${NC} Não foi possível conectar via SSH automaticamente."
    echo "Você pode estar conectado manualmente ou precisar de senha."
    read -p "Deseja tentar conectar manualmente? (s/n): " MANUAL_CONNECT
    
    if [ "$MANUAL_CONNECT" = "s" ]; then
        ssh -p $VPS_PORT $VPS_USER@$VPS_HOST
        CONNECTED=$?
    else
        CONNECTED=false
    fi
fi

if [ "$CONNECTED" = true ]; then
    echo ""
    echo "🔍 Verificando ambiente na VPS..."
    
    # Criar script temporário para executar na VPS
    cat > /tmp/vps_check.sh << 'EOF'
#!/bin/bash

echo "=== Informações do Sistema ==="
uname -a
echo ""

echo "=== Versão do Sistema Operacional ==="
cat /etc/os-release | grep PRETTY_NAME
echo ""

echo "=== PostgreSQL ==="
if command -v psql &> /dev/null; then
    echo "✓ PostgreSQL instalado"
    psql --version
else
    echo "✗ PostgreSQL NÃO instalado"
fi
echo ""

echo "=== Node.js ==="
if command -v node &> /dev/null; then
    echo "✓ Node.js instalado"
    node --version
else
    echo "✗ Node.js NÃO instalado"
fi
echo ""

echo "=== NPM ==="
if command -v npm &> /dev/null; then
    echo "✓ NPM instalado"
    npm --version
else
    echo "✗ NPM NÃO instalado"
fi
echo ""

echo "=== PM2 ==="
if command -v pm2 &> /dev/null; then
    echo "✓ PM2 instalado"
    pm2 --version
else
    echo "✗ PM2 NÃO instalado"
fi
echo ""

echo "=== Nginx ==="
if command -v nginx &> /dev/null; then
    echo "✓ Nginx instalado"
    nginx -v 2>&1
else
    echo "✗ Nginx NÃO instalado"
fi
echo ""

echo "=== Git ==="
if command -v git &> /dev/null; then
    echo "✓ Git instalado"
    git --version
else
    echo "✗ Git NÃO instalado"
fi
echo ""

echo "=== Espaço em Disco ==="
df -h / | tail -1
echo ""

echo "=== Memória ==="
free -h | grep Mem
echo ""

echo "=== Processos PM2 (se existir) ==="
if command -v pm2 &> /dev/null; then
    pm2 list
fi
echo ""

echo "=== Bancos de Dados PostgreSQL (se existir) ==="
if command -v psql &> /dev/null; then
    sudo -u postgres psql -c "\l" 2>/dev/null || echo "Sem permissão ou PostgreSQL não configurado"
fi
EOF

    # Copiar e executar script na VPS
    scp -P $VPS_PORT /tmp/vps_check.sh $VPS_USER@$VPS_HOST:/tmp/
    ssh -p $VPS_PORT $VPS_USER@$VPS_HOST "bash /tmp/vps_check.sh"
    
    # Limpar
    rm /tmp/vps_check.sh
    ssh -p $VPS_PORT $VPS_USER@$VPS_HOST "rm /tmp/vps_check.sh"
fi

echo ""
echo "============================================"
echo "📝 Resumo da Verificação"
echo "============================================"
echo ""
echo "Salve estas informações para o deploy:"
echo "VPS_HOST: $VPS_HOST"
echo "VPS_USER: $VPS_USER"
echo "VPS_PORT: $VPS_PORT"
echo ""
echo "Próximos passos:"
echo "1. Instalar PostgreSQL 17 (se não instalado)"
echo "2. Criar banco de dados 'clinicrafabarros'"
echo "3. Configurar backend Node.js"
echo "4. Deploy da aplicação"
echo ""
