import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMyInquiries = () => {
    navigate('/my-inquiries');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  // 외부 클릭시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">REALCATCHA</Link>

        {/* 모바일 메뉴 버튼 */}
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* 데스크톱 네비게이션 */}
        <nav className="nav desktop-only">
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
            Contact Us
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'nav-link active' : 'nav-link'}>
              Dashboard
            </Link>
          )}
        </nav>

        <div className="auth-area">
          {isAuthenticated ? (
            <div className="user-menu desktop-only" ref={dropdownRef}>
              <button className="user-button" onClick={toggleDropdown}>
                <div className="user-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                    <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
                  </svg>
                </div>
                                 <span className="user-name">{user?.name || user?.username || user?.email || '사용자'}</span>
                <svg className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 10L12 15L17 10H7Z" fill="currentColor"/>
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="user-info">
                      <div className="user-avatar-large">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                          <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="user-details">
                                                 <div className="user-display-name">{user?.name || user?.username || '사용자'}</div>
                        <div className="user-email">{user?.email}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={handleMyInquiries}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
                        <path d="M7 9H17V11H7V9ZM7 12H17V14H7V12ZM7 6H17V8H7V6Z" fill="currentColor"/>
                      </svg>
                      <span>문의사항 확인</span>
                    </button>
                    
                    <div className="dropdown-divider"></div>
                    
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7Z" fill="currentColor"/>
                        <path d="M5 5H12V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H12V19H5V5Z" fill="currentColor"/>
                      </svg>
                      <span>로그아웃</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signin" className="nav-link desktop-only">
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            <Link to="/products" className={location.pathname === '/products' ? 'mobile-nav-link active' : 'mobile-nav-link'} onClick={handleNavClick}>
              Products
            </Link>
            <Link to="/company" className={location.pathname === '/company' ? 'mobile-nav-link active' : 'mobile-nav-link'} onClick={handleNavClick}>
              Company
            </Link>
            <Link to="/document" className={location.pathname === '/document' ? 'mobile-nav-link active' : 'mobile-nav-link'} onClick={handleNavClick}>
              Document
            </Link>
            <Link to="/contact" className={location.pathname === '/contact' ? 'mobile-nav-link active' : 'mobile-nav-link'} onClick={handleNavClick}>
              Contact Us
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'mobile-nav-link active' : 'mobile-nav-link'} onClick={handleNavClick}>
                Dashboard
              </Link>
            )}
          </nav>
          
          <div className="mobile-auth">
            {isAuthenticated ? (
              <div className="mobile-user-menu">
                <div className="mobile-user-info">
                  <div className="mobile-user-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                      <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="mobile-user-details">
                                         <div className="mobile-user-name">{user?.name || user?.username || '사용자'}</div>
                    <div className="mobile-user-email">{user?.email}</div>
                  </div>
                </div>
                
                <div className="mobile-menu-items">
                  <button className="mobile-menu-item" onClick={handleMyInquiries}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
                      <path d="M7 9H17V11H7V9ZM7 12H17V14H7V12ZM7 6H17V8H7V6Z" fill="currentColor"/>
                    </svg>
                    <span>문의사항 확인</span>
                  </button>
                  
                  <button className="mobile-menu-item logout-item" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7Z" fill="currentColor"/>
                      <path d="M5 5H12V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H12V19H5V5Z" fill="currentColor"/>
                    </svg>
                    <span>로그아웃</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/signin" className="mobile-signin" onClick={handleNavClick}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 