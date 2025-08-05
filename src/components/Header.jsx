import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">REAL</Link>
        <nav className="nav">
          <Link 
            to="/products" 
            className={location.pathname === '/products' ? 'nav-link active' : 'nav-link'}
          >
            Products
          </Link>
                                <Link
                        to="/document"
                        className={location.pathname === '/document' ? 'nav-link active' : 'nav-link'}
                      >
                        Document
                      </Link>
                                <Link
                        to="/company"
                        className={location.pathname === '/company' ? 'nav-link active' : 'nav-link'}
                      >
                        Company
                      </Link>
          <Link 
            to="/signin" 
            className={location.pathname === '/signin' ? 'nav-link active' : 'nav-link'}
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header; 