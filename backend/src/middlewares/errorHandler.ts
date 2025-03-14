import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { EntityNotFoundError } from 'typeorm';

// Custom error class for API errors
export class ApiError extends Error {
    statusCode: number;
    errors?: any[];

    constructor(statusCode: number, message: string, errors?: any[]) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
        this.errors = errors;
    }
}

// Error handler middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);

    // Handle Zod validation errors
    if (err instanceof ZodError) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation error',
            errors: err.errors,
        });
    }

    // Handle TypeORM entity not found errors
    if (err instanceof EntityNotFoundError) {
        return res.status(404).json({
            status: 'error',
            message: 'Resource not found',
        });
    }

    // Handle custom API errors
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            errors: err.errors,
        });
    }

    // Handle other errors
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
};
