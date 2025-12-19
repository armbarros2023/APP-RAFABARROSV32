# 🏥 ClinicaRafaBarros - Sistema de Gestão

Sistema completo de gestão para clínicas de terapia.

## 🚀 Tecnologias

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL 17
- Prisma ORM
- JWT Authentication
- Zod Validation

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL 17
- npm ou yarn

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure o .env com suas credenciais
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

Ver documentação completa em `.agent/FASE_3_DEPLOY.md`

### Resumo
1. Configurar VPS com PostgreSQL
2. Deploy do backend com PM2
3. Configurar Nginx
4. Deploy do frontend
5. Configurar SSL (opcional)

## 📚 Documentação

Toda documentação está em `.agent/`:
- **PROJETO_CONCLUIDO.md** - Resumo completo do projeto
- **GUIA_ACESSO_USUARIOS.md** - Como usuários acessam o sistema
- **FASE_3_DEPLOY.md** - Guia de deploy na VPS
- **BACKUP_GITHUB.md** - Como fazer backup no GitHub

## 🔐 Segurança

- Autenticação JWT
- Senhas com bcrypt
- Validação de dados com Zod
- CORS configurado
- Proteção de rotas

## 🎯 Funcionalidades

- ✅ Gestão de usuários (Admin/Terapeuta)
- ✅ Gestão de filiais
- ✅ Gestão de alunos/pacientes
- ✅ Gestão de terapeutas
- ✅ Agendamento de sessões
- ✅ Controle financeiro
- ✅ Emissão de recibos
- ✅ Notas fiscais
- ✅ Relatórios
- ✅ Dashboard com estatísticas

## 📱 Acesso

### Produção
- URL: http://69.62.103.58
- Futuro: https://app.clinicarafabarros.com.br

### Desenvolvimento
- Frontend: http://localhost:3000
- Backend: http://localhost:5001

## 🛠️ Scripts Úteis

### Backend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build TypeScript
npm run start        # Produção
npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate   # Rodar migrations
npm run prisma:seed      # Popular banco
```

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run preview      # Preview build
```

## 📊 Estrutura do Projeto

```
app-rafabarrosv32/
├── .agent/              # Documentação completa
├── backend/             # Backend Node.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.ts
│   └── prisma/
│       └── schema.prisma
├── src/                 # Frontend React
│   └── services/        # API Services
├── pages/               # Páginas React
├── contexts/            # React Contexts
└── components/          # Componentes React
```

## 🤝 Contribuindo

Este é um projeto privado. Para contribuir:
1. Solicite acesso ao repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Abra um Pull Request

## 📝 Licença

Privado - ClinicaRafaBarros © 2025

## 📞 Suporte

- Email: armbarros2023@gmail.com
- Documentação: Ver pasta `.agent/`

---

**Desenvolvido com ❤️ por Antigravity AI**
