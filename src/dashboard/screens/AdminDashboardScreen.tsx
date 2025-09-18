import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
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
import { adminService, AdminMetrics, HourlyStatsData } from '../services/adminService';
import { formatNumber, formatPercentage, formatResponseTime } from '../utils';

const AdminDashboardScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics>({
    totalUsers: 0,
    newUsersToday: 0,
    activeUsers: 0,
    totalRequests: 0,
    successRate: 0,
    revenue: 0,
    planDistribution: []
  });
  
  // 시간별 통계 관련 상태
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [hourlyStats, setHourlyStats] = useState<HourlyStatsData[]>([]);
  const [hourlyLoading, setHourlyLoading] = useState(false);

  const loadAdminDashboardData = async () => {
    try {
      setLoading(true);
      // 관리자용 전체 시스템 통계 조회
      const response = await adminService.getDashboardMetrics();
      if (response.success) {
        setAdminMetrics(response.data);
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error('관리자 대시보드 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHourlyStats = async (date: string) => {
    try {
      setHourlyLoading(true);
      const response = await adminService.getHourlyStats(date);
      if (response.success) {
        setHourlyStats(response.data.hourlyStats);
      }
    } catch (error) {
      console.error('시간별 통계 로드 실패:', error);
    } finally {
      setHourlyLoading(false);
    }
  };

  useEffect(() => {
    loadAdminDashboardData();
    loadHourlyStats(selectedDate);
  }, []);

  // 날짜 변경 시 시간별 통계 다시 로드
  useEffect(() => {
    if (selectedDate) {
      loadHourlyStats(selectedDate);
    }
  }, [selectedDate]);

  // 관리자용 실제 데이터 (전체 시스템 통계) - 차트용
  const chartData = {
    totalUsers: adminMetrics.totalUsers,
    activeUsers: adminMetrics.activeUsers,
    totalRequests: adminMetrics.totalRequests,
    successfulSolves: Math.round(adminMetrics.totalRequests * adminMetrics.successRate / 100),
    failedAttempts: Math.round(adminMetrics.totalRequests * (100 - adminMetrics.successRate) / 100),
    successRate: adminMetrics.successRate,
    averageResponseTime: 245, // TODO: 실제 응답 시간 데이터 추가
    systemHealth: 'healthy' as const,
    revenue: adminMetrics.revenue,
    newUsersToday: adminMetrics.newUsersToday,
  };

  // 실제 시간별 통계 데이터 사용 (Mock 데이터 제거)

  // 실제 플랜 분포 데이터 사용
  const planDistribution = adminMetrics.planDistribution;

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
      {/* 헤더 (일관된 스타일 적용) */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
          <Box>
            <Typography variant="h5" component="h5" gutterBottom sx={{ fontWeight: 700, mb: 0 }}>
              관리자 대시보드
            </Typography>
            <Typography variant="body1" color="text.secondary">
              전체 시스템 현황 및 관리자 전용 통계
            </Typography>
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
            title="캡차 생성 수"
            value={formatNumber(adminMetrics.totalGenerated)}
            icon={<SecurityIcon sx={{ fontSize: 40 }} />}
            color="#ed6c02"
            subtitle={`성공률: ${formatPercentage(adminMetrics.generatedSuccessRate)}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="월간 수익"
            value={`₩${formatNumber(adminMetrics.revenue)}`}
            icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            color="#9c27b0"
            subtitle="이번 달"
          />
        </Grid>
      </Grid>

      {/* 캡차 해결 및 전환율 통계 */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="캡차 해결 수"
            value={formatNumber(adminMetrics.totalSolved)}
            icon={<SuccessIcon sx={{ fontSize: 40 }} />}
            color="#2e7d32"
            subtitle={`성공률: ${formatPercentage(adminMetrics.solvedSuccessRate)}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="해결 완료율"
            value={formatPercentage(Math.min(adminMetrics.completionRate, 100))}
            icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            color="#1976d2"
            subtitle="생성 대비 해결 비율"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="평균 응답시간"
            value={formatResponseTime(adminMetrics.avgResponseTime)}
            icon={<SpeedIcon sx={{ fontSize: 40 }} />}
            color="#ff9800"
            subtitle="전체 시스템 평균"
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  시간별 시스템 사용량
                </Typography>
                <TextField
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  size="small"
                  sx={{ width: 150 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
              <Box sx={{ height: 300, mt: 2 }}>
                {hourlyLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography>로딩 중...</Typography>
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hourlyStats}>
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
                )}
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

      {/* 시스템 성능 및 보안 현황 섹션 제거됨 */}
    </Box>
  );
};

export default AdminDashboardScreen;


