import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../api/authApiSlice';
import './AuthPages.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [register, { isLoading }] = useRegisterMutation();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const { firstName, lastName, email, password, confirmPassword } = formData;

        // Basic validation
        if (!firstName || !lastName || !email || !password) {
            setError('Пожалуйста, заполните все обязательные поля');
            return;
        }

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        if (password.length < 8) {
            setError('Пароль должен содержать не менее 8 символов');
            return;
        }

        try {
            const result = await register({
                firstName,
                lastName,
                email,
                password,
            }).unwrap();

            // Registration successful, redirect to login
            navigate('/login', {
                state: { message: 'Регистрация успешна! Пожалуйста, войдите в систему.' },
            });
        } catch (err: any) {
            setError(err.data?.message || 'Ошибка регистрации. Пожалуйста, попробуйте снова.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1>Создание аккаунта</h1>
                    <p>
                        Присоединяйтесь к нашему фитнес-сообществу и начните отслеживать свой
                        прогресс уже сегодня!
                    </p>
                </div>

                {error && (
                    <div className="auth-error" role="alert">
                        {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">Имя</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                aria-required="true"
                                autoComplete="given-name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Фамилия</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                aria-required="true"
                                autoComplete="family-name"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
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
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            aria-required="true"
                            autoComplete="new-password"
                            minLength={8}
                            aria-describedby="password-hint"
                        />
                        <p id="password-hint" className="form-hint">
                            Пароль должен содержать не менее 8 символов
                        </p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Подтверждение пароля</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            aria-required="true"
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="auth-button"
                            disabled={isLoading}
                            aria-busy={isLoading}
                        >
                            {isLoading ? 'Создание аккаунта...' : 'Создать аккаунт'}
                        </button>
                    </div>
                </form>

                <div className="auth-links">
                    <p>
                        Уже есть аккаунт? <Link to="/login">Войти</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
