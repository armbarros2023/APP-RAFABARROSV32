# 🔧 CORREÇÃO DE DEPLOY - Clínica Rafael Barros

**Data**: 22/12/2025  
**Problema**: Aplicativo TeleFlix sendo servido ao invés da Clínica Rafael Barros

---

## 📋 Problemas Identificados

### 1. ❌ DNS Incorreto
- **Domínio esperado**: `app.clinicarafabarros.com.br`
- **Registro DNS atual**: `A app.clinicarafabarros.iaaplicativos.com.br 69.62.103.58`
- **Erro**: Domínio base diferente (`iaaplicativos.com.br` vs `clinicarafabarros.com.br`)

### 2. ❌ Aplicativo Errado no Servidor
- **URL**: `https://app.clinicarafabarros.iaaplicativos.com.br/#/login`
- **Servindo**: TeleFlix
- **Deveria servir**: Clínica Rafael Barros

---

## ✅ SOLUÇÃO PASSO A PASSO

### ETAPA 1: Corrigir DNS no Registro.br

Você tem **duas opções**:

#### **Opção A: Usar domínio clinicarafabarros.com.br** (Recomendado)

Acesse o painel do **Registro.br** e crie o seguinte registro DNS:

```
Tipo: A
Nome: app
Aponta para: 69.62.103.58
TTL: 3600
```

**Resultado**: `app.clinicarafabarros.com.br` → `69.62.103.58`

#### **Opção B: Manter domínio iaaplicativos.com.br**

Manter o registro atual:
```
A app.clinicarafabarros.iaaplicativos.com.br 69.62.103.58
```

**Resultado**: `app.clinicarafabarros.iaaplicativos.com.br` → `69.62.103.58`

---

### ETAPA 2: Verificar Servidor VPS

Execute os seguintes comandos **no servidor VPS** (SSH):

```bash
# Conectar ao servidor
ssh root@69.62.103.58

# Verificar aplicativos instalados
ls -la /var/www/

# Verificar configurações Nginx
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/

# Ver qual aplicativo está sendo servido
cat /etc/nginx/sites-available/app.clinicarafabarros.iaaplicativos.com.br
```

**📸 Me envie o resultado desses comandos!**

---

### ETAPA 3: Fazer Backup do TeleFlix (Segurança)

```bash
# No servidor VPS
cd /var/www/

# Fazer backup do TeleFlix (se existir)
sudo tar -czf teleflix-backup-$(date +%Y%m%d).tar.gz teleflix/ 2>/dev/null || echo "TeleFlix não encontrado"

# Listar backups
ls -lh *backup*.tar.gz
```

---

### ETAPA 4: Deploy da Clínica Rafael Barros

#### 4.1 No seu Mac - Preparar pacote

```bash
cd /Users/arbtechinfo.ia/Projetos\ 2025/app-rafabarrosv32

# Build já foi feito! Criar pacote para upload
tar -czf clinica-deploy-$(date +%Y%m%d).tar.gz dist/

# Verificar pacote
ls -lh clinica-deploy-*.tar.gz
```

#### 4.2 Upload para VPS

**Escolha um método:**

**Método A: SCP (Recomendado)**
```bash
# No Mac
scp clinica-deploy-*.tar.gz root@69.62.103.58:/tmp/
```

**Método B: SFTP**
```bash
# No Mac
sftp root@69.62.103.58
put clinica-deploy-*.tar.gz /tmp/
exit
```

#### 4.3 No Servidor - Instalar aplicativo

```bash
# Conectar ao servidor
ssh root@69.62.103.58

# Criar diretório (se não existir)
sudo mkdir -p /var/www/clinicrafabarros-frontend

# Extrair arquivos
cd /var/www/clinicrafabarros-frontend
sudo tar -xzf /tmp/clinica-deploy-*.tar.gz --strip-components=1

# Verificar arquivos
ls -la

# Ajustar permissões
sudo chown -R www-data:www-data /var/www/clinicrafabarros-frontend
sudo chmod -R 755 /var/www/clinicrafabarros-frontend
```

---

### ETAPA 5: Configurar Nginx

#### 5.1 Criar configuração do Nginx

```bash
# No servidor VPS
sudo nano /etc/nginx/sites-available/clinicrafabarros
```

**Cole o seguinte conteúdo:**

