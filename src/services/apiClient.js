import axios from 'axios';

// API 설정
const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://api.realcatcha.com' 
    : 'http://localhost:8000',
  TIMEOUT: 10000,
};

// Create a pre-configured Axios instance for the website app.
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
});

// Request interceptor - 쿠키 기반 인증 사용
apiClient.interceptors.request.use((config) => {
  // 쿠키가 자동으로 전송되도록 withCredentials: true 설정
  // 추가적인 헤더 설정이 필요한 경우 여기에 추가
  return config;
});

// Response interceptor - 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    
    // 401 에러 처리 (인증 필요)
    if (status === 401) {
      console.log('인증이 필요합니다.');
      // 필요시 로그인 페이지로 리다이렉트
      // window.location.href = '/login';
    }
    
    // 403 에러 처리 (권한 없음)
    if (status === 403) {
      console.log('권한이 없습니다.');
    }
    
    // 500 에러 처리 (서버 오류)
    if (status >= 500) {
      console.log('서버 오류가 발생했습니다.');
    }
    
    return Promise.reject(error);
  }
);

export { apiClient }; 