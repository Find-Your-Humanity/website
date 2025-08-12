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
          <Link to="/document" className={location.pathname === '/document' ? 'nav-link active' : 'nav-link'}>
            Document
          </Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'nav-link active' : 'nav-link'}>
            Contact-us
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'nav-link active' : 'nav-link'}>
              Dashboard
            </Link>
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