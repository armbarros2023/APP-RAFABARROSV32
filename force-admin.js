
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setAdmin() {
    const email = 'rafaelvernill@icloud.com';
    console.log(`Buscando usuário: ${email}`);

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.log('❌ Usuário não encontrado!');
            return;
        }

        console.log(`Estado atual: ${user.name} - Role: ${user.role}`);

        if (user.role !== 'ADMIN') {
            const updated = await prisma.user.update({
                where: { email },
                data: { role: 'ADMIN' }
            });
            console.log(`✅ Usuário atualizado para ADMIN com sucesso!`);
            console.log(`Novo estado: ${updated.name} - Role: ${updated.role}`);
        } else {
            console.log('ℹ️ O usuário já é ADMIN.');
        }

    } catch (e) {
        console.error('❌ Erro:', e);
    } finally {
        await prisma.$disconnect();
    }
}

setAdmin();
