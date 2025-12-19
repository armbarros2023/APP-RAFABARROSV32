import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }

        const [, token] = authHeader.split(' ');

        if (!token) {
            res.status(401).json({ error: 'Invalid token format' });
            return;
        }

        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export const adminOnly = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (req.user?.role !== 'ADMIN') {
        res.status(403).json({ error: 'Admin access required' });
        return;
    }
    next();
};
