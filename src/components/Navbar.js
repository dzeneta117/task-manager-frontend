import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Importuj useLocation
import '../Style/Navbar.css';
import '../App.css';
import loggo from '../loggo.png';

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation(); // Kreiraj location objekat

    useEffect(() => {
        // Proveri da li je korisnik ulogovan (npr. da li postoji JWT token)
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        setIsAuthenticated(false); 
    };

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    if (isAuthPage) return null;

    return (
        <nav className="navbar">
            <ul className="navbar-menu">
            <div className="navbar-logo">
                <a href="/" className="navbar-logo-link">
                    <img src={loggo} alt="Logo" className="navbar-logo-image" />
                    <h2 className="navbar-logo-text">Enterijeri Ruža</h2>
                </a>
            </div>
            <li className="navbar-item">
                    <a href="/tasklist" className="navbar-link">Svi zadaci</a>
                </li>
            <li className="navbar-item">
                    <a href="/taskstatus" className="navbar-link">Dnevni zadaci</a>
                </li>
            
                <li className="navbar-item">
                    <a href="/taskstatuschart" className="navbar-link">Statistika</a>
                </li>
                {isAuthenticated ? (
                    <li className="navbar-item" onClick={handleLogout}>
                        <a href="/" className="navbar-link">Odjavi se</a> 
                    </li>
                ) : (
                    <li className="navbar-item">
                        <a href="/login" className="navbar-link">Prijavi se</a>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;


