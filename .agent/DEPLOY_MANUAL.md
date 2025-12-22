# 🔧 Deploy Manual - Passo a Passo

**Domínio**: `clinica.iaaplicativos.com.br`  
**Data**: 22/12/2025

---

## 📦 PASSO 1: Upload do Pacote

Execute no seu Mac:

```bash
cd /Users/arbtechinfo.ia/Projetos\ 2025/app-rafabarrosv32

scp clinica-deploy-20251222.tar.gz root@69.62.103.58:/tmp/
```

**Senha quando solicitado**: `B075@#ax/980tec`

---

## 🔧 PASSO 2: Conectar ao Servidor

```bash
ssh root@69.62.103.58
```

**Senha**: `B075@#ax/980tec`

---

## 📂 PASSO 3: Preparar Diretório (no servidor VPS)

```bash
# Criar diretório
mkdir -p /var/www/clinicrafabarros-frontend

# Fazer backup se existir conteúdo anterior
if [ -f "/var/www/clinicrafabarros-frontend/index.html" ]; then
    tar -czf /tmp/clinica-backup-$(date +%Y%m%d-%H%M%S).tar.gz -C /var/www/clinicrafabarros-frontend .
    echo "Backup criado!"
fi

# Limpar diretório
rm -rf /var/www/clinicrafabarros-frontend/*

# Extrair novos arquivos
tar -xzf /tmp/clinica-deploy-20251222.tar.gz -C /var/www/clinicrafabarros-frontend --strip-components=1

# Verificar arquivos
ls -la /var/www/clinicrafabarros-frontend/

# Ajustar permissões
chown -R www-data:www-data /var/www/clinicrafabarros-frontend
chmod -R 755 /var/www/clinicrafabarros-frontend

echo "✓ Arquivos instalados!"
```

---

## 🌐 PASSO 4: Configurar Nginx (no servidor VPS)

```bash
# Criar configuração
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

echo "✓ Configuração criada!"
```

---

## 🔗 PASSO 5: Ativar Configuração (no servidor VPS)

```bash
# Desativar configuração antiga (se existir)
rm -f /etc/nginx/sites-enabled/app.clinicarafabarros.iaaplicativos.com.br

# Ativar nova configuração
ln -sf /etc/nginx/sites-available/clinicrafabarros /etc/nginx/sites-enabled/

# Testar configuração
nginx -t

# Se OK, recarregar Nginx
systemctl reload nginx

# Verificar status
systemctl status nginx

echo "✓ Nginx configurado!"
```

---

## 🔒 PASSO 6: Configurar SSL (no servidor VPS)

```bash
# Verificar se certbot está instalado
if ! command -v certbot &> /dev/null; then
    echo "Instalando Certbot..."
    apt update
    apt install -y certbot python3-certbot-nginx
fi

# Obter certificado SSL
certbot --nginx -d clinica.iaaplicativos.com.br

# Seguir as instruções:
# - Digite seu email (ou pressione Enter para pular)
# - Digite 'Y' para aceitar os termos
# - Digite '2' para redirecionar HTTP para HTTPS

echo "✓ SSL configurado!"
```

---

## ✅ PASSO 7: Verificar Funcionamento

```bash
# No servidor VPS

# Testar localmente
curl -I http://localhost

# Ver logs em tempo real
tail -f /var/log/nginx/clinicrafabarros-access.log
```

**No navegador do Mac:**
- Acesse: `https://clinica.iaaplicativos.com.br`
- Deve aparecer a **Clínica Rafael Barros**! 🎉

---

## 🔍 Verificações Importantes

### Verificar qual app está sendo servido:

```bash
# No servidor VPS
cat /var/www/clinicrafabarros-frontend/index.html | grep -i "title"
```

**Deve mostrar**: `<title>Equipe Rafael Barros - Gestão de Clínicas</title>`

### Verificar configurações Nginx ativas:

```bash
# No servidor VPS
ls -la /etc/nginx/sites-enabled/
nginx -T | grep server_name
```

---

## 📊 Checklist

- [ ] Pacote enviado para `/tmp/` no VPS
- [ ] Conectado ao servidor via SSH
- [ ] Diretório criado e limpo
- [ ] Arquivos extraídos
- [ ] Permissões ajustadas
- [ ] Configuração Nginx criada
- [ ] Configuração antiga desativada
- [ ] Nova configuração ativada
- [ ] Nginx testado (`nginx -t`)
- [ ] Nginx recarregado
- [ ] SSL configurado
- [ ] Aplicação acessível via HTTPS
- [ ] **Clínica Rafael Barros** sendo exibida

---

## 🆘 Se Algo Der Errado

### Erro: "nginx: configuration file test failed"

```bash
# Ver detalhes do erro
nginx -t

# Verificar sintaxe do arquivo
cat /etc/nginx/sites-available/clinicrafabarros
```

### Erro: Ainda aparece TeleFlix

```bash
# Verificar qual configuração está ativa
ls -la /etc/nginx/sites-enabled/

# Remover todas as configurações antigas
rm -f /etc/nginx/sites-enabled/*

# Reativar apenas a nova
ln -sf /etc/nginx/sites-available/clinicrafabarros /etc/nginx/sites-enabled/

# Recarregar
systemctl reload nginx
```

### Erro 404 ou página em branco

```bash
# Verificar se index.html existe
ls -la /var/www/clinicrafabarros-frontend/index.html

# Verificar permissões
ls -la /var/www/clinicrafabarros-frontend/

# Corrigir permissões
chown -R www-data:www-data /var/www/clinicrafabarros-frontend
chmod -R 755 /var/www/clinicrafabarros-frontend
```

---

## 📝 Comandos Resumidos (Copiar e Colar)

### No Mac:
```bash
cd /Users/arbtechinfo.ia/Projetos\ 2025/app-rafabarrosv32
scp clinica-deploy-20251222.tar.gz root@69.62.103.58:/tmp/
ssh root@69.62.103.58
```

### No Servidor (copie tudo de uma vez):
```bash
mkdir -p /var/www/clinicrafabarros-frontend && \
rm -rf /var/www/clinicrafabarros-frontend/* && \
tar -xzf /tmp/clinica-deploy-20251222.tar.gz -C /var/www/clinicrafabarros-frontend --strip-components=1 && \
chown -R www-data:www-data /var/www/clinicrafabarros-frontend && \
chmod -R 755 /var/www/clinicrafabarros-frontend && \
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
rm -f /etc/nginx/sites-enabled/app.clinicarafabarros.iaaplicativos.com.br && \
ln -sf /etc/nginx/sites-available/clinicrafabarros /etc/nginx/sites-enabled/ && \
nginx -t && \
systemctl reload nginx && \
echo "✓ Deploy concluído! Acesse: https://clinica.iaaplicativos.com.br"
```

Depois execute o SSL:
```bash
apt install -y certbot python3-certbot-nginx && \
certbot --nginx -d clinica.iaaplicativos.com.br
```

---

**Boa sorte! 🚀**
