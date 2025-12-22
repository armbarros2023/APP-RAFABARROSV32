# 🔐 CREDENCIAIS DE ACESSO - ClinicaRafaBarros

**Data**: 22/12/2025  
**Versão**: 1.0.0  
**Status**: ✅ Produção

---

## 🌐 URLs DE ACESSO

### Frontend (Aplicação Web)
**URL**: https://clinica.iaaplicativos.com.br  
**Status**: ✅ Ativo  
**Servidor**: Nginx no VPS Hostinger

### Backend (API)
**URL**: http://69.62.103.58:5000/api  
**Status**: ⏳ Aguardando deploy  
**Servidor**: Node.js + Express no VPS Hostinger

### Health Check
**URL**: http://69.62.103.58:5000/api/health  
**Resposta esperada**: `{"status":"ok"}`

---

## 👤 CREDENCIAIS DE ADMINISTRADOR

### Acesso à Aplicação

**Nome**: Armando de Barros  
**Email**: armbrros2023@gmail.com  
**Senha**: 483220  
**Perfil**: ADMIN (Administrador)

### Primeiro Acesso
1. Acesse: https://clinica.iaaplicativos.com.br
2. Clique em "Entrar"
3. Digite o email: `armbrros2023@gmail.com`
4. Digite a senha: `483220`
5. Clique em "Entrar"

---

## 🖥️ ACESSO AO SERVIDOR VPS

### SSH
**IP**: 69.62.103.58  
**Usuário**: root  
**Porta**: 22  
**Senha**: [Você possui a senha]

**Comando de conexão**:
```bash
ssh root@69.62.103.58
```

### Diretórios Importantes

| Componente | Diretório |
|------------|-----------|
| **Frontend** | `/var/www/clinicrafabarros-frontend` |
| **Backend** | `/root/clinicrafabarros` |
| **Nginx Config** | `/etc/nginx/sites-available/clinicrafabarros` |
| **SSL Certs** | `/etc/letsencrypt/live/clinica.iaaplicativos.com.br/` |
| **Logs Nginx** | `/var/log/nginx/` |
| **Logs PM2** | `/root/.pm2/logs/` |

---

## 🗄️ BANCO DE DADOS

### PostgreSQL

**Host**: localhost (no VPS)  
**Porta**: 5432  
**Database**: app-rafabarros  
**Usuário**: clinicapp  
**Senha**: Ra483220fa

**String de Conexão**:
```
postgresql://clinicapp:Ra483220fa@localhost:5432/app-rafabarros
```

### Acesso ao Banco

**Via SSH no VPS**:
```bash
# Conectar ao PostgreSQL
psql -U clinicapp -d app-rafabarros

# Ou como superuser
sudo -u postgres psql -d app-rafabarros
```

**Comandos úteis**:
```sql
-- Listar tabelas
\dt

-- Ver usuários
SELECT * FROM "User";

-- Ver filiais
SELECT * FROM "Branch";

-- Ver alunos
SELECT * FROM "Student";
```

---

## 🔧 GERENCIAMENTO DE SERVIÇOS

### PM2 (Backend)

**Ver status**:
```bash
ssh root@69.62.103.58 'pm2 list'
```

**Ver logs**:
```bash
ssh root@69.62.103.58 'pm2 logs clinicrafabarros-api'
```

**Reiniciar**:
```bash
ssh root@69.62.103.58 'pm2 restart clinicrafabarros-api'
```

**Parar**:
```bash
ssh root@69.62.103.58 'pm2 stop clinicrafabarros-api'
```

**Iniciar**:
```bash
ssh root@69.62.103.58 'pm2 start clinicrafabarros-api'
```

### Nginx (Frontend)

**Ver status**:
```bash
ssh root@69.62.103.58 'systemctl status nginx'
```

**Reiniciar**:
```bash
ssh root@69.62.103.58 'systemctl restart nginx'
```

**Recarregar configuração**:
```bash
ssh root@69.62.103.58 'nginx -s reload'
```

**Testar configuração**:
```bash
ssh root@69.62.103.58 'nginx -t'
```

---

## 📊 MONITORAMENTO

### Logs em Tempo Real

**Nginx Access Log**:
```bash
ssh root@69.62.103.58 'tail -f /var/log/nginx/clinicrafabarros-access.log'
```

**Nginx Error Log**:
```bash
ssh root@69.62.103.58 'tail -f /var/log/nginx/clinicrafabarros-error.log'
```

**Backend API Log**:
```bash
ssh root@69.62.103.58 'pm2 logs clinicrafabarros-api --lines 100'
```

### Recursos do Servidor

**Uso de CPU e Memória**:
```bash
ssh root@69.62.103.58 'htop'
# ou
ssh root@69.62.103.58 'top'
```

**Espaço em Disco**:
```bash
ssh root@69.62.103.58 'df -h'
```

