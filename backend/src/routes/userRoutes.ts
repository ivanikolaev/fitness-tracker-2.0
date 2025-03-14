import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    changePassword,
} from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validationMiddleware';
import { updateUserSchema, changePasswordSchema } from '../utils/validations';

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);

// Routes
router.get('/profile', getUserProfile);
router.patch('/profile', validateRequest(updateUserSchema), updateUserProfile);
router.post('/change-password', validateRequest(changePasswordSchema), changePassword);

export default router;
