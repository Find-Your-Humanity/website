import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/DashboardEmbed.css';

const DashboardEmbed = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [stats, setStats] = useState({
    totalRequests: 125430,
    successRate: 94.8,
    avgResponseTime: 245,
    activeUsers: 1247
  });

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
          <div className="brand-logo">REALCATCHA</div>
          <nav className="header-nav">
            <a href="#" className="nav-link">realcatcha</a>
            <a href="#" className="nav-link">Products</a>
            <a href="#" className="nav-link">Company</a>
            <a href="#" className="nav-link">Document</a>
            <a href="#" className="nav-link">Contact-us</a>
            <a href="#" className="nav-link active">Dashboard</a>
          </nav>
        </div>
        <div className="header-right">
          <div className="user-section">
            <div className="user-icon">👤</div>
            <span className="user-name">전남규</span>
            <span className="dropdown-arrow">▼</span>
            <button className="logout-button">→</button>
          </div>
        </div>
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
            <div className="nav-item active">
              <span className="nav-icon">📊</span>
              <span className="nav-text">대시보드</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon">📈</span>
              <span className="nav-text">분석</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon">👥</span>
              <span className="nav-text">사용자 관리</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon">💳</span>
              <span className="nav-text">요금제 관리</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon">📧</span>
              <span className="nav-text">요청사항</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon">📊</span>
              <span className="nav-text">요청 상태</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">설정</span>
            </div>
          </nav>
          
          <div className="sidebar-footer">
            <span className="version-text">v1.0.0</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          <div className="main-header">
            <div className="header-content">
              <h1 className="main-title">Real Captcha Dashboard</h1>
              <h2 className="main-subtitle">대시보드</h2>
              <p className="main-description">Real Captcha 서비스 모니터링 및 관리</p>
            </div>
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
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue">🛡️</div>
                <div className="stat-content">
                  <div className="stat-value blue">{stats.totalRequests.toLocaleString()}</div>
                  <div className="stat-label">총 요청 수</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon green">📈</div>
                <div className="stat-content">
                  <div className="stat-value green">{stats.successRate}%</div>
                  <div className="stat-label">성공률</div>
                  <div className="stat-subtitle">118,920 / 125,430</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon orange">🔄</div>
                <div className="stat-content">
                  <div className="stat-value orange">{stats.avgResponseTime}ms</div>
                  <div className="stat-label">평균 응답 시간</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon purple">👥</div>
                <div className="stat-content">
                  <div className="stat-value purple">{stats.activeUsers.toLocaleString()}</div>
                  <div className="stat-label">현재 활성 사용자</div>
                  <div className="stat-subtitle">125/분</div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
              <h3 className="section-title">시간별 요청 현황</h3>
              <div className="chart-container">
                <div className="chart-placeholder">
                  <div className="chart-line blue"></div>
                  <div className="chart-line green"></div>
                  <div className="chart-points">
                    <div className="chart-point"></div>
                    <div className="chart-point"></div>
                    <div className="chart-point"></div>
                    <div className="chart-point"></div>
                    <div className="chart-point"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Alerts */}
            <div className="alerts-section">
              <h3 className="section-title">실시간 알림</h3>
              <div className="alerts-list">
                <div className="alert-item success">
                  <span className="alert-icon">✅</span>
                  <span className="alert-text">모든 서비스가 정상 작동 중입니다.</span>
                </div>
                <div className="alert-item warning">
                  <span className="alert-icon">⚠️</span>
                  <span className="alert-text">GPU 풀 사용률이 85%에 도달했습니다.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEmbed;


