import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const DashboardEmbed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    
    // 대시보드에서 로그아웃 메시지 수신 처리
    const handleMessage = (event) => {
      if (event.origin !== 'https://dashboard.realcatcha.com') {
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

  // iframe 로드 완료 시 토큰 전달
  const handleIframeLoad = () => {
    setIsLoading(false);
    
    if (isAuthenticated && iframeRef.current) {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        // 대시보드로 인증 정보 전달
        setTimeout(() => {
          iframeRef.current.contentWindow.postMessage({
            type: 'AUTH_TOKEN',
            token: token,
            user: JSON.parse(userData)
          }, 'https://dashboard.realcatcha.com');
        }, 1000); // iframe이 완전히 로드될 때까지 잠시 대기
      }
    }
  };

  // 로그인되지 않은 경우
  if (!isAuthenticated) {
    return (
      <div style={{height: 'calc(100vh - 140px)', display:'flex', alignItems:'center', justifyContent:'center'}}>
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
    <div style={{height: 'calc(100vh - 140px)', display:'flex', flexDirection:'column'}}>
      <div style={{height: 12}} />
      <div style={{position:'relative', flex:1, borderRadius: 12, overflow:'hidden', boxShadow:'0 8px 24px rgba(0,0,0,0.15)'}}>
        {isLoading && (
          <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg, rgba(138,43,226,0.08), rgba(32,223,223,0.08))'}}>
            <div className="spinner" />
          </div>
        )}
        <iframe
          ref={iframeRef}
          title="Realcatcha Dashboard"
          src="https://dashboard.realcatcha.com"
          style={{ width: '100%', height: '100%', border: 'none', background:'#fff' }}
          onLoad={handleIframeLoad}
        />
      </div>
      <div style={{height: 12}} />
    </div>
  );
};

export default DashboardEmbed;


