import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

    // If authentication is still loading, you might want to show a loading spinner
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
