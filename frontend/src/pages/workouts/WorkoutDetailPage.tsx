import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    useGetWorkoutQuery,
    useCompleteWorkoutMutation,
    useDeleteWorkoutMutation,
} from '../../api/workoutsApiSlice';
import './WorkoutDetailPage.css';

const WorkoutDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    // Fetch workout details
    const { data: workoutData, isLoading, isError, error } = useGetWorkoutQuery(id || '');

    // Mutations
    const [completeWorkout, { isLoading: isCompletingWorkout }] = useCompleteWorkoutMutation();
    const [deleteWorkout, { isLoading: isDeletingWorkout }] = useDeleteWorkoutMutation();

    // Extract workout from response data
    const workout = workoutData?.data.workout;

    // Handle complete workout
    const handleCompleteWorkout = async () => {
        if (!id) return;

        try {
            await completeWorkout(id).unwrap();
        } catch (err) {
            console.error('Failed to complete workout:', err);
        }
    };

    // Handle delete workout
    const handleDeleteWorkout = async () => {
        if (!id) return;

        try {
            await deleteWorkout(id).unwrap();
            navigate('/workouts');
        } catch (err) {
            console.error('Failed to delete workout:', err);
        }
    };

    if (isLoading) {
        return <div className="loading-state">Loading workout details...</div>;
    }

    if (isError) {
        return (
            <div className="error-state">
                <p>Error loading workout details.</p>
                <Link to="/workouts" className="back-link">
                    Back to Workouts
                </Link>
            </div>
        );
    }

    if (!workout) {
        return (
            <div className="not-found-state">
                <p>Workout not found.</p>
                <Link to="/workouts" className="back-link">
                    Back to Workouts
                </Link>
            </div>
        );
    }

    return (
        <div className="workout-detail-page">
            <div className="workout-detail-header">
                <div className="header-content">
                    <Link to="/workouts" className="back-link">
                        ← Back to Workouts
                    </Link>
                    <h1>{workout.name}</h1>
                    <div className="workout-meta">
                        <span className="workout-date">
                            {new Date(workout.scheduledDate).toLocaleDateString()}
                        </span>
                        <span className="workout-duration">{workout.duration} min</span>
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
                    {!workout.isCompleted && (
                        <button
                            className="complete-workout-btn"
                            onClick={handleCompleteWorkout}
                            disabled={isCompletingWorkout}
                        >
                            {isCompletingWorkout ? 'Completing...' : 'Mark as Completed'}
                        </button>
                    )}
                    <Link to={`/workouts/${workout.id}/edit`} className="edit-workout-btn">
                        Edit Workout
                    </Link>
                    <button
                        className="delete-workout-btn"
                        onClick={() => setShowConfirmDelete(true)}
                    >
                        Delete Workout
                    </button>
                </div>
            </div>

            <div className="workout-exercises">
                <h2>Exercises</h2>
                {workout.workoutExercises.length === 0 ? (
                    <p className="empty-exercises">No exercises added to this workout.</p>
                ) : (
                    <div className="exercises-list">
                        {workout.workoutExercises
                            .sort((a, b) => a.order - b.order)
                            .map(workoutExercise => (
                                <div className="exercise-card" key={workoutExercise.id}>
                                    <div className="exercise-header">
                                        <h3 className="exercise-name">
                                            {workoutExercise.exercise.name}
                                        </h3>
                                        <span
                                            className={`exercise-status ${workoutExercise.isCompleted ? 'completed' : ''}`}
                                        >
                                            {workoutExercise.isCompleted ? 'Completed' : 'Pending'}
                                        </span>
                                    </div>

                                    {workoutExercise.notes && (
                                        <p className="exercise-notes">{workoutExercise.notes}</p>
                                    )}

                                    <div className="exercise-details">
                                        <div className="exercise-info">
                                            <span className="info-label">Muscle Group:</span>
                                            <span className="info-value">
                                                {workoutExercise.exercise.primaryMuscleGroup}
                                            </span>
                                        </div>
                                        <div className="exercise-info">
                                            <span className="info-label">Type:</span>
                                            <span className="info-value">
                                                {workoutExercise.exercise.type}
                                            </span>
                                        </div>
                                    </div>

                                    {workoutExercise.sets.length > 0 && (
                                        <div className="exercise-sets">
                                            <h4>Sets</h4>
                                            <table className="sets-table">
                                                <thead>
                                                    <tr>
                                                        <th>Set</th>
                                                        <th>Weight</th>
                                                        <th>Reps</th>
                                                        <th>Duration</th>
                                                        <th>Distance</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {workoutExercise.sets
                                                        .sort((a, b) => a.setNumber - b.setNumber)
                                                        .map(set => (
                                                            <tr
                                                                key={set.id}
                                                                className={
                                                                    set.isCompleted
                                                                        ? 'completed'
                                                                        : ''
                                                                }
                                                            >
                                                                <td>{set.setNumber}</td>
                                                                <td>
                                                                    {set.weight
                                                                        ? `${set.weight} kg`
                                                                        : '-'}
                                                                </td>
                                                                <td>{set.reps || '-'}</td>
                                                                <td>
                                                                    {set.duration
                                                                        ? `${set.duration} sec`
                                                                        : '-'}
                                                                </td>
                                                                <td>
                                                                    {set.distance
                                                                        ? `${set.distance} km`
                                                                        : '-'}
                                                                </td>
                                                                <td>
                                                                    <span
                                                                        className={`set-status ${set.isCompleted ? 'completed' : 'pending'}`}
                                                                    >
                                                                        {set.isCompleted
                                                                            ? 'Completed'
                                                                            : 'Pending'}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showConfirmDelete && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal">
                        <h3>Delete Workout</h3>
                        <p>
                            Are you sure you want to delete this workout? This action cannot be
                            undone.
                        </p>
                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => setShowConfirmDelete(false)}
                                disabled={isDeletingWorkout}
                            >
                                Cancel
                            </button>
                            <button
                                className="delete-btn"
                                onClick={handleDeleteWorkout}
                                disabled={isDeletingWorkout}
                            >
                                {isDeletingWorkout ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkoutDetailPage;
