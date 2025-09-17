import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface ApiKey {
  id: number;
  key_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
  last_used_at: string | null;
  usage_count: number;
}

export interface CreateApiKeyRequest {
  name: string;
  description?: string;
}

export interface CreateApiKeyResponse {
  success: boolean;
  api_key: string;
  secret_key: string;
  created_at: string;
}

export interface ApiKeyListResponse {
  success: boolean;
  api_keys: ApiKey[];
}

export interface ToggleApiKeyRequest {
  is_active: boolean;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

class ApiKeyService {
  private handleAxiosError(error: any): never {
    if ((error as any).response) {
      const message = (error as any).response.data?.detail || (error as any).response.data?.message || '서버 오류가 발생했습니다.';
      throw new Error(message);
    } else if ((error as any).request) {
      throw new Error('서버에 연결할 수 없습니다.');
    } else {
      throw new Error('요청을 보낼 수 없습니다.');
    }
  }

  async createApiKey(data: CreateApiKeyRequest): Promise<CreateApiKeyResponse> {
    try {
      const response = await apiClient.post<CreateApiKeyResponse>(
        API_ENDPOINTS.API_KEYS.CREATE,
        data
      );
      return response.data;
    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  async getApiKeys(): Promise<ApiKey[]> {
    try {
      const response = await apiClient.get<ApiKeyListResponse>(
        API_ENDPOINTS.API_KEYS.LIST
      );
      return response.data.api_keys;
    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  async toggleApiKey(keyId: string, isActive: boolean): Promise<ApiResponse> {
    try {
      // CORS 회피: 토글만 동일 출처(realcatcha.com) 경로로 호출
      const sameOrigin = typeof window !== 'undefined' ? window.location.origin : '';
      const toggleUrl = sameOrigin
        ? `${sameOrigin}/app/api-keys/${keyId}/toggle`
        : API_ENDPOINTS.API_KEYS.TOGGLE(keyId);
      const response = await apiClient.patch<ApiResponse>(toggleUrl, { is_active: isActive });
      return response.data;
    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  async deleteApiKey(keyId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete<ApiResponse>(
        API_ENDPOINTS.API_KEYS.DELETE(keyId)
      );
      return response.data;
    } catch (error) {
      this.handleAxiosError(error);
    }
  }
}

export const apiKeyService = new ApiKeyService();
