import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardHeader from '../components/DashboardHeader';
import './DashboardEmbed.css';

const DashboardEmbed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [authVerified, setAuthVerified] = useState(false);
  const iframeRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();

  // 인증 상태 확인 및 검증
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // 로컬 스토리지에 토큰이 있는지 확인
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (!token || !userData) {
          console.log('토큰 또는 사용자 데이터가 없음');
          setAuthVerified(true);
          return;
        }

        // 서버에 인증 상태 확인
        const response = await fetch('https://gateway.realcatcha.com/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.success && data.user) {
            console.log('인증 상태 확인 성공');
            setAuthVerified(true);
          } else {
            console.log('서버 응답에 사용자 정보 없음');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            setAuthVerified(true);
          }
        } else {
          console.log('인증 상태 확인 실패:', response.status);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          setAuthVerified(true);
        }
      } catch (error) {
        console.warn('인증 상태 확인 중 오류:', error);
        setAuthVerified(true);
      }
    };

    verifyAuth();
  }, []);

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

  // iframe 로드 완료 시 토큰 전달 및 내부 헤더 숨기기
  const handleIframeLoad = () => {
    setIsLoading(false);
    
    if (authVerified && isAuthenticated && iframeRef.current) {
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

      // iframe 내부의 헤더 숨기기
      setTimeout(() => {
        try {
          const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
          if (iframeDoc) {
            // CSS 스타일 주입
            const style = iframeDoc.createElement('style');
            style.textContent = `
              /* Real Captcha Dashboard 헤더 숨기기 */
              header, 
              .header, 
              [class*="header"], 
              [class*="Header"],
              .dashboard-header,
              .main-header,
              .top-header,
              .app-header {
                display: none !important;
              }
              
              /* 사용자 정보 영역 숨기기 */
              .user-info,
              .user-profile,
              .account-info,
              .profile-section,
              [class*="user"],
              [class*="User"],
              [class*="profile"],
              [class*="Profile"] {
                display: none !important;
              }
              
              /* 메인 콘텐츠 영역을 전체 화면으로 확장 */
              main, 
              .main, 
              .content, 
              .main-content,
              [class*="main"],
              [class*="Main"],
              [class*="content"],
              [class*="Content"] {
                margin-top: 0 !important;
                padding-top: 0 !important;
                height: 100vh !important;
                min-height: 100vh !important;
              }
              
              /* body와 html의 여백 제거 */
              body, html {
                margin: 0 !important;
                padding: 0 !important;
                height: 100% !important;
                overflow: hidden !important;
              }
            `;
            iframeDoc.head.appendChild(style);
          }
        } catch (error) {
          console.warn('iframe 내부 스타일 주입 실패:', error);
        }
      }, 2000); // iframe 로드 후 2초 뒤에 스타일 주입
    }
  };

  // 인증 상태 확인 중이거나 로그인되지 않은 경우
  if (!authVerified || !isAuthenticated) {
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
          src="https://dashboard.realcatcha.com"
          className="dashboard-iframe"
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
};

export default DashboardEmbed;


