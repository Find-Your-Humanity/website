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
      const resp = await apiClient.get<ApiResponse<User[]>>(API_ENDPOINTS.USERS.LIST);
      return resp.data;
    } catch (error: any) {
      throw error;
    }
  }

  async create(data: CreateUserRequest): Promise<ApiResponse<User>> {
    try {
      const resp = await apiClient.post<ApiResponse<User>>(API_ENDPOINTS.USERS.CREATE, data);
      return resp.data;
    } catch (error: any) {
      throw error;
    }
  }

  async update(id: string, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    try {
      const resp = await apiClient.put<ApiResponse<User>>(API_ENDPOINTS.USERS.UPDATE(id), data);
      return resp.data;
    } catch (error: any) {
      throw error;
    }
  }

  async remove(id: string): Promise<ApiResponse> {
    try {
      const resp = await apiClient.delete<ApiResponse>(API_ENDPOINTS.USERS.DELETE(id));
      return resp.data;
    } catch (error: any) {
      throw error;
    }
  }
}

export const usersService = new UsersService();
