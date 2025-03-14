import { apiSlice } from './apiSlice';
import { User } from '../store/slices/authSlice';

// Define response types
interface UserResponse {
    status: string;
    data: {
        user: User;
    };
}

// Define request types
interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    profilePicture?: string;
    height?: number;
    weight?: number;
    dateOfBirth?: string;
}

interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// Create the user API slice
export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUserProfile: builder.query<UserResponse, void>({
            query: () => '/users/profile',
            providesTags: ['User'],
        }),
        updateUserProfile: builder.mutation<UserResponse, UpdateUserRequest>({
            query: userData => ({
                url: '/users/profile',
                method: 'PATCH',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),
        changePassword: builder.mutation<
            { status: string; message: string },
            ChangePasswordRequest
        >({
            query: passwordData => ({
                url: '/users/change-password',
                method: 'POST',
                body: passwordData,
            }),
        }),
    }),
});

// Export hooks
export const { useGetUserProfileQuery, useUpdateUserProfileMutation, useChangePasswordMutation } =
    userApiSlice;
