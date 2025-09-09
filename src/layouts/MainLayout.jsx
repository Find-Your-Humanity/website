import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const location = useLocation();
  
  // 대시보드 경로 감지 - 새로운 경로들 포함  
  const isDashboard = location.pathname.startsWith('/app/') || 
                     location.pathname.startsWith('/admin/') ||
                     location.pathname === '/dashboard';

  return (
    <div className="main-layout">
      {/* 모든 페이지에서 헤더 표시 */}
      <Header />
      <main className={`main-content ${isDashboard ? 'dashboard-content' : ''}`}>
        {children}
      </main>
      {/* 대시보드가 아닌 페이지에서만 푸터 표시 */}
      {!isDashboard && <Footer />}
    </div>
  );
};

export default MainLayout; 