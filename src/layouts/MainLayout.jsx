import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const location = useLocation();
  
  // 대시보드 경로 감지 개선 - 새로운 경로들 포함
  const isDashboard = location.pathname.startsWith('/app/') || 
                     location.pathname.startsWith('/admin/') ||
                     location.pathname === '/dashboard';

  return (
    <div className="main-layout">
      {!isDashboard && <Header />}
      <main className={`main-content ${isDashboard ? 'dashboard-content' : ''}`}>
        {children}
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
};

export default MainLayout; 