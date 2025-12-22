const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createCorrectUser() {
    const emailCorreto = 'armbarros2023@gmail.com'; // O que ele está tentando
    const emailOriginal = 'armbrros2023@gmail.com'; // O que eu criei
    const password = '483220';

    console.log('Fixing user emails...');

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 1. Criar o usuário que ele está tentando usar (armbarros)
        const newUser = await prisma.user.upsert({
            where: { email: emailCorreto },
            update: {
                password: hashedPassword,
                role: 'ADMIN',
                name: 'Armando de Barros'
            },
            create: {
                email: emailCorreto,
                name: 'Armando de Barros',
                password: hashedPassword,
                role: 'ADMIN'
            }
        });

        console.log(`✅ User created/updated: ${newUser.email}`);

        // 2. Garantir que o original tbm funcione, vai que ele acerta depois
        const originalUser = await prisma.user.upsert({
            where: { email: emailOriginal },
            update: {
                password: hashedPassword,
                role: 'ADMIN',
                name: 'Armando de Barros'
            },
            create: {
                email: emailOriginal,
                name: 'Armando de Barros',
                password: hashedPassword,
                role: 'ADMIN'
            }
        });
        console.log(`✅ Original user ensured: ${originalUser.email}`);

    } catch (error) {
        console.error('❌ Error creating user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createCorrectUser();
