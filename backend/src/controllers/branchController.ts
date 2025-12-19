import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';

const branchSchema = z.object({
    name: z.string().min(2),
    address: z.string().optional(),
    phone: z.string().optional(),
    cnpj: z.string().optional(),
    stateRegistration: z.string().optional(),
    email: z.string().email().optional(),
    responsible: z.string().optional(),
});

export const getAllBranches = async (req: Request, res: Response): Promise<void> => {
    try {
        const branches = await prisma.branch.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(branches);
    } catch (error) {
        console.error('Get branches error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getBranchById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const branch = await prisma.branch.findUnique({
            where: { id },
            include: {
                staffMembers: true,
                students: true,
            },
        });

        if (!branch) {
            res.status(404).json({ error: 'Branch not found' });
            return;
        }

        res.json(branch);
    } catch (error) {
        console.error('Get branch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createBranch = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = branchSchema.parse(req.body);

        const branch = await prisma.branch.create({
            data,
        });

        res.status(201).json(branch);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('Create branch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateBranch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const data = branchSchema.partial().parse(req.body);

        const branch = await prisma.branch.update({
            where: { id },
            data,
        });

        res.json(branch);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('Update branch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteBranch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.branch.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        console.error('Delete branch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
