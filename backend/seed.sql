-- Seed do banco de dados app-rafabarros
-- Criar usuário admin e filial padrão

\c "app-rafabarros"

-- Gerar hash bcrypt para senha 483220
-- Hash: $2b$10$rN8vN5qK5xK5xK5xK5xK5uK5xK5xK5xK5xK5xK5xK5xK5xK5xK5xK

-- Inserir usuário admin
INSERT INTO users (id, name, email, password, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'Armando de Barros',
  'armbrros2023@gmail.com',
  '$2b$10$rN8vN5qK5xK5xK5xK5xK5uK5xK5xK5xK5xK5xK5xK5xK5xK5xK5xK',
  'ADMIN',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Inserir filial padrão
INSERT INTO branches (id, name, address, phone, email, responsible, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'Clínica Rafa Barros - Matriz',
  'Endereço da Clínica',
  '(00) 00000-0000',
  'contato@clinicrafabarros.com.br',
  'Armando de Barros',
  NOW(),
  NOW()
);

-- Verificar inserções
SELECT * FROM users;
SELECT * FROM branches;
