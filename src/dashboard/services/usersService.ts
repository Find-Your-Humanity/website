import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type { ApiResponse, User } from '../types';

export interface CreateUserRequest {
  email: string;
  name?: string;
  password?: string;
  role?: 'admin' | 'user';
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  password?: string;
  role?: 'admin' | 'user';
  is_admin?: boolean | number;
}

class UsersService {
  async list(): Promise<ApiResponse<User[]>> {
    try {
      // 관리자 전용 엔드포인트로 변경
      const resp = await apiClient.get<any>(API_ENDPOINTS.ADMIN.USERS);
      const body = resp.data;
      // 호환 처리: {success, data: User[], total...} | {success, data: {data: User[], ...}} | ApiResponse<User[]>
      if (body && Array.isArray(body.data)) {
        return { success: !!body.success, data: body.data, message: body.message, error: body.error };
      }
      if (body && body.data && Array.isArray(body.data.data)) {
        return { success: !!body.success, data: body.data.data, message: body.message, error: body.error };
      }
      if (Array.isArray(body)) {
        return { success: true, data: body };
      }
      return { success: false, data: [], error: 'Unexpected response shape from /api/admin/users' };
    } catch (error: any) {
      throw error;
    }
  }

  async create(data: CreateUserRequest): Promise<ApiResponse<User>> {
    try {
      const resp = await apiClient.post<ApiResponse<User>>(API_ENDPOINTS.ADMIN.USERS, data);
      return resp.data;
    } catch (error: any) {
      throw error;
    }
  }

  async update(id: string, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    try {
      const resp = await apiClient.put<ApiResponse<User>>(`${API_ENDPOINTS.ADMIN.USERS}/${id}`, data);
      return resp.data;
    } catch (error: any) {
      throw error;
    }
  }

  async remove(id: string): Promise<ApiResponse> {
    try {
      const resp = await apiClient.delete<ApiResponse>(`${API_ENDPOINTS.ADMIN.USERS}/${id}`);
      return resp.data;
    } catch (error: any) {
      throw error;
    }
  }
}

export const usersService = new UsersService();
