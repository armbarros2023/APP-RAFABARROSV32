import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';

const staffSchema = z.object({
    branchId: z.string().uuid(),
    name: z.string().min(2),
    role: z.string(),
    email: z.string().email(),
    secondaryEmail: z.string().email().optional(),
    phone: z.string().optional(),
    status: z.enum(['ACTIVE', 'ON_VACATION', 'INACTIVE']).optional(),
    avatarUrl: z.string().url().optional(),
    specialty: z.string().optional(),
    bankInfo: z.string().optional(),
    contractUrl: z.string().url().optional(),
    admissionDate: z.string().optional(),
    terminationDate: z.string().optional(),
});

export const getAllStaff = async (req: Request, res: Response): Promise<void> => {
    try {
        const { branchId, status } = req.query;

        const where: any = {};
        if (branchId) where.branchId = branchId;
        if (status) where.status = status;

        const staff = await prisma.staffMember.findMany({
            where,
            include: {
                branch: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        students: true,
                        appointments: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(staff);
    } catch (error) {
        console.error('Get staff error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getStaffById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const staff = await prisma.staffMember.findUnique({
            where: { id },
            include: {
                branch: true,
                students: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                    },
                },
                appointments: {
                    where: {
                        dateTime: {
                            gte: new Date(),
                        },
                    },
                    orderBy: { dateTime: 'asc' },
                    take: 10,
                },
                payments: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });

        if (!staff) {
            res.status(404).json({ error: 'Staff member not found' });
            return;
        }

        res.json(staff);
    } catch (error) {
        console.error('Get staff member error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createStaff = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = staffSchema.parse(req.body);

        // Convert dates if provided
        const staffData: any = { ...data };
        if (data.admissionDate) {
            staffData.admissionDate = new Date(data.admissionDate);
        }
        if (data.terminationDate) {
            staffData.terminationDate = new Date(data.terminationDate);
        }

        const staff = await prisma.staffMember.create({
            data: staffData,
            include: {
                branch: true,
            },
        });

        res.status(201).json(staff);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('Create staff error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateStaff = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const data = staffSchema.partial().parse(req.body);

        // Convert dates if provided
        const staffData: any = { ...data };
        if (data.admissionDate) {
            staffData.admissionDate = new Date(data.admissionDate);
        }
        if (data.terminationDate) {
            staffData.terminationDate = new Date(data.terminationDate);
        }

        const staff = await prisma.staffMember.update({
            where: { id },
            data: staffData,
            include: {
                branch: true,
            },
        });

        res.json(staff);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('Update staff error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteStaff = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.staffMember.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        console.error('Delete staff error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
