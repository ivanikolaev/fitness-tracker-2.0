import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    useGetWorkoutQuery,
    useCompleteWorkoutMutation,
    useDeleteWorkoutMutation,
    useReopenWorkoutMutation,
} from '../../api/workoutsApiSlice';
import { translateMuscleGroup, translateExerciseType } from '../../utils/translations';
import './WorkoutDetailPage.css';

const WorkoutDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    // Fetch workout details
    const { data: workoutData, isLoading, isError, error } = useGetWorkoutQuery(id || '');

    // Mutations
    const [completeWorkout, { isLoading: isCompletingWorkout }] = useCompleteWorkoutMutation();
    const [reopenWorkout, { isLoading: isReopeningWorkout }] = useReopenWorkoutMutation();
    const [deleteWorkout, { isLoading: isDeletingWorkout }] = useDeleteWorkoutMutation();

    // Extract workout from response data
    const workout = workoutData?.data.workout;

    // Handle complete workout
    const handleCompleteWorkout = async () => {
        if (!id) return;

        try {
            await completeWorkout(id).unwrap();
        } catch (err) {
            // Handle error silently
        }
    };

    // Handle reopen workout
    const handleReopenWorkout = async () => {
        if (!id) return;

        try {
            await reopenWorkout(id).unwrap();
        } catch (err) {
            // Handle error silently
        }
    };

    // Handle delete workout
    const handleDeleteWorkout = async () => {
        if (!id) return;

        try {
            await deleteWorkout(id).unwrap();
            navigate('/workouts');
        } catch (err) {
            // Handle error silently
        }
    };

    if (isLoading) {
        return <div className="loading-state">Загрузка данных тренировки...</div>;
    }

    if (isError) {
        return (
            <div className="error-state">
                <p>Ошибка при загрузке данных тренировки.</p>
                <Link to="/workouts" className="back-link">
                    Вернуться к тренировкам
                </Link>
            </div>
        );
    }

    if (!workout) {
        return (
            <div className="not-found-state">
                <p>Тренировка не найдена.</p>
                <Link to="/workouts" className="back-link">
                    Вернуться к тренировкам
                </Link>
            </div>
        );
    }

    return (
        <div className="workout-detail-page">
            <div className="workout-detail-header">
                <div className="header-content">
                    <Link to="/workouts" className="back-link">
                        ← Назад к тренировкам
                    </Link>
                    <h1>{workout.name}</h1>
                    <div className="workout-meta">
                        <span className="workout-date">
                            {new Date(workout.scheduledDate).toLocaleDateString()}
                        </span>
                        <span className="workout-duration">{workout.duration} мин</span>
                        <span
                            className={`workout-status ${workout.isCompleted ? 'completed' : 'upcoming'}`}
                        >
                            {workout.isCompleted ? 'Завершена' : 'Предстоящая'}
                        </span>
                    </div>
                    {workout.description && (
                        <p className="workout-description">{workout.description}</p>
                    )}
                </div>

                <div className="workout-actions">
                    {!workout.isCompleted ? (
                        <button
                            className="complete-workout-btn"
                            onClick={handleCompleteWorkout}
                            disabled={isCompletingWorkout}
                        >
                            {isCompletingWorkout ? 'Завершение...' : 'Отметить как завершенную'}
                        </button>
                    ) : (
                        <button
                            className="reopen-workout-btn"
                            onClick={handleReopenWorkout}
                            disabled={isReopeningWorkout}
                        >
                            {isReopeningWorkout ? 'Открытие...' : 'Открыть заново'}
                        </button>
                    )}
                    <Link to={`/workouts/${workout.id}/edit`} className="edit-workout-btn">
                        Редактировать
                    </Link>
                    <button
                        className="delete-workout-btn"
                        onClick={() => setShowConfirmDelete(true)}
                    >
                        Удалить
                    </button>
                </div>
            </div>

            <div className="workout-exercises">
                <h2>Упражнения</h2>
                {workout.workoutExercises.length === 0 ? (
                    <p className="empty-exercises">К этой тренировке не добавлено упражнений.</p>
                ) : (
                    <div className="exercises-list">
                        {[...workout.workoutExercises]
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
                                            {workoutExercise.isCompleted ? 'Выполнено' : 'В ожидании'}
                                        </span>
                                    </div>

                                    {workoutExercise.notes && (
                                        <p className="exercise-notes">{workoutExercise.notes}</p>
                                    )}

                                    <div className="exercise-details">
                                        <div className="exercise-info">
                                            <span className="info-label">Группа мышц:</span>
                                            <span className="info-value">
                                                {translateMuscleGroup(workoutExercise.exercise.primaryMuscleGroup)}
                                            </span>
                                        </div>
                                        <div className="exercise-info">
                                            <span className="info-label">Тип:</span>
                                            <span className="info-value">
                                                {translateExerciseType(workoutExercise.exercise.type)}
                                            </span>
                                        </div>
                                    </div>

                                    {workoutExercise.sets.length > 0 && (
                                        <div className="exercise-sets">
                                            <h4>Подходы</h4>
                                            <table className="sets-table">
                                                <thead>
                                                    <tr>
                                                        <th>Подход</th>
                                                        <th>Вес</th>
                                                        <th>Повторения</th>
                                                        <th>Длительность</th>
                                                        <th>Дистанция</th>
                                                        <th>Статус</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[...workoutExercise.sets]
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
                                                                        ? `${set.weight} кг`
                                                                        : '-'}
                                                                </td>
                                                                <td>{set.reps || '-'}</td>
                                                                <td>
                                                                    {set.duration
                                                                        ? `${set.duration} сек`
                                                                        : '-'}
                                                                </td>
                                                                <td>
                                                                    {set.distance
                                                                        ? `${set.distance} км`
                                                                        : '-'}
                                                                </td>
                                                                <td>
                                                                    <span
                                                                        className={`set-status ${set.isCompleted ? 'completed' : 'pending'}`}
                                                                    >
                                                                        {set.isCompleted
                                                                            ? 'Выполнено'
                                                                            : 'В ожидании'}
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
                        <h3>Удаление тренировки</h3>
                        <p>
                            Вы уверены, что хотите удалить эту тренировку? Это действие нельзя
                            отменить.
                        </p>
                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => setShowConfirmDelete(false)}
                                disabled={isDeletingWorkout}
                            >
                                Отмена
                            </button>
                            <button
                                className="delete-btn"
                                onClick={handleDeleteWorkout}
                                disabled={isDeletingWorkout}
                            >
                                {isDeletingWorkout ? 'Удаление...' : 'Удалить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkoutDetailPage;
