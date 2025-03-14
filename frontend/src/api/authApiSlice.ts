import { apiSlice } from './apiSlice';
import { User } from '../store/slices/authSlice';

// Define response types
interface LoginResponse {
    status: string;
    data: {
        user: User;
        accessToken: string;
    };
}

interface RegisterResponse {
    status: string;
    data: {
        user: User;
    };
}

interface RefreshTokenResponse {
    status: string;
    data: {
        accessToken: string;
    };
}

interface LogoutResponse {
    status: string;
    message: string;
}

interface CurrentUserResponse {
    status: string;
    data: {
        user: User;
    };
}

// Define request types
interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: 'user' | 'trainer' | 'admin';
    profilePicture?: string;
    height?: number;
    weight?: number;
    dateOfBirth?: string;
}

interface RefreshTokenRequest {
    refreshToken: string;
}

// Create the auth API slice
export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: credentials => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation<RegisterResponse, RegisterRequest>({
            query: userData => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),
        refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
            query: refreshData => ({
                url: '/auth/refresh-token',
                method: 'POST',
                body: refreshData,
            }),
        }),
        logout: builder.mutation<LogoutResponse, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
        getCurrentUser: builder.query<CurrentUserResponse, void>({
            query: () => '/auth/me',
            providesTags: ['User'],
        }),
    }),
});

// Export hooks
export const {
    useLoginMutation,
    useRegisterMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
    useGetCurrentUserQuery,
} = authApiSlice;
