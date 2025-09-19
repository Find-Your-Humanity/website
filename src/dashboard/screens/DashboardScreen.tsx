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
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  Star as StarIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { dashboardService } from '../services/dashboardService';
import { userStatsService, UserStatsOverview, ApiKeyStats, CaptchaTypeStats, ChartData } from '../services/userStatsService';
import { DashboardAnalytics, CaptchaStats } from '../types';
import { formatNumber, formatPercentage, formatResponseTime } from '../utils';

const DashboardScreen: React.FC = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [stats, setStats] = useState<CaptchaStats[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 새로운 상태 추가
  const [userStats, setUserStats] = useState<UserStatsOverview | null>(null);
  const [apiKeyStats, setApiKeyStats] = useState<ApiKeyStats[]>([]);
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('month');
  const [tabValue, setTabValue] = useState(0);
  const [includeInactiveDeleted, setIncludeInactiveDeleted] = useState<boolean>(false);
  
  // 차트 데이터 상태
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartTabValue, setChartTabValue] = useState(0); // 0: 오전, 1: 오후

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsResponse, statsResponse, userStatsResponse, apiKeyStatsResponse, chartResponse] = await Promise.all([
        dashboardService.getAnalytics(),
        dashboardService.getStats('daily'),
        userStatsService.getOverview(period, { includeInactiveDeleted }),
        userStatsService.getByApiKey(period, { includeInactiveDeleted }),
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
    } catch (error) {
      // 콘솔 출력 제거, UI로만 처리
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [period, includeInactiveDeleted]);

  const handlePeriodChange = (event: SelectChangeEvent<string>) => {
    setPeriod(event.target.value as 'today' | 'week' | 'month');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  const handleToggleInactiveDeleted = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeInactiveDeleted(event.target.checked);
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

  // Credit 사용량을 userStats의 총 요청 수와 동일하게 맞춤
  const creditUsagePercentage = userStats?.total_requests ? 
    (userStats.total_requests / (analytics?.plan_info?.monthly_limit || 100)) * 100 : 0;
  
  // 디버깅 로그 제거
  const levelData = analytics?.level_stats ? [
    { name: 'Level 0 (Pass)', value: Math.round(analytics.level_stats.level_0), color: '#8884d8' },
    { name: 'Level 1 (Image)', value: Math.round(analytics.level_stats.level_1), color: '#82ca9d' },
    // 레벨 의미 변경: 2=Abstract, 3=Handwriting 이므로 값도 교체
    { name: 'Level 2 (Abstract)', value: Math.round(analytics.level_stats.level_3), color: '#ffc658' },
    { name: 'Level 3 (Handwriting)', value: Math.round(analytics.level_stats.level_2), color: '#ff7300' },
  ] : [];

  // 캡차 타입 정규화 함수
  // A안: 백엔드에서 준 success_rate를 그대로 사용(재계산하지 않음)
  const normalizeCaptchaTypes = (captchaTypes: CaptchaTypeStats[]): CaptchaTypeStats[] => {
    if (!captchaTypes || captchaTypes.length === 0) return [];
    return captchaTypes.map((t) => ({
      captcha_type:
        t.captcha_type === 'image' ? 'imagecaptcha' : (t.captcha_type || 'unknown'),
      total_requests: t.total_requests,
      success_requests: t.success_requests,
      failed_requests: t.failed_requests,
      success_rate: t.success_rate, // 그대로 사용
      avg_response_time: t.avg_response_time,
    }));
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
            <Typography variant="h5" component="h5" gutterBottom sx={{ fontWeight: 700, mb: 0 }}>
              내 대시보드
            </Typography>
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
                          {userStats?.total_requests ? formatNumber(userStats.total_requests) : '0'}
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
                  
                  {/* 월별 크레딧 사용량 막대그래프 */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
                      최근 6개월 사용량
                    </Typography>
                    <Box sx={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics?.monthly_usage || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="month_short" 
                            tick={{ fontSize: 12 }}
                            interval={0}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length && payload[0].payload) {
                                const data = payload[0].payload;
                                return (
                                  <Box sx={{ 
                                    bgcolor: 'background.paper', 
                                    border: 1, 
                                    borderColor: 'divider', 
                                    borderRadius: 1, 
                                    p: 2, 
                                    boxShadow: 3 
                                  }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                      {label} 사용량
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                      <Typography variant="body2">
                                        총 요청: <strong>{formatNumber(data.total)}</strong>
                                      </Typography>
                                      <Typography variant="body2" color="info.main">
                                        Pass: <strong>{formatNumber(data.pass || 0)}</strong>
                                      </Typography>
                                      <Typography variant="body2" color="primary">
                                        필기 캡차: <strong>{formatNumber(data.handwriting)}</strong>
                                      </Typography>
                                      <Typography variant="body2" color="warning.main">
                                        추상 캡차: <strong>{formatNumber(data.abstract)}</strong>
                                      </Typography>
                                      <Typography variant="body2" color="success.main">
                                        이미지 캡차: <strong>{formatNumber(data.imagecaptcha)}</strong>
                                      </Typography>                      
                                    </Box>
                                  </Box>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar 
                            dataKey="total" 
                            fill="#1976d2" 
                            name="총 요청"
                            radius={[2, 2, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
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
              {levelData.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    아직 사용 내역이 없습니다. 캡차 위젯을 연동하면 유형별 통계가 표시됩니다.
                  </Typography>
                  <Button variant="contained" size="small" href="/app/api-keys">
                    API 키 발급하기
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                  <Box sx={{ width: '100%', height: 280, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={levelData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
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
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 기간 선택 */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          내 통계
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={period} onChange={handlePeriodChange}>
              <MenuItem value="today">오늘</MenuItem>
              <MenuItem value="week">최근 일주일</MenuItem>
              <MenuItem value="month">최근 한달</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              API 키별 상세 통계
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">비활성화+삭제</Typography>
              <input type="checkbox" checked={includeInactiveDeleted} onChange={handleToggleInactiveDeleted} />
            </Box>
          </Box>
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
                          {/* 상태 뱃지 */}
                          {apiKey.is_active !== undefined && (
                            <Box sx={{ mb: 1 }}>
                              {!includeInactiveDeleted ? null : (
                                <Chip size="small" label={apiKey.is_active ? '활성' : '비활성/삭제'} color={apiKey.is_active ? 'success' : 'default'} />
                              )}
                            </Box>
                          )}
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
                      {apiKey.is_active !== undefined && includeInactiveDeleted && (
                        <Chip size="small" sx={{ ml: 1 }} label={apiKey.is_active ? '활성' : '비활성/삭제'} color={apiKey.is_active ? 'success' : 'default'} />
                      )}
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
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const pMap: Record<string, number> = {} as any;
                          payload.forEach((p: any) => {
                            if (p && p.dataKey) {
                              pMap[p.dataKey] = p.value as number;
                            }
                          });
                          return (
                            <Box sx={{ 
                              bgcolor: 'background.paper', 
                              border: 1, 
                              borderColor: 'divider', 
                              borderRadius: 1, 
                              p: 2,
                              boxShadow: 3
                            }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                {label}
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body2">
                                  전체 요청: <strong>{formatNumber(pMap['requests'] || 0)}</strong>
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#2e7d32' }}>
                                  성공 요청: <strong>{formatNumber(pMap['success'] || 0)}</strong>
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#d32f2f' }}>
                                  실패 요청: <strong>{formatNumber(pMap['failed'] || 0)}</strong>
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#9c27b0' }}>
                                  리렌더링: <strong>{formatNumber(Math.max(0, (pMap['requests'] || 0) - (pMap['success'] || 0) - (pMap['failed'] || 0)))}</strong>
                                </Typography>
                              </Box>
                            </Box>
                          );
                        }
                        return null;
                      }}
                    />
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
