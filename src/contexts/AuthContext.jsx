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
  
  // 하위 호환: 인증 상태 헬퍼
  const isLoggedIn = !!user;
  const isAuthenticated = () => !!user;

  // 토큰 갱신 함수
  const refreshToken = async () => {
    try {
      const response = await fetch('https://gateway.realcatcha.com/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          if (data.access_token) {
            localStorage.setItem('authToken', data.access_token);
            localStorage.setItem('userData', JSON.stringify(data.user));
          }
          return data.access_token;
        }
      }
      
      // 갱신 실패 시 로그아웃 처리
      throw new Error('토큰 갱신 실패');
    } catch (error) {
      console.error('토큰 갱신 오류:', error);
      // 갱신 실패 시 로그아웃
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      throw error;
    }
  };

  // API 요청 래퍼 (자동 토큰 갱신 포함)
  const fetchWithAuth = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // 401 에러 시 토큰 갱신 시도
      if (response.status === 401) {
        try {
          await refreshToken();
          // 원본 요청 재시도
          return await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              ...options.headers,
            },
          });
        } catch (refreshError) {
          // 갱신 실패 시 401 응답 그대로 반환
          return response;
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  // 사용자 정보 복원 (로컬 스토리지 + 쿠키 자동 로그인)
  useEffect(() => {
    const initAuth = async () => {
      // 1. 로컬 스토리지 확인
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
          setLoading(false);
          return;
        } catch (error) {
          console.error('사용자 데이터 파싱 오류:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
      
      // 2. 쿠키 기반 자동 로그인 시도
      try {
        const response = await fetch('https://gateway.realcatcha.com/api/auth/me', {
          method: 'GET',
          credentials: 'include', // 쿠키 전송
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
            // 토큰이 있다면 로컬 스토리지에도 저장
            if (data.access_token) {
              localStorage.setItem('authToken', data.access_token);
              localStorage.setItem('userData', JSON.stringify(data.user));
            }
          }
        } else if (response.status === 401) {
          // Access Token이 만료된 경우 Refresh Token으로 갱신 시도
          try {
            await refreshToken();
          } catch (refreshError) {
            console.log('자동 로그인 불가능');
          }
        }
      } catch (error) {
        console.warn('쿠키 기반 자동 로그인 실패:', error);
      }
      
      setLoading(false);
    };
    
    initAuth();
  }, []);

  // 로그인 함수
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
      
      // 토큰과 사용자 정보 저장
      if (data.access_token) {
        localStorage.setItem('authToken', data.access_token);
      }
      if (data.user) {
        localStorage.setItem('userData', JSON.stringify(data.user));
        setUser(data.user);
      }

      return data;
    } catch (err) {
      setError(err.message || '로그인 중 오류가 발생했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

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

    // 로컬 스토리지 정리
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    fetchWithAuth,
    refreshToken,
    setError,
    // 하위 호환 제공
    isAuthenticated,
    isLoggedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};