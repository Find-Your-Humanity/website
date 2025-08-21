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

  const handleContactUsClick = () => {
    navigate('/contact');
  };

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left">
        <h1 className="dashboard-title">대시보드</h1>
        <div className="dashboard-nav">
          <h2 className="nav-item" onClick={handleHomeClick}>realcatcha</h2>
          <h2 className="nav-item" onClick={handleContactUsClick}>contact-us</h2>
          <h2 className="nav-item">대시보드</h2>
        </div>
      </div>
      <div className="dashboard-header-right">
        <div className="user-info">
          <span className="user-name">{user?.name || user?.email}</span>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
