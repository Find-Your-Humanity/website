import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dashboardService } from '../services/dashboardService';
import { DashboardAnalytics, CaptchaStats } from '../types';
import { formatNumber, formatPercentage, formatResponseTime } from '../utils';

const DashboardScreen: React.FC = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [stats, setStats] = useState<CaptchaStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsResponse, statsResponse] = await Promise.all([
        dashboardService.getAnalytics(),
        dashboardService.getStats('daily'),
      ]);

      if (analyticsResponse.success) {
        setAnalytics(analyticsResponse.data);
      }
      
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Mock 데이터 (API 연동 전 더미 데이터)
  const mockMetrics = {
    totalRequests: 125430,
    successfulSolves: 118920,
    failedAttempts: 6510,
    successRate: 94.8,
    averageResponseTime: 245,
    currentActiveUsers: 1247,
    requestsPerMinute: 125,
    systemHealth: 'healthy' as const,
  };

  const mockChartData = [
    { time: '00:00', requests: 45, success: 42 },
    { time: '04:00', requests: 38, success: 36 },
    { time: '08:00', requests: 78, success: 74 },
    { time: '12:00', requests: 125, success: 118 },
    { time: '16:00', requests: 156, success: 148 },
    { time: '20:00', requests: 89, success: 84 },
  ];

  const mockLevelData = [
    { name: 'Level 0', value: 40, color: '#8884d8' },
    { name: 'Level 1', value: 30, color: '#82ca9d' },
    { name: 'Level 2', value: 20, color: '#ffc658' },
    { name: 'Level 3', value: 10, color: '#ff7300' },
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
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
              Dashboard
            </Typography>
            <Chip
              label="정상"
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
            <IconButton onClick={loadDashboardData} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Credit 사용량, Pro Credit 및 캡챠 레벨별 사용량 */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 3 }} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <Grid container spacing={2} direction="column">
            <Grid item>
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
                    Credit 사용량
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                    <Box sx={{ width: '80%', mb: 2, position: 'relative' }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={75} 
                        sx={{ 
                          height: 20, 
                          borderRadius: 8,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 8,
                            backgroundColor: '#1976d2'
                          }
                        }} 
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">0</Typography>
                        <Typography variant="caption" color="text.secondary">100</Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          position: 'absolute',
                          bottom: -10,
                          left: '75%',
                          transform: 'translateX(-50%)'
                        }}
                      >
                        75%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item>
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
                    Pro Credit
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                    <Box sx={{ width: '80%', mb: 2, position: 'relative' }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={45} 
                        sx={{ 
                          height: 20, 
                          borderRadius: 8,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 8,
                            backgroundColor: '#9c27b0'
                          }
                        }} 
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">0</Typography>
                        <Typography variant="caption" color="text.secondary">100</Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          position: 'absolute',
                          bottom: -10,
                          left: '45%',
                          transform: 'translateX(-50%)'
                        }}
                      >
                        45%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        
        <Grid item xs={12} md={6}>
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
                캡챠 레벨별 사용량
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                <Box sx={{ width: '100%', height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockLevelData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {mockLevelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 1 }}>
                  {mockLevelData.map((entry, index) => (
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

      {/* 주요 메트릭 */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="총 요청 수"
            value={formatNumber(mockMetrics.totalRequests)}
            icon={<SecurityIcon sx={{ fontSize: 40 }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="성공률"
            value={formatPercentage(mockMetrics.successRate)}
            icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            color="#2e7d32"
            subtitle={`${formatNumber(mockMetrics.successfulSolves)} / ${formatNumber(mockMetrics.totalRequests)}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="평균 응답 시간"
            value={formatResponseTime(mockMetrics.averageResponseTime)}
            icon={<SpeedIcon sx={{ fontSize: 40 }} />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="현재 활성 사용자"
            value={formatNumber(mockMetrics.currentActiveUsers)}
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="#9c27b0"
            subtitle={`${mockMetrics.requestsPerMinute}/분`}
          />
        </Grid>
      </Grid>

      {/* 차트 */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12}>
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
                시간별 요청 현황
              </Typography>
              <Box sx={{ height: 250, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="requests"
                      stroke="#1976d2"
                      strokeWidth={2}
                      name="전체 요청"
                    />
                    <Line
                      type="monotone"
                      dataKey="success"
                      stroke="#2e7d32"
                      strokeWidth={2}
                      name="성공 요청"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardScreen;
