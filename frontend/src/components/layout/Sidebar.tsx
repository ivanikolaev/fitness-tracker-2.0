import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './Sidebar.css';

const Sidebar = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', label: 'Дашборд', icon: '📊' },
        { path: '/workouts', label: 'Тренировки', icon: '💪' },
        { path: '/exercises', label: 'Упражнения', icon: '🏋️' },
        { path: '/profile', label: 'Профиль', icon: '👤' },
    ];

    // Add trainer/admin specific routes
    if (user?.role === 'trainer' || user?.role === 'admin') {
        navItems.push({ path: '/clients', label: 'Клиенты', icon: '👥' });
    }

    // Add admin specific routes
    if (user?.role === 'admin') {
        navItems.push({ path: '/admin', label: 'Админ панель', icon: '⚙️' });
    }

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <button
                className="collapse-button"
                onClick={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? 'Развернуть боковую панель' : 'Свернуть боковую панель'}
            >
                {collapsed ? '→' : '←'}
            </button>

            <nav className="sidebar-nav" aria-label="Основная навигация">
                <ul className="nav-list">
                    {navItems.map(item => (
                        <li key={item.path} className="nav-item">
                            <NavLink
                                to={item.path}
                                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                                aria-current={isActive(item.path) ? 'page' : undefined}
                            >
                                <span className="nav-icon" aria-hidden="true">
                                    {item.icon}
                                </span>
                                {!collapsed && <span className="nav-label">{item.label}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
