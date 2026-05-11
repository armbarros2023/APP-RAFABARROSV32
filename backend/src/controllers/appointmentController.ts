import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { getTherapistScopeOrDeny } from '../utils/accessControl';

const appointmentSchema = z.object({
    branchId: z.string().uuid(),
    therapistId: z.string().uuid().nullable().optional(),
    studentId: z.string().uuid().optional(),
    dateTime: z.string(),
    studentName: z.string().min(2),
    therapistName: z.string().optional(),
    service: z.string().min(2),
    status: z.enum(['SCHEDULED', 'CANCELLED', 'COMPLETED', 'PENDING_ACCEPTANCE']).optional(),
    notes: z.string().optional(),
    cancellationReason: z.string().optional(),
    cancelledBy: z.enum(['student', 'therapist', 'admin']).optional(),
    reminderSent: z.boolean().optional(),
});

export const getAllAppointments = async (req: Request, res: Response): Promise<void> => {
    try {
        const { branchId, therapistId, status } = req.query;
        const scope = await getTherapistScopeOrDeny(req, res);
        if (scope === false) return;

        const where: Record<string, unknown> = {};
        if (branchId) where.branchId = branchId;
        if (therapistId) where.therapistId = therapistId;
        if (status) where.status = status;
        if (scope) {
            where.branchId = scope.branchId;
            where.therapistId = scope.id;
        }

        const query: any = {
            where,
            orderBy: { dateTime: 'asc' },
        };
        if (req.query.limit || req.query.offset) {
            query.take = Math.min(Number(req.query.limit) || 100, 200);
            query.skip = Math.max(Number(req.query.offset) || 0, 0);
        }

        const appointments = await prisma.appointment.findMany(query);

        res.json(appointments);
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAppointmentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const scope = await getTherapistScopeOrDeny(req, res);
        if (scope === false) return;

        const appointment = await prisma.appointment.findUnique({
            where: { id },
        });

        if (!appointment) {
            res.status(404).json({ error: 'Appointment not found' });
            return;
        }
        if (scope && (appointment.branchId !== scope.branchId || appointment.therapistId !== scope.id)) {
            res.status(403).json({ error: 'Access denied' });
            return;
        }

        res.json(appointment);
    } catch (error) {
        console.error('Get appointment error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = appointmentSchema.parse(req.body);
        const scope = await getTherapistScopeOrDeny(req, res);
        if (scope === false) return;

        const appointment = await prisma.appointment.create({
            data: {
                ...data,
                dateTime: new Date(data.dateTime),
                branchId: scope?.branchId ?? data.branchId,
                therapistId: scope?.id ?? data.therapistId ?? null,
            },
        });

        res.status(201).json(appointment);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('Create appointment error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const data = appointmentSchema.partial().parse(req.body);
        const scope = await getTherapistScopeOrDeny(req, res);
        if (scope === false) return;

        if (scope) {
            const existing = await prisma.appointment.findUnique({
                where: { id },
                select: { branchId: true, therapistId: true },
            });
            if (!existing) {
                res.status(404).json({ error: 'Appointment not found' });
                return;
            }
            if (existing.branchId !== scope.branchId || existing.therapistId !== scope.id) {
                res.status(403).json({ error: 'Access denied' });
                return;
            }
        }

        const appointment = await prisma.appointment.update({
            where: { id },
            data: {
                ...data,
                dateTime: data.dateTime ? new Date(data.dateTime) : undefined,
                branchId: scope ? undefined : data.branchId,
                therapistId: scope ? undefined : data.therapistId === undefined ? undefined : data.therapistId,
            },
        });

        res.json(appointment);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('Update appointment error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const scope = await getTherapistScopeOrDeny(req, res);
        if (scope === false) return;

        if (scope) {
            const existing = await prisma.appointment.findUnique({
                where: { id },
                select: { branchId: true, therapistId: true },
            });
            if (!existing) {
                res.status(404).json({ error: 'Appointment not found' });
                return;
            }
            if (existing.branchId !== scope.branchId || existing.therapistId !== scope.id) {
                res.status(403).json({ error: 'Access denied' });
                return;
            }
        }

        await prisma.appointment.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        console.error('Delete appointment error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
