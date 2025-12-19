# 🔌 Conectando ao PostgreSQL da VPS

## 📋 Situação Atual

✅ **VPS IP**: 69.62.103.58  
✅ **PostgreSQL**: Rodando na VPS  
✅ **Banco**: app-rafabarros  
✅ **Usuário**: clinicapp  
✅ **Senha**: Ra483220fa  

---

## 🚀 Como Usar (2 Terminais)

### **Terminal 1: Túnel SSH** (deixe aberto)

```bash
cd "/Users/arbtechinfo.ia/Projetos 2025/app-rafabarrosv32/backend"
./tunnel-vps.sh
```

Isso vai:
- Conectar na VPS via SSH
- Criar um túnel da porta 5432 local para a porta 5432 da VPS
- Permitir que você acesse o PostgreSQL remoto como se fosse local

⚠️ **IMPORTANTE**: Mantenha este terminal aberto enquanto estiver desenvolvendo!

---

### **Terminal 2: Backend** (comandos de desenvolvimento)

Depois de abrir o túnel no Terminal 1, execute neste terminal:

#### **1. Executar Migrations:**
```bash
cd "/Users/arbtechinfo.ia/Projetos 2025/app-rafabarrosv32/backend"
npm run prisma:migrate
```

#### **2. Popular o Banco (Seed):**
```bash
npm run prisma:seed
```

#### **3. Iniciar o Backend:**
```bash
npm run dev
```

#### **4. Testar Endpoints:**
```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"armbrros2023@gmail.com","password":"483220"}'
```

---

## 🔧 Troubleshooting

### Erro: "Can't reach database server"

**Causa**: O túnel SSH não está aberto  
**Solução**: Abra o Terminal 1 e execute `./tunnel-vps.sh`

### Erro: "Port 5432 already in use"

**Causa**: Já existe algo rodando na porta 5432  
**Solução**: 
```bash
# Ver o que está usando a porta
lsof -i :5432

# Se for outro túnel SSH, mate o processo
kill -9 <PID>
```

### Erro: "Permission denied (publickey)"

**Causa**: Precisa da senha SSH  
**Solução**: O script vai pedir a senha da VPS quando conectar

---

## 📊 Próximos Passos

Após executar os comandos acima:

1. ✅ Migrations aplicadas no banco da VPS
2. ✅ Banco populado com admin e filial padrão
3. ✅ Backend rodando localmente
4. ✅ Conectado ao banco da VPS via túnel
5. ⏳ Testar todos os endpoints
6. ⏳ Integrar com o frontend

---

## 🎯 Comandos Rápidos

```bash
# Abrir túnel (Terminal 1)
./tunnel-vps.sh

# Migrations (Terminal 2)
npm run prisma:migrate

# Seed (Terminal 2)
npm run prisma:seed

# Iniciar backend (Terminal 2)
npm run dev
```

---

**Pronto para começar!** 🚀
