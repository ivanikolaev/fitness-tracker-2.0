import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { useLogoutMutation } from '../../api/authApiSlice';
import './Header.css';

const Header = () => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const [logoutMutation] = useLogoutMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logoutMutation().unwrap();
            dispatch(logout());
            navigate('/login');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    return (
        <header className="app-header">
            {/* Skip to content link for accessibility */}
            <a href="#main-content" className="skip-link">
                Перейти к содержимому
            </a>

            <div className="header-container">
                <div className="logo-container">
                    <Link to="/" className="logo">
                        <h1>Фитнес Трекер</h1>
                    </Link>
                </div>

                <div className="header-actions">
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <button className="user-button" onClick={() => setMenuOpen(!menuOpen)}>
                                <span className="user-name">
                                    {user?.firstName || 'Пользователь'}
                                </span>
                            </button>

                            {menuOpen && (
                                <div className="menu-dropdown">
                                    <ul className="menu-list">
                                        <li
                                            onClick={() => navigate('/profile')}
                                            className="menu-item"
                                        >
                                            Профиль
                                        </li>
                                        <li
                                            onClick={() => navigate('/profile/settings')}
                                            className="menu-item"
                                        >
                                            Настройки
                                        </li>
                                        <li onClick={handleLogout} className="menu-item">
                                            Выйти
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <button className="login-button" onClick={() => navigate('/login')}>
                                Войти
                            </button>
                            <button
                                className="register-button"
                                onClick={() => navigate('/register')}
                            >
                                Регистрация
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
