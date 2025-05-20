import { useState } from 'react';
import { User, UserRole } from '../../types';
import {
    useGetAllUsersQuery,
    useUpdateUserMutation,
    useDeleteUserMutation
} from '../../api/adminApiSlice';
import './UserManagement.css';

const UserManagement = () => {
    const { data: usersData, isLoading, error: fetchError } = useGetAllUsersQuery();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: UserRole.USER,
        isActive: true,
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    
    const users = usersData?.data?.users || [];

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleEdit = (user: User) => {
        setCurrentUser(user);
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        });
        setShowModal(true);
    };

    const handleDelete = async (userId: string) => {
        if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            return;
        }

        try {
            await deleteUser(userId).unwrap();
        } catch (err) {
            console.error('Failed to delete user:', err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!currentUser) return;

        try {
            await updateUser({
                id: currentUser.id,
                userData: formData
            }).unwrap();
            
            // Close modal
            setShowModal(false);
        } catch (err) {
            console.error('Failed to update user:', err);
        }
    };

    // Filter users based on search term
    const filteredUsers = users.filter(
        (user) =>
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get current users for pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (isLoading) {
        return <div>Loading users...</div>;
    }

    if (fetchError) {
        return <div className="error-message">Error loading users</div>;
    }

    return (
        <div className="user-management">
            <div className="user-search">
                <input
                    type="text"
                    placeholder="Поиск пользователей..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <table className="user-table">
                <thead>
                    <tr>
                        <th>Имя</th>
                        <th>Email</th>
                        <th>Роль</th>
                        <th>Статус</th>
                        <th>Дата регистрации</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{`${user.firstName} ${user.lastName}`}</td>
                            <td>{user.email}</td>
                            <td>
                                <span className={`role-badge role-${user.role}`}>
                                    {user.role === UserRole.ADMIN
                                        ? 'Администратор'
                                        : user.role === UserRole.TRAINER
                                        ? 'Тренер'
                                        : 'Пользователь'}
                                </span>
                            </td>
                            <td>
                                <span
                                    className={`status-badge ${
                                        user.isActive ? 'status-active' : 'status-inactive'
                                    }`}
                                >
                                    {user.isActive ? 'Активен' : 'Неактивен'}
                                </span>
                            </td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                                <div className="user-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEdit(user)}
                                    >
                                        Изменить
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &laquo;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={currentPage === i + 1 ? 'active' : ''}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        &raquo;
                    </button>
                </div>
            )}

            {/* Edit User Modal */}
            {showModal && (
                <div className="user-modal">
                    <div className="user-modal-content">
                        <div className="user-modal-header">
                            <h2>Редактировать пользователя</h2>
                            <button
                                className="user-modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="user-form">
                            <div className="form-group">
                                <label htmlFor="firstName">Имя</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Фамилия</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">Роль</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                >
                                    <option value={UserRole.USER}>Пользователь</option>
                                    <option value={UserRole.TRAINER}>Тренер</option>
                                    <option value={UserRole.ADMIN}>Администратор</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="isActive">Статус</label>
                                <select
                                    id="isActive"
                                    name="isActive"
                                    value={formData.isActive.toString()}
                                    onChange={handleInputChange}
                                >
                                    <option value="true">Активен</option>
                                    <option value="false">Неактивен</option>
                                </select>
                            </div>
                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    Отмена
                                </button>
                                <button type="submit" className="save-btn">
                                    Сохранить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;