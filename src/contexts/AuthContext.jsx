import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 사용자 정보 복원 (로컬 스토리지 + 쿠키 기반 자동 로그인)
  useEffect(() => {
    const initAuth = async () => {
      // 1. 로컬 스토리지 확인 - Dashboard와 동일한 키 사용
      const token = localStorage.getItem('captcha_dashboard_token');
      const userData = localStorage.getItem('captcha_dashboard_user');
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
          setLoading(false);
          return;
        } catch (error) {
          console.error('사용자 데이터 파싱 오류:', error);
          localStorage.removeItem('captcha_dashboard_token');
          localStorage.removeItem('captcha_dashboard_user');
        }
      }
      
      // 2. 쿠키 기반 자동 로그인 시도 (401 오류 조용히 처리)
      try {
        const response = await fetch('https://gateway.realcatcha.com/api/auth/me', {
          method: 'GET',
          credentials: 'include', // 쿠키 전송
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.success && data.user) {
            setUser(data.user);
            // 토큰이 있다면 로컬 스토리지에도 저장 - Dashboard와 동일한 키 사용
            if (data.access_token) {
              localStorage.setItem('captcha_dashboard_token', data.access_token);
              localStorage.setItem('captcha_dashboard_user', JSON.stringify(data.user));
            }
            console.log('쿠키 기반 자동 로그인 완료:', data.user);
          } else {
            // 서버 응답에 사용자 정보가 없는 경우
            localStorage.removeItem('captcha_dashboard_token');
            localStorage.removeItem('captcha_dashboard_user');
          }
        } else {
          // 401 에러 등으로 인증 실패 시 로컬 스토리지 정리
          localStorage.removeItem('captcha_dashboard_token');
          localStorage.removeItem('captcha_dashboard_user');
        }
      } catch (error) {
        // 네트워크 오류 시에도 로컬 스토리지 정리
        localStorage.removeItem('captcha_dashboard_token');
        localStorage.removeItem('captcha_dashboard_user');
      }
      
      setLoading(false);
    };
    
    initAuth();
  }, []);

  // 로그인 함수 (이메일/비밀번호)
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      // API 호출 (절대 경로로 변경) - 쿠키 전송 포함
      const response = await fetch('https://gateway.realcatcha.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 전송/수신 허용
        body: JSON.stringify({ email, password }),
      });

      // 서버 응답 본문 먼저 파싱 (에러 메시지 활용)
      let data = null;
      try {
        data = await response.clone().json();
      } catch (_) {}

      if (!response.ok) {
        const detail = data?.detail || data?.message;
        const friendly = typeof detail === 'string' && detail
          ? detail
          : '없는 이메일 또는 비밀번호가 올바르지 않습니다.';
        throw new Error(friendly);
      }

      if (!data) {
        data = await response.json();
      }
      
      // 토큰과 사용자 정보 저장 - Dashboard와 동일한 키 사용
      localStorage.setItem('captcha_dashboard_token', data.access_token);
      localStorage.setItem('captcha_dashboard_user', JSON.stringify(data.user));
      
      setUser(data.user);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth 로그인 함수
  const loginWithGoogle = (userData) => {
    try {
      setError(null);
      setUser(userData);
      localStorage.setItem('captcha_dashboard_user', JSON.stringify(userData));
      localStorage.setItem('captcha_dashboard_token', 'google-oauth');
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      // 백엔드에 로그아웃 요청 (쿠키 제거)
      await fetch('https://gateway.realcatcha.com/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // 쿠키 전송 허용
      });
    } catch (error) {
      console.warn('로그아웃 API 호출 실패:', error);
      // API 실패해도 로컬 상태는 정리
    }
    
    // 로컬 스토리지 및 상태 정리 - Dashboard와 동일한 키 사용
    localStorage.removeItem('captcha_dashboard_token');
    localStorage.removeItem('captcha_dashboard_user');
    setUser(null);
    setError(null);
  };

  // 회원가입 함수
  const signup = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      console.log('🚀 Signup 요청 시작:', userData);
      console.log('📡 API URL:', 'https://gateway.realcatcha.com/api/auth/signup');

      const response = await fetch('https://gateway.realcatcha.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('📨 응답 상태:', response.status);
      console.log('📨 응답 헤더:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let message = `회원가입에 실패했습니다. (${response.status})`;
        try {
          const maybeJson = await response.clone().json();
          if (maybeJson && maybeJson.detail) {
            message = maybeJson.detail;
          }
        } catch (_) {
          try {
            const text = await response.text();
            if (text) message = text;
          } catch (_) {}
        }
        console.error('❌ 응답 오류 메시지:', message);
        return { success: false, error: message };
      }

      const data = await response.json();
      console.log('✅ 회원가입 성공:', data);
      return { success: true, message: '회원가입이 완료되었습니다.' };
    } catch (error) {
      console.error('❌ 회원가입 오류:', error);
      const fallback = error?.message || '회원가입 중 오류가 발생했습니다.';
      setError(fallback);
      return { success: false, error: fallback };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    logout,
    signup,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};