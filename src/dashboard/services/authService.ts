import { ApiResponse } from '../types';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type { LoginCredentials, User } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(API_ENDPOINTS.AUTH.LOGOUT);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.REFRESH
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.PROFILE);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User; access_token?: string }>> {
    try {
      const response = await apiClient.get<ApiResponse<{ user: User; access_token?: string }>>(
        API_ENDPOINTS.AUTH.ME
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const authService = new AuthService();
