import React, { useEffect, useState } from 'react';
import Map from './Map';
import Login from './Login';
import Header from './Header';
import Greeting from './Greeting';
import './Home.css';

const Home = () => {
    const [name, setName] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    // Vérifier l'authentification au chargement et après connexion
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const storedName = localStorage.getItem('name');
            const user = localStorage.getItem('user');

            if (token && user) {
                try {
                    const userData = JSON.parse(user);
                    setName(userData.name || storedName);
                    setIsAuthenticated(true);
                    setShowLogin(false);
                } catch (error) {
                    console.error('Error parsing user data:', error);
                }
            }
        };

        checkAuth();
    }, []);

    const handleLoginSuccess = (userData) => {
        console.log('Login success:', userData); // Debug log
        localStorage.setItem('name', userData.name);
        localStorage.setItem('user', JSON.stringify(userData));
        setName(userData.name);
        setIsAuthenticated(true);
        setShowLogin(false);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setName('');
        localStorage.removeItem('name');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <div className="home-container">
            <Header
                isAuthenticated={isAuthenticated}
                name={name}
                handleLogout={handleLogout}
                setShowLogin={setShowLogin}
            />
            {showLogin && (
                <div className="login-popup">
                    <div className="login-popup-content">
                        <button className="close-button" onClick={() => setShowLogin(false)}>X</button>
                        <Login onLoginSuccess={handleLoginSuccess} />
                    </div>
                </div>
            )}
            <div className="main-content">
                <div className="map-container">
                    <Greeting name={name} />
                    <Map />
                </div>
            </div>
        </div>
    );
};

export default Home;