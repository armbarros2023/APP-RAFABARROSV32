# 🎯 GUIA PASSO A PASSO - Deploy em Produção

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:
- ✅ Acesso SSH à VPS Hostinger
- ✅ Permissões de sudo na VPS
- ✅ Domínio registrado e DNS configurado
- ✅ Pelo menos 2GB RAM e 20GB disco na VPS

---

## PASSO 1: Conectar à VPS e Verificar Status

### 1.1 Conectar via SSH
```bash
# No seu Mac, execute:
ssh usuario@ip-da-vps
# ou
ssh usuario@dominio.com.br

# Se usar porta diferente:
ssh -p PORTA usuario@ip-da-vps
```

### 1.2 Verificar Status da VPS
```bash
# Copie o script para a VPS
# No seu Mac:
scp vps-status.sh usuario@ip-da-vps:/tmp/

# Na VPS:
chmod +x /tmp/vps-status.sh
bash /tmp/vps-status.sh
```

**📸 Tire um print ou copie o resultado e me envie!**

---

## PASSO 2: Instalar Componentes Necessários (se faltarem)

### 2.1 Atualizar Sistema
```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 Instalar PostgreSQL 17
```bash
# Adicionar repositório oficial
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# Adicionar chave GPG
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Instalar
sudo apt update
sudo apt install postgresql-17 postgresql-contrib-17 -y

# Verificar instalação
psql --version

# Iniciar serviço
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo systemctl status postgresql
```

### 2.3 Instalar Node.js 20+
```bash
# Instalar NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recarregar shell
source ~/.bashrc

# Instalar Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verificar
node --version
npm --version
```

### 2.4 Instalar PM2
```bash
npm install -g pm2

# Verificar
pm2 --version

# Configurar PM2 para iniciar com o sistema
pm2 startup
# Execute o comando que o PM2 sugerir
```

### 2.5 Instalar Nginx
```bash
sudo apt install nginx -y

# Verificar
nginx -v

# Iniciar
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

### 2.6 Instalar Git
```bash
sudo apt install git -y

# Verificar
git --version
```

---

## PASSO 3: Configurar PostgreSQL

### 3.1 Criar Banco de Dados e Usuário
```bash
# Conectar ao PostgreSQL
sudo -u postgres psql

# No prompt do PostgreSQL (postgres=#), execute:
CREATE DATABASE clinicrafabarros;
CREATE USER clinicapp WITH ENCRYPTED PASSWORD 'SuaSenhaSegura123!@#';
GRANT ALL PRIVILEGES ON DATABASE clinicrafabarros TO clinicapp;

# Sair
\q
```

### 3.2 Testar Conexão
```bash
psql -U clinicapp -d clinicrafabarros -h localhost

# Se pedir senha, digite a senha que você criou
# Se conectar com sucesso, digite \q para sair
```

### 3.3 Configurar Acesso (se necessário)
```bash
# Editar pg_hba.conf
sudo nano /etc/postgresql/17/main/pg_hba.conf

# Adicionar linha (se não existir):
# local   all             clinicapp                               md5

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

---

## PASSO 4: Preparar Diretórios

```bash
# Criar diretório para aplicações
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www

# Criar diretórios específicos
mkdir -p /var/www/clinicrafabarros-backend
mkdir -p /var/www/clinicrafabarros-frontend
```

---

## PASSO 5: Me Fornecer as Informações

Agora que a VPS está preparada, preciso que você me forneça:

### ✅ Informações Coletadas
```
IP da VPS: _________________
Usuário SSH: _________________
Porta SSH: _________________

Domínio principal: _________________
Subdomínio API: _________________

PostgreSQL:
- Usuário: clinicapp
- Senha: _________________
- Database: clinicrafabarros
- Host: localhost
- Porta: 5432

