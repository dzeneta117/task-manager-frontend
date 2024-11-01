import React, { useState } from 'react';
import axios from 'axios';

const UpdateTaskForm = ({ task }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [priority, setPriority] = useState(task.priority);
    const [dueDate, setDueDate] = useState(task.dueDate);
    const [assignedUsers, setAssignedUsers] = useState(task.assignedUsers);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/tasks/${task._id}`, {
                title,
                description,
                priority,
                dueDate,
                assignedUsers
            });
            // handle success
        } catch (error) {
            // handle error
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            {/* Add user input or selection */}
            <button type="submit">Update Task</button>
        </form>
    );
};

export default UpdateTaskForm;
