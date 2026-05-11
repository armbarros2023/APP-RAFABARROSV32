import { Request, Response } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { getTherapistScopeOrDeny } from '../utils/accessControl';

const studentSchema = z.object({
    branchId: z.string().uuid(),
    therapistId: z.string().uuid(),
    name: z.string().min(2),
    avatarUrl: z.string().url().optional(),
    dateOfBirth: z.string().optional(),
    guardianName: z.string().optional(),
    guardianPhone: z.string().optional(),
    guardianEmail: z.string().email().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    rg: z.string().optional(),
    cpf: z.string().optional(),
    address: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    sessionsPerMonth: z.number().int().positive().optional(),
    monthlyValue: z.number().positive().optional(),
    paymentMethod: z.enum(['PIX', 'DEBITO', 'CREDITO_RECORRENTE', 'FIDELIDADE_TRIMESTRAL', 'FIDELIDADE_SEMESTRAL', 'FIDELIDADE_ANUAL']).optional(),
    taxPercentage: z.number().min(0).max(100).optional(),
    planObservations: z.string().optional(),
    wantsMonthlyNFe: z.boolean().optional(),
});

export const getAllStudents = async (req: Request, res: Response): Promise<void> => {
    try {
        const { branchId, therapistId, status } = req.query;
        const scope = await getTherapistScopeOrDeny(req, res);
        if (scope === false) return;

        const where: Prisma.StudentWhereInput = {};
        if (typeof branchId === 'string') where.branchId = branchId;
        if (typeof therapistId === 'string') where.therapistId = therapistId;
        if (typeof status === 'string') where.status = status as any;
        if (scope) {
            where.branchId = scope.branchId;
            where.therapistId = scope.id;
        }

        const query: any = {
            where,
            include: {
                branch: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                therapist: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        };
        if (req.query.limit || req.query.offset) {
            query.take = Math.min(Number(req.query.limit) || 100, 200);
            query.skip = Math.max(Number(req.query.offset) || 0, 0);
        }

        const students = await prisma.student.findMany(query);

        res.json(students);
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getStudentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const scope = await getTherapistScopeOrDeny(req, res);
        if (scope === false) return;

        const student = await prisma.student.findUnique({
            where: { id },
            include: {
                branch: true,
                therapist: true,
                appointments: {
                    orderBy: { dateTime: 'desc' },
                    take: 10,
                },
                invoices: {
                    orderBy: { issueDate: 'desc' },
                    take: 10,
                },
                activityLogs: {
                    orderBy: { date: 'desc' },
                    take: 20,
                },
                media: {
                    orderBy: { uploadDate: 'desc' },
                    take: 10,
                },
            },
        });

        if (!student) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }
        if (scope && (student.branchId !== scope.branchId || student.therapistId !== scope.id)) {
            res.status(403).json({ error: 'Access denied' });
            return;
        }

        res.json(student);
    } catch (error) {
        console.error('Get student error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createStudent = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = studentSchema.parse(req.body);
        const scope = await getTherapistScopeOrDeny(req, res);
        if (scope === false) return;

        // Convert dateOfBirth string to Date if provided
        const studentData: any = { ...data };
        if (scope) {
            studentData.branchId = scope.branchId;
            studentData.therapistId = scope.id;
        }
        if (data.dateOfBirth) {
            studentData.dateOfBirth = new Date(data.dateOfBirth);
        }

        const student = await prisma.student.create({
            data: studentData,
            include: {
                branch: true,
                therapist: true,
            },
        });

        res.status(201).json(student);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('Create student error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateStudent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const data = studentSchema.partial().parse(req.body);
        const scope = await getTherapistScopeOrDeny(req, res);
        if (scope === false) return;

        if (scope) {
            const existing = await prisma.student.findUnique({
                where: { id },
                select: { branchId: true, therapistId: true },
            });
            if (!existing) {
                res.status(404).json({ error: 'Student not found' });
                return;
            }
            if (existing.branchId !== scope.branchId || existing.therapistId !== scope.id) {
                res.status(403).json({ error: 'Access denied' });
                return;
            }
        }

        // Convert dateOfBirth string to Date if provided
        const studentData: any = { ...data };
        if (scope) {
            delete studentData.branchId;
            delete studentData.therapistId;
        }
        if (data.dateOfBirth) {
            studentData.dateOfBirth = new Date(data.dateOfBirth);
        }

        const student = await prisma.student.update({
            where: { id },
            data: studentData,
            include: {
                branch: true,
                therapist: true,
            },
        });

        res.json(student);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('Update student error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const scope = await getTherapistScopeOrDeny(req, res);
        if (scope === false) return;

        if (scope) {
            const existing = await prisma.student.findUnique({
                where: { id },
                select: { branchId: true, therapistId: true },
            });
            if (!existing) {
                res.status(404).json({ error: 'Student not found' });
                return;
            }
            if (existing.branchId !== scope.branchId || existing.therapistId !== scope.id) {
                res.status(403).json({ error: 'Access denied' });
                return;
            }
        }

        await prisma.student.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
