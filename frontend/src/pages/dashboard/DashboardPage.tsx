import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../store';
import { useGetWorkoutsQuery } from '../../api/workoutsApiSlice';
import './DashboardPage.css';

const DashboardPage = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    // Fetch recent workouts (completed)
    const {
        data: recentWorkoutsData,
        isLoading: isLoadingRecent,
        refetch: refetchRecentWorkouts,
    } = useGetWorkoutsQuery({
        isCompleted: true,
        limit: 3,
    });

    // Fetch upcoming workouts (not completed)
    const {
        data: upcomingWorkoutsData,
        isLoading: isLoadingUpcoming,
        refetch: refetchUpcomingWorkouts,
    } = useGetWorkoutsQuery({
        isCompleted: false,
        limit: 3,
    });

    // Refetch data when user changes
    useEffect(() => {
        if (user?.id) {
            refetchRecentWorkouts();
            refetchUpcomingWorkouts();
        }
    }, [user?.id, refetchRecentWorkouts, refetchUpcomingWorkouts]);

    // Extract workouts from response data
    const recentWorkouts = recentWorkoutsData?.data.workouts || [];
    const upcomingWorkouts = upcomingWorkoutsData?.data.workouts || [];

    // Calculate progress stats
    const totalWorkouts = recentWorkouts.length;
    const totalMinutes = recentWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
    const avgDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;

    const progressStats = [
        { label: 'Завершенные тренировки', value: totalWorkouts, unit: '' },
        { label: 'Общее время', value: totalMinutes, unit: 'мин' },
        { label: 'Средняя продолжительность', value: avgDuration, unit: 'мин' },
    ];

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <h1>Добро пожаловать, {user?.firstName || 'Пользователь'}!</h1>
                <p className="dashboard-subtitle">Вот обзор вашего фитнес-прогресса</p>
            </header>

            <div className="dashboard-grid">
                {/* Stats Section */}
                <section className="dashboard-section stats-section">
                    <h2 className="section-title">Ваш прогресс</h2>
                    <div className="stats-grid">
                        {progressStats.map((stat, index) => (
                            <div className="stat-card" key={index}>
                                <div className="stat-value">
                                    {stat.value}
                                    {stat.unit}
                                </div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recent Workouts Section */}
                <section className="dashboard-section recent-workouts-section">
                    <div className="section-header">
                        <h2 className="section-title">Недавние тренировки</h2>
                        <Link to="/workouts" className="section-link">
                            Смотреть все
                        </Link>
                    </div>

                    <div className="workouts-list">
                        {recentWorkouts.length > 0 ? (
                            recentWorkouts.map(workout => (
                                <div className="workout-card" key={workout.id}>
                                    <div className="workout-info">
                                        <h3 className="workout-name">
                                            <Link to={`/workouts/${workout.id}`}>
                                                {workout.name}
                                            </Link>
                                        </h3>
                                        <div className="workout-meta">
                                            <span className="workout-date">
                                                {new Date(
                                                    workout.scheduledDate
                                                ).toLocaleDateString()}
                                            </span>
                                            <span className="workout-duration">
                                                {workout.duration} мин
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="empty-state">Недавние тренировки не найдены.</p>
                        )}
                    </div>
                </section>

                {/* Upcoming Workouts Section */}
                <section className="dashboard-section upcoming-workouts-section">
                    <div className="section-header">
                        <h2 className="section-title">Предстоящие тренировки</h2>
                        <Link to="/workouts/schedule" className="section-link">
                            Расписание
                        </Link>
                    </div>

                    <div className="workouts-list">
                        {upcomingWorkouts.length > 0 ? (
                            upcomingWorkouts.map(workout => (
                                <div className="workout-card" key={workout.id}>
                                    <div className="workout-info">
                                        <h3 className="workout-name">
                                            <Link to={`/workouts/${workout.id}`}>
                                                {workout.name}
                                            </Link>
                                        </h3>
                                        <div className="workout-meta">
                                            <span className="workout-date">
                                                {new Date(
                                                    workout.scheduledDate
                                                ).toLocaleDateString()}
                                            </span>
                                            <span className="workout-duration">
                                                {workout.duration} мин
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="empty-state">Предстоящие тренировки не запланированы.</p>
                        )}
                    </div>
                </section>

                {/* Quick Actions Section */}
                <section className="dashboard-section quick-actions-section">
                    <h2 className="section-title">Быстрые действия</h2>
                    <div className="actions-grid">
                        <Link to="/workouts/new" className="action-card">
                            <div className="action-icon">➕</div>
                            <div className="action-label">Новая тренировка</div>
                        </Link>
                        <Link to="/exercises" className="action-card">
                            <div className="action-icon">💪</div>
                            <div className="action-label">Просмотр упражнений</div>
                        </Link>
                        <Link to="/profile" className="action-card">
                            <div className="action-icon">👤</div>
                            <div className="action-label">Обновить профиль</div>
                        </Link>
                        <Link to="/workouts/templates" className="action-card">
                            <div className="action-icon">📋</div>
                            <div className="action-label">Шаблоны тренировок</div>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DashboardPage;
