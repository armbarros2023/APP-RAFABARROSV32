#!/bin/bash
# Execute este script NA VPS para corrigir permissões do PostgreSQL

echo "🔧 Corrigindo permissões do PostgreSQL..."

sudo -u postgres psql << 'EOF'
-- Dar permissões completas ao usuário clinicapp
ALTER USER clinicapp CREATEDB;
ALTER USER clinicapp WITH SUPERUSER;

-- Garantir acesso ao banco
\c "app-rafabarros"
GRANT ALL ON SCHEMA public TO clinicapp;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO clinicapp;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO clinicapp;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO clinicapp;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO clinicapp;

-- Verificar permissões
\du clinicapp

EOF

echo ""
echo "✅ Permissões atualizadas!"
echo "✅ O usuário clinicapp agora tem permissões completas"
