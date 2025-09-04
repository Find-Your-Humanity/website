import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [clickedDropdown, setClickedDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const productsDropdownRef = useRef(null);
  const companyDropdownRef = useRef(null);

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
    // Link의 기본 동작이 완료된 후 메뉴를 닫기 위해 지연 추가
    setTimeout(() => {
      setMobileMenuOpen(false);
      setProductsDropdownOpen(false);
      setCompanyDropdownOpen(false);
      setClickedDropdown(null);
    }, 50);
  };

  // 드롭다운 항목 클릭 핸들러
  const handleDropdownItemClick = (path) => {
    // 드롭다운 즉시 닫기
    setProductsDropdownOpen(false);
    setCompanyDropdownOpen(false);
    setClickedDropdown(null);
    
    // 페이지 이동
    navigate(path);
    
    // 모바일 메뉴 닫기 (지연)
    setTimeout(() => {
      setMobileMenuOpen(false);
    }, 100);
  };

  // Products 드롭다운 토글
  const toggleProductsDropdown = (e) => {
    e.preventDefault();
    if (clickedDropdown === 'products') {
      setProductsDropdownOpen(false);
      setClickedDropdown(null);
    } else {
      setProductsDropdownOpen(!productsDropdownOpen);
      setClickedDropdown(productsDropdownOpen ? null : 'products');
    }
    setCompanyDropdownOpen(false);
  };

  // Company 드롭다운 토글
  const toggleCompanyDropdown = (e) => {
    e.preventDefault();
    if (clickedDropdown === 'company') {
      setCompanyDropdownOpen(false);
      setClickedDropdown(null);
    } else {
      setCompanyDropdownOpen(!companyDropdownOpen);
      setClickedDropdown(companyDropdownOpen ? null : 'company');
    }
    setProductsDropdownOpen(false);
  };

  // Products 드롭다운 호버
  const handleProductsMouseEnter = () => {
    if (clickedDropdown !== 'company') {
      setProductsDropdownOpen(true);
    }
  };

  const handleProductsMouseLeave = () => {
    // 드롭다운 메뉴 내부로 마우스가 이동해도 닫히지 않도록 수정
    setTimeout(() => {
      if (clickedDropdown !== 'products' && !productsDropdownRef.current?.matches(':hover')) {
        setProductsDropdownOpen(false);
      }
    }, 100);
  };

  // Company 드롭다운 호버
  const handleCompanyMouseEnter = () => {
    if (clickedDropdown !== 'products') {
      setCompanyDropdownOpen(true);
    }
  };

  const handleCompanyMouseLeave = () => {
    // 드롭다운 메뉴 내부로 마우스가 이동해도 닫히지 않도록 수정
    setTimeout(() => {
      if (clickedDropdown !== 'company' && !companyDropdownRef.current?.matches(':hover')) {
        setCompanyDropdownOpen(false);
      }
    }, 100);
  };

  // 외부 클릭시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 사용자 드롭다운 외부 클릭
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      
      // Products 드롭다운 외부 클릭
      if (productsDropdownRef.current && !productsDropdownRef.current.contains(event.target)) {
        setProductsDropdownOpen(false);
        setClickedDropdown(null);
      }
      
      // Company 드롭다운 외부 클릭
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target)) {
        setCompanyDropdownOpen(false);
        setClickedDropdown(null);
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

        {/* 모바일 테마 토글 버튼 */}
        <button 
          className="mobile-theme-toggle-header" 
          onClick={toggleTheme} 
          title={theme === 'light' ? '다크모드로 변경' : '라이트모드로 변경'}
          aria-label={theme === 'light' ? '다크모드로 변경' : '라이트모드로 변경'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* 모바일 메뉴 버튼 */}
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* 데스크톱 네비게이션 */}
        <nav className="nav desktop-only">
          {/* Products 드롭다운 */}
          <div 
            className="nav-dropdown" 
            ref={productsDropdownRef}
            onMouseEnter={handleProductsMouseEnter}
            onMouseLeave={handleProductsMouseLeave}
          >
            <button 
              className={`nav-dropdown-button ${location.pathname === '/products' || location.pathname === '/pay' ? 'active' : ''}`}
              onClick={toggleProductsDropdown}
            >
              Products
              <FaChevronDown className={`dropdown-arrow ${productsDropdownOpen ? 'open' : ''}`} />
            </button>
            {productsDropdownOpen && (
              <div className="nav-dropdown-menu">
                <Link to="/products" className="nav-dropdown-item" onClick={() => setProductsDropdownOpen(false)}>
                  Products
                </Link>
                <Link to="/pay" className="nav-dropdown-item" onClick={() => setProductsDropdownOpen(false)}>
                  Prices
                </Link>
              </div>
            )}
          </div>

          {/* Company 드롭다운 */}
          <div 
            className="nav-dropdown" 
            ref={companyDropdownRef}
            onMouseEnter={handleCompanyMouseEnter}
            onMouseLeave={handleCompanyMouseLeave}
          >
            <button 
              className={`nav-dropdown-button ${location.pathname === '/company' || location.pathname === '/contact' ? 'active' : ''}`}
              onClick={toggleCompanyDropdown}
            >
              Company
              <FaChevronDown className={`dropdown-arrow ${companyDropdownOpen ? 'open' : ''}`} />
            </button>
            {companyDropdownOpen && (
              <div className="nav-dropdown-menu">
                <Link to="/company" className="nav-dropdown-item" onClick={() => setCompanyDropdownOpen(false)}>
                  About Us
                </Link>
                <Link to="/contact" className="nav-dropdown-item" onClick={() => setCompanyDropdownOpen(false)}>
                  Contact Us
                </Link>
              </div>
            )}
          </div>

          <Link to="/document" className={location.pathname === '/document' ? 'nav-link active' : 'nav-link'}>
            Document
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'nav-link active' : 'nav-link'}>
              Dashboard
            </Link>
          )}
        </nav>

        <div className="auth-area">
          {/* 테마 토글 버튼 - Sign In/프로필 버튼 좌측에 배치 */}
          <button 
            className="theme-toggle" 
            onClick={toggleTheme} 
            title={theme === 'light' ? '다크모드로 변경' : '라이트모드로 변경'}
            aria-label={theme === 'light' ? '다크모드로 변경' : '라이트모드로 변경'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
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
            {/* 모바일 Products 드롭다운 */}
            <div className="mobile-dropdown">
              <button 
                className={`mobile-dropdown-button ${location.pathname === '/products' || location.pathname === '/pay' ? 'active' : ''}`}
                onClick={() => {
                  setProductsDropdownOpen(!productsDropdownOpen);
                  setCompanyDropdownOpen(false);
                  setClickedDropdown(productsDropdownOpen ? null : 'products');
                }}
              >
                Products
                <FaChevronDown className={`mobile-dropdown-arrow ${productsDropdownOpen ? 'open' : ''}`} />
              </button>
              {productsDropdownOpen && (
                <div className="mobile-dropdown-menu">
                  <button 
                    className="mobile-dropdown-item" 
                    onClick={() => handleDropdownItemClick('/products')}
                  >
                    Products
                  </button>
                  <button 
                    className="mobile-dropdown-item" 
                    onClick={() => handleDropdownItemClick('/pay')}
                  >
                    Prices
                  </button>
                </div>
              )}
            </div>

            {/* 모바일 Company 드롭다운 */}
            <div className="mobile-dropdown">
              <button 
                className={`mobile-dropdown-button ${location.pathname === '/company' || location.pathname === '/contact' ? 'active' : ''}`}
                onClick={() => {
                  setCompanyDropdownOpen(!companyDropdownOpen);
                  setProductsDropdownOpen(false);
                  setClickedDropdown(companyDropdownOpen ? null : 'company');
                }}
              >
                Company
                <FaChevronDown className={`mobile-dropdown-arrow ${companyDropdownOpen ? 'open' : ''}`} />
              </button>
              {companyDropdownOpen && (
                <div className="mobile-dropdown-menu">
                  <button 
                    className="mobile-dropdown-item" 
                    onClick={() => handleDropdownItemClick('/company')}
                  >
                    About Us
                  </button>
                  <button 
                    className="mobile-dropdown-item" 
                    onClick={() => handleDropdownItemClick('/contact')}
                  >
                    Contact Us
                  </button>
                </div>
              )}
            </div>

            <Link to="/document" className={location.pathname === '/document' ? 'mobile-nav-link active' : 'mobile-nav-link'} onClick={handleNavClick}>
              Document
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