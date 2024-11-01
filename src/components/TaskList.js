import React, { useState, useEffect } from 'react';
import '../Style/TaskList.css';
import TaskForm from './TaskForm';
import TaskUpdateForm from './TaskUpdateForm';
import Modal from './Modal';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';
const USERS_URL = 'http://localhost:5000/api/auth/workers'; // URL za učitavanje korisnika

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]); // Dodajemo stanje za korisnike
    const [showForm, setShowForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [currentTaskData, setCurrentTaskData] = useState(null);
    const [sortOrder, setSortOrder] = useState('');
    const [filterDate, setFilterDate] = useState('');

    // Učitavanje zadataka
    const fetchTasks = async () => {
        try {
            const response = await fetch(`${API_URL}?sortBy=${sortOrder}&date=${filterDate}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
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

    useEffect(() => {
        fetchTasks();
        fetchUsers(); // Učitavamo korisnike kada se komponenta mount-uje
    }, [sortOrder, filterDate]);

    const handleToggleForm = () => {
        setShowForm(!showForm);
        setShowUpdateForm(false);
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleDateChange = (e) => {
        setFilterDate(e.target.value);
    };

    const handleAddTask = async (newTask) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask),
            });
            if (!response.ok) {
                throw new Error('Failed to add task');
            }
            await fetchTasks(); // Osvežavamo listu zadataka nakon dodavanja
            handleCloseForm();
            window.location.reload();  // Zatvaramo formu nakon dodavanja
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleUpdateClick = (taskId) => {
        const taskToUpdate = tasks.find(task => task._id === taskId);
        setCurrentTaskData(taskToUpdate);
        setCurrentTaskId(taskId);
        setShowUpdateForm(true);
    };

    const handleUpdateTask = async (updatedTask) => {
        try {
            const response = await fetch(`${API_URL}/${updatedTask._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            });
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            
            handleCloseUpdateModal();
            await fetchTasks(); // Zatvori modal nakon ažuriranja
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setCurrentTaskData(null); // Očisti trenutne podatke zadatka
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateForm(false);
        setCurrentTaskData(null);
    };

    // Kreiranje mape korisnika za lakše pronalaženje username-a
    const userMap = new Map(users.map(user => [user._id, user.username]));

    return (
        <div className="task-list-container">
            <button onClick={handleToggleForm} className="toggle-form-button">
                {showForm ? 'Zatvori formu' : '+ Dodaj zadatak'}
            </button>
            {showForm && <TaskForm onSubmit={handleAddTask} onClose={handleCloseForm} />}

            <Modal show={showUpdateForm} onClose={handleCloseUpdateModal}>
                {currentTaskData && (
                    <TaskUpdateForm 
                        task={currentTaskData}
                        onUpdate={handleUpdateTask}
                        onClose={handleCloseUpdateModal} 
                    />
                )}
            </Modal>

            <div className="task-list-header">
                <h2>Lista zadataka</h2>
                <div className="sort-select">
                    <label htmlFor="sort">Sortiraj po:</label>
                    <select id="sort" value={sortOrder} onChange={handleSortChange}>
                        <option value="">Izaberi...</option>
                        <option value="date">Datum isporuke</option>
                        <option value="title">Naslov</option>
                        <option value="status">Status</option>
                    </select>
                </div>
                <div className="filter-date">
                    <label htmlFor="filter-date">Filtriraj po datumu:</label>
                    <input
                        type="date"
                        id="filter-date"
                        value={filterDate}
                        onChange={handleDateChange}
                    />
                </div>
            </div>
            <div className="task-list">
                <ul>
                    {tasks.map((task) => (
                        <li key={task._id} className="task-item" onClick={() => handleUpdateClick(task._id)}>
                            <h3>{task.title}</h3>
                            <p><strong>Podaci za isporuku:</strong> {task.description}</p>
                            <p>
                                <strong>Datum isporuke:</strong> 
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Nije postavljen'}
                            </p>
                            <p><strong>Zaduženi radnici:</strong> {task.assignedUsers.map(id => userMap.get(id)).join(', ')}</p>
                            <p><strong>Prioritet:</strong> {task.priority}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TaskList;
