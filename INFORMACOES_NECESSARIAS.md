# ℹ️ Informações Necessárias para Deploy

Para finalizar o app e colocar em produção na VPS Hostinger, preciso das seguintes informações:

## 🔐 Acesso à VPS

### Informações de Conexão SSH
- [ ] **IP ou Hostname da VPS**: _________________
- [ ] **Usuário SSH**: _________________
- [ ] **Porta SSH**: _________________ (padrão: 22)
- [ ] **Senha ou chave SSH**: (você já está logado?)

### Verificar se está logado
Execute no terminal:
```bash
# Verificar se há conexão SSH ativa
who
# ou
w

# Verificar variáveis de ambiente SSH
echo $SSH_CLIENT
echo $SSH_CONNECTION
```

---

## 🌐 Domínio

- [ ] **Domínio principal**: _________________ (ex: rafaelbarros.com.br)
- [ ] **Subdomínio para API**: _________________ (ex: api.rafaelbarros.com.br)
- [ ] **Subdomínio para App**: _________________ (ex: app.rafaelbarros.com.br)

**Nota**: O DNS já está configurado apontando para a VPS?

---

## 💾 Banco de Dados

### PostgreSQL na VPS
- [ ] PostgreSQL já está instalado? (Sim/Não)
- [ ] Versão do PostgreSQL: _________________
- [ ] Usuário PostgreSQL desejado: _________________ (ex: clinicapp)
- [ ] Senha PostgreSQL: _________________ (gerar senha forte)
- [ ] Nome do banco: _________________ (sugestão: clinicrafabarros)

---

## 📦 Backend

### Repositório
- [ ] Você tem um repositório Git? (GitHub/GitLab/Bitbucket)
- [ ] URL do repositório: _________________
- [ ] Branch principal: _________________ (ex: main)

**Ou prefere que eu crie a estrutura do backend localmente primeiro?**

---

## 🔑 Credenciais e Secrets

### JWT Secret
Gerar com: `openssl rand -base64 32`
- [ ] JWT_SECRET: _________________

### Credenciais Admin Inicial
- [ ] Nome do Admin: _________________
- [ ] Email do Admin: _________________
- [ ] Senha do Admin: _________________

---

## 📧 Email (Opcional - para futuras notificações)

- [ ] Provedor de email: _________________ (Gmail, SendGrid, etc)
- [ ] SMTP Host: _________________
- [ ] SMTP Port: _________________
- [ ] SMTP User: _________________
- [ ] SMTP Password: _________________

---

## 🎯 Decisões de Arquitetura

### 1. Migração de Dados
Você tem dados no localStorage que precisa migrar?
- [ ] Sim - Preciso exportar dados atuais
- [ ] Não - Começar com banco limpo

### 2. Estrutura do Backend
- [ ] **Opção A**: Criar backend em repositório separado
- [ ] **Opção B**: Criar backend na mesma pasta (monorepo)

### 3. Deploy
- [ ] **Opção A**: Deploy manual (via SSH e Git)
- [ ] **Opção B**: CI/CD automático (GitHub Actions)

---

## 📋 Status Atual da VPS

Por favor, execute e me envie o resultado:

```bash
# Informações do sistema
uname -a
cat /etc/os-release

# Verificar PostgreSQL
psql --version
sudo systemctl status postgresql

# Verificar Node.js
node --version
npm --version

# Verificar Nginx
nginx -v
sudo systemctl status nginx

# Verificar PM2
pm2 --version
pm2 list

# Espaço em disco
df -h

# Memória
free -h

# Processos rodando
ps aux | grep -E 'postgres|nginx|node|pm2'
```

---

## ✅ Checklist Rápido

Antes de começar, confirme:

- [ ] Tenho acesso SSH à VPS Hostinger
- [ ] Sei o domínio que vou usar
- [ ] Decidi se vou migrar dados ou começar limpo
- [ ] Tenho permissões de sudo na VPS
- [ ] A VPS tem pelo menos 2GB de RAM
- [ ] A VPS tem pelo menos 20GB de espaço livre

---

## 🚀 Próximos Passos

Assim que você me fornecer essas informações, vou:

1. ✅ Criar estrutura completa do backend
2. ✅ Configurar PostgreSQL na VPS
3. ✅ Criar migrations do Prisma
4. ✅ Conectar frontend ao backend
5. ✅ Fazer deploy na VPS
6. ✅ Configurar Nginx e SSL
7. ✅ Testar tudo em produção

---

**Quanto mais informações você fornecer agora, mais rápido conseguiremos colocar em produção!** 🎯
