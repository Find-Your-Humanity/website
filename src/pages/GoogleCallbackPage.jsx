import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/GoogleCallbackPage.css';

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Google 로그인 처리 중...');

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('Google 로그인이 취소되었습니다.');
          setTimeout(() => navigate('/signin'), 3000);
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('인증 코드를 받지 못했습니다.');
          setTimeout(() => navigate('/signin'), 3000);
          return;
        }

        // 백엔드로 코드 전송하여 로그인 완료
        const response = await fetch(`https://gateway.realcatcha.com/api/auth/google/callback?code=${code}`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('success');
          setMessage('Google 로그인이 완료되었습니다!');
          
          // AuthContext 상태 업데이트
          if (data.user) {
            // AuthContext 상태 업데이트
            loginWithGoogle(data.user);
          }
          
          // 2초 후 홈으로 리디렉트
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.detail || 'Google 로그인에 실패했습니다.');
          setTimeout(() => navigate('/signin'), 3000);
        }
      } catch (error) {
        console.error('Google callback error:', error);
        setStatus('error');
        setMessage('로그인 처리 중 오류가 발생했습니다.');
        setTimeout(() => navigate('/signin'), 3000);
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="google-callback-page">
      <div className="callback-container">
        <div className="callback-card">
          <div className="callback-icon">
            {status === 'processing' && <div className="spinner"></div>}
            {status === 'success' && <div className="success-icon">✓</div>}
            {status === 'error' && <div className="error-icon">✗</div>}
          </div>
          
          <h2 className="callback-title">
            {status === 'processing' && 'Google 로그인 처리 중...'}
            {status === 'success' && '로그인 성공!'}
            {status === 'error' && '로그인 실패'}
          </h2>
          
          <p className="callback-message">{message}</p>
          
          {status === 'processing' && (
            <div className="loading-text">잠시만 기다려주세요...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
