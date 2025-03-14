import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { ApiError } from '../middlewares/errorHandler';

const userRepository = AppDataSource.getRepository(User);

// Get user profile
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Authentication required');
        }

        // Get user from database (to ensure we have the latest data)
        const user = await userRepository.findOneBy({ id: req.user.id });
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

// Update user profile
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Authentication required');
        }

        const {
            firstName,
            lastName,
            email,
            profilePicture,
            height,
            weight,
            dateOfBirth,
        } = req.body;

        // Get user from database
        const user = await userRepository.findOneBy({ id: req.user.id });
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

// Change password
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Authentication required');
        }

        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Check if new password and confirmation match
        if (newPassword !== confirmPassword) {
            throw new ApiError(400, 'New password and confirmation do not match');
        }

        // Get user with password from database
        const user = await userRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id: req.user.id })
            .addSelect('user.password')
            .getOne();

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Check if current password is correct
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Current password is incorrect');
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await userRepository.save(user);

        res.status(200).json({
            status: 'success',
            message: 'Password changed successfully',
        });
    } catch (error) {
        next(error);
    }
};
