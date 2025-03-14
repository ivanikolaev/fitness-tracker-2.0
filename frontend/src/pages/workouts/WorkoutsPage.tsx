import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetWorkoutsQuery } from '../../api/workoutsApiSlice';
import './WorkoutsPage.css';

const WorkoutsPage = () => {
    const [filter, setFilter] = useState<'all' | 'completed' | 'upcoming'>('all');
    const [page, setPage] = useState(1);
    const limit = 10;

    // Fetch workouts based on filter
    const {
        data: workoutsData,
        isLoading,
        isError,
    } = useGetWorkoutsQuery({
        isCompleted: filter === 'all' ? undefined : filter === 'completed',
        page,
        limit,
    });

    // Extract workouts from response data
    const workouts = workoutsData?.data.workouts || [];
    const totalWorkouts = workoutsData?.data.total || 0;
    const totalPages = Math.ceil(totalWorkouts / limit);

    // Handle filter change
    const handleFilterChange = (newFilter: 'all' | 'completed' | 'upcoming') => {
        setFilter(newFilter);
        setPage(1); // Reset to first page when filter changes
    };

    // Handle pagination
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="workouts-page">
            <header className="workouts-header">
                <h1>Your Workouts</h1>
                <Link to="/workouts/new" className="create-workout-btn">
                    Create Workout
                </Link>
            </header>

            <div className="filter-tabs">
                <button
                    className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('all')}
                >
                    All Workouts
                </button>
                <button
                    className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('completed')}
                >
                    Completed
                </button>
                <button
                    className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('upcoming')}
                >
                    Upcoming
                </button>
            </div>

            {isLoading ? (
                <div className="loading-state">Loading workouts...</div>
            ) : isError ? (
                <div className="error-state">Failed to load workouts. Please try again.</div>
            ) : workouts.length === 0 ? (
                <div className="empty-state">
                    <p>No workouts found.</p>
                    <Link to="/workouts/new" className="create-workout-link">
                        Create your first workout
                    </Link>
                </div>
            ) : (
                <>
                    <div className="workouts-list">
                        {workouts.map(workout => (
                            <div className="workout-card" key={workout.id}>
                                <div className="workout-info">
                                    <h3 className="workout-name">
                                        <Link to={`/workouts/${workout.id}`}>{workout.name}</Link>
                                    </h3>
                                    <div className="workout-meta">
                                        <span className="workout-date">
                                            {new Date(workout.scheduledDate).toLocaleDateString()}
                                        </span>
                                        <span className="workout-duration">
                                            {workout.duration} min
                                        </span>
                                        <span
                                            className={`workout-status ${workout.isCompleted ? 'completed' : 'upcoming'}`}
                                        >
                                            {workout.isCompleted ? 'Completed' : 'Upcoming'}
                                        </span>
                                    </div>
                                    {workout.description && (
                                        <p className="workout-description">{workout.description}</p>
                                    )}
                                </div>
                                <div className="workout-actions">
                                    <Link
                                        to={`/workouts/${workout.id}`}
                                        className="view-workout-btn"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-btn prev"
                                disabled={page === 1}
                                onClick={() => handlePageChange(page - 1)}
                            >
                                Previous
                            </button>
                            <span className="pagination-info">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                className="pagination-btn next"
                                disabled={page === totalPages}
                                onClick={() => handlePageChange(page + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default WorkoutsPage;
