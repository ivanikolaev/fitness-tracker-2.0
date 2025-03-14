import express from 'express';
import {
    getAllWorkouts,
    getWorkoutById,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    completeWorkout,
    reopenWorkout,
} from '../controllers/workoutController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validationMiddleware';
import { createWorkoutSchema, updateWorkoutSchema } from '../utils/validations';

const router = express.Router();

// All workout routes require authentication
router.use(authenticateToken);

// Routes
router.get('/', getAllWorkouts);
router.get('/:id', getWorkoutById);
router.post('/', validateRequest(createWorkoutSchema), createWorkout);
router.patch('/:id', validateRequest(updateWorkoutSchema), updateWorkout);
router.delete('/:id', deleteWorkout);
router.patch('/:id/complete', completeWorkout);
router.patch('/:id/reopen', reopenWorkout);

export default router;
