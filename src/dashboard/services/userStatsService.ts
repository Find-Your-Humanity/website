import { apiClient } from './apiClient';

export interface CaptchaTypeStats {
  captcha_type: string;
  total_requests: number;
  success_requests: number;
  failed_requests: number;
  success_rate: number;
  avg_response_time: number;
}

export interface ApiKeyStats {
  api_key_id: string;
  api_key_name: string;
  total_requests: number;
  success_requests: number;
  failed_requests: number;
  success_rate: number;
  avg_response_time: number;
  captcha_types: CaptchaTypeStats[];
}

export interface UserStatsOverview {
  total_requests: number;
  success_requests: number;
  failed_requests: number;
  success_rate: number;
  avg_response_time: number;
  peak_daily_requests: number;
  peak_date: string | null;
  captcha_types: CaptchaTypeStats[];
  period: string;
}

export interface TimeSeriesData {
  time: string;
  total_requests: number;
  success_requests: number;
  failed_requests: number;
  success_rate: number;
  avg_response_time: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

class UserStatsService {
  /**
   * 사용자 통계 개요 조회 (전체 합계)
   */
  async getOverview(period: 'today' | 'week' | 'month' = 'month'): Promise<ApiResponse<UserStatsOverview>> {
    try {
      const response = await apiClient.get(`/api/user/stats/overview?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('사용자 통계 개요 조회 실패:', error);
      throw error;
    }
  }

  /**
   * API 키별 상세 통계 조회
   */
  async getByApiKey(period: 'today' | 'week' | 'month' = 'month'): Promise<ApiResponse<{api_keys: ApiKeyStats[], period: string}>> {
    try {
      const response = await apiClient.get(`/api/user/stats/by-api-key?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('API 키별 통계 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 시계열 통계 데이터 조회 (차트용)
   */
  async getTimeSeries(
    period: 'today' | 'week' | 'month' = 'week',
    apiKeyId?: string
  ): Promise<ApiResponse<{time_series: TimeSeriesData[], period: string, api_key_id?: string}>> {
    try {
      const params = new URLSearchParams({ period });
      if (apiKeyId) {
        params.append('api_key_id', apiKeyId);
      }
      
      const response = await apiClient.get(`/api/user/stats/time-series?${params}`);
      return response.data;
    } catch (error) {
      console.error('시계열 통계 조회 실패:', error);
      throw error;
    }
  }
}

export const userStatsService = new UserStatsService();
