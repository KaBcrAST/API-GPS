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

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setName(storedName);
            setIsAuthenticated(true);
        }
    }, []);

    const handleLoginSuccess = (userName) => {
        setName(userName);
        setIsAuthenticated(true);
        setShowLogin(false);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setName('');
        localStorage.removeItem('name');
        localStorage.removeItem('token');
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