import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SidebarMenu.css';
import { FaCog, FaRegSave, FaSignOutAlt } from 'react-icons/fa';

const SidebarMenu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer les données d'authentification
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('name');

    // Recharger la page pour réinitialiser l'état
    window.location.href = '/';
  };

  return (
    <div className="sidebar-menu">
      <div className="icon-container">
        <FaCog className="icon" />
      </div>
      <div className="icon-container bottom" onClick={handleLogout}>
        <FaSignOutAlt className="icon" />
      </div>
    </div>
  );
};

export default SidebarMenu;