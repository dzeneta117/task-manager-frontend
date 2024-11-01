import React, { useEffect, useState } from 'react';
import axios from 'axios';
import notification from '../Style/Notification.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/api/tasks/notifications', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Sortiraj obaveštenja od najnovijeg do najstarijeg
                const sortedNotifications = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setNotifications(sortedNotifications);
            } catch (err) {
                setError('Greška prilikom učitavanja obaveštenja');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleNotificationClick = async (taskId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/tasks/${taskId}`);
            setSelectedTask(response.data);
            setShowDetails(true);
        } catch (error) {
            console.error('Greška prilikom dobijanja zadatka:', error);
        }
    };

    const handleCloseDetails = () => {
        setShowDetails(false);
        setSelectedTask(null);
    };

    return (
        <div className="notifications-container">
            <button onClick={toggleDropdown} className="notification-icon">
                <span role="img" aria-label="notifications">🔔</span>
            </button>
            {isOpen && (
                <div className="dropdown-menu">
                    <h4>Obaveštenja</h4>
                    {loading && <div>Učitavanje...</div>}
                    {error && <div>{error}</div>}
                    {!loading && notifications.length === 0 && <div>Nema novih obaveštenja</div>}
                    <ul>
                        {notifications.map((notification) => (
                            <li 
                                key={notification._id}
                                onClick={() => handleNotificationClick(notification.taskId)} 
                                style={{ cursor: 'pointer' }}
                            >
                                {notification.title} - {notification.message} - {new Date(notification.createdAt).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {showDetails && selectedTask && (
                <div className="task-details">
                    <h2>Detalji zadatka</h2>
                    <button onClick={handleCloseDetails}>Zatvori</button>
                    <p><strong>Naslov:</strong> {selectedTask.title}</p>
                    <p><strong>Opis:</strong> {selectedTask.description}</p>
                    <p><strong>Prioritet:</strong> {selectedTask.priority}</p>
                    <p><strong>Datum isporuke:</strong> {selectedTask.dueDate}</p>
                    <p><strong>Zaduženi korisnik:</strong> {selectedTask.assignedUsers.join(', ')}</p>
                </div>
            )}
        </div>
    );
};

export default Notifications;
