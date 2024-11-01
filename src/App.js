import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import TaskStatusChart from './components/TaskStatusChart';
import TaskStatus from './components/TaskStatus';
import AdminOnlyRoute from './components/AdminOnlyRoute'; 
import Unauthorized from './components/Unauthorized'; 
import Notifications from './components/Notifications';


const App = () => {
    return (
        <Router>
            <Navbar /> 
            <Routes>
                <Route path="/" element={<Home />} /> 
                <Route path="/login" element={<Login />} /> 
                <Route path="/register" element={<Register/>} />
                <Route path="/tasklist" element={ <AdminOnlyRoute> <TaskList /> </AdminOnlyRoute>} /> 
                <Route path="/taskstatuschart" element={ <AdminOnlyRoute> <TaskStatusChart /> </AdminOnlyRoute>
                } />
             <Route path="/taskstatus" element={<TaskStatus />} />    
                <Route path="/unauthorized" element={<Unauthorized />} /> 
                <Route path="/notifications" element={<Notifications />} /> 
            </Routes>

        </Router>
    );
};

export default App;





