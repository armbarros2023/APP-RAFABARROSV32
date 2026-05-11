import { Request, Response } from 'express';
import prisma from '../config/database';

export interface TherapistScope {
    id: string;
    branchId: string;
}

export const isAdminRequest = (req: Request): boolean => req.user?.role === 'ADMIN';

export const getTherapistScopeOrDeny = async (
    req: Request,
    res: Response
): Promise<TherapistScope | null | false> => {
    if (!req.user || isAdminRequest(req)) return null;

    const staff = await prisma.staffMember.findUnique({
        where: { email: req.user.email },
        select: { id: true, branchId: true },
    });

    if (!staff) {
        res.status(403).json({ error: 'Therapist profile not linked to this user' });
        return false;
    }

    return staff;
};
