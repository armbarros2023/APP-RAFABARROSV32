const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
    const email = 'armbrros2023@gmail.com';
    const newPassword = '483220'; // Senha desejada

    console.log(`Resetting password for ${email}...`);

    try {
        // 1. Hash da nova senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        console.log('New hash generated:', hashedPassword);

        // 2. Atualizar usuário
        const updatedUser = await prisma.user.update({
            where: { email: email },
            data: {
                password: hashedPassword,
                role: 'ADMIN',
                name: 'Armando de Barros' // Garantir nome correto
            },
        });

        console.log('✅ Password updated successfully for:', updatedUser.email);
        console.log('User ID:', updatedUser.id);

    } catch (error) {
        console.error('❌ Error resetting password:', error);

        // Se usuário não existir, criar
        if (error.code === 'P2025') {
            console.log('User not found. Creating new admin...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            const newUser = await prisma.user.create({
                data: {
                    name: 'Armando de Barros',
                    email: email,
                    password: hashedPassword,
                    role: 'ADMIN'
                }
            });
            console.log('✅ Admin user created:', newUser.email);
        }
    } finally {
        await prisma.$disconnect();
    }
}

resetPassword();
