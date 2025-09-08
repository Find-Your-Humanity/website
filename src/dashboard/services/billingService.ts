import { apiClient } from './apiClient';
import { ApiResponse } from '../types';
import axios, { AxiosError } from 'axios';

export interface Plan {
  id: number;
  name: string;
  price: number;
  request_limit: number;
  description: string;
  features: string[] | Record<string, unknown>;
  rate_limit_per_minute: number;
  is_popular: boolean;
  sort_order: number;
}

export interface CurrentPlan {
  plan: Plan;
  current_usage: {
    tokens_used: number;
    api_calls: number;
    overage_tokens: number;
    overage_cost: number;
    tokens_limit: number;
    average_tokens_per_call: number;
    success_rate: number;
  };
  billing_info: {
    base_fee: number;
    overage_fee: number;
    total_amount: number;
    start_date: string | null;
    end_date: string | null;
  };
  pending_changes?: {
    plan_id: number;
    plan_name: string;
    effective_date: string;
  };
}

export interface UsageHistory {
  date: string;
  tokens_used: number;
  api_calls: number;
  overage_tokens: number;
  overage_cost: number;
}

export interface PlanChangeRequest {
  plan_id: number;
}

export interface PlanChangeResponse {
  success: boolean;
  message: string;
  plan_id: number;
  effective_date: string;
}

// Axios 에러 처리 헬퍼 함수
function handleAxiosError(error: any, defaultMessage: string): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.code === 'ERR_NETWORK') {
      return '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.';
    }
    if (axiosError.code === 'ECONNABORTED') {
      return '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
    }
    if (axiosError.response) {
      const status = axiosError.response.status;
      switch (status) {
        case 401:
          return '인증이 필요합니다. 다시 로그인해주세요.';
        case 403:
          return '접근 권한이 없습니다.';
        case 404:
          return '요청한 리소스를 찾을 수 없습니다.';
        case 500:
          return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        default:
          return `서버 오류가 발생했습니다. (${status})`;
      }
    }
    return axiosError.message || defaultMessage;
  }
  return error?.message || defaultMessage;
}

class BillingService {
  async getCurrentPlan(): Promise<ApiResponse<CurrentPlan>> {
    try {
      const response = await apiClient.get('/api/billing/current-plan');
      return {
        success: true,
        data: response.data,
      } as any;
    } catch (error) {
      return {
        success: false,
        data: null as any,
        error: handleAxiosError(error, '현재 요금제 정보를 불러오는데 실패했습니다.'),
      };
    }
  }

  async getAvailablePlans(): Promise<ApiResponse<Plan[]>> {
    try {
      const response = await apiClient.get('/api/billing/plans');
      return {
        success: true,
        data: response.data,
      } as any;
    } catch (error) {
      return {
        success: false,
        data: [] as Plan[],
        error: handleAxiosError(error, '요금제 목록을 불러오는데 실패했습니다.'),
      };
    }
  }

  async changePlan(planId: number): Promise<ApiResponse<PlanChangeResponse>> {
    try {
      const response = await apiClient.post('/api/billing/change-plan', { plan_id: planId });
      if ((response.data as any).success) {
        window.dispatchEvent(
          new CustomEvent('planChanged', {
            detail: { planId, message: (response.data as any).message },
          })
        );
      }
      return {
        success: true,
        data: response.data,
      } as any;
    } catch (error) {
      return {
        success: false,
        data: null as any,
        error: handleAxiosError(error, '요금제 변경에 실패했습니다.'),
      };
    }
  }

  async getUsageHistory(month?: string): Promise<ApiResponse<UsageHistory[]>> {
    try {
      const params = month ? { month } : {};
      const response = await apiClient.get('/api/billing/usage-history', { params });
      return {
        success: true,
        data: response.data,
      } as any;
    } catch (error) {
      return {
        success: false,
        data: [] as UsageHistory[],
        error: handleAxiosError(error, '사용량 기록을 불러오는데 실패했습니다.'),
      };
    }
  }

  async getBillingHistory(): Promise<ApiResponse<any[]>> {
    try {
      const response = await apiClient.get('/api/billing/history');
      return {
        success: true,
        data: response.data,
      } as any;
    } catch (error) {
      return {
        success: false,
        data: [] as any[],
        error: handleAxiosError(error, '결제 기록을 불러오는데 실패했습니다.'),
      };
    }
  }
}

export const billingService = new BillingService();
