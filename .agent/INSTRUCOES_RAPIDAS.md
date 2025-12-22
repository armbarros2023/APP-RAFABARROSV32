# 🎯 DEPLOY - Instruções Rápidas

**Domínio**: `clinica.iaaplicativos.com.br`  
**Senha SSH**: `B075@#ax/980tec`

---

## ⚡ OPÇÃO MAIS RÁPIDA (Recomendada)

### No seu Mac - Terminal 1:

```bash
cd /Users/arbtechinfo.ia/Projetos\ 2025/app-rafabarrosv32

# 1. Enviar pacote
scp clinica-deploy-20251222.tar.gz root@69.62.103.58:/tmp/
# Senha: B075@#ax/980tec

# 2. Enviar script
scp deploy-no-servidor.sh root@69.62.103.58:/tmp/
# Senha: B075@#ax/980tec
```

### No seu Mac - Terminal 2 (ou mesmo terminal):

```bash
# 3. Conectar ao servidor
ssh root@69.62.103.58
# Senha: B075@#ax/980tec

# 4. Executar deploy (NO SERVIDOR)
chmod +x /tmp/deploy-no-servidor.sh
/tmp/deploy-no-servidor.sh

# 5. Configurar SSL (NO SERVIDOR)
certbot --nginx -d clinica.iaaplicativos.com.br
```

**Pronto!** Acesse: `https://clinica.iaaplicativos.com.br`

---

## 🔧 OPÇÃO ALTERNATIVA (Comando Único)

Se preferir, copie e cole este comando único **NO SERVIDOR**:

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
echo "✓ Deploy concluído!"
```

---

## 📋 Resumo dos Passos

1. ✅ **Upload do pacote** (do Mac para VPS)
2. ✅ **Conectar ao servidor** via SSH
3. ✅ **Executar deploy** (extrair arquivos + configurar Nginx)
4. ✅ **Configurar SSL** (Certbot)
5. ✅ **Acessar aplicação** em https://clinica.iaaplicativos.com.br

---

## ✅ Verificação Final

Após o deploy, execute **NO SERVIDOR**:

```bash
# Verificar arquivos
ls -la /var/www/clinicrafabarros-frontend/

# Verificar Nginx
systemctl status nginx

# Ver configurações ativas
ls -la /etc/nginx/sites-enabled/

# Testar localmente
curl -I http://localhost
```

**No navegador**: Acesse `https://clinica.iaaplicativos.com.br`

Deve aparecer: **Equipe Rafael Barros - Gestão de Clínicas** 🎉

---

## 🆘 Problemas?

### Ainda aparece TeleFlix?

```bash
# NO SERVIDOR
rm -f /etc/nginx/sites-enabled/*
ln -sf /etc/nginx/sites-available/clinicrafabarros /etc/nginx/sites-enabled/
systemctl reload nginx
```

### Erro 404?

```bash
# NO SERVIDOR
ls -la /var/www/clinicrafabarros-frontend/index.html
chown -R www-data:www-data /var/www/clinicrafabarros-frontend
chmod -R 755 /var/www/clinicrafabarros-frontend
systemctl reload nginx
```

---

**Última atualização**: 22/12/2025 10:11
