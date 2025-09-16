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
      // 1. 로컬 스토리지 확인 - 다양한 토큰 키 지원
      const token = localStorage.getItem('authToken') || localStorage.getItem('captcha_dashboard_token');
      const userData = localStorage.getItem('captcha_dashboard_user');
      
      // log removed
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setLoading(false);
          // log removed: restore user info
          return;
        } catch (error) {
          // log removed
          localStorage.removeItem('authToken');
          localStorage.removeItem('captcha_dashboard_token');
          localStorage.removeItem('captcha_dashboard_user');
        }
      }
      
      // Google OAuth 토큰이 있는 경우 처리
      if (token === 'google-oauth') {
        // Google OAuth 사용자는 쿠키 기반으로 사용자 정보 확인
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
            // 토큰이 있다면 로컬 스토리지에도 저장 - 다양한 키 지원
            if (data.access_token) {
              localStorage.setItem('captcha_dashboard_token', data.access_token);
              localStorage.setItem('captcha_dashboard_user', JSON.stringify(data.user));
            } else if (token === 'google-oauth') {
              // Google OAuth 토큰이 있는 경우 사용자 정보만 저장
              localStorage.setItem('captcha_dashboard_user', JSON.stringify(data.user));
            }
            // log removed
          } else {
            // 서버 응답에 사용자 정보가 없는 경우
            localStorage.removeItem('authToken');
            localStorage.removeItem('captcha_dashboard_token');
            localStorage.removeItem('captcha_dashboard_user');
          }
        } else {
          // 401 에러 등으로 인증 실패 시 로컬 스토리지 정리
          localStorage.removeItem('authToken');
          localStorage.removeItem('captcha_dashboard_token');
          localStorage.removeItem('captcha_dashboard_user');
        }
      } catch (error) {
        // 네트워크 오류 시에도 로컬 스토리지 정리
        localStorage.removeItem('authToken');
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
      // log removed
      // API 실패해도 로컬 상태는 정리
    }
    
    // 로컬 스토리지 및 상태 정리 - Dashboard와 동일한 키 사용
    localStorage.removeItem('captcha_dashboard_token');
    localStorage.removeItem('captcha_dashboard_user');
    setUser(null);
    setError(null);
  };

  // 토큰 자동 갱신 함수
  const refreshAccessToken = async () => {
    try {
      // log removed
      const response = await fetch('https://gateway.realcatcha.com/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // 쿠키 전송
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.access_token) {
          // 새 액세스 토큰을 localStorage에 저장
          localStorage.setItem('captcha_dashboard_token', data.access_token);
          // log removed
          return data.access_token;
        }
      }
      
      // log removed
      return null;
    } catch (error) {
      // log removed
      return null;
    }
  };

  // API 요청 인터셉터 (토큰 만료 시 자동 갱신)
  const apiRequest = async (url, options = {}) => {
    try {
      // 첫 번째 요청 시도
      let response = await fetch(url, {
        ...options,
        credentials: 'include',
      });

      // 401 에러 (토큰 만료) 시 토큰 갱신 시도
      if (response.status === 401) {
        // log removed
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          // 새 토큰으로 재요청
          // log removed
          response = await fetch(url, {
            ...options,
            credentials: 'include',
          });
        } else {
          // 토큰 갱신 실패 시 로그아웃
          // log removed
          logout();
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
        }
      }

      return response;
    } catch (error) {
      // log removed
      throw error;
    }
  };

  // 회원가입 함수
  const signup = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      // log removed

      const response = await fetch('https://gateway.realcatcha.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // log removed

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
        // log removed
        return { success: false, error: message };
      }

      const data = await response.json();
      // log removed
      return { success: true, message: '회원가입이 완료되었습니다.' };
    } catch (error) {
      // log removed
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
    refreshAccessToken,
    apiRequest,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};