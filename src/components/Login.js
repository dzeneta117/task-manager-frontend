import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importujemo useNavigate
import '../Style/Login.css';
import '../App.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Kreiramo navigate funkciju

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token); // Čuvanje JWT tokena
                localStorage.setItem('role', data.role);  // Čuvanje role
                alert('Uspešan login');
                navigate('/'); // Preusmeravanje na početnu stranicu
                window.location.reload(); 
            } else {
                alert(data.message || 'Došlo je do greške prilikom prijave.');
            }
        } catch (error) {
            console.error('Greška:', error);
        }
    };
    

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Login</h2>
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
                <button type="submit" className="login-button">Prijavi se</button>
            </form>
            <p className="register-text">
                Nemate nalog? <span className="register-link" onClick={() => navigate('/register')}>Registruj se.</span>
            </p>
        </div>
    );
};

export default Login;
