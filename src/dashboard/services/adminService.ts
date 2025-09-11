import { apiClient } from './apiClient';

export interface PlanDistribution {
  name: string;
  value: number;
  count: number;
  color: string;
}

export interface AdminMetrics {
  totalUsers: number;
  newUsersToday: number;
  activeUsers: number;
  totalRequests: number;
  successRate: number;
  revenue: number;
  planDistribution: PlanDistribution[];
}

export interface AdminMetricsResponse {
  success: boolean;
  data: AdminMetrics;
}

class AdminService {
  async getDashboardMetrics(): Promise<AdminMetricsResponse> {
    try {
      const response = await apiClient.get<AdminMetricsResponse>('/api/admin/dashboard-metrics');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const adminService = new AdminService();