import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Alert,
  LinearProgress,
  Chip,
  Tabs,
  Tab,
  Button,
  Skeleton,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatNumber, formatPercentage } from '../utils';
import { adminService } from '../services/adminService';

const AdminAnalyticsScreen: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState('7days');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleTimePeriodChange = (event: SelectChangeEvent) => {
    setTimePeriod(event.target.value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 관리자용 Mock 데이터 (전체 시스템 통계)
  const systemStats = [
    { date: '2024-01-01', totalRequests: 1250, successfulRequests: 1180, failedRequests: 70, activeUsers: 89 },
    { date: '2024-01-02', totalRequests: 1380, successfulRequests: 1305, failedRequests: 75, activeUsers: 95 },
    { date: '2024-01-03', totalRequests: 1520, successfulRequests: 1440, failedRequests: 80, activeUsers: 112 },
    { date: '2024-01-04', totalRequests: 1680, successfulRequests: 1590, failedRequests: 90, activeUsers: 125 },
    { date: '2024-01-05', totalRequests: 1450, successfulRequests: 1375, failedRequests: 75, activeUsers: 98 },
    { date: '2024-01-06', totalRequests: 1320, successfulRequests: 1250, failedRequests: 70, activeUsers: 87 },
    { date: '2024-01-07', totalRequests: 1480, successfulRequests: 1405, failedRequests: 75, activeUsers: 105 },
  ];

  const userGrowthData = [
    { month: '1월', newUsers: 1200, totalUsers: 1200 },
    { month: '2월', newUsers: 1500, totalUsers: 2700 },
    { month: '3월', newUsers: 1800, totalUsers: 4500 },
    { month: '4월', newUsers: 2200, totalUsers: 6700 },
    { month: '5월', newUsers: 2500, totalUsers: 9200 },
    { month: '6월', newUsers: 2800, totalUsers: 12000 },
    { month: '7월', newUsers: 3200, totalUsers: 15200 },
  ];

  const planDistribution = [
    { name: 'Free', value: 45, users: 6939, revenue: 0 },
    { name: 'Basic', value: 30, users: 4626, revenue: 23130 },
    { name: 'Pro', value: 20, users: 3084, revenue: 30840 },
    { name: 'Enterprise', value: 5, users: 771, revenue: 15420 },
  ];

  const errorTypes = [
    { type: '타임아웃', count: 156, percentage: 42.5 },
    { type: '잘못된 입력', count: 98, percentage: 26.7 },
    { type: '네트워크 오류', count: 67, percentage: 18.2 },
    { type: '서버 오류', count: 46, percentage: 12.5 },
  ];

  // 차트용 가공 데이터 생성
  const chartData = useMemo(() => {
    return systemStats.map((s, idx) => {
      const date = new Date(s.date);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const label = `${month}/${day}`;
      
      return {
        label: label,
        total: s.totalRequests,
        success: s.successfulRequests,
        failed: s.failedRequests,
        users: s.activeUsers,
      };
    });
  }, [systemStats]);

  if (loading) {
    return (
      <Box className="rc-container">
        <Skeleton variant="rectangular" height={200} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box className="rc-container">
      {/* 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ mb: { xs: 3, md: 2 } }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
            시스템 분석
          </Typography>
          <Typography variant="body1" color="text.secondary">
            전체 시스템 사용 패턴 및 성능 분석 (관리자 전용)
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 2 },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: { md: 'flex-end' }
        }}>
          <FormControl sx={{ 
            minWidth: { xs: 'auto', md: 150 },
            order: { xs: 1, md: 1 }
          }}>
            <InputLabel>기간</InputLabel>
            <Select
              value={timePeriod}
              label="기간"
              onChange={handleTimePeriodChange}
            >
              <MenuItem value="7days">최근 7일</MenuItem>
              <MenuItem value="30days">최근 30일</MenuItem>
              <MenuItem value="90days">최근 90일</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* 에러 상태 표시 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* 시스템 개요 통계 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                시스템 개요 통계
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {formatNumber(15420)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      총 사용자 수
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main">
                      {formatNumber(125430)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      총 API 요청
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="info.main">
                      {formatPercentage(94.8)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      평균 성공률
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="warning.main">
                      $125,000
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      월간 수익
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 기간별 시스템 사용량 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              {/* 탭 네비게이션 */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="요청 현황" />
                  <Tab label="사용자 현황" />
                  <Tab label="성능 분석" />
                </Tabs>
              </Box>
              
              {/* 요청 현황 차트 */}
              {tabValue === 0 && (
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#1976d2"
                        strokeWidth={2}
                        name="총 요청"
                      />
                      <Line
                        type="monotone"
                        dataKey="success"
                        stroke="#2e7d32"
                        strokeWidth={2}
                        name="성공 요청"
                      />
                      <Line
                        type="monotone"
                        dataKey="failed"
                        stroke="#f44336"
                        strokeWidth={2}
                        name="실패 요청"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              )}

              {/* 사용자 현황 차트 */}
              {tabValue === 1 && (
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="newUsers"
                        stroke="#1976d2"
                        strokeWidth={2}
                        name="신규 사용자"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="totalUsers"
                        stroke="#2e7d32"
                        strokeWidth={2}
                        name="총 사용자"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              )}

              {/* 성능 분석 차트 */}
              {tabValue === 2 && (
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#1976d2" name="활성 사용자" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 플랜별 분포 및 수익 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                플랜별 사용자 분포
              </Typography>
              <Box sx={{ height: 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
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
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 2 }}>
                {planDistribution.map((entry, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, backgroundColor: entry.color, borderRadius: '50%' }} />
                    <Typography variant="caption" color="text.secondary">
                      {entry.name}: {entry.value}% ({formatNumber(entry.users)}명)
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 수익 분석 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                플랜별 수익 분석
              </Typography>
              <Box sx={{ mt: 2 }}>
                {planDistribution.map((plan, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{plan.name} 플랜</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ${formatNumber(plan.revenue)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(plan.revenue / 30840) * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">총 월간 수익</Typography>
                    <Typography variant="h6" color="primary">
                      ${formatNumber(69390)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 오류 유형 분석 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                시스템 오류 분석
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {errorTypes.map((error, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'grey.50',
                        borderRadius: 1,
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="h4" color="error.main">
                        {formatNumber(error.count)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {error.type}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({formatPercentage(error.percentage)})
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminAnalyticsScreen;


