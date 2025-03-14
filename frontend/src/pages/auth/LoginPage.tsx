import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../api/authApiSlice';
import { setCredentials } from '../../store/slices/authSlice';
import './AuthPages.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Пожалуйста, введите email и пароль');
            return;
        }

        try {
            const result = await login({ email, password }).unwrap();
            if (result && result.data) {
                dispatch(setCredentials(result.data));
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.data?.message || 'Ошибка входа. Пожалуйста, попробуйте снова.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1>Вход в аккаунт</h1>
                    <p>С возвращением! Пожалуйста, введите свои данные для входа.</p>
                </div>

                {error && (
                    <div className="auth-error" role="alert">
                        {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            aria-required="true"
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            aria-required="true"
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="auth-button"
                            disabled={isLoading}
                            aria-busy={isLoading}
                        >
                            {isLoading ? 'Выполняется вход...' : 'Войти'}
                        </button>
                    </div>
                </form>

                <div className="auth-links">
                    <p>
                        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                    </p>
                    <p>
                        <Link to="/forgot-password">Забыли пароль?</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
