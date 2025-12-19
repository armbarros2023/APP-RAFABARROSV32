# 🚀 Plano de Produção - App RafaBarros v32

## 📊 Status Atual do Projeto

### ✅ Componentes Prontos
- **Frontend React**: Completo com TypeScript + Vite
- **Interface UI**: Design moderno e responsivo
- **Páginas implementadas**:
  - Dashboard
  - Gestão de Pacientes/Alunos
  - Gestão de Terapeutas
  - Agenda de Sessões
  - Gestão Financeira
  - Faturamento e Pagamentos
  - Emissão de NFe
  - Usuários e Filiais
  - Triagem/Integração

### ⚠️ Componentes que Precisam de Atenção
- **Autenticação**: Atualmente usando MOCK com localStorage (Base64 - NÃO SEGURO)
- **Armazenamento de Dados**: localStorage (temporário, não persistente entre dispositivos)
- **Backend**: Não existe ainda
- **Banco de Dados**: Não configurado

---

## 🎯 Etapas para Colocar em Produção

### **FASE 1: Criar Backend com Node.js + Express + PostgreSQL**

#### 1.1 Estrutura do Backend
```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts       # Configuração Prisma/PostgreSQL
│   │   └── env.ts            # Variáveis de ambiente
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── branchController.ts
│   │   ├── studentController.ts
│   │   ├── therapistController.ts
│   │   ├── appointmentController.ts
│   │   └── financialController.ts
│   ├── middleware/
│   │   ├── auth.ts           # JWT verification
│   │   └── errorHandler.ts
│   ├── routes/
│   │   └── index.ts
│   ├── models/               # Prisma schema
│   │   └── schema.prisma
│   ├── services/
│   │   └── emailService.ts
│   └── server.ts
├── .env.example
├── .env
├── package.json
└── tsconfig.json
```

#### 1.2 Tecnologias Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL 17
- **Autenticação**: JWT + bcrypt
- **Validação**: Zod
- **CORS**: cors middleware

#### 1.3 Schema do Banco de Dados (Prisma)
Baseado nos tipos TypeScript existentes:

**Tabelas principais:**
- `users` - Usuários do sistema (admin, therapist)
- `branches` - Filiais
- `staff_members` - Terapeutas/Equipe
- `students` - Alunos/Pacientes
- `appointments` - Agendamentos
- `financial_transactions` - Transações financeiras
- `student_invoices` - Faturas de alunos
- `therapist_payments` - Pagamentos a terapeutas
- `initial_assessments` - Avaliações iniciais
- `student_activity_logs` - Logs de atividades
- `student_media` - Mídias dos alunos

---

### **FASE 2: Configurar Banco de Dados PostgreSQL na VPS**

#### 2.1 Instalação PostgreSQL 17 (Hostinger VPS)
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar PostgreSQL 17
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install postgresql-17 postgresql-contrib-17 -y

# Iniciar serviço
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 2.2 Criar Database e Usuário
```bash
sudo -u postgres psql

CREATE DATABASE clinicrafabarros;
CREATE USER clinicapp WITH ENCRYPTED PASSWORD 'SenhaSegura123!@#';
GRANT ALL PRIVILEGES ON DATABASE clinicrafabarros TO clinicapp;
\q
```

#### 2.3 Configurar Acesso Remoto (se necessário)
```bash
# Editar postgresql.conf
sudo nano /etc/postgresql/17/main/postgresql.conf
# Alterar: listen_addresses = '*'

# Editar pg_hba.conf
sudo nano /etc/postgresql/17/main/pg_hba.conf
# Adicionar: host all all 0.0.0.0/0 md5

# Reiniciar
sudo systemctl restart postgresql
```

---

### **FASE 3: Migrar Dados do localStorage para PostgreSQL**

#### 3.1 Script de Migração
Criar script para exportar dados do localStorage e importar no banco:

```typescript
// migration-script.ts
// Exportar dados do navegador (console)
const exportData = () => {
  const data = {
    users: JSON.parse(localStorage.getItem('equipe_rafael_barros_users_db') || '[]'),
    branches: JSON.parse(localStorage.getItem('equipe_rafael_barros_branches') || '[]'),
    students: JSON.parse(localStorage.getItem('students_db') || '[]'),
    appointments: JSON.parse(localStorage.getItem('appointments_db') || '[]'),
    transactions: JSON.parse(localStorage.getItem('financial_transactions') || '[]'),
  };
  console.log(JSON.stringify(data, null, 2));
  return data;
};
```

#### 3.2 Importar no Backend
Criar endpoint temporário `/api/migrate` para importar dados iniciais.

---

### **FASE 4: Conectar Frontend ao Backend**

#### 4.1 Criar Service Layer no Frontend
```typescript
// services/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  auth: {
    login: (username: string, password: string) => 
      fetch(`${API_URL}/api/auth/login`, { method: 'POST', ... }),
    register: (data) => 
      fetch(`${API_URL}/api/auth/register`, { method: 'POST', ... }),
  },
  students: {
    getAll: () => fetch(`${API_URL}/api/students`),
    create: (data) => fetch(`${API_URL}/api/students`, { method: 'POST', ... }),
    // ...
  },
  // ...
};
```

