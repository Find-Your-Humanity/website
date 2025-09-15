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
import { 
  adminService, 
  SystemStatsData, 
  UserGrowthData, 
  PlanDistributionData, 
  ErrorStatsData,
  PerformanceStatsData 
} from '../services/adminService';

const AdminAnalyticsScreen: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState('7days');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // 실제 API 데이터 state
  const [systemStats, setSystemStats] = useState<SystemStatsData[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [planDistribution, setPlanDistribution] = useState<PlanDistributionData[]>([]);
  const [errorTypes, setErrorTypes] = useState<ErrorStatsData[]>([]);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStatsData[]>([]);

  const handleTimePeriodChange = (event: SelectChangeEvent) => {
    setTimePeriod(event.target.value);
  };

  // 컴포넌트 마운트 시 및 timePeriod 변경 시 데이터 로드
  useEffect(() => {
    loadAnalyticsData();
  }, [timePeriod]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // API 데이터 로드 함수
  const loadAnalyticsData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const days = timePeriod === '7days' ? 7 : timePeriod === '30days' ? 30 : 90;
      const months = timePeriod === '7days' ? 1 : timePeriod === '30days' ? 3 : 6;
      
      // 병렬로 모든 API 호출
      const [systemStatsRes, userGrowthRes, planDistRes, errorStatsRes, performanceStatsRes] = await Promise.all([
        adminService.getSystemStats(days),
        adminService.getUserGrowth(months),
        adminService.getPlanDistribution(),
        adminService.getErrorStats(days),
        adminService.getPerformanceStats(days)
      ]);
      
      setSystemStats(systemStatsRes.data);
      setUserGrowthData(userGrowthRes.data);
      setPlanDistribution(planDistRes.data);
      setErrorTypes(errorStatsRes.data);
      setPerformanceStats(performanceStatsRes.data);
      
    } catch (err: any) {
      console.error('분석 데이터 로드 실패:', err);
      setError(err.response?.data?.detail || '분석 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 차트용 가공 데이터 생성
  const chartData = useMemo(() => {
    return systemStats.map((s, idx) => {
      const date = new Date(s.date);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const label = `${month}/${day}`;
      
      return {
        label: label,
        // 생성 데이터
        generated: s.totalGenerated,
        successGenerated: s.successfulGenerated,
        failedGenerated: s.failedGenerated,
        // 해결 데이터
        solved: s.totalSolved,
        successSolved: s.successfulSolved,
        failedSolved: s.failedSolved,
        // 공통
        users: s.activeUsers,
        completionRate: s.completionRate,
      };
    });
  }, [systemStats]);

  // 성능 분석 차트 데이터 생성
  const performanceChartData = useMemo(() => {
    return performanceStats.map((stat) => {
      const date = new Date(stat.date);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const label = `${month}/${day}`;
      
      return {
        label: label,
        avgResponseTime: stat.avgResponseTime,
        successRate: stat.successRate,
        errorRate: stat.errorRate,
        throughput: stat.throughput,
        activeUsers: stat.activeUsers
      };
    });
  }, [performanceStats]);

  // 시스템 개요 통계 계산
  const systemOverview = useMemo(() => {
    if (systemStats.length === 0) {
      return {
        totalUsers: 0,
        totalGenerated: 0,
        totalSolved: 0,
        generatedSuccessRate: 0,
        solvedSuccessRate: 0,
        completionRate: 0,
        totalRevenue: 0
      };
    }

    // 생성 통계
    const totalGenerated = systemStats.reduce((sum, stat) => sum + stat.totalGenerated, 0);
    const totalSuccessfulGenerated = systemStats.reduce((sum, stat) => sum + stat.successfulGenerated, 0);
    const generatedSuccessRate = totalGenerated > 0 ? (totalSuccessfulGenerated / totalGenerated) * 100 : 0;
    
    // 해결 통계
    const totalSolved = systemStats.reduce((sum, stat) => sum + stat.totalSolved, 0);
    const totalSuccessfulSolved = systemStats.reduce((sum, stat) => sum + stat.successfulSolved, 0);
    const solvedSuccessRate = totalSolved > 0 ? (totalSuccessfulSolved / totalSolved) * 100 : 0;
    
    // 해결 완료율
    const completionRate = totalGenerated > 0 ? (totalSolved / totalGenerated) * 100 : 0;
    
    // 수익 및 사용자
    const totalRevenue = planDistribution.reduce((sum, plan) => sum + plan.revenue, 0);
    const totalUsers = userGrowthData.length > 0 
      ? userGrowthData[userGrowthData.length - 1].totalUsers 
      : 0;

    return {
      totalUsers,
      totalGenerated,
      totalSolved,
      generatedSuccessRate,
      solvedSuccessRate,
      completionRate,
      totalRevenue
    };
  }, [systemStats, planDistribution, userGrowthData]);

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
      {/* 에러 표시 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* 헤더 (사용자 대시보드와 동일한 레이아웃) */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
          <Box>
            <Typography variant="h5" component="h5" gutterBottom sx={{ fontWeight: 700, mb: 0 }}>
              시스템 분석
            </Typography>
            <Typography variant="body2" color="text.secondary">
              전체 시스템 사용 패턴 및 성능 분석 (관리자 전용)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: { xs: 120, md: 150 } }}>
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
                      {formatNumber(systemOverview.totalUsers)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      총 사용자 수
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main">
                      {formatNumber(systemOverview.totalGenerated)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      캡차 생성 수
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      성공률: {formatPercentage(systemOverview.generatedSuccessRate)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="info.main">
                      {formatNumber(systemOverview.totalSolved)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      캡차 해결 수
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      성공률: {formatPercentage(systemOverview.solvedSuccessRate)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="warning.main">
                      {formatPercentage(systemOverview.completionRate)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      해결 완료율
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      수익: ₩{formatNumber(systemOverview.totalRevenue)}
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
                        dataKey="generated"
                        stroke="#1976d2"
                        strokeWidth={2}
                        name="캡차 생성"
                      />
                      <Line
                        type="monotone"
                        dataKey="solved"
                        stroke="#2e7d32"
                        strokeWidth={2}
                        name="캡차 해결"
                      />
                      <Line
                        type="monotone"
                        dataKey="completionRate"
                        stroke="#ff9800"
                        strokeWidth={2}
                        name="해결 완료율 (%)"
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
                    <LineChart data={performanceChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="avgResponseTime"
                        stroke="#ff9800"
                        strokeWidth={2}
                        name="평균 응답시간 (ms)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="successRate"
                        stroke="#2e7d32"
                        strokeWidth={2}
                        name="성공률 (%)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="errorRate"
                        stroke="#f44336"
                        strokeWidth={2}
                        name="에러율 (%)"
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="throughput"
                        stroke="#1976d2"
                        strokeWidth={2}
                        name="처리량 (요청)"
                      />
                    </LineChart>
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
                      {planDistribution.map((entry, index) => {
                        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 2 }}>
                {planDistribution.map((entry, index) => {
                  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];
                  return (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, backgroundColor: colors[index % colors.length], borderRadius: '50%' }} />
                      <Typography variant="caption" color="text.secondary">
                        {entry.name}: {entry.value}% ({formatNumber(entry.users)}명{typeof entry.inactiveUsers === 'number' ? `, 비활성 ${formatNumber(entry.inactiveUsers)}명` : ''})
                      </Typography>
                    </Box>
                  );
                })}
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
                        ₩{formatNumber(plan.revenue)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={systemOverview.totalRevenue > 0 ? (plan.revenue / systemOverview.totalRevenue) * 100 : 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">총 월간 수익</Typography>
                    <Typography variant="h6" color="primary">
                      ₩{formatNumber(systemOverview.totalRevenue)}
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


