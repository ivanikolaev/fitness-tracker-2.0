import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';
import authReducer, { logout } from './slices/authSlice';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: import.meta.env.DEV,
});

// Reset the store when the user logs out
store.dispatch(apiSlice.util.resetApiState());

// Add a listener to reset the API state when the user logs out
let currentState = store.getState();
store.subscribe(() => {
    let previousState = currentState;
    currentState = store.getState();

    // If the user has logged out, reset the API state
    if (previousState.auth.isAuthenticated && !currentState.auth.isAuthenticated) {
        store.dispatch(apiSlice.util.resetApiState());
    }
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
