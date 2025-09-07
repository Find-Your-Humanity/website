// 애플리케이션 상수 (dashboard 전용)
export const APP_CONFIG = {
  NAME: 'Real Captcha Dashboard',
  VERSION: '1.0.0',
  DESCRIPTION: 'Captcha 서비스 관리 대시보드',
  COMPANY: 'Real Captcha',
} as const;

// 로컬 스토리지 키 (website 표준 키 사용)
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'captcha_dashboard_token',
  USER_DATA: 'captcha_dashboard_user',
  THEME_MODE: 'captcha_dashboard_theme',
  LANGUAGE: 'captcha_dashboard_language',
} as const;

// 페이지네이션 설정
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// 차트 및 그래프 설정
export const CHART_CONFIG = {
  DEFAULT_COLORS: [
    '#1976d2',
    '#dc004e', 
    '#f57c00',
    '#388e3c',
    '#7b1fa2',
    '#0097a7',
  ],
  ANIMATION_DURATION: 300,
  REFRESH_INTERVAL: 30000, // 30초
} as const;

// 날짜 형식
export const DATE_FORMATS = {
  DISPLAY: 'YYYY-MM-DD HH:mm:ss',
  DATE_ONLY: 'YYYY-MM-DD',
  TIME_ONLY: 'HH:mm:ss',
  API: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
} as const;
