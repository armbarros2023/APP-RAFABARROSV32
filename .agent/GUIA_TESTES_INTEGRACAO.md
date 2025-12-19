# 🧪 GUIA DE TESTES - Integração Frontend + Backend

**Data**: 2025-12-18  
**Objetivo**: Testar a integração completa do frontend com o backend

---

## ✅ Pré-requisitos

Certifique-se que os seguintes serviços estão rodando:

### Terminal 1: Túnel SSH
```bash
cd backend
./tunnel-vps.sh
# Senha: B075@#ax/980tec
```
**Status**: ✅ Deve mostrar "Porta local: 5433 -> VPS: 5433"

### Terminal 2: Backend
```bash
cd backend
npm run dev
```
**Status**: ✅ Deve mostrar "Server running on: http://localhost:5001"

### Terminal 3: Frontend
```bash
npm run dev
```
**Status**: ✅ Deve mostrar "Local: http://localhost:3000"

---

## 🧪 TESTE 1: Login

### Passos:
1. Abra o navegador em: http://localhost:3000
2. Você deve ver a tela de login
3. Preencha:
   - **Email**: `armbrros2023@gmail.com`
   - **Senha**: `483220`
4. Clique em "Entrar" ou "Login"

### Resultado Esperado:
- ✅ Login bem-sucedido
- ✅ Redirecionamento para Dashboard
- ✅ Nome do usuário aparece no header: "Armando de Barros"
- ✅ Role: ADMIN

### Se falhar:
1. Abra o Console do navegador (F12)
2. Verifique erros na aba "Console"
3. Verifique requisições na aba "Network"
4. Procure por `POST /api/auth/login`
5. Verifique o Response

---

## 🧪 TESTE 2: Listar Filiais

### Passos:
1. Após login, vá para a página de Filiais
2. Ou clique no seletor de filiais no header

### Resultado Esperado:
- ✅ Lista de filiais carrega
- ✅ Aparece "Clínica Rafa Barros - Matriz"
- ✅ Dados vêm da API (não são mock)

### Como verificar:
1. Abra Console (F12)
2. Aba "Network"
3. Procure por `GET /api/branches`
4. Verifique Response

---

## 🧪 TESTE 3: Criar Nova Filial (Admin)

### Passos:
1. Na página de Filiais
2. Clique em "Nova Filial" ou "Adicionar"
3. Preencha:
   - **Nome**: Filial Teste
   - **Endereço**: Rua Teste, 123
   - **Telefone**: (11) 98765-4321
   - **Email**: teste@clinica.com
4. Salve

### Resultado Esperado:
- ✅ Filial criada com sucesso
- ✅ Aparece na lista
- ✅ Mensagem de sucesso

### Como verificar:
1. Console (F12) → Network
2. Procure por `POST /api/branches`
3. Status: 201 Created
4. Response contém a nova filial com ID

---

## 🧪 TESTE 4: Atualizar Filial

### Passos:
1. Selecione uma filial
2. Clique em "Editar"
3. Altere o nome para "Filial Teste - Editada"
4. Salve

### Resultado Esperado:
- ✅ Filial atualizada
- ✅ Nome mudou na lista
- ✅ Mensagem de sucesso

### Como verificar:
1. Console (F12) → Network
2. Procure por `PUT /api/branches/{id}`
3. Status: 200 OK

---

## 🧪 TESTE 5: Deletar Filial

### Passos:
1. Selecione uma filial (não a principal)
2. Clique em "Deletar" ou ícone de lixeira
3. Confirme a exclusão

### Resultado Esperado:
- ✅ Filial removida da lista
- ✅ Mensagem de sucesso

### Como verificar:
1. Console (F12) → Network
2. Procure por `DELETE /api/branches/{id}`
3. Status: 200 OK ou 204 No Content

---

## 🧪 TESTE 6: Logout

### Passos:
1. Clique no menu do usuário
2. Clique em "Sair" ou "Logout"

### Resultado Esperado:
- ✅ Redirecionado para tela de login
- ✅ Token removido do localStorage
- ✅ Não consegue acessar páginas protegidas

### Como verificar:
1. Console (F12) → Application → Local Storage
2. Verifique que `token` foi removido

---

## 🧪 TESTE 7: Sessão Persistente

### Passos:
1. Faça login
2. Feche o navegador
3. Abra novamente
4. Acesse http://localhost:3000

### Resultado Esperado:
- ✅ Ainda está logado
- ✅ Dashboard carrega automaticamente
- ✅ Dados do usuário aparecem

---

## 🧪 TESTE 8: Token Expirado

### Passos:
1. Faça login
2. Aguarde 7 dias (ou altere JWT_EXPIRES_IN para 1m)
3. Tente fazer uma requisição

### Resultado Esperado:
- ✅ Erro 401 Unauthorized
- ✅ Redirecionado para login
- ✅ Mensagem de sessão expirada

---

## 🐛 Troubleshooting

### Erro: "Credenciais inválidas"

**Possíveis causas:**
1. Senha incorreta no banco
2. Hash bcrypt diferente
3. Frontend enviando dados errados

**Solução:**
```bash
# Teste via curl
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"armbrros2023@gmail.com","password":"483220"}'

# Se funcionar, o problema é no frontend
# Se não funcionar, o problema é no backend/banco
```

### Erro: "Network Error" ou "Failed to fetch"

**Possíveis causas:**
1. Backend não está rodando
2. Túnel SSH não está ativo
3. CORS bloqueando

**Solução:**
1. Verifique se backend está em http://localhost:5001
2. Verifique se túnel SSH está ativo
3. Verifique CORS_ORIGIN no backend/.env

### Erro: "Cannot read property 'user' of undefined"

**Possíveis causas:**
1. AuthContext não está envolvendo a aplicação
2. Import incorreto

**Solução:**
1. Verifique App.tsx tem `<AuthProvider>`
2. Verifique imports dos contexts

---

## 📊 Checklist Final

- [ ] Login funciona
- [ ] Logout funciona
- [ ] Listar filiais funciona
- [ ] Criar filial funciona (admin)
- [ ] Atualizar filial funciona (admin)
- [ ] Deletar filial funciona (admin)
- [ ] Sessão persiste após reload
- [ ] Token expirado redireciona para login
- [ ] Dados vêm da API (não são mock)
- [ ] Console sem erros

---

## 🎯 Próximo Passo

Se todos os testes passarem:
- ✅ Integração frontend + backend está completa!
- ✅ Pronto para Fase 3: Deploy na VPS

Se houver falhas:
- 🐛 Anote os erros
- 📝 Verifique Console e Network
- 🔧 Corrija os problemas

---

**Boa sorte nos testes!** 🚀
