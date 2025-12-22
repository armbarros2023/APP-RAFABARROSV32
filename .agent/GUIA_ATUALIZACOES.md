# 🔄 GUIA: Alterações e Atualizações do Sistema

**Como proceder após testes da empresa**

---

## 📋 FLUXO DE ATUALIZAÇÃO

### 1️⃣ Desenvolvimento Local
### 2️⃣ Teste Local
### 3️⃣ Commit no GitHub
### 4️⃣ Deploy na VPS
### 5️⃣ Teste em Produção

---

## 🛠️ PASSO A PASSO DETALHADO

### CENÁRIO 1: Alterar Frontend (Interface)

#### 1. Fazer Alteração Local
```bash
# No Mac
cd "/Users/arbtechinfo.ia/Projetos 2025/app-rafabarrosv32"

# Editar arquivo desejado
# Exemplo: pages/DashboardPage.tsx
```

#### 2. Testar Localmente
```bash
# Iniciar frontend local
npm run dev

# Acessar: http://localhost:3000
# Testar a alteração
```

#### 3. Build de Produção
```bash
# Fazer build
npm run build

# Verificar se build funcionou
ls -la dist/
```

#### 4. Salvar no GitHub
```bash
git add .
git commit -m "Descrição da alteração feita"
git push
```

#### 5. Deploy na VPS
```bash
# Criar pacote
tar -czf dist.tar.gz dist/

# Enviar para VPS
scp dist.tar.gz root@69.62.103.58:/tmp/
```

**Na VPS**:
```bash
# Conectar via SSH
ssh root@69.62.103.58
# Senha: B075@#ax/980tec

# Atualizar frontend
cd /var/www/clinicrafabarros
rm -rf *
tar -xzf /tmp/dist.tar.gz --strip-components=1
chmod -R 755 /var/www/clinicrafabarros
rm /tmp/dist.tar.gz

# Pronto! Recarregue o navegador
```

---

### CENÁRIO 2: Alterar Backend (API)

#### 1. Fazer Alteração Local
```bash
# No Mac
cd "/Users/arbtechinfo.ia/Projetos 2025/app-rafabarrosv32/backend"

# Editar arquivo desejado
# Exemplo: src/controllers/studentController.ts
```

#### 2. Testar Localmente
```bash
# Iniciar backend local
npm run dev

# Testar endpoint
curl http://localhost:5001/api/health
```

#### 3. Salvar no GitHub
```bash
git add .
git commit -m "Descrição da alteração no backend"
git push
```

#### 4. Deploy na VPS
```bash
# No Mac
cd "/Users/arbtechinfo.ia/Projetos 2025/app-rafabarrosv32/backend"

# Criar pacote
tar -czf backend-update.tar.gz src/ package.json

# Enviar para VPS
scp backend-update.tar.gz root@69.62.103.58:/tmp/
```

**Na VPS**:
```bash
ssh root@69.62.103.58

cd /root/clinicrafabarros
tar -xzf /tmp/backend-update.tar.gz
npm install
pm2 restart clinicrafabarros-api

# Verificar logs
pm2 logs clinicrafabarros-api --lines 20
```

---

### CENÁRIO 3: Alterar Banco de Dados (Schema)

#### 1. Atualizar Schema Prisma
```bash
# No Mac
cd "/Users/arbtechinfo.ia/Projetos 2025/app-rafabarrosv32/backend"

# Editar schema
nano prisma/schema.prisma

# Exemplo: Adicionar campo
model Student {
  id    String @id @default(uuid())
  name  String
  cpf   String? // NOVO CAMPO
  // ...
}
```

#### 2. Criar Migration
```bash
# Gerar migration
npx prisma migrate dev --name adicionar_cpf_aluno

# Isso cria arquivo em prisma/migrations/
```

#### 3. Testar Localmente
```bash
# Verificar se migration funcionou
npx prisma studio
```

#### 4. Salvar no GitHub
```bash
git add .
git commit -m "Adicionar campo CPF em alunos"
git push
```

#### 5. Aplicar na VPS
```bash
# Enviar migration para VPS
cd backend
tar -czf migration.tar.gz prisma/
scp migration.tar.gz root@69.62.103.58:/tmp/
```

**Na VPS**:
```bash
ssh root@69.62.103.58

cd /root/clinicrafabarros
tar -xzf /tmp/migration.tar.gz
npx prisma migrate deploy
pm2 restart clinicrafabarros-api
```

---

## 🎯 EXEMPLOS PRÁTICOS

### Exemplo 1: Mudar Cor do Dashboard

**Arquivo**: `pages/DashboardPage.tsx`

```typescript
// Antes
<div className="bg-blue-500">

// Depois
<div className="bg-green-500">
```

**Comandos**:
```bash
# No Mac
npm run build
tar -czf dist.tar.gz dist/
scp dist.tar.gz root@69.62.103.58:/tmp/

# Na VPS
ssh root@69.62.103.58
cd /var/www/clinicrafabarros
rm -rf *
tar -xzf /tmp/dist.tar.gz --strip-components=1
```

---

### Exemplo 2: Adicionar Novo Campo em Aluno

**1. Atualizar Schema**:
```prisma
model Student {
  // ... campos existentes
  cpf String? @unique
}
```

**2. Criar Migration**:
```bash
npx prisma migrate dev --name add_cpf
```

