# ClinicaRafaBarros Backend API

Backend API para o sistema de gestão da Clínica Rafael Barros.

## 🚀 Tecnologias

- **Node.js** 20.19.6
- **Express.js** - Framework web
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** 17.7 - Banco de dados
- **TypeScript** - Tipagem estática
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **Zod** - Validação de dados

## 📋 Pré-requisitos

- Node.js 20+
- PostgreSQL 17 (rodando via Docker)
- npm ou yarn

## 🔧 Instalação

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://clinicapp:Ra483220fa@localhost:5432/clinicrafabarros
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
ADMIN_NAME=Armando de Barros
ADMIN_EMAIL=armbrros2023@gmail.com
ADMIN_PASSWORD=483220
```

### 3. Gerar Prisma Client

```bash
npm run prisma:generate
```

### 4. Executar migrations

```bash
npm run prisma:migrate
```

### 5. Seed do banco de dados

```bash
npm run prisma:seed
```

Isso criará:
- Usuário admin inicial
- Filial padrão

## 🏃 Executar

### Desenvolvimento

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:5000`

### Produção

```bash
npm run build
npm start
```

## 📡 Endpoints da API

### Autenticação

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Usuário atual (requer auth)

### Filiais

- `GET /api/branches` - Listar filiais
- `GET /api/branches/:id` - Buscar filial
- `POST /api/branches` - Criar filial (admin)
- `PUT /api/branches/:id` - Atualizar filial (admin)
- `DELETE /api/branches/:id` - Deletar filial (admin)

### Alunos

- `GET /api/students` - Listar alunos
- `GET /api/students/:id` - Buscar aluno
- `POST /api/students` - Criar aluno
- `PUT /api/students/:id` - Atualizar aluno
- `DELETE /api/students/:id` - Deletar aluno (admin)

### Terapeutas

- `GET /api/staff` - Listar terapeutas
- `GET /api/staff/:id` - Buscar terapeuta
- `POST /api/staff` - Criar terapeuta (admin)
- `PUT /api/staff/:id` - Atualizar terapeuta
- `DELETE /api/staff/:id` - Deletar terapeuta (admin)

### Health Check

- `GET /api/health` - Verificar status da API

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação.

Para acessar rotas protegidas, inclua o token no header:

```
Authorization: Bearer <seu-token>
```

## 🗄️ Banco de Dados

### Prisma Studio

Para visualizar e editar dados:

```bash
npm run prisma:studio
```

### Migrations

Criar nova migration:

```bash
npx prisma migrate dev --name nome_da_migration
```

## 📝 Scripts Disponíveis

- `npm run dev` - Desenvolvimento com hot reload
- `npm run build` - Build para produção
- `npm start` - Executar versão de produção
- `npm run prisma:generate` - Gerar Prisma Client
- `npm run prisma:migrate` - Executar migrations
- `npm run prisma:deploy` - Deploy migrations (produção)
- `npm run prisma:seed` - Seed do banco
- `npm run prisma:studio` - Abrir Prisma Studio

## 🚀 Deploy

### Na VPS

1. Fazer upload do código para `/var/www/clinicrafabarros-backend`
2. Instalar dependências: `npm install`
3. Configurar `.env` de produção
4. Executar migrations: `npm run prisma:deploy`
5. Executar seed: `npm run prisma:seed`
6. Build: `npm run build`
7. Iniciar com PM2: `pm2 start dist/server.js --name clinicrafabarros-api`

## 📄 Licença

MIT