**Processos Node.js**:
```bash
ssh root@69.62.103.58 'pm2 monit'
```

---

## 🔒 SEGURANÇA

### JWT Secret (Backend)

**Localização**: `/root/clinicrafabarros/.env`  
**Variável**: `JWT_SECRET`

⚠️ **IMPORTANTE**: Trocar o JWT_SECRET em produção!

**Gerar novo secret**:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### SSL/HTTPS

**Certificado**: Let's Encrypt  
**Renovação**: Automática (certbot)  
**Validade**: 90 dias

**Renovar manualmente**:
```bash
ssh root@69.62.103.58 'certbot renew'
```

**Verificar certificado**:
```bash
ssh root@69.62.103.58 'certbot certificates'
```

---

## 🚀 DEPLOY E ATUALIZAÇÃO

### Atualizar Frontend

```bash
cd /Users/arbtechinfo.ia/Projetos\ 2025/app-rafabarrosv32
./deploy-clinica.sh
```

### Atualizar Backend

```bash
cd /Users/arbtechinfo.ia/Projetos\ 2025/app-rafabarrosv32/backend
./deploy-to-vps.sh
```

### Deploy Completo (Frontend + Backend)

```bash
cd /Users/arbtechinfo.ia/Projetos\ 2025/app-rafabarrosv32
./deploy-no-servidor.sh
```

---

## 🆘 TROUBLESHOOTING

### Problema: Aplicação não carrega

1. Verificar Nginx:
```bash
ssh root@69.62.103.58 'systemctl status nginx'
ssh root@69.62.103.58 'nginx -t'
```

2. Verificar arquivos:
```bash
ssh root@69.62.103.58 'ls -la /var/www/clinicrafabarros-frontend/'
```

### Problema: API não responde

1. Verificar PM2:
```bash
ssh root@69.62.103.58 'pm2 list'
ssh root@69.62.103.58 'pm2 logs clinicrafabarros-api --lines 50'
```

2. Verificar porta:
```bash
ssh root@69.62.103.58 'netstat -tulpn | grep 5000'
```

### Problema: Erro de login

1. Verificar banco de dados:
```bash
ssh root@69.62.103.58 'psql -U clinicapp -d app-rafabarros -c "SELECT * FROM \"User\";"'
```

2. Verificar logs do backend:
```bash
ssh root@69.62.103.58 'pm2 logs clinicrafabarros-api'
```

### Problema: Erro 502 Bad Gateway

1. Backend não está rodando - iniciar:
```bash
ssh root@69.62.103.58 'cd /root/clinicrafabarros && pm2 start dist/server.js --name clinicrafabarros-api'
```

2. Verificar configuração Nginx:
```bash
ssh root@69.62.103.58 'cat /etc/nginx/sites-available/clinicrafabarros'
```

---

## 📞 CONTATOS E SUPORTE

### Desenvolvedor
**Nome**: Armando de Barros  
**Email**: armbrros2023@gmail.com

### Servidor
**Provedor**: Hostinger  
**Painel**: https://hpanel.hostinger.com

### DNS
**Provedor**: Registro.br  
**Painel**: https://registro.br

---

## 📋 CHECKLIST DE SEGURANÇA

- [x] Senhas criptografadas (bcrypt)
- [x] JWT para autenticação
- [x] CORS configurado
- [x] Rate limiting ativo
- [x] Helmet (security headers)
- [x] HTTPS/SSL ativo
- [ ] JWT_SECRET forte em produção (⚠️ TROCAR!)
- [ ] Backup automático do banco
- [ ] Monitoramento de logs
- [ ] 2FA (futuro)

---

## 🎯 PRÓXIMOS PASSOS

### Imediato (Hoje)
1. ✅ Deploy do backend
2. ✅ Testar API
3. ✅ Conectar frontend ao backend
4. ⚠️ Trocar JWT_SECRET

### Curto Prazo (Esta Semana)
5. ✅ Configurar backup automático
6. ✅ Configurar monitoramento
7. ✅ Testar todas as funcionalidades
8. ✅ Documentar procedimentos

### Médio Prazo (Este Mês)
9. ✅ Implementar logs estruturados
10. ✅ Adicionar mais testes
11. ✅ Otimizar performance
12. ✅ Revisar segurança

---

**Última atualização**: 22/12/2025 10:30  
**Próxima revisão**: Após deploy do backend

---

## ⚠️ AVISOS IMPORTANTES

1. **NUNCA** compartilhe estas credenciais publicamente
2. **SEMPRE** use HTTPS em produção
3. **TROQUE** o JWT_SECRET padrão
4. **FAÇA** backup regular do banco de dados
5. **MONITORE** os logs regularmente
6. **ATUALIZE** as dependências periodicamente
7. **TESTE** antes de fazer deploy em produção

---

**🔐 Este documento contém informações sensíveis - mantenha em local seguro!**
