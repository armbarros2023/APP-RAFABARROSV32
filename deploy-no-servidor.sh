#!/bin/bash

# Script de Deploy Simplificado - Para executar NO SERVIDOR VPS
# Clínica Rafael Barros

set -e

echo "🚀 Iniciando deploy da Clínica Rafael Barros..."
echo ""

# Verificar se o pacote existe
if [ ! -f "/tmp/clinica-deploy-20251222.tar.gz" ]; then
    echo "❌ Erro: Pacote não encontrado em /tmp/"
    echo ""
    echo "Primeiro, faça upload do pacote do seu Mac:"
    echo "  scp clinica-deploy-20251222.tar.gz root@69.62.103.58:/tmp/"
    exit 1
fi

# Passo 1: Preparar diretório
echo "[1/5] Preparando diretório..."
mkdir -p /var/www/clinicrafabarros-frontend

# Backup se existir
if [ -f "/var/www/clinicrafabarros-frontend/index.html" ]; then
    echo "  Fazendo backup..."
    tar -czf /tmp/clinica-backup-$(date +%Y%m%d-%H%M%S).tar.gz -C /var/www/clinicrafabarros-frontend . 2>/dev/null || true
fi

# Limpar
rm -rf /var/www/clinicrafabarros-frontend/*
echo "  ✓ Diretório preparado"

# Passo 2: Extrair arquivos
echo "[2/5] Extraindo arquivos..."
tar -xzf /tmp/clinica-deploy-20251222.tar.gz -C /var/www/clinicrafabarros-frontend --strip-components=1
echo "  ✓ Arquivos extraídos"

# Passo 3: Ajustar permissões
echo "[3/5] Ajustando permissões..."
chown -R www-data:www-data /var/www/clinicrafabarros-frontend
chmod -R 755 /var/www/clinicrafabarros-frontend
echo "  ✓ Permissões ajustadas"

# Passo 4: Configurar Nginx
echo "[4/5] Configurando Nginx..."
cat > /etc/nginx/sites-available/clinicrafabarros << 'EOF'
server {
    listen 80;
    listen [::]:80;
    
    server_name clinica.iaaplicativos.com.br;
    
    root /var/www/clinicrafabarros-frontend;
    index index.html;
    
    access_log /var/log/nginx/clinicrafabarros-access.log;
    error_log /var/log/nginx/clinicrafabarros-error.log;
    
    location / {
        try_files $uri $uri/ /index.html;
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
EOF

# Desativar configuração antiga
rm -f /etc/nginx/sites-enabled/app.clinicarafabarros.iaaplicativos.com.br 2>/dev/null || true

# Ativar nova configuração
ln -sf /etc/nginx/sites-available/clinicrafabarros /etc/nginx/sites-enabled/

# Testar
nginx -t
echo "  ✓ Nginx configurado"

# Passo 5: Recarregar Nginx
echo "[5/5] Recarregando Nginx..."
systemctl reload nginx
echo "  ✓ Nginx recarregado"

echo ""
echo "✅ Deploy concluído com sucesso!"
echo ""
echo "Acesse: https://clinica.iaaplicativos.com.br"
echo ""
echo "Para configurar SSL, execute:"
echo "  certbot --nginx -d clinica.iaaplicativos.com.br"
