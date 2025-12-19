# 🔗 FASE 2: Integração Frontend com Backend

**Data**: 2025-12-18  
**Status**: 🚧 Em Progresso

---

## ✅ O que foi criado

### 📁 Services Layer

```
src/services/
├── apiClient.ts          ✅ Cliente HTTP com interceptors
├── authService.ts        ✅ Serviço de autenticação
├── branchService.ts      ✅ Serviço de filiais
└── index.ts              ✅ Export centralizado
```

### 🔧 Configuração

- ✅ `.env` - Variável `VITE_API_URL` configurada
- ✅ `axios` - Instalado e configurado

---

## 📋 Próximos Passos

### 1. Atualizar AuthContext

Substituir lógica de localStorage por chamadas à API real:

```typescript
// Antes (mock):
const login = (email: string, password: string) => {
  // Mock data
  setUser(mockUser);
};

// Depois (API real):
const login = async (email: string, password: string) => {
  const response = await authService.login({ email, password });
  setUser(response.user);
};
```

### 2. Atualizar BranchContext

Substituir dados mockados por chamadas à API:

```typescript
// Antes (mock):
const branches = mockBranches;

// Depois (API real):
const fetchBranches = async () => {
  const data = await branchService.getAll();
  setBranches(data);
};
```

### 3. Testar Integração

- [ ] Login com credenciais reais
- [ ] Listar filiais da API
- [ ] Criar nova filial
- [ ] Atualizar filial
- [ ] Deletar filial

---

## 🎯 Como Usar os Services

### Exemplo: Login

```typescript
import { authService } from '@/services';

// Login
try {
  const response = await authService.login({
    email: 'armbrros2023@gmail.com',
    password: '483220'
  });
  
  console.log('Token:', response.token);
  console.log('User:', response.user);
} catch (error) {
  console.error('Erro no login:', error);
}
```

### Exemplo: Listar Filiais

```typescript
import { branchService } from '@/services';

// Listar todas as filiais
try {
  const branches = await branchService.getAll();
  console.log('Filiais:', branches);
} catch (error) {
  console.error('Erro ao listar filiais:', error);
}
```

### Exemplo: Criar Filial

```typescript
import { branchService } from '@/services';

// Criar nova filial
try {
  const newBranch = await branchService.create({
    name: 'Filial São Paulo',
    address: 'Rua Exemplo, 123',
    phone: '(11) 98765-4321',
    email: 'sp@clinica.com.br'
  });
  
  console.log('Filial criada:', newBranch);
} catch (error) {
  console.error('Erro ao criar filial:', error);
}
```

---

## 🔐 Autenticação

### Como funciona

1. **Login**: Usuário faz login → Recebe token JWT
2. **Token**: Salvo no `localStorage`
3. **Requisições**: Token enviado automaticamente em todas as requisições
4. **Expiração**: Se token expirar (401), usuário é redirecionado para login

### Interceptors

O `apiClient` possui 2 interceptors:

**Request Interceptor:**
- Adiciona token JWT no header `Authorization`

**Response Interceptor:**
- Detecta erro 401 (não autorizado)
- Remove token e redireciona para login

---

## 📊 Estrutura de Dados

### User
```typescript
{
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'THERAPIST';
  createdAt?: string;
}
```

### Branch
```typescript
{
  id: string;
  name: string;
  address?: string;
  phone?: string;
  cnpj?: string;
  stateRegistration?: string;
  email?: string;
  responsible?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🚀 Testando a Integração

### 1. Certifique-se que o backend está rodando

```bash
# Terminal 1: Túnel SSH
cd backend
./tunnel-vps.sh

# Terminal 2: Backend
cd backend
npm run dev
```

### 2. Inicie o frontend

```bash
# Terminal 3: Frontend
npm run dev
```

### 3. Teste o login

- Acesse http://localhost:5173
- Faça login com:
  - Email: `armbrros2023@gmail.com`
  - Senha: `483220`

---

## 📝 Checklist de Integração

- [x] Criar `apiClient.ts`
- [x] Criar `authService.ts`
- [x] Criar `branchService.ts`
- [x] Configurar `.env`
- [x] Instalar `axios`
- [ ] Atualizar `AuthContext`
- [ ] Atualizar `BranchContext`
- [ ] Testar login
- [ ] Testar listagem de filiais
- [ ] Testar CRUD de filiais

---

## 🎯 Próxima Ação

**Atualizar o AuthContext para usar o authService!**

Vamos substituir a lógica mockada por chamadas reais à API.

---

**Status**: 🚧 Services criados - Aguardando integração com Contexts
