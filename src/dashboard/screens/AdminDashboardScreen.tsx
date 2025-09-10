import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  CheckCircle as SuccessIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { adminService } from '../services/adminService';
import { formatNumber, formatPercentage, formatResponseTime } from '../utils';

const AdminDashboardScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadAdminDashboardData = async () => {
    try {
      setLoading(true);
      // 관리자용 전체 시스템 통계 조회
      // TODO: adminService에서 전체 시스템 통계 API 호출
      setLastUpdated(new Date());
    } catch (error) {
      console.error('관리자 대시보드 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminDashboardData();
  }, []);

  // 관리자용 Mock 데이터 (전체 시스템 통계)
  const adminMetrics = {
    totalUsers: 15420,
    activeUsers: 1247,
    totalRequests: 125430,
    successfulSolves: 118920,
    failedAttempts: 6510,
    successRate: 94.8,
    averageResponseTime: 245,
    systemHealth: 'healthy' as const,
    revenue: 125000,
    newUsersToday: 89,
  };

  const systemChartData = [
    { time: '00:00', requests: 45, users: 120 },
    { time: '04:00', requests: 38, users: 95 },
    { time: '08:00', requests: 78, users: 180 },
    { time: '12:00', requests: 125, users: 250 },
    { time: '16:00', requests: 156, users: 320 },
    { time: '20:00', requests: 89, users: 200 },
  ];

  const planDistribution = [
    { name: 'Free', value: 45, color: '#8884d8' },
    { name: 'Basic', value: 30, color: '#82ca9d' },
    { name: 'Pro', value: 20, color: '#ffc658' },
    { name: 'Enterprise', value: 5, color: '#ff7300' },
  ];

  const StatCard = ({ title, value, icon, color, subtitle }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }) => (
    <Card sx={{ 
      height: 140,
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        cursor: 'pointer'
      }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="h2" sx={{ color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color, opacity: 0.7 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box className="rc-container">
      {/* 헤더 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AdminIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
              관리자 대시보드
            </Typography>
            <Chip
              label="시스템 정상"
              color="success"
              variant="outlined"
              icon={<SuccessIcon />}
              size="small"
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              마지막 업데이트: {lastUpdated.toLocaleTimeString()}
            </Typography>
            <IconButton onClick={loadAdminDashboardData} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary">
          전체 시스템 현황 및 관리자 전용 통계
        </Typography>
      </Box>

      {/* 시스템 개요 메트릭 */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="총 사용자 수"
            value={formatNumber(adminMetrics.totalUsers)}
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="#1976d2"
            subtitle={`오늘 신규: ${adminMetrics.newUsersToday}명`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="현재 활성 사용자"
            value={formatNumber(adminMetrics.activeUsers)}
            icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            color="#2e7d32"
            subtitle="실시간 접속자"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="총 요청 수"
            value={formatNumber(adminMetrics.totalRequests)}
            icon={<SecurityIcon sx={{ fontSize: 40 }} />}
            color="#ed6c02"
            subtitle={`성공률: ${formatPercentage(adminMetrics.successRate)}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="월간 수익"
            value={`$${formatNumber(adminMetrics.revenue)}`}
            icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            color="#9c27b0"
            subtitle="이번 달"
          />
        </Grid>
      </Grid>

      {/* 시스템 현황 차트 */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              cursor: 'pointer'
            }
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                시간별 시스템 사용량
              </Typography>
              <Box sx={{ height: 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={systemChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="requests"
                      stroke="#1976d2"
                      strokeWidth={2}
                      name="API 요청"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="users"
                      stroke="#2e7d32"
                      strokeWidth={2}
                      name="활성 사용자"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              cursor: 'pointer'
            }
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                플랜별 사용자 분포
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                <Box sx={{ width: '100%', height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={planDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {planDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 1 }}>
                  {planDistribution.map((entry, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, backgroundColor: entry.color, borderRadius: '50%' }} />
                      <Typography variant="caption" color="text.secondary">
                        {entry.name}: {entry.value}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 시스템 성능 메트릭 */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              cursor: 'pointer'
            }
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                시스템 성능
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">평균 응답 시간</Typography>
                  <Typography variant="body2" fontWeight="bold">{formatResponseTime(adminMetrics.averageResponseTime)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">시스템 업타임</Typography>
                  <Typography variant="body2" fontWeight="bold" color="success.main">99.9%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">서버 CPU 사용률</Typography>
                  <Typography variant="body2" fontWeight="bold">45%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">메모리 사용률</Typography>
                  <Typography variant="body2" fontWeight="bold">62%</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ 
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              cursor: 'pointer'
            }
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                보안 현황
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">차단된 봇 요청</Typography>
                  <Typography variant="body2" fontWeight="bold" color="error.main">{formatNumber(adminMetrics.failedAttempts)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">의심스러운 활동</Typography>
                  <Typography variant="body2" fontWeight="bold" color="warning.main">23</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">API 키 비활성화</Typography>
                  <Typography variant="body2" fontWeight="bold">5</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">보안 점수</Typography>
                  <Typography variant="body2" fontWeight="bold" color="success.main">A+</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardScreen;


