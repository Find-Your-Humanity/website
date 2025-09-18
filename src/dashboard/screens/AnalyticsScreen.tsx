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
} from 'recharts';
import { formatNumber, formatPercentage } from '../utils';
import { dashboardService } from '../services/dashboardService';
import { userStatsService, ChartData } from '../services/userStatsService';
import { CaptchaStats, ApiUsageLimit, ApiType, PeriodType } from '../types';
import AnalyticsSkeleton from '../components/AnalyticsSkeleton';
import AnalyticsChart from '../components/AnalyticsChart';

const AnalyticsScreen: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState('1day');
  const [apiType, setApiType] = useState<ApiType>('all');
  const [tabValue, setTabValue] = useState(0); // 탭 네비게이션 상태
  const [statsData, setStatsData] = useState<ChartData[]>([]);
  const [apiKeys, setApiKeys] = useState<{ key_id: string; name?: string }[]>([]);
  const [selectedApiKey, setSelectedApiKey] = useState<string>('');
  const [usageLimits, setUsageLimits] = useState<ApiUsageLimit | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  

  const handleTimePeriodChange = (event: SelectChangeEvent) => {
    setTimePeriod(event.target.value);
  };

  const handleApiTypeChange = (event: SelectChangeEvent) => {
    setApiType(event.target.value as ApiType);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // 탭 인덱스를 API 타입으로 변환
    const apiTypes: ApiType[] = ['all', 'handwriting', 'abstract', 'imagecaptcha'];
    setApiType(apiTypes[newValue]);
  };

  // API 키별 사용량 조회 함수


  // 내 API 키 목록 로드
  useEffect(() => {
    (async () => {
      try {
        const res = await dashboardService.getMyApiKeys();
        if ((res as any)?.success && (res as any)?.api_keys) {
          setApiKeys((res as any).api_keys || []);
        }
      } catch (e) {}
    })();
  }, []);

  // API 연동: 기간/타입/키 변경 시 통계 조회
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        // 기간 매핑: 1day -> today, 7days -> week, 30days -> month
        const periodMap: { [key: string]: 'today' | 'week' | 'month' } = {
          '1day': 'today',
          '7days': 'week', 
          '30days': 'month'
        };
        const period = periodMap[timePeriod] || 'month';
        
        // userStatsService.getHourlyChartData 사용 (daily_user_api_stats 기반)
        const res = await userStatsService.getHourlyChartData(period, apiType, selectedApiKey || undefined);
        if (res.success && res.data && res.data.chart_data) {
          setStatsData(res.data.chart_data);
        } else {
          setError(res.message || '통계 데이터를 불러오지 못했습니다.');
          setStatsData([]);
        }
      } catch (e) {
        setError('통계 데이터를 불러오지 못했습니다.');
        setStatsData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [timePeriod, apiType, selectedApiKey]);


  // API 사용량 제한 조회
  useEffect(() => {
    const fetchUsageLimits = async () => {
      try {
        const res = await dashboardService.getUsageLimits();
        if (res.success) {
          setUsageLimits(res.data);
        }
      } catch (e) {
        // 콘솔 출력 제거
      }
    };
    
    // 초기 로드
    fetchUsageLimits();
    
    // 요금제 변경 이벤트 리스너 추가
    const handlePlanChanged = () => {
      // 로그 제거
      fetchUsageLimits();
    };
    
    window.addEventListener('planChanged', handlePlanChanged);
    
    // 클린업
    return () => {
      window.removeEventListener('planChanged', handlePlanChanged);
    };
  }, []);

  // 차트용 가공 데이터 생성 (ChartData 타입 사용)
  const chartData = useMemo(() => {
    return statsData.map((s, idx) => {
      // ChartData 타입에 맞게 매핑
      return {
        label: s.label || `Day ${idx + 1}`,
        success: s.success || 0,
        failed: s.failed || 0,
        total: s.requests || 0,
      };
    });
  }, [statsData]);



  // 중복 데이터 정리 핸들러 (하단의 고도화 버전만 유지)

  // 사용량 제한 상태에 따른 색상 반환
  const getUsageStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      case 'exceeded': return 'error';
      default: return 'default';
    }
  };

  // 사용량 퍼센트 계산
  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };


  if (loading && statsData.length === 0) {
    return <AnalyticsSkeleton />;
  }

  return (
    <Box className="rc-container">
      {/* 헤더 (요금제/API 키 페이지와 동일한 레이아웃) */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
          <Box>
            <Typography variant="h5" component="h5" gutterBottom sx={{ fontWeight: 700, mb: 0 }}>
              내 분석
            </Typography>
            <Typography variant="body1" color="text.secondary">
              개인 API 사용 패턴 및 성능 분석
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
                <MenuItem value="1day">오늘</MenuItem>
                <MenuItem value="7days">1주일</MenuItem>
                <MenuItem value="30days">한달</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: { xs: 160, md: 220 } }}>
              <InputLabel>전체 API 키</InputLabel>
              <Select
                value={selectedApiKey}
                label="전체 API 키"
                onChange={(e) => setSelectedApiKey(e.target.value)}
                renderValue={(value) => {
                  if (value === '') {
                    return '전체 API 키';
                  }
                  const selectedKey = apiKeys.find(k => k.key_id === value);
                  return selectedKey ? (selectedKey.name || selectedKey.key_id) : value;
                }}
              >
                <MenuItem value="">전체 API 키</MenuItem>
                {apiKeys.map((k) => (
                  <MenuItem key={k.key_id} value={k.key_id}>{k.name || k.key_id}</MenuItem>
                ))}
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
      
      {/* 초기 로딩 시 스켈레톤 표시 */}
      {loading && (
        <AnalyticsSkeleton />
      )}

      <Grid container spacing={3}>
        {/* API 사용량 제한 확인 */}
        {usageLimits && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    API 사용량 제한 확인
                  </Typography>
                  <Chip 
                    label={`${usageLimits.planDisplayName || usageLimits.plan.toUpperCase()} 플랜`}
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                <Grid container spacing={3}>
                  {/* 분당 요청 제한 */}
                  <Grid item xs={12} md={4}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">분당 요청 제한</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {formatNumber(usageLimits.currentUsage.perMinute)} / {formatNumber(usageLimits.limits.perMinute)}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getUsagePercentage(usageLimits.currentUsage.perMinute, usageLimits.limits.perMinute)}
                        color={getUsageStatusColor(usageLimits.status) as any}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        리셋: {new Date(usageLimits.resetTimes.perMinute).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* 일일 요청 제한 */}
                  <Grid item xs={12} md={4}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">일일 요청 제한</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {formatNumber(usageLimits.currentUsage.perDay)} / {formatNumber(usageLimits.limits.perDay)}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getUsagePercentage(usageLimits.currentUsage.perDay, usageLimits.limits.perDay)}
                        color={getUsageStatusColor(usageLimits.status) as any}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        리셋: {new Date(usageLimits.resetTimes.perDay).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* 월간 요청 제한 */}
                  <Grid item xs={12} md={4}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">월간 요청 제한</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {formatNumber(usageLimits.currentUsage.perMonth)} / {formatNumber(usageLimits.limits.perMonth)}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getUsagePercentage(usageLimits.currentUsage.perMonth, usageLimits.limits.perMonth)}
                        color={getUsageStatusColor(usageLimits.status) as any}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        리셋: {new Date(usageLimits.resetTimes.perMonth).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* 사용량 제한 경고 */}
                {usageLimits.status !== 'normal' && (
                  <Alert 
                    severity={usageLimits.status === 'exceeded' ? 'error' : 'warning'} 
                    sx={{ mt: 2 }}
                  >
                    {usageLimits.status === 'exceeded' 
                      ? 'API 사용량 제한을 초과했습니다. 플랜을 업그레이드하거나 다음 리셋 시간까지 기다려주세요.'
                      : 'API 사용량이 제한에 근접하고 있습니다. 사용량을 모니터링하세요.'
                    }
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}


        {/* 기간별 요청 현황 (API 연동) */}
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
                  sx={{
                    '& .MuiTab-root': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      minWidth: { xs: 'auto', sm: 160 },
                      padding: { xs: '6px 8px', sm: '12px 16px' }
                    }
                  }}
                >
                  <Tab label="전체" />
                  <Tab label="필기" />
                  <Tab label="추상" />
                  <Tab label="이미지" />
                </Tabs>
              </Box>
              
              <AnalyticsChart 
                data={chartData} 
                loading={loading} 
                timePeriod={timePeriod}
                apiType={apiType}
              />
            </CardContent>
          </Card>
        </Grid>


      </Grid>
    </Box>
  );
};

export default AnalyticsScreen;
