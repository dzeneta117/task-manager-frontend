import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal'; // Uvezi modal komponentu

const UpdateTaskForm = ({ task, onTaskUpdated, setShowUpdateForm }) => {
    const [title, setTitle] = useState(task.title || '');
    const [description, setDescription] = useState(task.description || '');
    const [priority, setPriority] = useState(task.priority || 'medium');
    const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.substring(0, 10) : '');
    const [assignedUser, setAssignedUser] = useState(task.assignedUsers ? task.assignedUsers[0] : ''); 
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/api/auth/workers', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUsers(response.data);
            } catch (err) {
                setError('Greška prilikom učitavanja korisnika');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Da li ste sigurni da želite da obrišete ovaj zadatak?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/tasks/${task._id}`);
            setMessage('Zadatak je uspešno obrisan.');
            setShowModal(true);
            if (onTaskUpdated) {
                onTaskUpdated(); // Obavestite roditeljsku komponentu o brisanju
            }
            setShowUpdateForm(false); // Zatvori formu nakon brisanja
        } catch (error) {
            console.error('Greška pri brisanju zadatka:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
                title,
                description,
                priority,
                dueDate,
                assignedUsers: assignedUser ? [assignedUser.trim()] : [],
            });
            setMessage('Zadatak je uspešno ažuriran.');
            setShowModal(true);
            if (onTaskUpdated) {
                onTaskUpdated(); // Obavestite roditeljsku komponentu o ažuriranju
            }
            setShowUpdateForm(false); // Zatvaranje forme
        } catch (error) {
            console.error('Greška pri ažuriranju zadatka:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        // Osveži stranicu nakon zatvaranja modala
        window.location.reload();
    };

    if (loading) {
        return <div>Učitavanje...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="task-form">
                <h2>Ažuriraj zadatak</h2>
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
                    <label>Opis:</label>
                    <textarea
                        className="form-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Unesite opis zadatka"
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
                    <label>Datum isteka:</label>
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
                <button type="submit" className="form-button">Ažuriraj zadatak</button>
                <button type="button" className="form-button delete-button" onClick={handleDelete}>
                    Obriši zadatak
                </button>
            </form>
            <Modal show={showModal} onClose={handleCloseModal}>
                <p>{message}</p>
            </Modal>
        </>
    );
};

export default UpdateTaskForm;
