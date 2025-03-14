import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from '@gravity-ui/uikit';
import { RootState } from './store/index.ts';
import { useGetCurrentUserQuery } from './api/authApiSlice.ts';
import { setUser, logout } from './store/slices/authSlice.ts';

// Layout components
import Layout from './components/layout/Layout.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';

// Page components
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/auth/LoginPage.tsx';
import RegisterPage from './pages/auth/RegisterPage.tsx';
import DashboardPage from './pages/dashboard/DashboardPage.tsx';
// Import page components
import WorkoutsPage from './pages/workouts/WorkoutsPage';
import WorkoutDetailPage from './pages/workouts/WorkoutDetailPage';
import CreateWorkoutPage from './pages/workouts/CreateWorkoutPage';
import ExercisesPage from './pages/exercises/ExercisesPage';
import ProfilePage from './pages/profile/ProfilePage';
import NotFoundPage from './pages/NotFoundPage.tsx';

function App() {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    // Fetch current user if authenticated
    const { data, isError } = useGetCurrentUserQuery(undefined, {
        skip: !isAuthenticated,
    });

    useEffect(() => {
        if (data) {
            dispatch(setUser(data.data.user));
        } else if (isError && isAuthenticated) {
            // If there's an error fetching the user and we're authenticated,
            // it means the token is invalid, so log out
            dispatch(logout());
        }
    }, [data, isError, isAuthenticated, dispatch]);

    return (
        <ThemeProvider theme="light">
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route
                            path="login"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/dashboard" replace />
                                ) : (
                                    <LoginPage />
                                )
                            }
                        />
                        <Route
                            path="register"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/dashboard" replace />
                                ) : (
                                    <RegisterPage />
                                )
                            }
                        />

                        {/* Protected routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="dashboard" element={<DashboardPage />} />
                            {/* Workout routes */}
                            <Route path="workouts" element={<WorkoutsPage />} />
                            <Route path="workouts/new" element={<CreateWorkoutPage />} />
                            <Route path="workouts/:id" element={<WorkoutDetailPage />} />

                            {/* Exercise routes */}
                            <Route path="exercises" element={<ExercisesPage />} />

                            {/* Profile route */}
                            <Route path="profile" element={<ProfilePage />} />
                        </Route>

                        {/* 404 route */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
