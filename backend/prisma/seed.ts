import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Hash da senha do admin
    const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || '483220',
        10
    );

    // Criar usuário admin
    const admin = await prisma.user.upsert({
        where: { email: process.env.ADMIN_EMAIL || 'armbrros2023@gmail.com' },
        update: {},
        create: {
            name: process.env.ADMIN_NAME || 'Armando de Barros',
            email: process.env.ADMIN_EMAIL || 'armbrros2023@gmail.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('✅ Admin user created:', {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
    });

    // Criar filial padrão (opcional)
    const defaultBranch = await prisma.branch.upsert({
        where: { id: 'default-branch-id' },
        update: {},
        create: {
            id: 'default-branch-id',
            name: 'Clínica Rafael Barros - Matriz',
            address: 'Endereço da clínica',
            phone: '(00) 0000-0000',
            email: 'contato@clinicrafabarros.com.br',
            responsible: 'Armando de Barros',
        },
    });

    console.log('✅ Default branch created:', {
        id: defaultBranch.id,
        name: defaultBranch.name,
    });

    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
