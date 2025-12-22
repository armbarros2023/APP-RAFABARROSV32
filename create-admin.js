require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        console.log('Iniciando criação do admin...');

        const hashedPassword = await bcrypt.hash('483220', 10);
        console.log('✓ Hash criado');

        // Remover usuários existentes
        await prisma.user.deleteMany({
            where: { email: 'armbrros2023@gmail.com' }
        });
        console.log('✓ Usuários antigos removidos');

        // Criar admin
        const admin = await prisma.user.create({
            data: {
                name: 'Armando de Barros',
                email: 'armbrros2023@gmail.com',
                password: hashedPassword,
                role: 'ADMIN'
            }
        });

        console.log('✓ Admin criado:', admin.email, admin.role);

        // Listar todos os usuários
        const allUsers = await prisma.user.findMany();
        console.log('\nTotal de usuários:', allUsers.length);
        allUsers.forEach(u => {
            console.log('  -', u.email, '|', u.role, '|', u.active ? 'Ativo' : 'Inativo');
        });

    } catch (error) {
        console.error('❌ ERRO:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
