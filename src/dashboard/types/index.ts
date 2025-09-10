// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;   // 일반 로그인 사용자의 username
  role?: 'admin' | 'user';
  is_admin?: boolean | number;
  createdAt: string;
  lastLoginAt?: string;
}

// Captcha Statistics Types
export interface CaptchaStats {
  totalRequests: number;
  successfulSolves: number;
  failedAttempts: number;
  successRate: number;
  averageResponseTime: number;
  date?: string; // 날짜 정보 추가
}

// Dashboard Analytics Types
export interface DashboardAnalytics {
  plan_info: {
    plan_name: string;
    monthly_limit: number;
    current_usage: number;
    usage_percentage: number;
  };
  monthly_stats: {
    total_requests: number;
    successful_requests: number;
    failed_requests: number;
    success_rate: number;
    avg_response_time: number;
  };
  captcha_stats: {
    image: number;
    handwriting: number;
    abstract: number;
    pass: number;
  };
  level_stats: {
    level_0: number;
    level_1: number;
    level_2: number;
    level_3: number;
  };
}

// Authentication Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Navigation Types
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

// API Usage Limit Types
export interface ApiUsageLimit {
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  planDisplayName?: string; // 플랜 표시 이름 추가
  limits: {
    perMinute: number;
    perDay: number;
    perMonth: number;
  };
  currentUsage: {
    perMinute: number;
    perDay: number;
    perMonth: number;
  };
  resetTimes: {
    perMinute: string; // ISO timestamp
    perDay: string;    // ISO timestamp
    perMonth: string;  // ISO timestamp
  };
  status: 'normal' | 'warning' | 'critical' | 'exceeded';
}

// API Type and Period Types
export type ApiType = 'all' | 'handwriting' | 'abstract' | 'imagecaptcha';
export type PeriodType = 'daily' | 'weekly' | 'monthly';