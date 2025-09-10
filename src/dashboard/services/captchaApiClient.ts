import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { STORAGE_KEYS } from '../config/constants';

// Captcha API 전용 클라이언트 (JWT 토큰 사용)
const captchaApiClient: AxiosInstance = axios.create({
  baseURL: 'https://api.realcatcha.com', // captcha-api URL
  timeout: 10000,
  withCredentials: false, // JWT 토큰 사용하므로 쿠키 불필요
});

// JWT 토큰을 Authorization 헤더에 추가
captchaApiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  console.log('JWT Token:', token ? 'Present' : 'Missing');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

captchaApiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest: any = error.config;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // 토큰 갱신 시도
        const refreshResp = await axios.post(
          'https://gateway.realcatcha.com/api/auth/refresh',
          {},
          {
            withCredentials: true,
            timeout: 5000,
          }
        );

        if (
          refreshResp.data &&
          (refreshResp.data.data?.access_token || refreshResp.data.access_token)
        ) {
          const newToken = refreshResp.data.data?.access_token || refreshResp.data.access_token;
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
          
          // 원래 요청에 새 토큰 추가
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return captchaApiClient(originalRequest);
        }
        throw new Error('No access_token in refresh response');
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        try {
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          // 로그인 페이지로 리다이렉트
          window.location.href = '/login';
        } catch {}
      }
    }

    return Promise.reject(error);
  }
);

export { captchaApiClient };
