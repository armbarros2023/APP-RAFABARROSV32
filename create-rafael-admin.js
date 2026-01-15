
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        console.log('Iniciando criação do admin Rafael...');
        const email = 'rafaelvernill@icloud.com';
        const password = 'Rafa758z';
        const name = 'Rafael Barros';

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.upsert({
            where: { email: email },
            update: {
                passwordHash: hashedPassword, // Corrigido de password para passwordHash
                role: 'ADMIN',
                name: name
            },
            create: {
                email: email,
                name: name,
                passwordHash: hashedPassword, // Corrigido de password para passwordHash
                role: 'ADMIN'
            }
        });

        console.log(`✅ Usuário criado/atualizado com sucesso:`);
        console.log(`Nome: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Função: ${user.role}`);

    } catch (error) {
        console.error('❌ Erro ao criar usuário:', error);
        console.error(error); // Ver erro completo se falhar
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
