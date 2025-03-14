import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import './HomePage.css';

const HomePage = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Отслеживайте свой фитнес-прогресс</h1>
                    <p className="hero-subtitle">
                        Планируйте тренировки, отслеживайте прогресс и достигайте своих фитнес-целей
                        с нашей доступной платформой для фитнес-трекинга.
                    </p>

                    {isAuthenticated ? (
                        <Link to="/dashboard" className="cta-button">
                            Перейти в дашборд
                        </Link>
                    ) : (
                        <div className="cta-buttons">
                            <Link to="/login" className="cta-button secondary">
                                Войти
                            </Link>
                            <Link to="/register" className="cta-button primary">
                                Бесплатная регистрация
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            <section className="features-section">
                <h2 className="section-title">Ключевые возможности</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📅</div>
                        <h3 className="feature-title">Планирование тренировок</h3>
                        <p className="feature-description">
                            Создавайте и планируйте свои тренировки с помощью интуитивного календаря
                            с функцией drag-and-drop.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3 className="feature-title">Отслеживание прогресса</h3>
                        <p className="feature-description">
                            Визуализируйте свой прогресс с помощью подробных графиков и статистики.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">💪</div>
                        <h3 className="feature-title">Библиотека упражнений</h3>
                        <p className="feature-description">
                            Получите доступ к обширной библиотеке упражнений с подробными
                            инструкциями.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🎯</div>
                        <h3 className="feature-title">Постановка целей</h3>
                        <p className="feature-description">
                            Устанавливайте и отслеживайте свои фитнес-цели, чтобы оставаться
                            мотивированными и сосредоточенными.
                        </p>
                    </div>
                </div>
            </section>

            <section className="accessibility-section">
                <h2 className="section-title">Доступность прежде всего</h2>
                <p className="section-description">
                    Наша платформа разработана с учетом доступности, следуя стандартам WCAG 2.1 AA,
                    чтобы каждый мог эффективно ее использовать.
                </p>
                <div className="accessibility-features">
                    <div className="accessibility-feature">
                        <h3>Навигация с клавиатуры</h3>
                        <p>Полностью доступна для навигации только с помощью клавиатуры.</p>
                    </div>
                    <div className="accessibility-feature">
                        <h3>Поддержка скринридеров</h3>
                        <p>Совместимость с популярными программами чтения с экрана.</p>
                    </div>
                    <div className="accessibility-feature">
                        <h3>Высокий контраст</h3>
                        <p>Цветовые схемы разработаны для лучшей видимости.</p>
                    </div>
                    <div className="accessibility-feature">
                        <h3>Адаптивный дизайн</h3>
                        <p>Работает на всех устройствах и размерах экранов.</p>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <h2 className="cta-title">Готовы начать свой фитнес-путь?</h2>
                <p className="cta-description">
                    Присоединяйтесь к тысячам пользователей, которые уже отслеживают свой
                    фитнес-прогресс с помощью нашей платформы.
                </p>

                {isAuthenticated ? (
                    <Link to="/workouts/new" className="cta-button">
                        Создать первую тренировку
                    </Link>
                ) : (
                    <Link to="/register" className="cta-button primary">
                        Зарегистрироваться сейчас
                    </Link>
                )}
            </section>
        </div>
    );
};

export default HomePage;
