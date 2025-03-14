import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'user' | 'trainer' | 'admin';
    profilePicture?: string;
    height?: number;
    weight?: number;
    dateOfBirth?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Initial state
const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,
};

// Create the slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
            const { user, accessToken } = action.payload;
            state.user = user;
            state.token = accessToken;
            state.isAuthenticated = true;
            state.error = null;
            localStorage.setItem('token', accessToken);
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        logout: state => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('token');
        },
    },
});

// Export actions and reducer
export const { setCredentials, setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
