import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <h1 className="not-found-title">404</h1>
                <h2 className="not-found-subtitle">Страница не найдена</h2>
                <p className="not-found-message">
                    Страница, которую вы ищете, не существует или была перемещена.
                </p>
                <div className="not-found-actions">
                    <Link to="/" className="not-found-button">
                        Перейти на главную страницу
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
