import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/Task.css';
import '../App.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('worker'); // Dodajemo state za ulogu
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, role }), // Dodajemo role
            });

            const data = await response.json();
            if (response.ok) {
                alert('Registracija uspešna');
                navigate('/login');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Greška:', error);
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleRegister}>
                <h2>Registracija</h2>
                <div className="form-group">
                    <label>Korisničko ime:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Lozinka:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Uloga:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} required>
                        <option value="worker">Radnik</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>
                <button type="submit" className="register-button">Registruj se</button>
            </form>
        </div>
    );
};

export default Register;
