import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { ApiError } from '../middlewares/errorHandler';

// Register a new user
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await authService.register(req.body);

        res.status(201).json({
            status: 'success',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

// Login user
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await authService.login(email, password);

        // Set refresh token in HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            status: 'success',
            data: {
                user,
                accessToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Refresh access token
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new ApiError(400, 'Refresh token is required');
        }

        const tokens = await authService.refreshAccessToken(refreshToken);

        // Set new refresh token in HTTP-only cookie
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            status: 'success',
            data: {
                accessToken: tokens.accessToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Logout user
export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Authentication required');
        }

        await authService.logout(req.user.id);

        // Clear refresh token cookie
        res.clearCookie('refreshToken');

        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully',
        });
    } catch (error) {
        next(error);
    }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Authentication required');
        }

        res.status(200).json({
            status: 'success',
            data: {
                user: req.user,
            },
        });
    } catch (error) {
        next(error);
    }
};
