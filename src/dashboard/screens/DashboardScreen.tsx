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
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  Star as StarIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dashboardService } from '../services/dashboardService';
import { userStatsService, UserStatsOverview, ApiKeyStats, CaptchaTypeStats, ChartData } from '../services/userStatsService';
import { DashboardAnalytics, CaptchaStats } from '../types';
import { formatNumber, formatPercentage, formatResponseTime } from '../utils';

const DashboardScreen: React.FC = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [stats, setStats] = useState<CaptchaStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // 새로운 상태 추가
  const [userStats, setUserStats] = useState<UserStatsOverview | null>(null);
  const [apiKeyStats, setApiKeyStats] = useState<ApiKeyStats[]>([]);
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('month');
  const [tabValue, setTabValue] = useState(0);
  
  // 차트 데이터 상태
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartTabValue, setChartTabValue] = useState(0); // 0: 오전, 1: 오후

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsResponse, statsResponse, userStatsResponse, apiKeyStatsResponse, chartResponse] = await Promise.all([
        dashboardService.getAnalytics(),
        dashboardService.getStats('daily'),
        userStatsService.getOverview(period),
        userStatsService.getByApiKey(period),
        userStatsService.getHourlyChartData(period),
      ]);

      if (analyticsResponse.success) {
        setAnalytics(analyticsResponse.data);
      }
      
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (userStatsResponse.success && userStatsResponse.data) {
        setUserStats(userStatsResponse.data);
      }

      if (apiKeyStatsResponse.success && apiKeyStatsResponse.data && apiKeyStatsResponse.data.api_keys) {
        setApiKeyStats(apiKeyStatsResponse.data.api_keys || []);
      }

      if (chartResponse.success && chartResponse.data) {
        setChartData(chartResponse.data.chart_data || []);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
      console.error('Error details:', error);
      // 에러 발생 시 Mock 데이터 사용
      console.log('Mock 데이터로 대체합니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [period]);

  const handlePeriodChange = (event: SelectChangeEvent<string>) => {
    setPeriod(event.target.value as 'today' | 'week' | 'month');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChartTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setChartTabValue(newValue);
  };

  // 차트 데이터를 오전/오후로 분할 (today인 경우에만)
  const getFilteredChartData = () => {
    if (period !== 'today') {
      return chartData; // week/month는 전체 데이터 표시
    }

    // today인 경우 오전/오후로 분할
    if (chartTabValue === 0) {
      // 오전: 00시~10시 (00, 02, 04, 06, 08, 10)
      return chartData.filter(item => {
        const hour = parseInt(item.time.replace('시', ''));
        return hour >= 0 && hour <= 10;
      });
    } else {
      // 오후: 12시~22시 (12, 14, 16, 18, 20, 22)
      return chartData.filter(item => {
        const hour = parseInt(item.time.replace('시', ''));
        return hour >= 12 && hour <= 22;
      });
    }
  };

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

  // 실제 데이터만 사용 (Mock 데이터 제거)
  const creditUsagePercentage = analytics?.plan_info?.usage_percentage || 0;
  
  // 디버깅용 로그
  console.log('Dashboard Analytics:', analytics);
  console.log('Credit Usage Percentage:', creditUsagePercentage);
  console.log('Analytics Success:', analytics ? 'Yes' : 'No');
  const levelData = analytics?.level_stats ? [
    { name: 'Level 0 (Pass)', value: Math.round(analytics.level_stats.level_0), color: '#8884d8' },
    { name: 'Level 1 (Image)', value: Math.round(analytics.level_stats.level_1), color: '#82ca9d' },
    { name: 'Level 2 (Handwriting)', value: Math.round(analytics.level_stats.level_2), color: '#ffc658' },
    { name: 'Level 3 (Abstract)', value: Math.round(analytics.level_stats.level_3), color: '#ff7300' },
  ] : [
    { name: 'Level 0 (Pass)', value: 40, color: '#8884d8' },
    { name: 'Level 1 (Image)', value: 30, color: '#82ca9d' },
    { name: 'Level 2 (Handwriting)', value: 20, color: '#ffc658' },
    { name: 'Level 3 (Abstract)', value: 10, color: '#ff7300' },
  ];

  // 캡차 타입 정규화 함수
  const normalizeCaptchaTypes = (captchaTypes: CaptchaTypeStats[]): CaptchaTypeStats[] => {
    if (!captchaTypes || captchaTypes.length === 0) return [];

    // 타입별로 그룹화
    const typeGroups: { [key: string]: CaptchaTypeStats[] } = {};
    
    captchaTypes.forEach(type => {
      let normalizedType: string;
      
      // 타입 정규화
      if (type.captcha_type === 'imagecaptcha' || type.captcha_type === 'image') {
        normalizedType = 'image';
      } else if (type.captcha_type === 'handwriting') {
        normalizedType = 'handwriting';
      } else if (type.captcha_type === 'abstract') {
        normalizedType = 'abstract';
      } else if (!type.captcha_type || type.captcha_type === '' || type.captcha_type === null) {
        normalizedType = 'pass';
      } else {
        normalizedType = type.captcha_type;
      }

      if (!typeGroups[normalizedType]) {
        typeGroups[normalizedType] = [];
      }
      typeGroups[normalizedType].push(type);
    });

    // 각 그룹별로 데이터 합계 계산
    const normalizedTypes: CaptchaTypeStats[] = Object.entries(typeGroups).map(([normalizedType, types]) => {
      const totalRequests = types.reduce((sum, type) => sum + type.total_requests, 0);
      const successRequests = types.reduce((sum, type) => sum + type.success_requests, 0);
      const failedRequests = types.reduce((sum, type) => sum + type.failed_requests, 0);
      const totalResponseTime = types.reduce((sum, type) => sum + (type.avg_response_time * type.total_requests), 0);
      
      return {
        captcha_type: normalizedType,
        total_requests: totalRequests,
        success_requests: successRequests,
        failed_requests: failedRequests,
        success_rate: totalRequests > 0 ? (successRequests / totalRequests) * 100 : 0,
        avg_response_time: totalRequests > 0 ? totalResponseTime / totalRequests : 0
      };
    });

    return normalizedTypes;
  };

  // 캡차 타입 이름 변환 함수
  const getCaptchaTypeName = (type: string): string => {
    switch (type) {
      case 'image':
        return '이미지 캡차';
      case 'handwriting':
        return '필기 캡차';
      case 'abstract':
        return '추상 캡차';
      case 'pass':
        return '행동분석 통과';
      default:
        return type || '미분류';
    }
  };

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
            <Typography variant="h5" component="h5" gutterBottom sx={{ fontWeight: 700 }}>
              내 대시보드
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
        <Typography variant="body1" color="text.secondary">
          개인 API 사용량 및 캡차 성능 분석
        </Typography>
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
                        value={creditUsagePercentage} 
                        sx={{ 
                          height: 20, 
                          borderRadius: 8,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 8,
                            backgroundColor: creditUsagePercentage > 80 ? '#f44336' : creditUsagePercentage > 60 ? '#ff9800' : '#1976d2'
                          }
                        }} 
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {analytics?.plan_info?.current_usage ? formatNumber(analytics.plan_info.current_usage) : '0'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {analytics?.plan_info?.monthly_limit ? formatNumber(analytics.plan_info.monthly_limit) : '100'}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          position: 'absolute',
                          top: -30,
                          left: `${Math.max(5, Math.min(creditUsagePercentage, 95))}%`,
                          transform: 'translateX(-50%)',
                          fontWeight: 'bold',
                          color: creditUsagePercentage > 80 ? '#f44336' : creditUsagePercentage > 60 ? '#ff9800' : '#1976d2'
                        }}
                      >
                        {creditUsagePercentage.toFixed(1)}%
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
                캡차 레벨별 사용량
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                <Box sx={{ width: '100%', height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={levelData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {levelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 1 }}>
                  {levelData.map((entry, index) => (
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

      {/* 기간 선택 */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          내 통계
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select value={period} onChange={handlePeriodChange}>
            <MenuItem value="today">오늘</MenuItem>
            <MenuItem value="week">최근 일주일</MenuItem>
            <MenuItem value="month">최근 한달</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* 주요 메트릭 */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="총 요청 수"
            value={formatNumber(userStats?.total_requests || 0)}
            icon={<SecurityIcon sx={{ fontSize: 40 }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="성공률"
            value={formatPercentage(userStats?.success_rate || 0)}
            icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            color="#2e7d32"
            subtitle={`${formatNumber(userStats?.success_requests || 0)} / ${formatNumber(userStats?.total_requests || 0)}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="평균 응답 시간"
            value={formatResponseTime(userStats?.avg_response_time || 0)}
            icon={<SpeedIcon sx={{ fontSize: 40 }} />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={
              period === 'today' ? '오늘 요청수' :
              period === 'week' ? '최근 일주일 최고 일일 요청수' :
              '최근 한달 최고 일일 요청수'
            }
            value={formatNumber(userStats?.peak_daily_requests || 0)}
            icon={<StarIcon sx={{ fontSize: 40 }} />}
            color="#9c27b0"
            subtitle={userStats?.peak_date ? new Date(userStats.peak_date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }) : '기록 없음'}
          />
        </Grid>
      </Grid>

      {/* 캡차 타입별 통계 */}
      {userStats && userStats.captcha_types && userStats.captcha_types.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              캡차 타입별 통계
            </Typography>
            <Grid container spacing={2}>
              {normalizeCaptchaTypes(userStats.captcha_types || []).map((type, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        {getCaptchaTypeName(type.captcha_type)}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">총 요청</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatNumber(type.total_requests)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">성공률</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: type.success_rate >= 90 ? '#2e7d32' : type.success_rate >= 70 ? '#ed6c02' : '#d32f2f' }}>
                          {formatPercentage(type.success_rate)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">평균 응답시간</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatResponseTime(type.avg_response_time)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* API 키별 상세 통계 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            API 키별 상세 통계
          </Typography>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="전체 보기" />
            <Tab label="상세 분석" />
          </Tabs>
          
          {tabValue === 0 && (
            <Box sx={{ mt: 2 }}>
              {!apiKeyStats || apiKeyStats.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  선택한 기간 동안 사용된 API 키가 없습니다. API 키를 사용하여 요청을 보내보세요.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {(apiKeyStats || []).map((apiKey, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            {apiKey.api_key_name}
                          </Typography>
                          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
                            <Box>
                              <Typography variant="body2" color="text.secondary">총 요청</Typography>
                              <Typography variant="h6">{formatNumber(apiKey.total_requests)}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" color="text.secondary">성공률</Typography>
                              <Typography variant="h6" sx={{ color: apiKey.success_rate >= 90 ? '#2e7d32' : apiKey.success_rate >= 70 ? '#ed6c02' : '#d32f2f' }}>
                                {formatPercentage(apiKey.success_rate)}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">평균 응답시간</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {formatResponseTime(apiKey.avg_response_time)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            캡차 타입별:
                          </Typography>
                          {normalizeCaptchaTypes(apiKey.captcha_types || []).map((type, typeIndex) => (
                            <Box key={typeIndex} sx={{ display: 'flex', justifyContent: 'space-between', ml: 1, mb: 0.5 }}>
                              <Typography variant="caption">
                                {getCaptchaTypeName(type.captcha_type).replace(' 캡차', '')}
                              </Typography>
                              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                {formatNumber(type.total_requests)}건
                              </Typography>
                            </Box>
                          ))}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ mt: 2 }}>
              {(apiKeyStats || []).map((apiKey, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 600 }}>
                      {apiKey.api_key_name} - {formatNumber(apiKey.total_requests)}건
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {normalizeCaptchaTypes(apiKey.captcha_types || []).map((type, typeIndex) => (
                        <Grid item xs={12} sm={6} md={4} key={typeIndex}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                {getCaptchaTypeName(type.captcha_type)}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">요청 수</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {formatNumber(type.total_requests)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">성공률</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: type.success_rate >= 90 ? '#2e7d32' : type.success_rate >= 70 ? '#ed6c02' : '#d32f2f' }}>
                                  {formatPercentage(type.success_rate)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">응답시간</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {formatResponseTime(type.avg_response_time)}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

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
                {period === 'today' ? '시간별 요청 현황' : 
                 period === 'week' ? '일별 요청 현황 (최근 7일)' : 
                 '일별 요청 현황 (최근 30일)'}
              </Typography>
              
              {/* today인 경우에만 오전/오후 탭 표시 */}
              {period === 'today' && (
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tabs 
                    value={chartTabValue} 
                    onChange={handleChartTabChange}
                    variant="fullWidth"
                  >
                    <Tab label="오전 (00~10시)" />
                    <Tab label="오후 (12~22시)" />
                  </Tabs>
                </Box>
              )}
              
              <Box sx={{ height: 250, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getFilteredChartData()}>
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
                    <Line
                      type="monotone"
                      dataKey="failed"
                      stroke="#d32f2f"
                      strokeWidth={2}
                      name="실패 요청"
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
