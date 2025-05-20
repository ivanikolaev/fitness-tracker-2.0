import { apiSlice } from './apiSlice';
import { User } from '../types';

// Define the dashboard stats interface
export interface DashboardStats {
    totalUsers: number;
    usersByRole: { role: string; count: string }[];
    activeUsers: number;
    inactiveUsers: number;
    newUsers: number;
}

// Define the admin API slice
export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get all users
        getAllUsers: builder.query<{ status: string; results: number; data: { users: User[] } }, void>({
            query: () => ({
                url: '/admin/users',
                method: 'GET',
            }),
            providesTags: ['User'],
        }),

        // Get user by ID
        getUserById: builder.query<{ status: string; data: { user: User } }, string>({
            query: (id) => ({
                url: `/admin/users/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'User', id }],
        }),

        // Update user
        updateUser: builder.mutation<
            { status: string; data: { user: User } },
            { id: string; userData: Partial<User> }
        >({
            query: ({ id, userData }) => ({
                url: `/admin/users/${id}`,
                method: 'PATCH',
                body: userData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'User', id },
                'User',
            ],
        }),

        // Delete user
        deleteUser: builder.mutation<{ status: string; data: null }, string>({
            query: (id) => ({
                url: `/admin/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),

        // Get dashboard stats
        getDashboardStats: builder.query<{ status: string; data: DashboardStats }, void>({
            query: () => ({
                url: '/admin/dashboard-stats',
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
    }),
});

// Export the generated hooks
export const {
    useGetAllUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetDashboardStatsQuery,
} = adminApiSlice;