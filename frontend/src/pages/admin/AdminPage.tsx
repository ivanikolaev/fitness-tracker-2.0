import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../store';
import { UserRole } from '../../types';
import { useGetDashboardStatsQuery } from '../../api/adminApiSlice';
import './AdminPage.css';
import UserManagement from './UserManagement';

const AdminPage = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [activeTab, setActiveTab] = useState('dashboard');
    // Fetch dashboard stats when the dashboard tab is active
    const { data: statsData, isLoading, error } = useGetDashboardStatsQuery(undefined, {
        skip: activeTab !== 'dashboard',
    });
    
    const stats = statsData?.data;
    
    // Redirect if not admin
    if (!user || user.role !== UserRole.ADMIN) {
        return <Navigate to="/dashboard" replace />;
    }

    const renderDashboard = () => {
        if (isLoading) {
            return <div>Loading dashboard stats...</div>;
        }

        if (error) {
            return <div className="error-message">Error loading dashboard stats</div>;
        }

        if (!stats) {
            return <div>Нет данных для отображения</div>;
        }

        return (
            <div>
                <div className="admin-stats">
                    <div className="stat-card">
                        <h3>Всего пользователей</h3>
                        <div className="stat-value">{stats.totalUsers}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Активные пользователи</h3>
                        <div className="stat-value">{stats.activeUsers}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Неактивные пользователи</h3>
                        <div className="stat-value">{stats.inactiveUsers}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Новые пользователи (30 дней)</h3>
                        <div className="stat-value">{stats.newUsers}</div>
                    </div>
                </div>

                <div className="admin-content">
                    <h2>Пользователи по ролям</h2>
                    <div>
                        {stats.usersByRole.map((item) => (
                            <div key={item.role} style={{ margin: '10px 0' }}>
                                <strong>{item.role}:</strong> {item.count}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return renderDashboard();
            case 'users':
                return <UserManagement />;
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div className="admin-page">
            <h1>Панель администратора</h1>

            <div className="admin-tabs">
                <button
                    className={activeTab === 'dashboard' ? 'active' : ''}
                    onClick={() => setActiveTab('dashboard')}
                >
                    Дашборд
                </button>
                <button
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => setActiveTab('users')}
                >
                    Управление пользователями
                </button>
            </div>

            {renderContent()}
        </div>
    );
};

export default AdminPage;