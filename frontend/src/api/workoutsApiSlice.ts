import { apiSlice } from './apiSlice';
import { User } from '../store/slices/authSlice';

// Define types
export interface Exercise {
    id: string;
    name: string;
    description?: string;
    primaryMuscleGroup: string;
    type: string;
    imageUrl?: string;
    videoUrl?: string;
    instructions?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ExerciseSet {
    id: string;
    workoutExerciseId: string;
    setNumber: number;
    weight?: number;
    reps?: number;
    duration?: number;
    distance?: number;
    isCompleted: boolean;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface WorkoutExercise {
    id: string;
    workoutId: string;
    exerciseId: string;
    exercise: Exercise;
    order: number;
    notes?: string;
    isCompleted: boolean;
    sets: ExerciseSet[];
    createdAt: string;
    updatedAt: string;
}

export interface Workout {
    id: string;
    name: string;
    description?: string;
    scheduledDate: string;
    completedDate?: string;
    isCompleted: boolean;
    duration: number;
    userId: string;
    user?: User;
    workoutExercises: WorkoutExercise[];
    createdAt: string;
    updatedAt: string;
}

// Define response types
interface WorkoutsResponse {
    status: string;
    data: {
        workouts: Workout[];
        total: number;
    };
}

interface WorkoutResponse {
    status: string;
    data: {
        workout: Workout;
    };
}

// Define request types
interface CreateWorkoutRequest {
    name: string;
    description?: string;
    scheduledDate: string;
    workoutExercises?: {
        exerciseId: string;
        order: number;
        notes?: string;
        sets?: {
            setNumber: number;
            weight?: number;
            reps?: number;
            duration?: number;
            distance?: number;
            notes?: string;
        }[];
    }[];
}

interface UpdateWorkoutRequest {
    name?: string;
    description?: string | null;
    scheduledDate?: string;
    completedDate?: string | null;
    isCompleted?: boolean;
    duration?: number;
    workoutExercises?: {
        id?: string;
        exerciseId?: string;
        order?: number;
        notes?: string | null;
        sets?: {
            id?: string;
            setNumber?: number;
            weight?: number | null;
            reps?: number | null;
            duration?: number | null;
            distance?: number | null;
            notes?: string | null;
        }[];
    }[];
}

interface GetWorkoutsRequest {
    page?: number;
    limit?: number;
    isCompleted?: boolean;
    startDate?: string;
    endDate?: string;
}

// Create the workouts API slice
export const workoutsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getWorkouts: builder.query<WorkoutsResponse, GetWorkoutsRequest | void>({
            query: params => ({
                url: '/workouts',
                params: params || undefined,
            }),
            providesTags: result =>
                result
                    ? [
                          ...result.data.workouts.map(({ id }) => ({
                              type: 'Workout' as const,
                              id,
                          })),
                          { type: 'Workout' as const, id: 'LIST' },
                      ]
                    : [{ type: 'Workout' as const, id: 'LIST' }],
        }),
        getWorkout: builder.query<WorkoutResponse, string>({
            query: id => `/workouts/${id}`,
            providesTags: (result, error, id) => [{ type: 'Workout' as const, id }],
        }),
        createWorkout: builder.mutation<WorkoutResponse, CreateWorkoutRequest>({
            query: workout => ({
                url: '/workouts',
                method: 'POST',
                body: workout,
            }),
            invalidatesTags: [{ type: 'Workout', id: 'LIST' }],
        }),
        updateWorkout: builder.mutation<
            WorkoutResponse,
            { id: string; workout: UpdateWorkoutRequest }
        >({
            query: ({ id, workout }) => ({
                url: `/workouts/${id}`,
                method: 'PATCH',
                body: workout,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Workout', id },
                { type: 'Workout', id: 'LIST' },
            ],
        }),
        deleteWorkout: builder.mutation<{ status: string; message: string }, string>({
            query: id => ({
                url: `/workouts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Workout', id },
                { type: 'Workout', id: 'LIST' },
            ],
        }),
        completeWorkout: builder.mutation<WorkoutResponse, string>({
            query: id => ({
                url: `/workouts/${id}/complete`,
                method: 'PATCH',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Workout', id },
                { type: 'Workout', id: 'LIST' },
            ],
        }),
        reopenWorkout: builder.mutation<WorkoutResponse, string>({
            query: id => ({
                url: `/workouts/${id}/reopen`,
                method: 'PATCH',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Workout', id },
                { type: 'Workout', id: 'LIST' },
            ],
        }),
    }),
});

// Export hooks
export const {
    useGetWorkoutsQuery,
    useGetWorkoutQuery,
    useCreateWorkoutMutation,
    useUpdateWorkoutMutation,
    useDeleteWorkoutMutation,
    useCompleteWorkoutMutation,
    useReopenWorkoutMutation,
} = workoutsApiSlice;