Status dos componentes (resultado do vps-status.sh):
[Cole aqui o resultado]
```

---

## PASSO 6: Aguardar Criação do Backend

Após receber as informações acima, vou:

1. ✅ Criar estrutura completa do backend
2. ✅ Configurar Prisma com o schema
3. ✅ Criar todas as rotas e controllers
4. ✅ Implementar autenticação JWT
5. ✅ Criar migrations do banco
6. ✅ Preparar para deploy

**Tempo estimado: 3-5 dias**

---

## PASSO 7: Deploy do Backend (Farei junto com você)

```bash
# Clonar repositório (ou fazer upload)
cd /var/www/clinicrafabarros-backend
git clone [URL_DO_REPO] .

# Ou fazer upload via SCP
# No Mac:
# scp -r backend/* usuario@vps:/var/www/clinicrafabarros-backend/

# Instalar dependências
npm install

# Configurar variáveis de ambiente
nano .env
# [Vou fornecer o conteúdo do .env]

# Executar migrations
npx prisma migrate deploy

# Build
npm run build

# Iniciar com PM2
pm2 start dist/server.js --name clinicrafabarros-api
pm2 save
```

---

## PASSO 8: Deploy do Frontend (Farei junto com você)

```bash
# No seu Mac, fazer build
cd /Users/arbtechinfo.ia/Projetos\ 2025/app-rafabarrosv32
npm run build

# Upload para VPS
scp -r dist/* usuario@vps:/var/www/clinicrafabarros-frontend/
```

---

## PASSO 9: Configurar Nginx

```bash
# Criar configuração do backend
sudo nano /etc/nginx/sites-available/clinicrafabarros-api

# [Vou fornecer o conteúdo]

# Criar configuração do frontend
sudo nano /etc/nginx/sites-available/clinicrafabarros-app

# [Vou fornecer o conteúdo]

# Ativar sites
sudo ln -s /etc/nginx/sites-available/clinicrafabarros-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/clinicrafabarros-app /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx
```

---

## PASSO 10: Configurar SSL (HTTPS)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado SSL
sudo certbot --nginx -d seudominio.com.br -d api.seudominio.com.br

# Renovação automática já está configurada!
```

---

## PASSO 11: Testar Aplicação

```bash
# Verificar backend
curl http://localhost:5000/health

# Verificar PM2
pm2 status
pm2 logs clinicrafabarros-api

# Verificar Nginx
sudo systemctl status nginx

# Acessar no navegador
# https://seudominio.com.br
# https://api.seudominio.com.br/health
```

---

## 🆘 Troubleshooting

### Backend não inicia
```bash
# Ver logs
pm2 logs clinicrafabarros-api

# Verificar variáveis de ambiente
cat /var/www/clinicrafabarros-backend/.env

# Testar conexão com banco
psql -U clinicapp -d clinicrafabarros -h localhost
```

### Nginx não funciona
```bash
# Ver logs de erro
sudo tail -f /var/log/nginx/error.log

# Testar configuração
sudo nginx -t

# Verificar portas
sudo netstat -tlnp | grep nginx
```

### PostgreSQL não conecta
```bash
# Verificar status
sudo systemctl status postgresql

# Ver logs
sudo tail -f /var/log/postgresql/postgresql-17-main.log

# Testar conexão
psql -U clinicapp -d clinicrafabarros -h localhost
```

---

## 📞 AÇÃO IMEDIATA NECESSÁRIA

**Execute agora:**

1. ✅ Conecte-se à VPS via SSH
2. ✅ Execute o script `vps-status.sh`
3. ✅ Me envie o resultado completo
4. ✅ Me forneça as informações solicitadas no PASSO 5

**Assim que receber, começarei a criar o backend imediatamente!**

---

## 📊 Progresso

- [ ] PASSO 1: Conectar à VPS ⏳
- [ ] PASSO 2: Instalar componentes
- [ ] PASSO 3: Configurar PostgreSQL
- [ ] PASSO 4: Preparar diretórios
- [ ] PASSO 5: Fornecer informações
- [ ] PASSO 6: Backend criado (por mim)
- [ ] PASSO 7: Deploy backend
- [ ] PASSO 8: Deploy frontend
- [ ] PASSO 9: Configurar Nginx
- [ ] PASSO 10: SSL
- [ ] PASSO 11: Testar
- [ ] ✅ PRODUÇÃO!

---

**Vamos começar? Execute o PASSO 1 agora!** 🚀
