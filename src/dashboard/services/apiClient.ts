import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG } from '../config/api';
import { STORAGE_KEYS } from '../config/constants';

// Create a pre-configured Axios instance for the integrated dashboard.
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
});

// Cookie-based auth: do not attach Authorization header from localStorage
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest: any = error.config;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Try refresh by cookie
        const refreshResp = await axios.post(
          `${API_CONFIG.BASE_URL}/api/auth/refresh`,
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
          // Server refreshes cookie; just retry original request
          return apiClient(originalRequest);
        }
        throw new Error('No access_token in refresh response');
      } catch (refreshError) {
        try {
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        } catch {}
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient };
