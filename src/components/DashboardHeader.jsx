import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import '../styles/components/DashboardHeader.css';

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };



  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left">
        <h1 className="dashboard-title" onClick={handleHomeClick}>REALCATCHA</h1>
      </div>
      <div className="dashboard-header-right">
        <div className={`user-button ${isDropdownOpen ? 'dropdown-open' : ''}`} onClick={toggleDropdown}>
          <FaUser className="user-profile-icon" />
          <span className="user-button-text">{user?.name || user?.email}</span>
          <span className="user-button-icon">▼</span>
          
          {isDropdownOpen && (
            <div className="user-dropdown">
              <div className="dropdown-item" onClick={handleLogout}>
                로그아웃
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
