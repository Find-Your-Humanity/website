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
  dailyStats: CaptchaStats[];
  weeklyStats: CaptchaStats[];
  monthlyStats: CaptchaStats[];
  realtimeMetrics: {
    currentActiveUsers: number;
    requestsPerMinute: number;
    systemHealth: 'healthy' | 'warning' | 'critical';
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
