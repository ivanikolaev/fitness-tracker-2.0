import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Workout } from '../entities/Workout';
import { WorkoutExercise } from '../entities/WorkoutExercise';
import { ExerciseSet } from '../entities/ExerciseSet';
import { Exercise } from '../entities/Exercise';
import { ApiError } from '../middlewares/errorHandler';

const workoutRepository = AppDataSource.getRepository(Workout);
const workoutExerciseRepository = AppDataSource.getRepository(WorkoutExercise);
const exerciseSetRepository = AppDataSource.getRepository(ExerciseSet);
const exerciseRepository = AppDataSource.getRepository(Exercise);

// Get all workouts for the current user with optional filtering
export const getAllWorkouts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Authentication required');
        }

        const { 
            page = 1, 
            limit = 10, 
            isCompleted, 
            startDate, 
            endDate 
        } = req.query;

        // Create query builder
        const queryBuilder = workoutRepository.createQueryBuilder('workout')
            .where('workout.userId = :userId', { userId: req.user.id })
            .leftJoinAndSelect('workout.workoutExercises', 'workoutExercises')
            .leftJoinAndSelect('workoutExercises.exercise', 'exercise');

        // Apply filters if provided
        if (isCompleted !== undefined) {
            queryBuilder.andWhere('workout.isCompleted = :isCompleted', { 
                isCompleted: isCompleted === 'true' 
            });
        }

        if (startDate) {
            queryBuilder.andWhere('workout.scheduledDate >= :startDate', { 
                startDate: new Date(startDate as string) 
            });
        }

        if (endDate) {
            queryBuilder.andWhere('workout.scheduledDate <= :endDate', { 
                endDate: new Date(endDate as string) 
            });
        }

        // Get total count for pagination
        const total = await queryBuilder.getCount();

        // Apply pagination
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        // Get paginated results
        const workouts = await queryBuilder
            .orderBy('workout.scheduledDate', 'DESC')
            .skip(skip)
            .take(limitNum)
            .getMany();

        // Return response
        res.status(200).json({
            status: 'success',
            data: {
                workouts,
                total,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get a single workout by ID
export const getWorkoutById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Authentication required');
        }

        const { id } = req.params;

        // Find workout with related entities
        const workout = await workoutRepository.findOne({
            where: { id },
            relations: {
                workoutExercises: {
                    exercise: true,
                    sets: true,
                },
            },
            order: {
                workoutExercises: {
                    order: 'ASC',
                    sets: {
                        setNumber: 'ASC',
                    },
                },
            },
        });

        if (!workout) {
            throw new ApiError(404, 'Workout not found');
        }

        // Check if the workout belongs to the current user
        if (workout.userId !== req.user.id) {
            throw new ApiError(403, 'You do not have permission to access this workout');
        }

        res.status(200).json({
            status: 'success',
            data: {
                workout,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Create a new workout
export const createWorkout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Authentication required');
        }

        const { name, description, scheduledDate, workoutExercises } = req.body;

        // Start a transaction
        await AppDataSource.transaction(async (transactionalEntityManager) => {
            // Create new workout
            const workout = transactionalEntityManager.create(Workout, {
                name,
                description,
                scheduledDate: new Date(scheduledDate),
                isCompleted: false,
                duration: 0,
                userId: req.user!.id,
            });

            // Save workout to database
            const savedWorkout = await transactionalEntityManager.save(workout);

            // Create workout exercises if provided
            if (workoutExercises && workoutExercises.length > 0) {
                for (const we of workoutExercises) {
                    // Check if exercise exists
                    const exercise = await exerciseRepository.findOneBy({ id: we.exerciseId });
                    if (!exercise) {
                        throw new ApiError(404, `Exercise with ID ${we.exerciseId} not found`);
                    }

                    // Create workout exercise
                    const workoutExercise = transactionalEntityManager.create(WorkoutExercise, {
                        workoutId: savedWorkout.id,
                        exerciseId: we.exerciseId,
                        order: we.order,
                        notes: we.notes,
                        isCompleted: false,
                    });

                    // Save workout exercise
                    const savedWorkoutExercise = await transactionalEntityManager.save(workoutExercise);

                    // Create sets if provided
                    if (we.sets && we.sets.length > 0) {
                        const sets = we.sets.map((set: {
                            setNumber: number;
                            weight?: number;
                            reps?: number;
                            duration?: number;
                            distance?: number;
                            notes?: string;
                        }) => 
                            transactionalEntityManager.create(ExerciseSet, {
                                workoutExerciseId: savedWorkoutExercise.id,
                                setNumber: set.setNumber,
                                weight: set.weight,
                                reps: set.reps,
                                duration: set.duration,
                                distance: set.distance,
                                notes: set.notes,
                                isCompleted: false,
                            })
                        );

                        // Save sets
                        await transactionalEntityManager.save(sets);
                    }
                }
            }

            // Get the complete workout with relations
            const completeWorkout = await workoutRepository.findOne({
                where: { id: savedWorkout.id },
                relations: {
                    workoutExercises: {
                        exercise: true,
                        sets: true,
                    },
                },
                order: {
                    workoutExercises: {
                        order: 'ASC',
                        sets: {
                            setNumber: 'ASC',
                        },
                    },
                },
            });

            res.status(201).json({
                status: 'success',
                data: {
                    workout: completeWorkout,
                },
            });
        });
    } catch (error) {
        next(error);
    }
};

// Update an existing workout
export const updateWorkout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Authentication required');
        }

        const { id } = req.params;
        const { 
            name, 
            description, 
            scheduledDate, 
            completedDate, 
            isCompleted, 
            duration,
            workoutExercises 
        } = req.body;

        // Process update workout request

        // Start a transaction
        await AppDataSource.transaction(async (transactionalEntityManager) => {
            // Find workout by ID
            const workout = await workoutRepository.findOneBy({ id });
            if (!workout) {
                throw new ApiError(404, 'Workout not found');
            }

            // Check if the workout belongs to the current user
            if (workout.userId !== req.user!.id) {
                throw new ApiError(403, 'You do not have permission to update this workout');
            }

            // Update workout properties
            if (name) workout.name = name;
            if (description !== undefined) workout.description = description;
            if (scheduledDate) workout.scheduledDate = new Date(scheduledDate);
            if (completedDate) workout.completedDate = new Date(completedDate);
            if (isCompleted !== undefined) workout.isCompleted = isCompleted;
            if (duration !== undefined) workout.duration = duration;

            // Save updated workout
            await transactionalEntityManager.save(workout);

            // Get existing workout exercises
            const existingWorkoutExercises = await workoutExerciseRepository.find({
                where: { workoutId: id },
                relations: { sets: true }
            });

            // Handle workout exercises
            if (workoutExercises) {
                // If workoutExercises is an empty array, delete all existing workout exercises
                if (workoutExercises.length === 0) {
                    for (const we of existingWorkoutExercises) {
                        await transactionalEntityManager.remove(we);
                    }
                } else {
                    // Create a map of existing workout exercises by ID
                    const existingWorkoutExercisesMap = new Map(
                        existingWorkoutExercises.map(we => [we.id, we])
                    );

                    // Process each workout exercise
                    for (const we of workoutExercises) {
                        // Check if exercise exists
                        const exercise = await exerciseRepository.findOneBy({ id: we.exerciseId });
                        if (!exercise) {
                            throw new ApiError(404, `Exercise with ID ${we.exerciseId} not found`);
                        }

                        let workoutExercise;

                        if (we.id && existingWorkoutExercisesMap.has(we.id)) {
                            // Update existing workout exercise
                            workoutExercise = existingWorkoutExercisesMap.get(we.id)!;
                            workoutExercise.exerciseId = we.exerciseId;
                            workoutExercise.order = we.order;
                            workoutExercise.notes = we.notes;
                            
                            // Remove from map to track which ones to delete later
                            existingWorkoutExercisesMap.delete(we.id);
                        } else {
                            // Create new workout exercise
                            workoutExercise = transactionalEntityManager.create(WorkoutExercise, {
                                workoutId: id,
                                exerciseId: we.exerciseId,
                                order: we.order,
                                notes: we.notes,
                                isCompleted: false,
                            });
                        }

                        // Save workout exercise
                        const savedWorkoutExercise = await transactionalEntityManager.save(workoutExercise);

                        // Handle sets if provided
                        if (we.sets && we.sets.length > 0) {
                            // Get existing sets if this is an existing workout exercise
                            const existingSets = workoutExercise.sets || [];
                            
                            // Create a map of existing sets by ID
                            const existingSetsMap = new Map(
                                existingSets.map(set => [set.id, set])
                            );

                            // Process each set
                            for (const setData of we.sets) {
                                let set;

                                if (setData.id && existingSetsMap.has(setData.id)) {
                                    // Update existing set
                                    set = existingSetsMap.get(setData.id)!;
                                    set.setNumber = setData.setNumber;
                                    set.weight = setData.weight;
                                    set.reps = setData.reps;
                                    set.duration = setData.duration;
                                    set.distance = setData.distance;
                                    set.notes = setData.notes;
                                    
                                    // Remove from map to track which ones to delete later
                                    existingSetsMap.delete(setData.id);
                                } else {
                                    // Create new set
                                    set = transactionalEntityManager.create(ExerciseSet, {
                                        workoutExerciseId: savedWorkoutExercise.id,
                                        setNumber: setData.setNumber,
                                        weight: setData.weight,
                                        reps: setData.reps,
                                        duration: setData.duration,
                                        distance: setData.distance,
                                        notes: setData.notes,
                                        isCompleted: false,
                                    });
                                }

                                // Save set
                                await transactionalEntityManager.save(set);
                            }

                            // Delete sets that weren't updated
                            for (const [id, set] of existingSetsMap.entries()) {
                                await transactionalEntityManager.remove(set);
                            }
                        }
                    }

                    // Delete workout exercises that weren't updated
                    for (const [id, workoutExercise] of existingWorkoutExercisesMap.entries()) {
                        await transactionalEntityManager.remove(workoutExercise);
                    }
                }
            }

            // Get the complete workout with relations
            const completeWorkout = await workoutRepository.findOne({
                where: { id },
                relations: {
                    workoutExercises: {
                        exercise: true,
                        sets: true,
                    },
                },
                order: {
                    workoutExercises: {
                        order: 'ASC',
                        sets: {
                            setNumber: 'ASC',
                        },
                    },
                },
            });

            res.status(200).json({
                status: 'success',
                data: {
                    workout: completeWorkout,
                },
            });
        });
    } catch (error) {
        next(error);
    }
};

