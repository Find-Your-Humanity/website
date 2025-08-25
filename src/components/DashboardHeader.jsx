import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/components/DashboardHeader.css';

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  const handleHomeClick = () => {
    navigate('/');
  };



  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left">
        <h1 className="dashboard-title" onClick={handleHomeClick}>REALCATCHA</h1>
      </div>
      <div className="dashboard-header-right">
        <div className="user-button" onClick={handleLogout}>
          <span className="user-button-text">{user?.name || user?.email}</span>
          <span className="user-button-icon">▼</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
