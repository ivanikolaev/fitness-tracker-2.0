import express from 'express';
import * as authController from '../controllers/authController';
import { validateRequest } from '../middlewares/validationMiddleware';
import { authenticateToken } from '../middlewares/authMiddleware';
import { createUserSchema, loginSchema, refreshTokenSchema } from '../utils/validations';

const router = express.Router();

// Public routes
router.post('/register', validateRequest(createUserSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh-token', validateRequest(refreshTokenSchema), authController.refreshToken);

// Protected routes
router.use(authenticateToken);
router.get('/me', authController.getCurrentUser);
router.post('/logout', authController.logout);

export default router;
