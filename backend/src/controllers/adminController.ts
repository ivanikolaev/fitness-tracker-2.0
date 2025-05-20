import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entities/User';
import { ApiError } from '../middlewares/errorHandler';
import { MoreThan } from 'typeorm';

const userRepository = AppDataSource.getRepository(User);

// Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userRepository.find({
            order: {
                createdAt: 'DESC',
            },
        });

        // Remove sensitive data
        const usersWithoutSensitiveData = users.map(user => {
            const { password, refreshToken, ...userWithoutSensitiveData } = user;
            return userWithoutSensitiveData;
        });

        res.status(200).json({
            status: 'success',
            results: usersWithoutSensitiveData.length,
            data: {
                users: usersWithoutSensitiveData,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get user by ID (admin only)
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const user = await userRepository.findOneBy({ id });
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Remove sensitive data
        const { password, refreshToken, ...userWithoutSensitiveData } = user;

        res.status(200).json({
            status: 'success',
            data: {
                user: userWithoutSensitiveData,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Update user (admin only)
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const {
            firstName,
            lastName,
            email,
            role,
            isActive,
            profilePicture,
            height,
            weight,
            dateOfBirth,
        } = req.body;

        const user = await userRepository.findOneBy({ id });
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Check if email is being changed and if new email already exists
        if (email && email !== user.email) {
            const existingUser = await userRepository.findOneBy({ email });
            if (existingUser) {
                throw new ApiError(400, 'Email is already in use');
            }
        }

        // Update user properties
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (role && Object.values(UserRole).includes(role as UserRole)) {
            user.role = role as UserRole;
        }
        if (isActive !== undefined) {
            // Convert string 'true'/'false' to boolean if needed
            user.isActive = typeof isActive === 'string'
                ? isActive === 'true'
                : Boolean(isActive);
        }
        if (profilePicture !== undefined) user.profilePicture = profilePicture;
        if (height !== undefined) user.height = height;
        if (weight !== undefined) user.weight = weight;
        if (dateOfBirth) {
            user.dateOfBirth = new Date(dateOfBirth);
        }

        // Save updated user
        await userRepository.save(user);

        // Remove sensitive data
        const { password, refreshToken, ...userWithoutSensitiveData } = user;

        res.status(200).json({
            status: 'success',
            data: {
                user: userWithoutSensitiveData,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Delete user (admin only)
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const user = await userRepository.findOneBy({ id });
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Prevent deleting yourself
        if (req.user && req.user.id === id) {
            throw new ApiError(400, 'You cannot delete your own account');
        }

        // Delete user
        await userRepository.remove(user);

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

// Get dashboard stats (admin only)
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get total users count
        const totalUsers = await userRepository.count();
        
        // Get users by role
        const usersByRole = await userRepository
            .createQueryBuilder('user')
            .select('user.role, COUNT(user.id) as count')
            .groupBy('user.role')
            .getRawMany();
        
        // Get active/inactive users
        const activeUsers = await userRepository.count({ where: { isActive: true } });
        const inactiveUsers = await userRepository.count({ where: { isActive: false } });
        
        // Get new users (registered in the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const newUsers = await userRepository.count({
            where: {
                createdAt: MoreThan(thirtyDaysAgo),
            },
        });

        res.status(200).json({
            status: 'success',
            data: {
                totalUsers,
                usersByRole,
                activeUsers,
                inactiveUsers,
                newUsers,
            },
        });
    } catch (error) {
        next(error);
    }
};