```nginx
server {
    listen 80;
    listen [::]:80;
    
    # Escolha o domínio conforme sua decisão na ETAPA 1
    # Opção A:
    server_name app.clinicarafabarros.com.br;
    
    # OU Opção B:
    # server_name app.clinicarafabarros.iaaplicativos.com.br;
    
    root /var/www/clinicrafabarros-frontend;
    index index.html;
    
    # Logs
    access_log /var/log/nginx/clinicrafabarros-access.log;
    error_log /var/log/nginx/clinicrafabarros-error.log;
    
    # Configuração para SPA (Single Page Application)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

**Salvar**: `Ctrl+O`, `Enter`, `Ctrl+X`

#### 5.2 Desativar configuração antiga (se existir)

```bash
# Remover link simbólico antigo
sudo rm /etc/nginx/sites-enabled/app.clinicarafabarros.iaaplicativos.com.br 2>/dev/null || echo "Não existe"

# Fazer backup da configuração antiga
sudo mv /etc/nginx/sites-available/app.clinicarafabarros.iaaplicativos.com.br \
   /etc/nginx/sites-available/app.clinicarafabarros.iaaplicativos.com.br.backup 2>/dev/null || echo "Não existe"
```

#### 5.3 Ativar nova configuração

```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/clinicrafabarros /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Se OK, recarregar Nginx
sudo systemctl reload nginx

# Verificar status
sudo systemctl status nginx
```

---

### ETAPA 6: Configurar SSL (HTTPS)

```bash
# Instalar Certbot (se não estiver instalado)
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado SSL
# Opção A (domínio clinicarafabarros.com.br):
sudo certbot --nginx -d app.clinicarafabarros.com.br

# OU Opção B (domínio iaaplicativos.com.br):
# sudo certbot --nginx -d app.clinicarafabarros.iaaplicativos.com.br

# Seguir instruções do Certbot
# Escolher opção 2 (Redirect HTTP to HTTPS)
```

---

### ETAPA 7: Verificar Funcionamento

```bash
# No servidor
# Verificar Nginx
sudo systemctl status nginx

# Ver logs em tempo real
sudo tail -f /var/log/nginx/clinicrafabarros-access.log

# Testar localmente
curl -I http://localhost
```

**No navegador:**
- Acesse: `https://app.clinicarafabarros.com.br` (ou o domínio escolhido)
- Deve aparecer a **Clínica Rafael Barros**, não o TeleFlix!

---

## 🔍 Troubleshooting

### Problema: Ainda aparece TeleFlix

```bash
# Verificar qual diretório o Nginx está servindo
sudo nginx -T | grep "root"

# Verificar conteúdo do diretório
ls -la /var/www/clinicrafabarros-frontend/

# Deve ter: index.html, assets/, etc.
```

### Problema: Erro 502 Bad Gateway

```bash
# Ver logs de erro
sudo tail -f /var/log/nginx/error.log

# Verificar permissões
sudo chown -R www-data:www-data /var/www/clinicrafabarros-frontend
sudo chmod -R 755 /var/www/clinicrafabarros-frontend
```

### Problema: Erro 404

```bash
# Verificar se index.html existe
ls -la /var/www/clinicrafabarros-frontend/index.html

# Verificar configuração do Nginx
sudo nginx -t
```

### Problema: DNS não resolve

```bash
# No Mac, testar DNS
nslookup app.clinicarafabarros.com.br

# Aguardar propagação DNS (pode levar até 48h, geralmente 1-4h)
```

---

## 📊 Checklist de Verificação

- [ ] DNS configurado corretamente no Registro.br
- [ ] Build da aplicação criado (`npm run build`)
- [ ] Pacote enviado para VPS
- [ ] Arquivos extraídos em `/var/www/clinicrafabarros-frontend`
- [ ] Permissões ajustadas (www-data:www-data)
- [ ] Configuração Nginx criada
- [ ] Configuração antiga desativada
- [ ] Nova configuração ativada
- [ ] Nginx testado (`nginx -t`)
- [ ] Nginx recarregado
- [ ] SSL configurado (Certbot)
- [ ] Aplicativo acessível via HTTPS
- [ ] **Clínica Rafael Barros** sendo exibida (não TeleFlix!)

---

## 🆘 Precisa de Ajuda?

**Me forneça:**

1. Resultado dos comandos da ETAPA 2
2. Qual opção de domínio escolheu (A ou B)
3. Prints ou mensagens de erro (se houver)

**Vou te ajudar em tempo real!** 🚀
