import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetExercisesQuery } from '../../api/exercisesApiSlice';
import { 
    useGetWorkoutQuery, 
    useUpdateWorkoutMutation,
    WorkoutExercise 
} from '../../api/workoutsApiSlice';
import './CreateWorkoutPage.css'; // Reuse the same CSS

// Define validation schema
const workoutSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be at most 100 characters'),
    description: z.string().optional(),
    scheduledDate: z.string().min(1, 'Date is required'),
    workoutExercises: z
        .array(
            z.object({
                id: z.string().optional(), // Existing workout exercise ID
                exerciseId: z.string().min(1, 'Exercise is required'),
                order: z.number(),
                notes: z.string().optional(),
                sets: z
                    .array(
                        z.object({
                            id: z.string().optional(), // Existing set ID
                            setNumber: z.number(),
                            weight: z.number().optional().nullable(),
                            reps: z.number().optional().nullable(),
                            duration: z.number().optional().nullable(),
                            distance: z.number().optional().nullable(),
                            notes: z.string().optional().nullable(),
                        })
                    )
                    .optional(),
            })
        )
        .optional(),
});

type WorkoutFormData = z.infer<typeof workoutSchema>;

const EditWorkoutPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [selectedExerciseType, setSelectedExerciseType] = useState<string>('');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState(false);

    // Fetch workout data
    const { 
        data: workoutData, 
        isLoading: isLoadingWorkout, 
        isError: isWorkoutError 
    } = useGetWorkoutQuery(id || '');

    // Fetch exercises
    const { data: exercisesData, isLoading: isLoadingExercises } = useGetExercisesQuery({
        type: selectedExerciseType || undefined,
        muscleGroup: selectedMuscleGroup || undefined,
    });

    // Update workout mutation
    const [updateWorkout, { isLoading: isUpdating }] = useUpdateWorkoutMutation();

    // Form setup
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset,
    } = useForm<WorkoutFormData>({
        resolver: zodResolver(workoutSchema),
        defaultValues: {
            name: '',
            description: '',
            scheduledDate: new Date().toISOString().split('T')[0],
            workoutExercises: [],
        },
    });

    // Field array for workout exercises
    const {
        fields: exerciseFields,
        append: appendExercise,
        remove: removeExercise,
        replace: replaceExercises,
    } = useFieldArray({
        control,
        name: 'workoutExercises',
    });

    // Load workout data into form when available
    useEffect(() => {
        if (workoutData && !isLoaded) {
            const workout = workoutData.data.workout;
            
            // Format date to YYYY-MM-DD
            const formattedDate = new Date(workout.scheduledDate)
                .toISOString()
                .split('T')[0];
            
            // Prepare workout exercises data
            const formattedExercises = workout.workoutExercises.map((we: WorkoutExercise) => ({
                id: we.id,
                exerciseId: we.exerciseId,
                order: we.order,
                notes: we.notes || '',
                sets: we.sets.map(set => ({
                    id: set.id,
                    setNumber: set.setNumber,
                    weight: set.weight,
                    reps: set.reps,
                    duration: set.duration,
                    distance: set.distance,
                    notes: set.notes || '',
                })),
            }));
            
            // Reset form with workout data
            reset({
                name: workout.name,
                description: workout.description || '',
                scheduledDate: formattedDate,
                workoutExercises: formattedExercises,
            });
            
            setIsLoaded(true);
        }
    }, [workoutData, reset, isLoaded]);

    // Handle form submission
    const onSubmit = async (data: WorkoutFormData) => {
        if (!id) return;
        
        try {
            // Format workout exercises
            const formattedData = {
                ...data,
                // Ensure workoutExercises is always an array, even if empty
                workoutExercises: data.workoutExercises?.length 
                    ? data.workoutExercises.map((exercise, index) => ({
                        ...exercise,
                        order: index,
                        sets: exercise.sets?.map((set, setIndex) => ({
                            ...set,
                            setNumber: setIndex + 1,
                        })),
                    }))
                    : [] // Explicitly send an empty array if no exercises
            };

            console.log('Submitting workout data:', formattedData);
            
            // Add a delay to ensure the console log is visible
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const result = await updateWorkout({ 
                id, 
                workout: formattedData 
            }).unwrap();
            
            console.log('Update workout result:', result);
            
            // Add a delay before navigation
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            navigate(`/workouts/${id}`);
        } catch (err) {
            console.error('Failed to update workout:', err);
            // Display the error in the console
            if (err instanceof Error) {
                console.error('Error details:', err.message);
            } else {
                console.error('Unknown error:', err);
            }
        }
    };

    // Add exercise to workout
    const handleAddExercise = (exerciseId: string, exerciseName: string) => {
        appendExercise({
            exerciseId,
            order: exerciseFields.length,
            notes: '',
            sets: [
                {
                    setNumber: 1,
                    weight: undefined,
                    reps: undefined,
                    duration: undefined,
                    distance: undefined,
                    notes: '',
                },
            ],
        });
    };

    // Add set to exercise
    const handleAddSet = (exerciseIndex: number, currentSets: any[] = []) => {
        const updatedSets = [
            ...currentSets,
            {
                setNumber: currentSets.length + 1,
                weight: undefined,
                reps: undefined,
                duration: undefined,
                distance: undefined,
                notes: '',
            },
        ];

        return updatedSets;
    };

    // Filter options
    const exerciseTypes = ['strength', 'cardio', 'flexibility', 'balance'];
    const muscleGroups = [
        'chest',
        'back',
        'shoulders',
        'arms',
        'legs',
        'core',
        'full_body',
        'cardio',
    ];

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Show loading state
    if (isLoadingWorkout) {
        return <div className="loading-state">Loading workout data...</div>;
    }

    // Show error state
    if (isWorkoutError) {
        return (
            <div className="error-state">
                <p>Error loading workout data.</p>
                <Link to="/workouts" className="back-link">
                    Back to Workouts
                </Link>
            </div>
        );
    }

    return (
        <div className="create-workout-page">
            <header className="create-workout-header">
                <Link to={`/workouts/${id}`} className="back-link">
                    ← Back to Workout
                </Link>
                <h1>Edit Workout</h1>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="create-workout-form">
                <div className="form-grid">
                    <div className="workout-details-section">
                        <h2>Workout Details</h2>

                        <div className="form-group">
                            <label htmlFor="name">Workout Name</label>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        id="name"
                                        type="text"
                                        placeholder="e.g., Full Body Workout"
                                        className={errors.name ? 'error' : ''}
                                    />
                                )}
                            />
                            {errors.name && <p className="error-message">{errors.name.message}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description (Optional)</label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        id="description"
                                        placeholder="Describe your workout..."
                                        rows={4}
                                    />
                                )}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="scheduledDate">Scheduled Date</label>
                            <Controller
                                name="scheduledDate"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        id="scheduledDate"
                                        type="date"
                                        className={errors.scheduledDate ? 'error' : ''}
                                    />
                                )}
                            />
                            {errors.scheduledDate && (
                                <p className="error-message">{errors.scheduledDate.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="exercises-section">
                        <h2>Add More Exercises</h2>

                        <div className="exercise-selector">
                            <div className="filter-controls">
                                <div className="filter-group">
                                    <label htmlFor="exerciseType">Exercise Type</label>
                                    <select
                                        id="exerciseType"
                                        value={selectedExerciseType}
                                        onChange={e => setSelectedExerciseType(e.target.value)}
                                    >
                                        <option value="">All Types</option>
                                        {exerciseTypes.map(type => (
                                            <option key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="filter-group">
                                    <label htmlFor="muscleGroup">Muscle Group</label>
                                    <select
                                        id="muscleGroup"
                                        value={selectedMuscleGroup}
                                        onChange={e => setSelectedMuscleGroup(e.target.value)}
                                    >
                                        <option value="">All Muscle Groups</option>
                                        {muscleGroups.map(group => (
                                            <option key={group} value={group}>
                                                {group
                                                    .split('_')
                                                    .map(
                                                        word =>
                                                            word.charAt(0).toUpperCase() +
                                                            word.slice(1)
                                                    )
                                                    .join(' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="exercise-list">
                                {isLoadingExercises ? (
                                    <div className="loading-state">Loading exercises...</div>
                                ) : exercisesData?.data.exercises.length === 0 ? (
                                    <div className="empty-state">No exercises found.</div>
                                ) : (
                                    exercisesData?.data.exercises.map(exercise => (
                                        <div className="exercise-item" key={exercise.id}>
                                            <div className="exercise-info">
                                                <h3>{exercise.name}</h3>
                                                <div className="exercise-meta">
                                                    <span className="muscle-group">
                                                        {exercise.primaryMuscleGroup}
                                                    </span>
                                                    <span className="exercise-type">
                                                        {exercise.type}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="add-exercise-btn"
                                                onClick={() =>
                                                    handleAddExercise(exercise.id, exercise.name)
                                                }
                                            >
                                                Add
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {exerciseFields.length > 0 && (
                    <div className="selected-exercises-section">
                        <h2>Selected Exercises</h2>

                        {exerciseFields.map((field, index) => {
                            const exerciseId = watch(`workoutExercises.${index}.exerciseId`);
                            const exercise = exercisesData?.data.exercises.find(
                                e => e.id === exerciseId
                            );
                            const sets = watch(`workoutExercises.${index}.sets`) || [];

                            return (
                                <div className="selected-exercise" key={field.id}>
                                    <div className="selected-exercise-header">
                                        <h3>{exercise?.name || 'Exercise'}</h3>
                                        <button
                                            type="button"
                                            className="remove-exercise-btn"
                                            onClick={() => removeExercise(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor={`workoutExercises.${index}.notes`}>
                                            Notes (Optional)
                                        </label>
                                        <Controller
                                            name={`workoutExercises.${index}.notes`}
                                            control={control}
                                            render={({ field }) => (
                                                <textarea
                                                    {...field}
                                                    id={`workoutExercises.${index}.notes`}
                                                    placeholder="Add notes for this exercise..."
                                                    rows={2}
                                                />
                                            )}
                                        />
                                    </div>

                                    <div className="sets-section">
                                        <div className="sets-header">
                                            <h4>Sets</h4>
                                            <button
                                                type="button"
                                                className="add-set-btn"
                                                onClick={() => {
                                                    const updatedSets = handleAddSet(index, sets);
                                                    // Use the setValue method from react-hook-form to update the form state
                                                    setValue(`workoutExercises.${index}.sets`, updatedSets);
                                                }}
                                            >
                                                Add Set
                                            </button>
                                        </div>

                                        {sets.length > 0 ? (
                                            <div className="sets-table-container">
                                                <table className="sets-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Set</th>
                                                            <th>Weight (kg)</th>
                                                            <th>Reps</th>
                                                            <th>Duration (sec)</th>
                                                            <th>Distance (km)</th>
                                                            <th>Notes</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sets.map((set, setIndex) => (
                                                            <tr key={setIndex}>
                                                                <td>{setIndex + 1}</td>
                                                                <td>
                                                                    <Controller
                                                                        name={`workoutExercises.${index}.sets.${setIndex}.weight`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <input
                                                                                {...field}
                                                                                type="number"
                                                                                step="0.1"
                                                                                min="0"
                                                                                placeholder="0"
                                                                                onChange={e =>
                                                                                    field.onChange(
                                                                                        e.target
                                                                                            .value
                                                                                            ? parseFloat(
                                                                                                  e
                                                                                                      .target
                                                                                                      .value
                                                                                              )
                                                                                            : undefined
                                                                                    )
                                                                                }
                                                                                value={field.value || ''}
                                                                            />
                                                                        )}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <Controller
                                                                        name={`workoutExercises.${index}.sets.${setIndex}.reps`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <input
                                                                                {...field}
                                                                                type="number"
                                                                                min="0"
                                                                                placeholder="0"
                                                                                onChange={e =>
                                                                                    field.onChange(
                                                                                        e.target
                                                                                            .value
                                                                                            ? parseInt(
                                                                                                  e
                                                                                                      .target
                                                                                                      .value
                                                                                              )
                                                                                            : undefined
                                                                                    )
                                                                                }
                                                                                value={field.value || ''}
                                                                            />
                                                                        )}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <Controller
                                                                        name={`workoutExercises.${index}.sets.${setIndex}.duration`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <input
                                                                                {...field}
                                                                                type="number"
                                                                                min="0"
                                                                                placeholder="0"
                                                                                onChange={e =>
                                                                                    field.onChange(
                                                                                        e.target
                                                                                            .value
                                                                                            ? parseInt(
                                                                                                  e
                                                                                                      .target
                                                                                                      .value
                                                                                              )
                                                                                            : undefined
                                                                                    )
                                                                                }
                                                                                value={field.value || ''}
                                                                            />
                                                                        )}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <Controller
                                                                        name={`workoutExercises.${index}.sets.${setIndex}.distance`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <input
                                                                                {...field}
                                                                                type="number"
                                                                                step="0.01"
                                                                                min="0"
                                                                                placeholder="0"
                                                                                onChange={e =>
                                                                                    field.onChange(
                                                                                        e.target
                                                                                            .value
                                                                                            ? parseFloat(
                                                                                                  e
                                                                                                      .target
                                                                                                      .value
                                                                                              )
                                                                                            : undefined
                                                                                    )
                                                                                }
                                                                                value={field.value || ''}
                                                                            />
                                                                        )}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <Controller
                                                                        name={`workoutExercises.${index}.sets.${setIndex}.notes`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <input
                                                                                {...field}
                                                                                type="text"
                                                                                placeholder="Notes"
                                                                                value={field.value || ''}
                                                                            />
                                                                        )}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        type="button"
                                                                        className="remove-set-btn"
                                                                        onClick={() => {
                                                                            const updatedSets = [
                                                                                ...sets,
                                                                            ];
                                                                            updatedSets.splice(
                                                                                setIndex,
                                                                                1
                                                                            );
                                                                            // Use the setValue method to update the form state
                                                                            setValue(
                                                                                `workoutExercises.${index}.sets`,
                                                                                updatedSets.map((s, i) => ({
                                                                                    ...s,
                                                                                    setNumber: i + 1,
                                                                                }))
                                                                            );
                                                                        }}
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p className="empty-sets">No sets added yet.</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="form-actions">
                    <Link to={`/workouts/${id}`} className="cancel-btn">
                        Cancel
                    </Link>
                    <button type="submit" className="submit-btn" disabled={isUpdating}>
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditWorkoutPage;
