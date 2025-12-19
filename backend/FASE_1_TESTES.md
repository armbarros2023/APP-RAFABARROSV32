# 🚀 FASE 1: Testar Backend Localmente (Conectado à VPS)

## ✅ Configuração Concluída

- ✅ PostgreSQL rodando na VPS (69.62.103.58)
- ✅ Banco `app-rafabarros` criado
- ✅ Usuário `clinicapp` configurado
- ✅ `.env` atualizado para usar porta 5433
- ✅ Script de túnel SSH criado

---

## 🎯 INSTRUÇÕES - Siga Passo a Passo

### **PASSO 1: Abrir Túnel SSH** (Terminal 1)

Abra um **novo terminal** e execute:

```bash
cd "/Users/arbtechinfo.ia/Projetos 2025/app-rafabarrosv32/backend"
./tunnel-vps.sh
```

Quando pedir a senha, digite: `B075@#ax/980tec`

✅ **Deixe este terminal aberto!** O túnel precisa ficar ativo.

---

### **PASSO 2: Executar Migrations** (Terminal 2)

Abra **outro terminal** e execute:

```bash
cd "/Users/arbtechinfo.ia/Projetos 2025/app-rafabarrosv32/backend"
npm run prisma:migrate
```

Isso vai criar todas as tabelas no banco da VPS.

---

### **PASSO 3: Popular o Banco (Seed)**

No mesmo terminal 2:

```bash
npm run prisma:seed
```

Isso vai criar:
- ✅ Usuário admin: armbrros2023@gmail.com / 483220
- ✅ Filial padrão

---

### **PASSO 4: Iniciar o Backend**

No mesmo terminal 2:

```bash
npm run dev
```

O servidor deve iniciar em `http://localhost:5000`

---

### **PASSO 5: Testar Endpoints**

Abra **outro terminal** (Terminal 3) e teste:

#### Health Check:
```bash
curl http://localhost:5000/api/health
```

#### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"armbrros2023@gmail.com","password":"483220"}'
```

Você deve receber um token JWT! 🎉

---

## 📊 Checklist de Progresso

- [ ] Túnel SSH aberto (Terminal 1)
- [ ] Migrations executadas
- [ ] Seed executado
- [ ] Backend rodando
- [ ] Health check funcionando
- [ ] Login funcionando

---

## 🔧 Troubleshooting

### "Can't reach database server"
- ✅ Verifique se o túnel SSH está aberto (Terminal 1)
- ✅ Verifique se não há erros no terminal do túnel

### "Port 5433 already in use"
```bash
lsof -i :5433
kill -9 <PID>
```

### "Connection closed by remote host"
- ✅ Verifique se a senha SSH está correta
- ✅ Tente conectar manualmente: `ssh root@69.62.103.58`

---

## 📝 Informações Importantes

**VPS:**
- IP: 69.62.103.58
- Usuário: root
- Senha SSH: B075@#ax/980tec

**PostgreSQL:**
- Host: 127.0.0.1 (via túnel)
- Porta: 5433 (local) -> 5432 (VPS)
- Database: app-rafabarros
- User: clinicapp
- Password: Ra483220fa

**Admin:**
- Email: armbrros2023@gmail.com
- Senha: 483220

---

## 🎯 Próxima Fase

Após concluir todos os passos acima:

1. ✅ Backend testado e funcionando
2. ⏳ Integrar frontend com backend
3. ⏳ Deploy completo na VPS
4. ⏳ Produção

---

**Comece agora executando o PASSO 1!** 🚀