**3. Atualizar Controller**:
```typescript
// src/controllers/studentController.ts
export const createStudent = async (req, res) => {
  const { name, cpf } = req.body; // Adicionar cpf
  
  const student = await prisma.student.create({
    data: { name, cpf } // Incluir cpf
  });
  
  res.json(student);
};
```

**4. Atualizar Frontend**:
```typescript
// pages/PatientManagementPage.tsx
<input
  type="text"
  placeholder="CPF"
  value={cpf}
  onChange={(e) => setCpf(e.target.value)}
/>
```

**5. Deploy**:
```bash
# Backend
cd backend
tar -czf update.tar.gz src/ prisma/
scp update.tar.gz root@69.62.103.58:/tmp/

# Frontend
npm run build
tar -czf dist.tar.gz dist/
scp dist.tar.gz root@69.62.103.58:/tmp/

# Na VPS
ssh root@69.62.103.58
cd /root/clinicrafabarros
tar -xzf /tmp/update.tar.gz
npx prisma migrate deploy
pm2 restart clinicrafabarros-api

cd /var/www/clinicrafabarros
rm -rf *
tar -xzf /tmp/dist.tar.gz --strip-components=1
```

---

## 🚨 BOAS PRÁTICAS

### ✅ SEMPRE Fazer:

1. **Testar localmente primeiro**
   ```bash
   npm run dev
   # Testar tudo antes de fazer deploy
   ```

2. **Fazer backup antes de alterar**
   ```bash
   # Na VPS
   cd /root/clinicrafabarros
   tar -czf backup-$(date +%Y%m%d).tar.gz .
   ```

3. **Commitar no GitHub**
   ```bash
   git add .
   git commit -m "Descrição clara"
   git push
   ```

4. **Verificar logs após deploy**
   ```bash
   pm2 logs clinicrafabarros-api
   ```

### ❌ NUNCA Fazer:

1. ❌ Editar diretamente na VPS
2. ❌ Fazer deploy sem testar localmente
3. ❌ Esquecer de fazer backup
4. ❌ Não commitar no GitHub
5. ❌ Alterar .env sem documentar

---

## 🔄 ROLLBACK (Desfazer Alteração)

Se algo der errado:

### Rollback Frontend
```bash
# Na VPS
cd /var/www/clinicrafabarros

# Restaurar do backup
tar -xzf /root/backups/frontend-backup.tar.gz
```

### Rollback Backend
```bash
# Na VPS
cd /root/clinicrafabarros

# Restaurar do backup
tar -xzf /root/backups/backend-backup.tar.gz
pm2 restart clinicrafabarros-api
```

### Rollback Banco de Dados
```bash
# Na VPS
cd /root/clinicrafabarros

# Reverter última migration
npx prisma migrate resolve --rolled-back NOME_DA_MIGRATION
```

---

## 📝 CHECKLIST DE ATUALIZAÇÃO

Antes de fazer deploy:

- [ ] Alteração testada localmente
- [ ] Build funcionando sem erros
- [ ] Backup criado
- [ ] Commit feito no GitHub
- [ ] Descrição clara do que mudou
- [ ] Equipe avisada (se necessário)

Após deploy:

- [ ] Sistema acessível
- [ ] Funcionalidade testada em produção
- [ ] Logs verificados
- [ ] Sem erros no console
- [ ] Equipe confirmou funcionamento

---

## 🆘 PROBLEMAS COMUNS

### "Sistema não atualiza"
**Solução**: Limpar cache do navegador (Ctrl+Shift+R)

### "Erro 500 após deploy"
**Solução**: Verificar logs
```bash
pm2 logs clinicrafabarros-api --lines 50
```

### "Banco de dados com erro"
**Solução**: Verificar migrations
```bash
npx prisma migrate status
```

### "Frontend em branco"
**Solução**: Verificar permissões
```bash
chmod -R 755 /var/www/clinicrafabarros
```

---

## 📞 SUPORTE

Se precisar de ajuda:

1. Consulte este guia
2. Verifique `.agent/PROJETO_CONCLUIDO.md`
3. Veja logs: `pm2 logs`
4. Verifique GitHub: commits recentes
5. Contate desenvolvedor

---

## 🎯 RESUMO RÁPIDO

```bash
# FRONTEND
npm run build
tar -czf dist.tar.gz dist/
scp dist.tar.gz root@69.62.103.58:/tmp/
# Na VPS: extrair em /var/www/clinicrafabarros

# BACKEND
tar -czf backend.tar.gz src/ package.json
scp backend.tar.gz root@69.62.103.58:/tmp/
# Na VPS: extrair e pm2 restart

# GITHUB (sempre!)
git add .
git commit -m "Descrição"
git push
```

---

## 🎓 DICAS PROFISSIONAIS

1. **Desenvolva em branches**
   ```bash
   git checkout -b nova-feature
   # Desenvolver
   git commit -m "Feature completa"
   git checkout main
   git merge nova-feature
   ```

2. **Use versionamento**
   ```bash
   git tag v1.0.1
   git push --tags
   ```

3. **Documente mudanças**
   - Crie arquivo CHANGELOG.md
   - Liste todas as alterações

4. **Automatize deploy**
   - Crie script de deploy
   - Use CI/CD (GitHub Actions)

---

**Última atualização**: 19/12/2025  
**Versão do Guia**: 1.0.0
