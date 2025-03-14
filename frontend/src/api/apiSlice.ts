import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Define a base query with auth header
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    prepareHeaders: (headers, { getState }) => {
        // Get the token from the state
        const token = (getState() as RootState).auth.token;

        // If we have a token, add it to the headers
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }

        return headers;
    },
    credentials: 'include', // This allows the browser to send cookies with the request
});

// Create the API slice
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery,
    tagTypes: ['User', 'Workout', 'Exercise'],
    endpoints: () => ({}),
});
