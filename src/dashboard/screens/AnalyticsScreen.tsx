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
  TextField,
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
} from 'recharts';
import { formatNumber, formatPercentage } from '../utils';
import { dashboardService } from '../services/dashboardService';
import { CaptchaStats, ApiUsageLimit, ApiType, PeriodType } from '../types';
import AnalyticsSkeleton from '../components/AnalyticsSkeleton';
import AnalyticsChart from '../components/AnalyticsChart';

const AnalyticsScreen: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState('7days');
  const [apiType, setApiType] = useState<ApiType>('all');
  const [tabValue, setTabValue] = useState(0); // 탭 네비게이션 상태
  const [statsData, setStatsData] = useState<CaptchaStats[]>([]);
  const [apiKeys, setApiKeys] = useState<{ key_id: string; name?: string }[]>([]);
  const [selectedApiKey, setSelectedApiKey] = useState<string>('');
  const [usageLimits, setUsageLimits] = useState<ApiUsageLimit | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // API 키 사용량 관련 상태
  const [apiKeyUsage, setApiKeyUsage] = useState<any>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeyLoading, setApiKeyLoading] = useState(false);

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
  const fetchApiKeyUsage = async (apiKey: string) => {
    try {
      setApiKeyLoading(true);
      const res = await dashboardService.getApiKeyUsage(apiKey);
      if (res.success) {
        setApiKeyUsage(res.data);
      } else {
        setApiKeyUsage(null);
      }
    } catch (e) {
      console.error('API 키 사용량 조회 실패:', e);
      setApiKeyUsage(null);
    } finally {
      setApiKeyLoading(false);
    }
  };


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
        const period: PeriodType =
          timePeriod === '7days' ? 'daily' : timePeriod === '30days' ? 'weekly' : 'monthly';
        // 키가 선택되어 있으면 개인/키 기반 통계 사용
        const res = selectedApiKey
          ? await dashboardService.getKeyStats(period, apiType, selectedApiKey)
          : await dashboardService.getKeyStats(period, apiType);
        if (res.success) {
          setStatsData(res.data);
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
        console.error('API 사용량 제한 조회 실패:', e);
      }
    };
    
    // 초기 로드
    fetchUsageLimits();
    
    // 요금제 변경 이벤트 리스너 추가
    const handlePlanChanged = () => {
      console.log('요금제 변경 감지됨 - Analytics 데이터 새로고침');
      fetchUsageLimits();
    };
    
    window.addEventListener('planChanged', handlePlanChanged);
    
    // 클린업
    return () => {
      window.removeEventListener('planChanged', handlePlanChanged);
    };
  }, []);

  // 차트용 가공 데이터 생성 (실제 날짜 사용)
  const chartData = useMemo(() => {
    return statsData.map((s, idx) => {
      // 실제 날짜를 사용하여 라벨 생성
      let label = '';
      if (s.date) {
        // 백엔드에서 이미 포맷된 라벨을 받은 경우 그대로 사용
        if (s.date.includes('/') || s.date.includes('-') || s.date.startsWith('W')) {
          label = s.date;
        } else {
          // 날짜 문자열인 경우 파싱
          const date = new Date(s.date);
          if (!isNaN(date.getTime())) {
            const month = date.getMonth() + 1;
            const day = date.getDate();
            label = `${month}/${day}`;
          } else {
            label = s.date;
          }
        }
      } else {
        // 날짜가 없는 경우 인덱스 기반으로 생성
        label = `Day ${idx + 1}`;
      }
      
      return {
        label: label,
        success: s.successfulSolves,
        failed: s.failedAttempts,
      };
    });
  }, [statsData]);

  // 오류 유형(샘플 데이터)
  const errorTypes = [
    { type: '타임아웃', count: 156, percentage: 42.5 },
    { type: '잘못된 입력', count: 98, percentage: 26.7 },
    { type: '네트워크 오류', count: 67, percentage: 18.2 },
    { type: '서버 오류', count: 46, percentage: 12.5 },
  ];

  // API 키별 사용량 조회 핸들러
  const handleApiKeyUsageCheck = () => {
    if (apiKeyInput.trim()) {
      fetchApiKeyUsage(apiKeyInput.trim());
    }
  };

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

  // 중복 데이터 정리 핸들러
  const handleCleanupDuplicates = async () => {
    try {
      const res = await dashboardService.cleanupDuplicates();
      if (res.success) {
        const deletedCount = (res.data as any)?.deletedCount || 0;
        alert(`중복 데이터 정리 완료: ${deletedCount}건 삭제`);
        // 데이터 새로고침
        window.location.reload();
      }
    } catch (error) {
      console.error('중복 데이터 정리 실패:', error);
      alert('중복 데이터 정리에 실패했습니다.');
    }
  };

  if (loading && statsData.length === 0) {
    return <AnalyticsSkeleton />;
  }

  return (
    <Box className="rc-container">
      {/* 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ mb: { xs: 3, md: 2 } }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
            내 분석
          </Typography>
          <Typography variant="body1" color="text.secondary">
            개인 API 사용 패턴 및 성능 분석
          </Typography>
        </Box>
        
        {/* 모바일: 세로 배치, 데스크톱: 가로 배치 */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 2 },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: { md: 'flex-end' }
        }}>
          <Button
            variant="outlined"
            color="warning"
            onClick={handleCleanupDuplicates}
            sx={{ 
              minWidth: { xs: 'auto', md: 120 },
              order: { xs: 3, md: 1 }
            }}
          >
            중복 데이터 정리
          </Button>
          <FormControl sx={{ 
            minWidth: { xs: 'auto', md: 150 },
            order: { xs: 1, md: 2 }
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
          <FormControl sx={{ 
            minWidth: { xs: 'auto', md: 220 },
            order: { xs: 2, md: 3 }
          }}>
            <InputLabel>API 키</InputLabel>
            <Select
              value={selectedApiKey}
              label="API 키"
              onChange={(e) => setSelectedApiKey(e.target.value)}
            >
              <MenuItem value="">내 모든 키 (합계)</MenuItem>
              {apiKeys.map((k) => (
                <MenuItem key={k.key_id} value={k.key_id}>{k.name || k.key_id}</MenuItem>
              ))}
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

        {/* API 키 사용량 조회 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                API 키 사용량 조회
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2, 
                mb: 3 
              }}>
                <TextField
                  fullWidth
                  label="API 키 입력"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="예: rc_live_f49a055d62283fd02e8203ccaba70fc2"
                  variant="outlined"
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={handleApiKeyUsageCheck}
                  disabled={!apiKeyInput.trim() || apiKeyLoading}
                  sx={{ 
                    minWidth: { xs: 'auto', sm: 120 },
                    flexShrink: 0
                  }}
                >
                  {apiKeyLoading ? '조회 중...' : '조회'}
                </Button>
              </Box>
              
              {apiKeyUsage && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    API 키: {apiKeyUsage.name || apiKeyUsage.apiKey}
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={6} sm={6} md={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="primary" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                          {formatNumber(apiKeyUsage.totalRequests)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          총 요청 수
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="success.main" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                          {formatNumber(apiKeyUsage.successRequests)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          성공 요청
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="error.main" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                          {formatNumber(apiKeyUsage.failedRequests)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          실패 요청
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="info.main" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                          {apiKeyUsage.avgResponseTime}ms
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          평균 응답 시간
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  {apiKeyUsage.lastUsed && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                      마지막 사용: {new Date(apiKeyUsage.lastUsed).toLocaleString()}
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

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

        {/* 오류 유형 분석 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                오류 유형 분석
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

        {/* 성능 메트릭 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                성능 메트릭
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">평균 응답 시간</Typography>
                  <Typography variant="body2" fontWeight="bold">245ms</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">95% 응답 시간</Typography>
                  <Typography variant="body2" fontWeight="bold">890ms</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">초당 처리 요청</Typography>
                  <Typography variant="body2" fontWeight="bold">2.1/s</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">업타임</Typography>
                  <Typography variant="body2" fontWeight="bold" color="success.main">99.9%</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 사용자 통계 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                사용자 통계
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">일일 활성 사용자</Typography>
                  <Typography variant="body2" fontWeight="bold">{formatNumber(15420)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">신규 사용자</Typography>
                  <Typography variant="body2" fontWeight="bold">{formatNumber(1240)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">재방문 사용자</Typography>
                  <Typography variant="body2" fontWeight="bold">{formatNumber(14180)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">평균 세션 시간</Typography>
                  <Typography variant="body2" fontWeight="bold">4m 32s</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsScreen;
