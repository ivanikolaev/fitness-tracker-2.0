import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Exercise } from '../entities/Exercise';
import { ApiError } from '../middlewares/errorHandler';

const exerciseRepository = AppDataSource.getRepository(Exercise);

// Get all exercises with optional filtering
export const getAllExercises = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            muscleGroup, 
            type, 
            search 
        } = req.query;

        // Create query builder
        const queryBuilder = exerciseRepository.createQueryBuilder('exercise')
            .where('exercise.isActive = :isActive', { isActive: true });

        // Apply filters if provided
        if (muscleGroup) {
            queryBuilder.andWhere('exercise.primaryMuscleGroup = :muscleGroup', { muscleGroup });
        }

        if (type) {
            queryBuilder.andWhere('exercise.type = :type', { type });
        }

        if (search) {
            queryBuilder.andWhere(
                '(exercise.name LIKE :search OR exercise.description LIKE :search)',
                { search: `%${search}%` }
            );
        }

        // Get total count for pagination
        const total = await queryBuilder.getCount();

        // Apply pagination
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        // Get paginated results
        const exercises = await queryBuilder
            .orderBy('exercise.name', 'ASC')
            .skip(skip)
            .take(limitNum)
            .getMany();

        // Return response
        res.status(200).json({
            status: 'success',
            data: {
                exercises,
                total,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get a single exercise by ID
export const getExerciseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const exercise = await exerciseRepository.findOneBy({ id });

        if (!exercise) {
            throw new ApiError(404, 'Exercise not found');
        }

        res.status(200).json({
            status: 'success',
            data: {
                exercise,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Create a new exercise
export const createExercise = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            name,
            description,
            primaryMuscleGroup,
            type,
            imageUrl,
            videoUrl,
            instructions,
        } = req.body;

        // Check if exercise with the same name already exists
        const existingExercise = await exerciseRepository.findOneBy({ name });
        if (existingExercise) {
            throw new ApiError(400, 'Exercise with this name already exists');
        }

        // Create new exercise
        const exercise = exerciseRepository.create({
            name,
            description,
            primaryMuscleGroup,
            type,
            imageUrl,
            videoUrl,
            instructions,
            isActive: true,
        });

        // Save exercise to database
        await exerciseRepository.save(exercise);

        res.status(201).json({
            status: 'success',
            data: {
                exercise,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Update an existing exercise
export const updateExercise = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            primaryMuscleGroup,
            type,
            imageUrl,
            videoUrl,
            instructions,
            isActive,
        } = req.body;

        // Find exercise by ID
        const exercise = await exerciseRepository.findOneBy({ id });
        if (!exercise) {
            throw new ApiError(404, 'Exercise not found');
        }

        // Check if name is being changed and if new name already exists
        if (name && name !== exercise.name) {
            const existingExercise = await exerciseRepository.findOneBy({ name });
            if (existingExercise) {
                throw new ApiError(400, 'Exercise with this name already exists');
            }
        }

        // Update exercise properties
        if (name) exercise.name = name;
        if (description !== undefined) exercise.description = description;
        if (primaryMuscleGroup) exercise.primaryMuscleGroup = primaryMuscleGroup;
        if (type) exercise.type = type;
        if (imageUrl !== undefined) exercise.imageUrl = imageUrl;
        if (videoUrl !== undefined) exercise.videoUrl = videoUrl;
        if (instructions !== undefined) exercise.instructions = instructions;
        if (isActive !== undefined) exercise.isActive = isActive;

        // Save updated exercise
        await exerciseRepository.save(exercise);

        res.status(200).json({
            status: 'success',
            data: {
                exercise,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Delete an exercise (soft delete by setting isActive to false)
export const deleteExercise = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Find exercise by ID
        const exercise = await exerciseRepository.findOneBy({ id });
        if (!exercise) {
            throw new ApiError(404, 'Exercise not found');
        }

        // Soft delete by setting isActive to false
        exercise.isActive = false;
        await exerciseRepository.save(exercise);

        res.status(200).json({
            status: 'success',
            message: 'Exercise deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