// Delete a workout
export const deleteWorkout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Authentication required');
        }

        const { id } = req.params;

        // Find workout by ID
        const workout = await workoutRepository.findOneBy({ id });
        if (!workout) {
            throw new ApiError(404, 'Workout not found');
        }

        // Check if the workout belongs to the current user
        if (workout.userId !== req.user.id) {
            throw new ApiError(403, 'You do not have permission to delete this workout');
        }

        // Delete workout (this will cascade delete related workout exercises and sets)
        await workoutRepository.remove(workout);

        res.status(200).json({
            status: 'success',
            message: 'Workout deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// Complete a workout
export const completeWorkout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Authentication required');
        }

        const { id } = req.params;

        // Find workout with related entities
        const workout = await workoutRepository.findOne({
            where: { id },
            relations: {
                workoutExercises: {
                    sets: true,
                },
            },
        });

        if (!workout) {
            throw new ApiError(404, 'Workout not found');
        }

        // Check if the workout belongs to the current user
        if (workout.userId !== req.user.id) {
            throw new ApiError(403, 'You do not have permission to complete this workout');
        }

        // Update workout properties
        workout.isCompleted = true;
        workout.completedDate = new Date();

        // Mark all workout exercises and sets as completed
        for (const workoutExercise of workout.workoutExercises) {
            workoutExercise.isCompleted = true;
            
            for (const set of workoutExercise.sets) {
                set.isCompleted = true;
            }

            // Save sets
            await exerciseSetRepository.save(workoutExercise.sets);
            
            // Save workout exercise
            await workoutExerciseRepository.save(workoutExercise);
        }

        // Save updated workout
        await workoutRepository.save(workout);

        // Get the complete workout with relations
        const completeWorkout = await workoutRepository.findOne({
            where: { id },
            relations: {
                workoutExercises: {
                    exercise: true,
                    sets: true,
                },
            },
            order: {
                workoutExercises: {
                    order: 'ASC',
                    sets: {
                        setNumber: 'ASC',
                    },
                },
            },
        });

        res.status(200).json({
            status: 'success',
            data: {
                workout: completeWorkout,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Reopen a completed workout
export const reopenWorkout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Authentication required');
        }

        const { id } = req.params;

        // Find workout with related entities
        const workout = await workoutRepository.findOne({
            where: { id },
            relations: {
                workoutExercises: {
                    sets: true,
                },
            },
        });

        if (!workout) {
            throw new ApiError(404, 'Workout not found');
        }

        // Check if the workout belongs to the current user
        if (workout.userId !== req.user.id) {
            throw new ApiError(403, 'You do not have permission to reopen this workout');
        }

        // Update workout properties
        workout.isCompleted = false;
        
        // Use a raw query to set completedDate to NULL
        await AppDataSource.createQueryBuilder()
            .update(Workout)
            .set({ isCompleted: false })
            .where("id = :id", { id })
            .execute();
            
        // Execute raw SQL to set completedDate to NULL
        await AppDataSource.query(
            `UPDATE workouts SET completed_date = NULL WHERE id = $1`,
            [id]
        );

        // Mark all workout exercises and sets as not completed
        for (const workoutExercise of workout.workoutExercises) {
            workoutExercise.isCompleted = false;
            
            for (const set of workoutExercise.sets) {
                set.isCompleted = false;
            }

            // Save sets
            await exerciseSetRepository.save(workoutExercise.sets);
            
            // Save workout exercise
            await workoutExerciseRepository.save(workoutExercise);
        }

        // Save updated workout
        await workoutRepository.save(workout);

        // Get the complete workout with relations
        const reopenedWorkout = await workoutRepository.findOne({
            where: { id },
            relations: {
                workoutExercises: {
                    exercise: true,
                    sets: true,
                },
            },
            order: {
                workoutExercises: {
                    order: 'ASC',
                    sets: {
                        setNumber: 'ASC',
                    },
                },
            },
        });

        res.status(200).json({
            status: 'success',
            data: {
                workout: reopenedWorkout,
            },
        });
    } catch (error) {
        next(error);
    }
};
