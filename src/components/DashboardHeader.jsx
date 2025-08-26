import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSearch, FaBars } from 'react-icons/fa';
import '../styles/components/DashboardHeader.css';

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
    setIsDropdownOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleMyInquiries = () => {
    navigate('/my-inquiries');
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 외부 클릭시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <h1 className="dashboard-title" onClick={handleHomeClick}>REALCATCHA</h1>
        </div>
        
        {/* 데스크톱 검색 입력창 */}
        <div className="dashboard-search-container desktop-only">
          <FaSearch className="dashboard-search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="dashboard-search-input"
          />
        </div>
        
        <div className="dashboard-header-right">
          {/* 모바일 메뉴 버튼 */}
          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            <FaBars />
          </button>
          
          {/* 데스크톱 사용자 메뉴 */}
          <div className="user-menu desktop-only" ref={dropdownRef}>
            <button className="user-button" onClick={toggleDropdown}>
              <div className="user-avatar">
                <FaUser />
              </div>
              <span className="user-name">{user?.name || user?.email || '사용자'}</span>
              <svg className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10L12 15L17 10H7Z" fill="currentColor"/>
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="user-info">
                    <div className="user-avatar-large">
                      <FaUser />
                    </div>
                    <div className="user-details">
                      <div className="user-display-name">{user?.name || '사용자'}</div>
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
        </div>
      </header>

      {/* 모바일 검색창 및 사용자 메뉴 */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-search-container">
            <FaSearch className="mobile-search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mobile-search-input"
            />
          </div>
          
          <div className="mobile-user-menu">
            <div className="mobile-user-info">
              <div className="mobile-user-avatar">
                <FaUser />
              </div>
              <div className="mobile-user-details">
                <div className="mobile-user-name">{user?.name || '사용자'}</div>
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
        </div>
      )}
    </>
  );
};

export default DashboardHeader;
