import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/DashboardEmbed.css';

const DashboardEmbed = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // 로그인되지 않은 경우
  if (!isAuthenticated) {
    return (
      <div className="dashboard-login-required">
        <div className="login-required-content">
          <h3>대시보드 접근</h3>
          <p>대시보드를 이용하려면 먼저 로그인해주세요.</p>
          <button 
            className="login-button"
            onClick={() => window.location.href = '/signin'}
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="brand-logo">대시보드</div>
          <nav className="header-nav">
            <a href="#" className="nav-link">ORCA ERP</a>
            <a href="#" className="nav-link">문의하기</a>
            <a href="#" className="nav-link active">대시보드</a>
          </nav>
        </div>
        <div className="header-right">
          <div className="user-section">
            <span className="logout-text">로그아웃</span>
            <div className="user-icon">👤</div>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <span>Dashboard</span>
        <span className="breadcrumb-separator">{'>'}</span>
        <span>서비스 관리</span>
        <span className="breadcrumb-separator">{'>'}</span>
        <span>ERP 신청</span>
      </div>

      <div className="dashboard-content">
        {/* Left Sidebar */}
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <span className="brand-icon">🛡️</span>
              <span className="brand-text">Real</span>
            </div>
          </div>
          
          <nav className="sidebar-nav">
            <div className="nav-category">
              <div className="nav-category-title">서비스 관리</div>
              <div className="nav-item active">
                <span className="nav-icon">📊</span>
                <span className="nav-text">ERP 구독 관리</span>
              </div>
            </div>
            
            <div className="nav-category">
              <div className="nav-category-title">결제 관리</div>
              <div className="nav-item">
                <span className="nav-icon">💰</span>
                <span className="nav-text">이번달 청구 금액</span>
              </div>
              <div className="nav-item">
                <span className="nav-icon">💳</span>
                <span className="nav-text">카드 관리</span>
              </div>
              <div className="nav-item">
                <span className="nav-icon">📋</span>
                <span className="nav-text">결제 히스토리</span>
              </div>
            </div>
            
            <div className="nav-category">
              <div className="nav-category-title">회사 정보</div>
              <div className="nav-item">
                <span className="nav-icon">🏢</span>
                <span className="nav-text">입점사 정보</span>
              </div>
            </div>
            
            <div className="nav-category">
              <div className="nav-category-title">고객 센터</div>
              <div className="nav-item">
                <span className="nav-icon">📞</span>
                <span className="nav-text">문의 사항</span>
              </div>
            </div>
          </nav>
          
          <div className="sidebar-footer">
            <span className="version-text">v1.0.0</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          <div className="main-header">
            <h1 className="main-title">ERP 신청</h1>
            <div className="main-status">
              <div className="status-info">
                <span className="last-update">마지막 업데이트: {lastUpdate.toLocaleTimeString()}</span>
                <button className="refresh-button">🔄</button>
              </div>
              <div className="status-badge">
                <span className="status-icon">✅</span>
                <span className="status-text">정상 운영</span>
              </div>
            </div>
          </div>

          <div className="main-content">
            <div className="erp-creation-section">
              <div className="erp-creation-message">
                <h2>ERP 생성중입니다.</h2>
                <button className="subscribe-button">지금부터 구독하기</button>
              </div>
            </div>

            <div className="usage-features-section">
              <h3 className="section-title">사용 기능</h3>
              
              <div className="subscription-duration">
                <div className="duration-buttons">
                  <button className="duration-btn active">매달</button>
                  <button className="duration-btn">3개월</button>
                  <button className="duration-btn">6개월</button>
                  <button className="duration-btn">1년</button>
                </div>
                <span className="currency-unit">(단위: 원)</span>
              </div>

              <div className="pricing-table">
                <table className="plans-table">
                  <thead>
                    <tr>
                      <th>ERP 기능/패키지</th>
                      <th>BASIC</th>
                      <th>STANDARD</th>
                      <th>PRO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="price-row">
                      <td>가격 안내</td>
                      <td>인당 4,900 /월</td>
                      <td>
                        <div className="standard-offer">
                          <span>인당 10,000 /월</span>
                          <div className="offer-badge">
                            <span>✅</span>
                            <span>최초 가입 시 한 달 무료</span>
                          </div>
                        </div>
                      </td>
                      <td>인당 50,000 /월</td>
                    </tr>
                    <tr>
                      <td>생산 관리</td>
                      <td>
                        <div className="feature-item">
                          <span className="feature-icon">🔧</span>
                          <span>기본 생산 관리</span>
                          <span className="feature-tag basic">BASIC</span>
                        </div>
                      </td>
                      <td>
                        <div className="feature-item">
                          <span className="feature-icon">🔧</span>
                          <span>기본 생산 관리</span>
                        </div>
                      </td>
                      <td>
                        <div className="feature-item">
                          <span className="feature-icon">🔧</span>
                          <span>기본 생산 관리</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        <div className="feature-item">
                          <span className="feature-icon">🤖</span>
                          <span>AI 자동 생산 지시</span>
                          <span className="feature-tag pro">PRO</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>재고 관리</td>
                      <td>
                        <div className="feature-item">
                          <span className="feature-icon">📦</span>
                          <span>기본 재고 관리</span>
                          <span className="feature-tag basic">BASIC</span>
                        </div>
                      </td>
                      <td>
                        <div className="feature-item">
                          <span className="feature-icon">📦</span>
                          <span>기본 재고 관리</span>
                        </div>
                      </td>
                      <td>
                        <div className="feature-item">
                          <span className="feature-icon">📦</span>
                          <span>기본 재고 관리</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEmbed;


