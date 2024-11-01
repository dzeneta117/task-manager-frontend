import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskForm = ({ onTaskAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [assignedUser, setAssignedUser] = useState(''); 
    const [users, setUsers] = useState([]); // Dodajemo stanje za korisnike
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token'); // Uzimanje tokena iz localStorage
            try {
                const response = await axios.get('http://localhost:5000/api/auth/workers', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUsers(response.data); // Postavi dobijene korisnike
            } catch (err) {
                setError('Greška prilikom učitavanja korisnika');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/tasks', {
                title,
                description,
                priority,
                dueDate,
                assignedUsers: assignedUser ? [assignedUser.trim()] : [],
            });
            setTitle('');
            setDescription('');
            setPriority('medium');
            setDueDate('');
            setAssignedUser('');
            if (onTaskAdded) {
                onTaskAdded();
            }
        } catch (error) {
            console.error('Greška pri dodavanju zadatka:', error);
        }
    };

    if (loading) {
        return <div>Učitavanje...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <h2>Dodaj zadatak</h2>
            <div className="form-group">
                <label>Naslov:</label>
                <input
                    type="text"
                    className="form-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Unesite naslov zadatka"
                    required
                />
            </div>
            <div className="form-group">
                <label>Podaci za isporuku:</label>
                <textarea
                    className="form-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Unesite podatke za isporuku"
                    required
                ></textarea>
            </div>
            <div className="form-group">
                <label>Prioritet:</label>
                <select
                    className="form-input"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="low">Nizak</option>
                    <option value="medium">Srednji</option>
                    <option value="high">Visok</option>
                </select>
            </div>
            <div className="form-group">
                <label>Datum isporuke:</label>
                <input
                    type="date"
                    className="form-input"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Zaduženi korisnik:</label>
                <select
                    className="form-input"
                    value={assignedUser}
                    onChange={(e) => setAssignedUser(e.target.value)}
                    required
                >
                    <option value="">Izaberite korisnika</option>
                    {users.map(user => (
                        <option key={user._id} value={user._id}>
                            {user.username} - {user.email}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit" className="form-button">Dodaj zadatak</button>
        </form>
    );
};

export default TaskForm;
