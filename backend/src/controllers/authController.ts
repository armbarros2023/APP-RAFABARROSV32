import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';

// Validation schemas
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['ADMIN', 'THERAPIST']).optional(),
});

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body;
        if (body.email) {
            body.email = body.email.trim().toLowerCase();
        }

        const { email, password } = loginSchema.parse(body);

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        console.log(`[LOGIN DEBUG] Tentativa para: ${email}`);

        if (!user) {
            console.log('[LOGIN DEBUG] Usuário NÃO encontrado no banco.');
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        console.log(`[LOGIN DEBUG] Usuário encontrado: ${user.id}, Role: ${user.role}`);
        console.log(`[LOGIN DEBUG] Hash no banco: ${user.password.substring(0, 20)}...`);

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);

        console.log(`[LOGIN DEBUG] Senha válida? ${isPasswordValid}`);

        if (!isPasswordValid) {
            console.log('[LOGIN DEBUG] Senha INVÁLIDA.');
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Generate token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role } = registerSchema.parse(req.body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            res.status(409).json({ error: 'User already exists' });
            return;
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'THERAPIST',
            },
        });

        // Generate token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const me = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error('Me error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
