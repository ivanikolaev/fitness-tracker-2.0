import { apiSlice } from './apiSlice';
import { Exercise } from './workoutsApiSlice';

// Define response types
interface ExercisesResponse {
    status: string;
    data: {
        exercises: Exercise[];
        total: number;
    };
}

interface ExerciseResponse {
    status: string;
    data: {
        exercise: Exercise;
    };
}

// Define request types
interface CreateExerciseRequest {
    name: string;
    description?: string;
    primaryMuscleGroup: string;
    type: string;
    imageUrl?: string;
    videoUrl?: string;
    instructions?: string;
}

interface UpdateExerciseRequest {
    name?: string;
    description?: string;
    primaryMuscleGroup?: string;
    type?: string;
    imageUrl?: string;
    videoUrl?: string;
    instructions?: string;
    isActive?: boolean;
}

interface GetExercisesRequest {
    page?: number;
    limit?: number;
    muscleGroup?: string;
    type?: string;
    search?: string;
}

// Create the exercises API slice
export const exercisesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getExercises: builder.query<ExercisesResponse, GetExercisesRequest | void>({
            query: params => ({
                url: '/exercises',
                params: params || undefined,
            }),
            providesTags: result =>
                result
                    ? [
                          ...result.data.exercises.map(({ id }) => ({
                              type: 'Exercise' as const,
                              id,
                          })),
                          { type: 'Exercise' as const, id: 'LIST' },
                      ]
                    : [{ type: 'Exercise' as const, id: 'LIST' }],
        }),
        getExercise: builder.query<ExerciseResponse, string>({
            query: id => `/exercises/${id}`,
            providesTags: (result, error, id) => [{ type: 'Exercise' as const, id }],
        }),
        createExercise: builder.mutation<ExerciseResponse, CreateExerciseRequest>({
            query: exercise => ({
                url: '/exercises',
                method: 'POST',
                body: exercise,
            }),
            invalidatesTags: [{ type: 'Exercise', id: 'LIST' }],
        }),
        updateExercise: builder.mutation<
            ExerciseResponse,
            { id: string; exercise: UpdateExerciseRequest }
        >({
            query: ({ id, exercise }) => ({
                url: `/exercises/${id}`,
                method: 'PATCH',
                body: exercise,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Exercise', id },
                { type: 'Exercise', id: 'LIST' },
            ],
        }),
        deleteExercise: builder.mutation<{ status: string; message: string }, string>({
            query: id => ({
                url: `/exercises/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Exercise', id },
                { type: 'Exercise', id: 'LIST' },
            ],
        }),
    }),
});

// Export hooks
export const {
    useGetExercisesQuery,
    useGetExerciseQuery,
    useCreateExerciseMutation,
    useUpdateExerciseMutation,
    useDeleteExerciseMutation,
} = exercisesApiSlice;
