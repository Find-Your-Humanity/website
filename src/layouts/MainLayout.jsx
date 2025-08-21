import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

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