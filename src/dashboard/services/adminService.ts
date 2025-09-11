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

// 사용자 관련 타입
export interface User {
  id: number;
  email: string;
  username: string;
  name?: string;
  contact?: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  current_plan?: string;
  plan_display_name?: string;
  subscription_status?: string;
  subscription_expires?: string;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  total: number;
  page: number;
  pageSize: number;
}

// 요금제 관련 타입
export interface Plan {
  id: number;
  name: string;
  display_name: string;
  price: number;
  monthly_request_limit: number;
  rate_limit_per_minute: number;
  is_active: boolean;
  subscriber_count?: number;
  active_subscribers?: number;
}

export interface PlanSubscriber {
  subscription_id: number;
  user_id: number;
  username: string;
  name?: string;
  email: string;
  start_date: string;
  end_date?: string;
  subscription_status: string;
  monthly_requests_used: number;
  monthly_request_limit?: number;
  daily_requests_used: number;
  last_request_time?: string;
}

export interface PlanSubscriberStats {
  plan_info: {
    name: string;
    display_name: string;
  };
  total_subscribers: number;
  active_subscribers: number;
  total_monthly_requests: number;
  total_daily_requests: number;
}

export interface PlansResponse {
  success: boolean;
  data: Plan[];
}

export interface PlanSubscribersResponse {
  success: boolean;
  data: {
    subscribers: PlanSubscriber[];
    plan_stats: PlanSubscriberStats;
  };
}

// 문의사항 관련 타입
export interface ContactRequest {
  id: number;
  subject: string;
  message: string;
  user_email: string;
  contact?: string;
  status: string;
  admin_username?: string;
  admin_response?: string;
  created_at: string;
  updated_at?: string;
  attachment_filename?: string;
}

export interface ContactRequestsResponse {
  success: boolean;
  data: {
    data: ContactRequest[];
    total: number;
    page: number;
    pageSize: number;
  };
}

// 실시간 모니터링 관련 타입
export interface ApiStatus {
  endpoint: string;
  total_requests: number;
  success_count: number;
  error_count: number;
  success_rate: number;
  avg_response_time: number;
  last_request_time: string | null;
  status: 'healthy' | 'warning' | 'critical';
}

export interface ResponseTimeData {
  time: string;
  avg_response_time: number;
  max_response_time: number;
  min_response_time: number;
  request_count: number;
}

export interface ErrorRateData {
  time: string;
  total_requests: number;
  error_count: number;
  error_rate: number;
}

export interface TpsData {
  time: string;
  tps: number;
}

export interface SystemSummary {
  total_requests_1h: number;
  success_requests_1h: number;
  error_requests_1h: number;
  avg_response_time_1h: number;
  unique_users_1h: number;
  success_rate_1h: number;
  error_rate_1h: number;
}

export interface RealtimeMonitoringData {
  api_status: ApiStatus[];
  response_time_data: ResponseTimeData[];
  error_rate_data: ErrorRateData[];
  tps_data: TpsData[];
  system_summary: SystemSummary;
  timestamp: string;
}

export interface RealtimeMonitoringResponse {
  success: boolean;
  data: RealtimeMonitoringData;
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

  async getUsers(page: number = 1, limit: number = 20, search?: string): Promise<UsersResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search })
      });
      const response = await apiClient.get<UsersResponse>(`/api/admin/users?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getPlans(): Promise<PlansResponse> {
    try {
      const response = await apiClient.get<PlansResponse>('/api/admin/plans');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updatePlan(planId: number, planData: Partial<Plan>): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.put(`/api/admin/plans/${planId}`, planData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getPlanSubscribers(planId: number): Promise<PlanSubscribersResponse> {
    try {
      const response = await apiClient.get<PlanSubscribersResponse>(`/api/admin/plans/${planId}/subscribers`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getContactRequests(page: number = 1, limit: number = 20, status?: string): Promise<ContactRequestsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status })
      });
      const response = await apiClient.get<ContactRequestsResponse>(`/api/admin/contact-requests?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateContactRequest(contactId: number, status: string, adminResponse?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.put(`/api/admin/contact-requests/${contactId}`, {
        status,
        admin_response: adminResponse
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getRealtimeMonitoring(): Promise<RealtimeMonitoringResponse> {
    try {
      const response = await apiClient.get<RealtimeMonitoringResponse>('/api/admin/realtime-monitoring');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const adminService = new AdminService();