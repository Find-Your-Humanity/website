import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardHeader from '../components/DashboardHeader';
import './DashboardEmbed.css';

const DashboardEmbed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [authVerified, setAuthVerified] = useState(false);
  const iframeRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();

  // 인증 상태 확인 및 검증 - 즉시 실행
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // AuthContext의 인증 상태를 그대로 사용
        console.log('AuthContext 인증 상태 확인:', isAuthenticated);
        setAuthVerified(true);
      } catch (error) {
        console.warn('인증 상태 확인 중 오류:', error);
        setAuthVerified(true);
      }
    };

    verifyAuth();
  }, [isAuthenticated]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800); // 로딩 시간 단축
    
    // 대시보드에서 로그아웃 메시지 수신 처리
    const handleMessage = (event) => {
      if (event.origin !== 'https://dashboard.realcatcha.com' && event.origin !== 'https://www.dashboard.realcatcha.com') {
        return;
      }
      
      if (event.data.type === 'LOGOUT') {
        // 대시보드에서 로그아웃했으면 웹사이트도 로그아웃
        logout();
        // 로그인 페이지로 리다이렉트
        window.location.href = '/signin';
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('message', handleMessage);
    };
  }, [logout]);

  // iframe 로드 완료 시 토큰 전달 및 내부 헤더 숨기기
  const handleIframeLoad = () => {
    setIsLoading(false);
    
    if (authVerified && isAuthenticated && iframeRef.current) {
      const token = localStorage.getItem('captcha_token');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        // 대시보드로 인증 정보 전달
        setTimeout(() => {
          const dashboardOrigin = 'https://dashboard.realcatcha.com';
          iframeRef.current.contentWindow.postMessage({
            type: 'AUTH_TOKEN',
            token: token,
            user: JSON.parse(userData)
          }, dashboardOrigin);
        }, 500); // 대기 시간 단축
      }
    }
  };

  // 인증 상태 확인 중이거나 로그인되지 않은 경우
  if (!authVerified) {
    return (
      <div style={{height: '100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{textAlign: 'center', padding: 40}}>
          <div className="spinner" style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #1976d2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <h3>대시보드 로딩 중...</h3>
          <p>인증 상태를 확인하고 있습니다.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{height: '100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{textAlign: 'center', padding: 40}}>
          <h3>대시보드 접근</h3>
          <p>대시보드를 이용하려면 먼저 로그인해주세요.</p>
          <button 
            style={{
              padding: '12px 24px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            onClick={() => window.location.href = '/signin'}
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{height: '100vh', display:'flex', flexDirection:'column', overflow: 'hidden'}}>
      <DashboardHeader />
      <div className="dashboard-iframe-container" style={{position:'relative', flex:1, overflow:'hidden'}}>
        {isLoading && (
          <div className="dashboard-loading">
            <div className="spinner" />
          </div>
        )}
        <iframe
          ref={iframeRef}
          title="Realcatcha Dashboard"
          src="https://dashboard.realcatcha.com/"
          className="dashboard-iframe"
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
};

export default DashboardEmbed;


