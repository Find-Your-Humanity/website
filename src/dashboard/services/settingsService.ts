import { apiClient } from './apiClient';
import { ApiResponse } from '../types';
import { API_ENDPOINTS } from '../config/api';

// Settings 관련 API 엔드포인트는 api.ts에서 가져옴

// 의심 IP 인터페이스
export interface SuspiciousIP {
  id: number;
  api_key: string;
  ip_address: string;
  violation_count: number;
  first_violation_time: string;
  last_violation_time: string;
  is_blocked: boolean;
  block_reason?: string;
  created_at: string;
  updated_at: string;
}

// IP 통계 인터페이스
export interface IPStats {
  total_violations: number;
  blocked_ips: number;
  active_violations: number;
  total_suspicious_ips?: number;
  active_suspicious_ips?: number;
  recent_violations_24h?: number;
  top_violating_ips: Array<{
    ip_address: string;
    violation_count: number;
  }>;
}

// API 키 인터페이스
export interface ApiKey {
  key_id: string;
  name?: string;
  is_active: boolean;
  created_at: string;
}

export class SettingsService {
  // 의심 IP 목록 조회 (세션 기반)
  async getSuspiciousIPs(
    page: number = 1, 
    limit: number = 50, 
    keyId?: string
  ): Promise<ApiResponse<{ suspicious_ips: SuspiciousIP[], total_count: number, page: number, limit: number }>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (keyId) {
        params.append('key_id', keyId);
      }

      const response = await apiClient.get<{ suspicious_ips: SuspiciousIP[], total_count: number, page: number, limit: number, total_pages: number }>(
        `${API_ENDPOINTS.ADMIN.SUSPICIOUS_IPS}?${params.toString()}`
      );
      
      // 백엔드 응답을 표준 형식으로 변환
      return {
        success: true,
        data: {
          suspicious_ips: response.data.suspicious_ips,
          total_count: response.data.total_count,
          page: response.data.page,
          limit: response.data.limit
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // IP 통계 조회 (세션 기반)
  async getIPStats(keyId?: string): Promise<ApiResponse<IPStats>> {
    try {
      const params = new URLSearchParams();
      if (keyId) {
        params.append('key_id', keyId);
      }

      const response = await apiClient.get<IPStats>(
        `${API_ENDPOINTS.ADMIN.IP_STATS}?${params.toString()}`
      );
      
      // 백엔드 응답을 표준 형식으로 변환
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw error;
    }
  }

  // IP 차단 (세션 기반)
  async blockIP(ipAddress: string, reason: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiClient.post<{ message: string }>(
        API_ENDPOINTS.ADMIN.BLOCK_IP,
        { ip_address: ipAddress, reason }
      );
      return { success: true, data: { message: response.data.message } } as any;
    } catch (error) {
      throw error;
    }
  }

  // IP 차단 해제 (세션 기반)
  async unblockIP(ipAddress: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiClient.post<{ message: string }>(
        API_ENDPOINTS.ADMIN.UNBLOCK_IP,
        { ip_address: ipAddress }
      );
      return { success: true, data: { message: response.data.message } } as any;
    } catch (error) {
      throw error;
    }
  }

  // 내 API 키 목록 조회 (세션 기반)
  async getMyApiKeys(): Promise<ApiResponse<{ api_keys: ApiKey[] }>> {
    try {
      const response = await apiClient.get<{ api_keys: any[] }>(
        API_ENDPOINTS.ADMIN.MY_API_KEYS
      );
      
      // 백엔드 응답을 표준 형식으로 변환
      return {
        success: true,
        data: {
          api_keys: response.data.api_keys.map(key => ({
            key_id: key.key_id,
            name: key.name || key.key_id,
            is_active: key.is_active,
            created_at: key.created_at
          }))
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성
export const settingsService = new SettingsService();
