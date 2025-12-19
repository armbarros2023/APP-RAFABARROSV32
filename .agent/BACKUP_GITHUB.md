# 🔐 Backup no GitHub - ClinicaRafaBarros

**Guia Completo para Salvar o Projeto**

---

## 📋 PASSO 1: Criar .gitignore

Primeiro, vamos criar um arquivo `.gitignore` para **NÃO** enviar arquivos sensíveis:

```bash
cd "/Users/arbtechinfo.ia/Projetos 2025/app-rafabarrosv32"

cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
dist/
build/

# Environment variables (IMPORTANTE!)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.production
backend/.env
backend/.env.production

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
*.log

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Prisma
backend/prisma/migrations/
backend/node_modules/

# Build files
*.tsbuildinfo

# Temporary files
*.tar.gz
backend-deploy.tar.gz
dist.tar.gz

# PM2
.pm2/
EOF
```

---

## 📋 PASSO 2: Criar Repositório no GitHub

### 2.1 Acessar GitHub
1. Vá em: https://github.com
2. Faça login
3. Clique em **"New repository"** (botão verde)

### 2.2 Configurar Repositório
- **Repository name**: `clinicrafabarros`
- **Description**: `Sistema de Gestão - ClinicaRafaBarros`
- **Visibility**: 
  - ✅ **Private** (recomendado - só você vê)
  - ⚠️ Public (qualquer um pode ver)
- **NÃO** marque "Initialize with README"
- Clique em **"Create repository"**

### 2.3 Copiar URL
Copie a URL que aparece, algo como:
```
https://github.com/seu-usuario/clinicrafabarros.git
```

---

## 📋 PASSO 3: Inicializar Git Local

Execute no Mac:

```bash
cd "/Users/arbtechinfo.ia/Projetos 2025/app-rafabarrosv32"

# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Fazer primeiro commit
git commit -m "🎉 Projeto ClinicaRafaBarros - Versão 1.0.0

- Backend completo (Node.js + Express + PostgreSQL)
- Frontend React integrado
- Deploy na VPS funcionando
- Sistema 100% funcional em produção
- Documentação completa em .agent/
"

# Adicionar repositório remoto (SUBSTITUA pela sua URL)
git remote add origin https://github.com/SEU-USUARIO/clinicrafabarros.git

# Enviar para GitHub
git push -u origin main
```

---

## 📋 PASSO 4: Verificar Envio

1. Volte ao GitHub
2. Atualize a página do repositório
3. Você deve ver todos os arquivos!

---

## 🔒 SEGURANÇA: Criar .env.example

Para documentar as variáveis sem expor senhas:

```bash
cd "/Users/arbtechinfo.ia/Projetos 2025/app-rafabarrosv32"

# Backend
cat > backend/.env.example << 'EOF'
# Environment
NODE_ENV=production

# Server
PORT=5000

# Database
DATABASE_URL=postgresql://usuario:senha@localhost:5433/banco

# JWT
JWT_SECRET=seu-secret-aqui
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://seudominio.com

# Admin
ADMIN_NAME=Nome Admin
ADMIN_EMAIL=admin@exemplo.com
ADMIN_PASSWORD=senha-segura
EOF

# Frontend
cat > .env.example << 'EOF'
# API URL
VITE_API_URL=http://localhost:5001/api
EOF

# Adicionar ao Git
git add backend/.env.example .env.example
git commit -m "📝 Adicionar exemplos de .env"
git push
```

---

## 📋 PASSO 5: Criar README.md

```bash
cd "/Users/arbtechinfo.ia/Projetos 2025/app-rafabarrosv32"

cat > README.md << 'EOF'
# 🏥 ClinicaRafaBarros - Sistema de Gestão

Sistema completo de gestão para clínicas de terapia.

## 🚀 Tecnologias

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL 17
- Prisma ORM
- JWT Authentication

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- React Router

## 📦 Instalação

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure o .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Frontend
```bash
npm install
cp .env.example .env
# Configure o .env
npm run dev
```

## 🌐 Deploy

Ver documentação em `.agent/FASE_3_DEPLOY.md`

## 📚 Documentação

Toda documentação está em `.agent/`:
- `PROJETO_CONCLUIDO.md` - Resumo completo
- `GUIA_ACESSO_USUARIOS.md` - Como acessar
- `FASE_3_DEPLOY.md` - Como fazer deploy

## 🔐 Credenciais

Ver `.agent/PROJETO_CONCLUIDO.md`

## 📝 Licença

Privado - ClinicaRafaBarros © 2025
EOF

git add README.md
git commit -m "📖 Adicionar README.md"
git push
```

---

## 📋 PASSO 6: Futuras Atualizações

Quando fizer mudanças no código:

```bash
cd "/Users/arbtechinfo.ia/Projetos 2025/app-rafabarrosv32"

# Ver o que mudou
git status

# Adicionar mudanças
git add .

# Fazer commit
git commit -m "Descrição da mudança"

# Enviar para GitHub
git push
```

---

## 🎯 COMANDOS ÚTEIS

### Ver histórico
```bash
git log --oneline
```

### Ver diferenças
```bash
git diff
```

### Desfazer mudanças
```bash
git checkout -- arquivo.txt
```

### Criar branch
```bash
git checkout -b nova-feature
```

### Voltar para main
```bash
git checkout main
```

---

## ⚠️ IMPORTANTE

### ❌ NUNCA envie para o GitHub:
- `.env` (senhas e credenciais)
- `node_modules/` (muito grande)
- `dist/` (arquivos compilados)
- Senhas ou tokens

### ✅ SEMPRE envie:
- Código fonte
- Documentação
- `.env.example` (sem senhas)
- README.md

---

## 🔄 Backup Automático (Opcional)

Criar script de backup:

```bash
cat > backup-github.sh << 'EOF'
#!/bin/bash
cd "/Users/arbtechinfo.ia/Projetos 2025/app-rafabarrosv32"
git add .
git commit -m "🔄 Backup automático - $(date '+%Y-%m-%d %H:%M:%S')"
git push
echo "✅ Backup concluído!"
EOF

chmod +x backup-github.sh
```

Executar:
```bash
./backup-github.sh
```

---

## 📊 Estrutura no GitHub

```
clinicrafabarros/
├── .agent/              # Documentação
├── backend/             # Backend Node.js
├── src/                 # Frontend React
├── pages/               # Páginas
├── contexts/            # React Contexts
├── .gitignore          # Arquivos ignorados
├── README.md           # Documentação principal
└── package.json        # Dependências
```

---

## 🎉 Pronto!

Seu projeto está seguro no GitHub! 🔒

**Vantagens**:
- ✅ Backup seguro na nuvem
- ✅ Histórico de todas as mudanças
- ✅ Pode acessar de qualquer lugar
- ✅ Pode compartilhar com equipe
- ✅ Pode voltar para versões antigas

---

**Última atualização**: 19/12/2025
EOF
