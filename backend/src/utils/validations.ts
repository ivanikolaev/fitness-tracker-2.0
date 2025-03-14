import { z } from 'zod';
import { UserRole } from '../entities/User';
import { MuscleGroup, ExerciseType } from '../entities/Exercise';

// User validation schemas
export const createUserSchema = z.object({
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(100),
    role: z.nativeEnum(UserRole).optional(),
    profilePicture: z.string().url().optional(),
    height: z.number().positive().optional(),
    weight: z.number().positive().optional(),
    dateOfBirth: z
        .string()
        .datetime()
        .optional()
        .transform(val => (val ? new Date(val) : undefined)),
});

export const updateUserSchema = createUserSchema.partial().omit({ password: true });

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string(),
});

// Exercise validation schemas
export const createExerciseSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().optional(),
    primaryMuscleGroup: z.nativeEnum(MuscleGroup),
    type: z.nativeEnum(ExerciseType),
    imageUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
    instructions: z.string().optional(),
});

export const updateExerciseSchema = createExerciseSchema.partial();

// Workout validation schemas
export const createWorkoutSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().optional(),
    scheduledDate: z
        .string()
        .datetime()
        .transform(val => new Date(val)),
});

export const updateWorkoutSchema = createWorkoutSchema.partial();

// WorkoutExercise validation schemas
export const createWorkoutExerciseSchema = z.object({
    exerciseId: z.string().uuid(),
    order: z.number().int().nonnegative(),
    notes: z.string().optional(),
    sets: z
        .array(
            z.object({
                setNumber: z.number().int().positive(),
                weight: z.number().positive().optional(),
                reps: z.number().int().positive().optional(),
                duration: z.number().int().positive().optional(),
                distance: z.number().positive().optional(),
                notes: z.string().optional(),
            })
        )
        .optional(),
});

export const updateWorkoutExerciseSchema = createWorkoutExerciseSchema.partial();

// ExerciseSet validation schemas
export const createExerciseSetSchema = z.object({
    setNumber: z.number().int().positive(),
    weight: z.number().positive().optional(),
    reps: z.number().int().positive().optional(),
    duration: z.number().int().positive().optional(),
    distance: z.number().positive().optional(),
    isCompleted: z.boolean().optional(),
    notes: z.string().optional(),
});

export const updateExerciseSetSchema = createExerciseSetSchema.partial();