#### 4.2 Atualizar Contexts
- `AuthContext.tsx`: Substituir localStorage por chamadas API
- `BranchContext.tsx`: Buscar filiais do backend
- Criar novos contexts conforme necessário

---

### **FASE 5: Deploy na VPS Hostinger**

#### 5.1 Preparar Backend para Produção
```bash
# Na VPS
cd /var/www
git clone <repo-backend>
cd backend
npm install
npm run build

# Configurar PM2
npm install -g pm2
pm2 start dist/server.js --name "clinicrafabarros-api"
pm2 startup
pm2 save
```

#### 5.2 Configurar Nginx como Reverse Proxy
```nginx
# /etc/nginx/sites-available/clinicrafabarros
server {
    listen 80;
    server_name api.seudominio.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 5.3 Build e Deploy Frontend
```bash
# Local
cd app-rafabarrosv32
npm run build

# Upload dist/ para VPS
scp -r dist/* user@vps:/var/www/clinicrafabarros/
```

#### 5.4 Configurar Nginx para Frontend
```nginx
server {
    listen 80;
    server_name seudominio.com;
    root /var/www/clinicrafabarros;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 5.5 Configurar SSL com Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seudominio.com -d api.seudominio.com
```

---

### **FASE 6: Segurança e Otimizações**

#### 6.1 Segurança
- [ ] Implementar rate limiting
- [ ] Configurar CORS adequadamente
- [ ] Usar HTTPS em produção
- [ ] Implementar validação de dados (Zod)
- [ ] Sanitizar inputs
- [ ] Configurar helmet.js
- [ ] Implementar refresh tokens
- [ ] Logs de auditoria

#### 6.2 Performance
- [ ] Configurar cache Redis (opcional)
- [ ] Otimizar queries do Prisma
- [ ] Implementar paginação
- [ ] Comprimir respostas (gzip)
- [ ] CDN para assets estáticos

#### 6.3 Backup
- [ ] Backup automático do PostgreSQL
- [ ] Backup de arquivos uploaded
- [ ] Plano de disaster recovery

---

## 📝 Variáveis de Ambiente Necessárias

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://clinicapp:SenhaSegura123!@#@localhost:5432/clinicrafabarros
JWT_SECRET=<gerar com: openssl rand -base64 32>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://seudominio.com
```

### Frontend (.env.local)
```env
VITE_API_URL=https://api.seudominio.com
VITE_APP_NAME=ClinicFlow
```

---

## ✅ Checklist de Deploy

### Pré-Deploy
- [ ] Backend criado e testado localmente
- [ ] Banco de dados PostgreSQL configurado na VPS
- [ ] Migrations do Prisma executadas
- [ ] Dados migrados do localStorage
- [ ] Frontend conectado ao backend
- [ ] Testes de integração realizados

### Deploy
- [ ] Backend deployado na VPS
- [ ] PM2 configurado e rodando
- [ ] Nginx configurado (reverse proxy + frontend)
- [ ] SSL/HTTPS configurado
- [ ] DNS apontando para VPS
- [ ] Variáveis de ambiente configuradas

### Pós-Deploy
- [ ] Monitoramento configurado (PM2, logs)
- [ ] Backup automático ativo
- [ ] Documentação atualizada
- [ ] Treinamento de usuários
- [ ] Plano de manutenção definido

---

## 🔧 Comandos Úteis

### PostgreSQL
```bash
# Conectar ao banco
psql -U clinicapp -d clinicrafabarros

# Backup
pg_dump -U clinicapp clinicrafabarros > backup.sql

# Restore
psql -U clinicapp clinicrafabarros < backup.sql
```

### PM2
```bash
# Status
pm2 status

# Logs
pm2 logs clinicrafabarros-api

# Restart
pm2 restart clinicrafabarros-api

# Monitoramento
pm2 monit
```

### Nginx
```bash
# Testar configuração
sudo nginx -t

# Reload
sudo systemctl reload nginx

# Logs
sudo tail -f /var/log/nginx/error.log
```

---

## 📞 Próximos Passos Imediatos

1. **Confirmar acesso à VPS Hostinger**
2. **Decidir domínio/subdomínio** (ex: app.rafaelbarros.com.br)
3. **Criar repositório Git** para versionamento
4. **Iniciar desenvolvimento do backend**
5. **Configurar PostgreSQL na VPS**

---

## 🎯 Estimativa de Tempo

- **Backend Development**: 3-5 dias
- **Database Setup**: 1 dia
- **Frontend Integration**: 2-3 dias
- **Deploy & Testing**: 2 dias
- **Total**: ~8-11 dias

---

**Criado em**: 2025-12-16  
**Versão**: 1.0  
**Status**: Planejamento
