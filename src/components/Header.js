import React from 'react';
import './Header.css';

const Header = ({ isAuthenticated, name, handleLogout, setShowLogin }) => {
    return (
        <header className="header-container">
            {isAuthenticated ? (
                <div className="user-info">
                    {name}
                    <button className="logout-button" onClick={handleLogout}>Déconnexion</button>
                </div>
            ) : (
                <button className="login-button" onClick={() => setShowLogin(true)}>Se connecter</button>
            )}
        </header>
    );
};

export default Header;