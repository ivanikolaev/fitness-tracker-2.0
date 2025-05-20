import express from 'express';
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getDashboardStats,
} from '../controllers/adminController';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validationMiddleware';
import { updateUserSchema } from '../utils/validations';
import { UserRole } from '../entities/User';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRoles(UserRole.ADMIN));

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id', validateRequest(updateUserSchema), updateUser);
router.delete('/users/:id', deleteUser);

// Dashboard stats
router.get('/dashboard-stats', getDashboardStats);

export default router;