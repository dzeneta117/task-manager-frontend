import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/TaskStatus.css';

const API_URL = 'http://localhost:5000/api/tasks';
const USERS_URL = 'http://localhost:5000/api/auth/workers'; // URL za učitavanje korisnika

const TaskStatus = () => {
    const [pendingTasks, setPendingTasks] = useState([]);
    const [inProgressTasks, setInProgressTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [users, setUsers] = useState([]); // Dodajemo stanje za korisnike
    const [todayDate, setTodayDate] = useState('');

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${API_URL}?date=${todayDate}`);
            const tasks = response.data;

            setPendingTasks(tasks.filter(task => task.status === 'Pending'));
            setInProgressTasks(tasks.filter(task => task.status === 'In Progress'));
            setCompletedTasks(tasks.filter(task => task.status === 'Completed'));
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Učitavanje korisnika
    const fetchUsers = async () => {
        const token = localStorage.getItem('token'); // Uzimanje tokena iz localStorage
        try {
            const response = await axios.get(USERS_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(response.data); // Postavljanje korisnika
        } catch (error) {
            console.error('Greška prilikom učitavanja korisnika:', error);
        }
    };

    // Kreiranje mape korisnika za lakše pronalaženje username-a
    const userMap = new Map(users.map(user => [user._id, user.username]));

    useEffect(() => {
        const date = getTodayDate();
        setTodayDate(date);
        fetchUsers(); // Učitavamo korisnike kada se komponenta mount-uje
    }, []);

    useEffect(() => {
        if (todayDate) {
            fetchTasks();
        }
    }, [todayDate]);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await axios.put(`${API_URL}/${taskId}`, { status: newStatus });
            fetchTasks();
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    return (
        <div className="task-status-page">
            <div className="task-column">
                <h3 style={{ color: 'red' }}>Na čekanju</h3>
                {pendingTasks.map(task => (
                    <div key={task._id} className="task-card">
                        <p><strong>{task.title}</strong></p>
                        <p>{task.description}</p>
                        <p><strong>Zaduženi korisnici:</strong> {task.assignedUsers.map(id => userMap.get(id)).join(', ')}</p>
                        <p><strong>Datum isporuke:</strong> {task.dueDate ? formatDate(task.dueDate) : 'Nije postavljen'}</p>
                        <button onClick={() => handleStatusChange(task._id, 'In Progress')}>Start</button>
                    </div>
                ))}
            </div>

            <div className="task-column">
                <h3 style={{ color: 'orange' }}>U toku</h3>
                {inProgressTasks.map(task => (
                    <div key={task._id} className="task-card">
                        <p><strong>{task.title}</strong></p>
                        <p>{task.description}</p>
                        <p><strong>Zaduženi korisnici:</strong> {task.assignedUsers.map(id => userMap.get(id)).join(', ')}</p>
                        <p><strong>Datum isporuke:</strong> {task.dueDate ? formatDate(task.dueDate) : 'Nije postavljen'}</p>
                        <button onClick={() => handleStatusChange(task._id, 'Completed')}>Complete</button>
                    </div>
                ))}
            </div>

            <div className="task-column">
                <h3 style={{ color: 'green' }}>Završeno</h3>
                {completedTasks.map(task => (
                    <div key={task._id} className="task-card">
                        <p><strong>Za isporuku:</strong>{task.title}</p>
                        <p><strong>Podaci:</strong>{task.description}</p>
                        <p><strong>Zaduženi radnici:</strong> {task.assignedUsers.map(id => userMap.get(id)).join(', ')}</p>
                        <p><strong>Datum isporuke:</strong> {task.dueDate ? formatDate(task.dueDate) : 'Nije postavljen'}</p>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskStatus;
