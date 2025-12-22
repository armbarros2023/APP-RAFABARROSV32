#!/bin/bash

# Script de Deploy - Clínica Rafael Barros
# Data: 22/12/2025

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
VPS_IP="69.62.103.58"
VPS_USER="root"
APP_DIR="/var/www/clinicrafabarros-frontend"
DEPLOY_PACKAGE="clinica-deploy-$(date +%Y%m%d).tar.gz"
DOMAIN="clinica.iaaplicativos.com.br"

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Deploy - Clínica Rafael Barros              ║${NC}"
echo -e "${BLUE}║   Domínio: clinica.iaaplicativos.com.br        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Passo 1: Verificar se o build existe
echo -e "${BLUE}[1/7] Verificando build...${NC}"
if [ ! -d "dist" ]; then
    echo -e "${YELLOW}Build não encontrado. Executando npm run build...${NC}"
    npm run build
fi
echo -e "${GREEN}✓ Build encontrado${NC}"
echo ""

# Passo 2: Criar pacote
echo -e "${BLUE}[2/7] Criando pacote de deploy...${NC}"
tar -czf "$DEPLOY_PACKAGE" dist/
echo -e "${GREEN}✓ Pacote criado: $DEPLOY_PACKAGE ($(du -h $DEPLOY_PACKAGE | cut -f1))${NC}"
echo ""

# Passo 3: Upload para VPS
echo -e "${BLUE}[3/7] Enviando para VPS...${NC}"
scp "$DEPLOY_PACKAGE" "$VPS_USER@$VPS_IP:/tmp/"
echo -e "${GREEN}✓ Upload concluído${NC}"
echo ""

# Passo 4: Preparar servidor
echo -e "${BLUE}[4/7] Preparando servidor...${NC}"
ssh "$VPS_USER@$VPS_IP" << EOF
    set -e
    
    # Criar diretório
    echo "Criando diretório..."
    mkdir -p $APP_DIR
    
    # Backup se existir conteúdo anterior
    if [ -f "$APP_DIR/index.html" ]; then
        echo "Fazendo backup da versão anterior..."
        tar -czf /tmp/clinica-backup-\$(date +%Y%m%d-%H%M%S).tar.gz -C $APP_DIR .
    fi
    
    # Limpar diretório
    echo "Limpando diretório..."
    rm -rf $APP_DIR/*
    
    # Extrair novos arquivos
    echo "Extraindo arquivos..."
    tar -xzf /tmp/$DEPLOY_PACKAGE -C $APP_DIR --strip-components=1
    
    # Ajustar permissões
    echo "Ajustando permissões..."
    chown -R www-data:www-data $APP_DIR
    chmod -R 755 $APP_DIR
    
    echo "✓ Arquivos instalados"
EOF
echo -e "${GREEN}✓ Servidor preparado${NC}"
echo ""

# Passo 5: Configurar Nginx
echo -e "${BLUE}[5/7] Configurando Nginx...${NC}"
ssh "$VPS_USER@$VPS_IP" << EOF
    set -e
    
    # Criar configuração Nginx
    cat > /etc/nginx/sites-available/clinicrafabarros << 'NGINX_CONFIG'
server {
    listen 80;
    listen [::]:80;
    
    server_name $DOMAIN;
    
    root $APP_DIR;
    index index.html;
    
    access_log /var/log/nginx/clinicrafabarros-access.log;
    error_log /var/log/nginx/clinicrafabarros-error.log;
    
    location / {
        try_files \\\$uri \\\$uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
NGINX_CONFIG
    
    # Desativar configuração antiga
    rm -f /etc/nginx/sites-enabled/app.clinicarafabarros.iaaplicativos.com.br
    
    # Ativar nova configuração
    ln -sf /etc/nginx/sites-available/clinicrafabarros /etc/nginx/sites-enabled/
    
    # Testar configuração
    nginx -t
    
    echo "✓ Nginx configurado"
EOF
echo -e "${GREEN}✓ Nginx configurado${NC}"
echo ""

# Passo 6: Recarregar Nginx
echo -e "${BLUE}[6/7] Recarregando Nginx...${NC}"
ssh "$VPS_USER@$VPS_IP" "systemctl reload nginx"
echo -e "${GREEN}✓ Nginx recarregado${NC}"
echo ""

# Passo 7: Configurar SSL
echo -e "${BLUE}[7/7] Configurando SSL...${NC}"
echo -e "${YELLOW}Executando Certbot...${NC}"
ssh "$VPS_USER@$VPS_IP" << EOF
    # Verificar se certbot está instalado
    if ! command -v certbot &> /dev/null; then
        echo "Instalando Certbot..."
        apt update
        apt install -y certbot python3-certbot-nginx
    fi
    
    # Obter certificado
    certbot --nginx -d $DOMAIN --non-interactive --agree-tos --register-unsafely-without-email --redirect || echo "Certbot falhou ou já existe certificado"
EOF
echo -e "${GREEN}✓ SSL configurado${NC}"
echo ""

# Resumo
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║            DEPLOY CONCLUÍDO! 🎉                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Acesse sua aplicação:${NC}"
echo -e "  ${GREEN}https://$DOMAIN${NC}"
echo ""
echo -e "${YELLOW}Comandos úteis:${NC}"
echo -e "  Ver logs: ${BLUE}ssh $VPS_USER@$VPS_IP 'tail -f /var/log/nginx/clinicrafabarros-access.log'${NC}"
echo -e "  Status Nginx: ${BLUE}ssh $VPS_USER@$VPS_IP 'systemctl status nginx'${NC}"
echo ""

# Limpar pacote local
rm -f "$DEPLOY_PACKAGE"
echo -e "${GREEN}✓ Pacote local removido${NC}"
