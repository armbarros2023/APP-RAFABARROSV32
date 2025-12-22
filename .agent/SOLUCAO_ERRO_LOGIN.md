# 🔧 SOLUÇÃO DO ERRO DE LOGIN

**Data**: 22/12/2025 10:56  
**Problema**: "Email ou senha não estão corretos"  
**Status**: 🔄 Resolvendo

---

## 🔍 DIAGNÓSTICO

### **Causa do Erro**

O erro de login ocorre porque:

1. ❌ **Backend não está rodando** no servidor
2. ❌ **Usuário admin não foi criado** no banco de dados
3. ⚠️ **Deploy do backend não foi concluído**

### **Por que isso aconteceu?**

O frontend está funcionando perfeitamente em:
- ✅ https://clinica.iaaplicativos.com.br

Porém, o backend (API) ainda não foi instalado no servidor, então:
- ❌ Não há API para processar o login
- ❌ Não há usuário admin no banco de dados
- ❌ A aplicação não consegue autenticar

---

## ✅ SOLUÇÃO

### **O que precisa ser feito:**

1. **Finalizar o deploy do backend** no VPS
2. **Criar o usuário admin** no banco de dados
3. **Iniciar a API** com PM2

### **Script Criado**

Criei o script `finalizar-deploy-backend.sh` que fará automaticamente:

- ✅ Extrair o pacote do backend
- ✅ Configurar variáveis de ambiente
- ✅ Executar migrations do banco
- ✅ **Criar usuário admin com as credenciais corretas**
- ✅ Iniciar o backend com PM2

---

## 🚀 COMO EXECUTAR

### **Opção 1: Executar o Script (Recomendado)**

```bash
cd /Users/arbtechinfo.ia/Projetos\ 2025/app-rafabarrosv32
./finalizar-deploy-backend.sh
```

**O script está aguardando a senha SSH do servidor.**

### **Opção 2: Comandos Manuais**

Se preferir fazer manualmente via SSH:

```bash
# 1. Conectar ao servidor
ssh root@69.62.103.58

# 2. Ir para o diretório do backend
cd /root/clinicrafabarros

# 3. Criar usuário admin
node << 'EOF'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
    const hashedPassword = await bcrypt.hash('483220', 10);
    
    const admin = await prisma.user.upsert({
        where: { email: 'armbrros2023@gmail.com' },
        update: { password: hashedPassword },
        create: {
            name: 'Armando de Barros',
            email: 'armbrros2023@gmail.com',
            password: hashedPassword,
            role: 'ADMIN',
            active: true
        }
    });
    
    console.log('✓ Admin criado:', admin.email);
    await prisma.$disconnect();
}

createAdmin();
EOF

# 4. Iniciar backend
pm2 start dist/server.js --name clinicrafabarros-api
pm2 save

# 5. Verificar status
pm2 list
pm2 logs clinicrafabarros-api --lines 20
```

---

## 🔐 CREDENCIAIS CORRETAS

Após o deploy ser concluído, use:

### **Para Login na Aplicação**
- **URL**: https://clinica.iaaplicativos.com.br
- **Email**: armbrros2023@gmail.com
- **Senha**: 483220
- **Perfil**: ADMIN

---

## 🧪 VERIFICAÇÃO PÓS-DEPLOY

### **1. Verificar se o Backend está Rodando**

```bash
ssh root@69.62.103.58 'pm2 list'
```

**Esperado**: Ver `clinicrafabarros-api` com status `online`

### **2. Testar Health Check**

```bash
curl http://69.62.103.58:5000/api/health
```

**Esperado**: `{"status":"ok"}`

### **3. Testar Login via API**

```bash
curl -X POST http://69.62.103.58:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "armbrros2023@gmail.com",
    "password": "483220"
  }'
```

**Esperado**: Retornar token JWT e dados do usuário

### **4. Verificar Usuário no Banco**

```bash
ssh root@69.62.103.58 'psql -U clinicapp -d app-rafabarros -c "SELECT id, name, email, role, active FROM \"User\";"'
```

**Esperado**: Ver o usuário admin listado

---

## 📊 CHECKLIST DE RESOLUÇÃO

- [ ] Fornecer senha SSH
- [ ] Script executar com sucesso
- [ ] Backend iniciado com PM2
- [ ] Usuário admin criado no banco
- [ ] Health check respondendo
- [ ] Login funcionando na aplicação

---

## ⚡ AÇÃO IMEDIATA

**Forneça a senha SSH quando solicitado** para que o script `finalizar-deploy-backend.sh` possa:

1. Instalar o backend no servidor
2. Criar o usuário admin
3. Iniciar a API

**Após isso, o login funcionará perfeitamente!** ✅

---

## 🆘 SE O PROBLEMA PERSISTIR

### **Verificar Logs do Backend**
```bash
ssh root@69.62.103.58 'pm2 logs clinicrafabarros-api'
```

### **Verificar Conexão com Banco**
```bash
ssh root@69.62.103.58 'psql -U clinicapp -d app-rafabarros -c "\dt"'
```

### **Reiniciar Backend**
```bash
ssh root@69.62.103.58 'pm2 restart clinicrafabarros-api'
```

---

## 📝 RESUMO

**Problema**: Frontend funcionando, mas backend não está instalado  
**Solução**: Executar `finalizar-deploy-backend.sh` com senha SSH  
**Resultado**: Login funcionará com `armbrros2023@gmail.com` / `483220`

---

**Última atualização**: 22/12/2025 10:56  
**Status**: ⏳ Aguardando senha SSH para concluir deploy
