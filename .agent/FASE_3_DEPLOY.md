# 🚀 FASE 3: Deploy na VPS Hostinger

**Data**: 2025-12-18  
**Objetivo**: Colocar o sistema em produção na VPS

---

## 📋 CHECKLIST DE DEPLOY

### Backend
- [ ] Transferir código para VPS
- [ ] Instalar dependências
- [ ] Configurar variáveis de ambiente de produção
- [ ] Configurar PM2 para gerenciar processo
- [ ] Testar backend na VPS

### Banco de Dados
- [x] PostgreSQL instalado ✅
- [x] Banco criado ✅
- [x] Tabelas criadas ✅
- [x] Dados iniciais inseridos ✅

### Nginx
- [ ] Instalar Nginx
- [ ] Configurar reverse proxy para backend
- [ ] Configurar SSL/HTTPS
- [ ] Configurar domínio (se houver)

### Frontend
- [ ] Build de produção
- [ ] Configurar variáveis de ambiente
- [ ] Deploy dos arquivos estáticos
- [ ] Configurar Nginx para servir frontend

---

## 🎯 PASSO 1: Preparar Backend para Produção

### 1.1 Criar arquivo .env de produção

```bash
# Na VPS
cd /root
mkdir -p clinicrafabarros
cd clinicrafabarros
```

Criar `.env`:
```env
# Environment
NODE_ENV=production

# Server
PORT=5000

# Database (local na VPS)
DATABASE_URL=postgresql://clinicapp:Ra483220fa@localhost:5433/apprafabarros

# JWT
JWT_SECRET=seu-secret-super-seguro-aqui-mude-isso
JWT_EXPIRES_IN=7d

# CORS (domínio de produção)
CORS_ORIGIN=https://seudominio.com

# Admin
ADMIN_NAME=Armando de Barros
ADMIN_EMAIL=armbarros2023@gmail.com
ADMIN_PASSWORD=483220
```

### 1.2 Transferir código do backend

**Opção A: Via Git (Recomendado)**
```bash
# No Mac, fazer commit e push
cd "/Users/arbtechinfo.ia/Projetos 2025/app-rafabarrosv32/backend"
git init
git add .
git commit -m "Backend completo"
git remote add origin <seu-repositorio>
git push -u origin main

# Na VPS, clonar
cd /root/clinicrafabarros
git clone <seu-repositorio> backend
```

**Opção B: Via SCP (Direto)**
```bash
# No Mac
cd "/Users/arbtechinfo.ia/Projetos 2025/app-rafabarrosv32"
tar -czf backend.tar.gz backend/
scp backend.tar.gz root@69.62.103.58:/root/clinicrafabarros/

# Na VPS
cd /root/clinicrafabarros
tar -xzf backend.tar.gz
```

### 1.3 Instalar dependências na VPS

```bash
# Na VPS
cd /root/clinicrafabarros/backend
npm install --production
```

### 1.4 Gerar Prisma Client

```bash
# Na VPS
npm run prisma:generate
```

---

## 🎯 PASSO 2: Configurar PM2

### 2.1 Instalar PM2 globalmente

```bash
# Na VPS
npm install -g pm2
```

### 2.2 Criar arquivo de configuração PM2

Criar `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'clinicrafabarros-api',
    script: 'dist/server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
```

### 2.3 Build do TypeScript

```bash
# Na VPS
npm run build
```

### 2.4 Iniciar com PM2

```bash
# Na VPS
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 🎯 PASSO 3: Configurar Nginx

### 3.1 Instalar Nginx

```bash
# Na VPS
apt update
apt install nginx -y
```

### 3.2 Configurar reverse proxy

Criar `/etc/nginx/sites-available/clinicrafabarros`:
```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend (será configurado depois)
    location / {
        root /var/www/clinicrafabarros;
        try_files $uri $uri/ /index.html;
    }
}
```

### 3.3 Ativar configuração

```bash
# Na VPS
ln -s /etc/nginx/sites-available/clinicrafabarros /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 🎯 PASSO 4: Configurar SSL (HTTPS)

### 4.1 Instalar Certbot

```bash
# Na VPS
apt install certbot python3-certbot-nginx -y
```

### 4.2 Obter certificado SSL

```bash
# Na VPS
certbot --nginx -d seudominio.com -d www.seudominio.com
```

---

## 🎯 PASSO 5: Deploy do Frontend

### 5.1 Build de produção

```bash
# No Mac
cd "/Users/arbtechinfo.ia/Projetos 2025/app-rafabarrosv32"

# Criar .env.production
echo "VITE_API_URL=https://seudominio.com/api" > .env.production

# Build
npm run build
```

### 5.2 Transferir para VPS

```bash
# No Mac
cd "/Users/arbtechinfo.ia/Projetos 2025/app-rafabarrosv32"
tar -czf dist.tar.gz dist/
scp dist.tar.gz root@69.62.103.58:/root/

# Na VPS
mkdir -p /var/www/clinicrafabarros
cd /var/www/clinicrafabarros
tar -xzf /root/dist.tar.gz --strip-components=1
```

---

## 🎯 PASSO 6: Testes Finais

### 6.1 Testar Backend

```bash
# Na VPS ou no Mac
curl https://seudominio.com/api/health
```

### 6.2 Testar Frontend

Acessar: https://seudominio.com

### 6.3 Testar Login

- Email: armbarros2023@gmail.com
- Senha: 483220

---

## 🔧 COMANDOS ÚTEIS

### PM2
```bash
pm2 status              # Ver status
pm2 logs                # Ver logs
pm2 restart all         # Reiniciar
pm2 stop all            # Parar
pm2 delete all          # Deletar
```

### Nginx
```bash
systemctl status nginx  # Ver status
systemctl restart nginx # Reiniciar
nginx -t                # Testar config
tail -f /var/log/nginx/error.log  # Ver logs
```

### PostgreSQL
```bash
systemctl status postgresql  # Ver status
sudo -u postgres psql -d apprafabarros -p 5433  # Conectar
```

---

## 🚨 TROUBLESHOOTING

### Backend não inicia
1. Verificar logs: `pm2 logs`
2. Verificar .env
3. Verificar se PostgreSQL está rodando
4. Verificar porta 5000 livre

### Nginx erro 502
1. Verificar se backend está rodando: `pm2 status`
2. Verificar logs: `tail -f /var/log/nginx/error.log`
3. Verificar configuração: `nginx -t`

### Frontend não carrega
1. Verificar se arquivos estão em `/var/www/clinicrafabarros`
2. Verificar permissões: `chmod -R 755 /var/www/clinicrafabarros`
3. Verificar logs do Nginx

---

## 📊 CHECKLIST FINAL

- [ ] Backend rodando com PM2
- [ ] Nginx configurado
- [ ] SSL/HTTPS funcionando
- [ ] Frontend servido pelo Nginx
- [ ] Login funcionando
- [ ] API respondendo
- [ ] Banco de dados acessível

---

**Próximo**: Começar implementação!
