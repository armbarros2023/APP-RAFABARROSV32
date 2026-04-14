import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';

const financialTransactionSchema = z.object({
    branchId: z.string().uuid(),
    studentId: z.string().uuid().optional(),
    date: z.string(),
    description: z.string().min(2),
    amount: z.number().positive(),
    taxPercentage: z.number().min(0).max(100).optional(),
    type: z.enum(['REVENUE', 'EXPENSE']),
    category: z.enum([
        'RECEITA_ATENDIMENTO',
        'RECEITA_CURSO',
        'RECEITA_KIT',
        'CUSTO_FIXO',
        'CUSTO_VARIAVEL',
        'INVESTIMENTO',
        'CAPITAL_GIRO',
    ]),
    status: z.enum(['PAID', 'PENDING']).optional(),
    nfeNumber: z.string().optional(),
    dueDate: z.string().optional(),
});

export const getAllFinancialTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { branchId, type, status } = req.query;

        const where: Record<string, unknown> = {};
        if (branchId) where.branchId = branchId;
        if (type) where.type = type;
        if (status) where.status = status;

        const transactions = await prisma.financialTransaction.findMany({
            where,
            orderBy: { date: 'desc' },
        });

        res.json(transactions);
    } catch (error) {
        console.error('Get financial transactions error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getFinancialTransactionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const transaction = await prisma.financialTransaction.findUnique({
            where: { id },
        });

        if (!transaction) {
            res.status(404).json({ error: 'Financial transaction not found' });
            return;
        }

        res.json(transaction);
    } catch (error) {
        console.error('Get financial transaction error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createFinancialTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = financialTransactionSchema.parse(req.body);

        const transaction = await prisma.financialTransaction.create({
            data: {
                ...data,
                date: new Date(data.date),
                dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
            },
        });

        res.status(201).json(transaction);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('Create financial transaction error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateFinancialTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const data = financialTransactionSchema.partial().parse(req.body);

        const transaction = await prisma.financialTransaction.update({
            where: { id },
            data: {
                ...data,
                date: data.date ? new Date(data.date) : undefined,
                dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
            },
        });

        res.json(transaction);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('Update financial transaction error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteFinancialTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.financialTransaction.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        console.error('Delete financial transaction error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
