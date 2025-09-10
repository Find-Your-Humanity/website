import { ApiResponse, DashboardAnalytics, CaptchaStats, ApiUsageLimit, ApiType, PeriodType } from '../types';
import { apiClient } from './apiClient';
import { captchaApiClient } from './captchaApiClient';
import { API_ENDPOINTS } from '../config/api';

class DashboardService {
  async getAnalytics(): Promise<ApiResponse<DashboardAnalytics>> {
    try {
      const response = await captchaApiClient.get<ApiResponse<DashboardAnalytics>>(
        '/api/dashboard/analytics'
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getStats(period: PeriodType = 'daily', apiType: ApiType = 'all'): Promise<ApiResponse<CaptchaStats[]>> {
    try {
      const response = await captchaApiClient.get<ApiResponse<CaptchaStats[]>>(
        `/api/dashboard/stats?period=${period}&api_type=${apiType}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // API 사용량 제한 조회
  async getUsageLimits(): Promise<ApiResponse<ApiUsageLimit>> {
    try {
      const response = await apiClient.get<ApiResponse<ApiUsageLimit>>(
        API_ENDPOINTS.DASHBOARD.USAGE_LIMITS
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getRealtimeMetrics(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(
        API_ENDPOINTS.DASHBOARD.REALTIME
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 사용자/키별 통계 조회
  async getKeyStats(
    period: PeriodType = 'daily',
    apiType: ApiType = 'all',
    apiKey?: string
  ): Promise<ApiResponse<CaptchaStats[]>> {
    try {
      const keyParam = apiKey ? `&api_key=${encodeURIComponent(apiKey)}` : '';
      const response = await apiClient.get<ApiResponse<CaptchaStats[]>>(
        `${API_ENDPOINTS.DASHBOARD.KEY_STATS}?period=${period}&api_type=${apiType}${keyParam}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCaptchaLogs(params?: {
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
    status?: 'success' | 'failed';
  }): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(
        API_ENDPOINTS.CAPTCHA.LOGS,
        { params }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCaptchaPerformance(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(
        API_ENDPOINTS.CAPTCHA.PERFORMANCE
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // API 키별 사용량 통계 조회
  async getApiKeyUsage(apiKey: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(
        `${API_ENDPOINTS.DASHBOARD.API_KEY_USAGE}/${apiKey}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 중복 데이터 정리
  async cleanupDuplicates(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(
        API_ENDPOINTS.DASHBOARD.CLEANUP_DUPLICATES
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 내 API 키 목록 조회
  async getMyApiKeys(): Promise<ApiResponse<{ api_keys: { key_id: string; name: string }[] }>> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(
        API_ENDPOINTS.API_KEYS.LIST
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
