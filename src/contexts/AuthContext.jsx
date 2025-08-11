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

  // 로컬 스토리지에서 사용자 정보 복원
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('사용자 데이터 파싱 오류:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  // 로그인 함수
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      // API 호출 (절대 경로로 변경)
      const response = await fetch('https://gateway.realcatcha.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다.');
      }

      const data = await response.json();
      
      // 토큰과 사용자 정보 저장
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      setUser(data.user);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
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