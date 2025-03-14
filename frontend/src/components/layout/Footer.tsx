import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="app-footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h2 className="footer-heading">Фитнес Трекер</h2>
                    <p className="footer-text">
                        Отслеживайте свои тренировки, следите за прогрессом и достигайте своих
                        фитнес-целей.
                    </p>
                </div>

                <div className="footer-section">
                    <h2 className="footer-heading">Быстрые ссылки</h2>
                    <ul className="footer-links">
                        <li>
                            <Link to="/">Главная</Link>
                        </li>
                        <li>
                            <Link to="/dashboard">Дашборд</Link>
                        </li>
                        <li>
                            <Link to="/workouts">Тренировки</Link>
                        </li>
                        <li>
                            <Link to="/exercises">Упражнения</Link>
                        </li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h2 className="footer-heading">Ресурсы</h2>
                    <ul className="footer-links">
                        <li>
                            <Link to="/help">Центр помощи</Link>
                        </li>
                        <li>
                            <Link to="/privacy">Политика конфиденциальности</Link>
                        </li>
                        <li>
                            <Link to="/terms">Условия использования</Link>
                        </li>
                        <li>
                            <Link to="/contact">Связаться с нами</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p className="copyright">&copy; {currentYear} Фитнес Трекер. Все права защищены.</p>
                <p className="accessibility-statement">
                    <Link to="/accessibility">Заявление о доступности</Link>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
