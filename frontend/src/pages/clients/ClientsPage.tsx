import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../store';
import { User, UserRole } from '../../types';
import { useGetAllUsersQuery } from '../../api/adminApiSlice';
import './ClientsPage.css';

const ClientsPage = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { data: usersData, isLoading, error: fetchError } = useGetAllUsersQuery();
    const [searchTerm, setSearchTerm] = useState('');
    
    // Redirect if not trainer or admin
    if (!user || (user.role !== UserRole.TRAINER && user.role !== UserRole.ADMIN)) {
        return <Navigate to="/dashboard" replace />;
    }
    
    // Filter only regular users
    const clients = usersData?.data?.users.filter(
        (user: User) => user.role === UserRole.USER
    ) || [];

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Filter clients based on search term
    const filteredClients = clients.filter(
        (client) =>
            client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <div>Loading clients...</div>;
    }

    if (fetchError) {
        return <div className="error-message">Error loading clients</div>;
    }

    return (
        <div className="clients-page">
            <h1>Клиенты</h1>

            <div className="clients-search">
                <input
                    type="text"
                    placeholder="Поиск клиентов..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            {filteredClients.length === 0 ? (
                <div className="empty-state">
                    <h3>Нет клиентов</h3>
                    <p>У вас пока нет клиентов или они не соответствуют критериям поиска.</p>
                </div>
            ) : (
                <div className="clients-list">
                    {filteredClients.map((client) => (
                        <div key={client.id} className="client-card">
                            <div className="client-header">
                                <div className="client-avatar">
                                    {client.profilePicture ? (
                                        <img src={client.profilePicture} alt={`${client.firstName} ${client.lastName}`} />
                                    ) : (
                                        `${client.firstName.charAt(0)}${client.lastName.charAt(0)}`
                                    )}
                                </div>
                                <div className="client-info">
                                    <h3>{`${client.firstName} ${client.lastName}`}</h3>
                                    <p>{client.email}</p>
                                </div>
                            </div>

                            <div className="client-stats">
                                <div className="stat-item">
                                    <p>Рост</p>
                                    <h4>{client.height ? `${client.height} см` : 'Н/Д'}</h4>
                                </div>
                                <div className="stat-item">
                                    <p>Вес</p>
                                    <h4>{client.weight ? `${client.weight} кг` : 'Н/Д'}</h4>
                                </div>
                            </div>

                            <div className="client-actions">
                                <button className="view-profile-btn">Профиль</button>
                                <button className="assign-workout-btn">Назначить тренировку</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClientsPage;