import React from 'react';
import './SidebarMenu.css';
import { FaCog, FaRegSave, FaSignOutAlt } from 'react-icons/fa';

const SidebarMenu = () => {
  return (
    <div className="sidebar-menu">
      <div className="icon-container">
        <FaCog className="icon" />
      </div>
      <div className="icon-container">
        <FaRegSave className="icon" />
      </div>
      <div className="icon-container bottom">
        <FaSignOutAlt className="icon" />
      </div>
    </div>
  );
};

export default SidebarMenu;