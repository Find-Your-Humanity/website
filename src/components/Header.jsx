import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">REALCATCHA</Link>

        <nav className="nav">
          <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>
            realcatcha
          </Link>
          <Link to="/products" className={location.pathname === '/products' ? 'nav-link active' : 'nav-link'}>
            Products
          </Link>
          <Link to="/company" className={location.pathname === '/company' ? 'nav-link active' : 'nav-link'}>
            Company
          </Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'nav-link active' : 'nav-link'}>
            문의하기
          </Link>
          {isAuthenticated && (
            <a href="https://dashboard.realcatcha.com" target="_blank" rel="noopener noreferrer" className="nav-link">
              대시보드 ↗
            </a>
          )}
        </nav>

        <div className="auth-area">
          {isAuthenticated ? (
            <button className="logout-button" onClick={handleLogout}>로그아웃</button>
          ) : (
            <Link to="/signin" className={location.pathname === '/signin' ? 'nav-link active' : 'nav-link'}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 