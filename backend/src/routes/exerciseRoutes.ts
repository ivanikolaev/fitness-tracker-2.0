import express from 'express';
import {
    getAllExercises,
    getExerciseById,
    createExercise,
    updateExercise,
    deleteExercise,
} from '../controllers/exerciseController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validationMiddleware';
import { createExerciseSchema, updateExerciseSchema } from '../utils/validations';

const router = express.Router();

// Public routes
router.get('/', getAllExercises);
router.get('/:id', getExerciseById);

// Protected routes (require authentication)
router.post('/', authenticateToken, validateRequest(createExerciseSchema), createExercise);
router.patch('/:id', authenticateToken, validateRequest(updateExerciseSchema), updateExercise);
router.delete('/:id', authenticateToken, deleteExercise);

export default router;
