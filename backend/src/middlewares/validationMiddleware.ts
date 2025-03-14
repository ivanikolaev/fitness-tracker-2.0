import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from './errorHandler';

// Middleware to validate request body against a Zod schema
export const validateRequest = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate request body against schema
            const validatedData = await schema.parseAsync(req.body);

            // Replace request body with validated data
            req.body = validatedData;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Format Zod validation errors
                const formattedErrors = error.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message,
                }));

                next(new ApiError(400, 'Validation error', formattedErrors));
            } else {
                next(error);
            }
        }
    };
};
