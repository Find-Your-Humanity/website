import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // 안전한 localStorage 접근 함수
  const getStoredTheme = () => {
    try {
      return localStorage.getItem('theme') || 'light';
    } catch (error) {
      console.warn('localStorage 접근 실패:', error);
      return 'light';
    }
  };

  const setStoredTheme = (newTheme) => {
    try {
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.warn('localStorage 저장 실패:', error);
    }
  };

  useEffect(() => {
    // 로컬 스토리지에서 테마 가져오기
    const savedTheme = getStoredTheme();
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setStoredTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 