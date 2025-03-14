import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entities/User';
import { ApiError } from './errorHandler';

// Extend Express Request interface to include user property
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

// Verify JWT token
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            throw new ApiError(401, 'Authentication token is required');
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new ApiError(500, 'JWT secret is not configured');
        }

        const decoded = jwt.verify(token, jwtSecret) as { id: string };
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: decoded.id });

        if (!user) {
            throw new ApiError(401, 'Invalid token - user not found');
        }

        if (!user.isActive) {
            throw new ApiError(403, 'User account is deactivated');
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new ApiError(401, 'Invalid or expired token'));
        } else {
            next(error);
        }
    }
};

// Check if user has required role
export const authorizeRoles = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new ApiError(401, 'Authentication required'));
        }

        if (!roles.includes(req.user.role)) {
            return next(new ApiError(403, 'You do not have permission to perform this action'));
        }

        next();
    };
};

// Check if user is accessing their own resource or has admin role
export const authorizeOwnerOrAdmin = (getUserIdFromParams: (req: Request) => string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new ApiError(401, 'Authentication required'));
        }

        const resourceUserId = getUserIdFromParams(req);

        if (req.user.id !== resourceUserId && req.user.role !== UserRole.ADMIN) {
            return next(new ApiError(403, 'You do not have permission to access this resource'));
        }

        next();
    };
};
