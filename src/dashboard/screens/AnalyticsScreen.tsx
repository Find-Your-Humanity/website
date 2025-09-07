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
import { CaptchaStats, ApiUsageLimit } from '../types';
import AnalyticsSkeleton from '../components/AnalyticsSkeleton';
import AnalyticsChart from '../components/AnalyticsChart';

const AnalyticsScreen: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState('7days');
  const [statsData, setStatsData] = useState<CaptchaStats[]>([]);
  const [usageLimits, setUsageLimits] = useState<ApiUsageLimit | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // API 키 사용량 관련 상태
  const [apiKeyUsage, setApiKeyUsage] = useState<any>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeyLoading, setApiKeyLoading] = useState(false);

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


  const handleTimePeriodChange = (event: SelectChangeEvent) => {
    setTimePeriod(event.target.value);
  };

  // API 연동: 기간 변경 시 통계 조회
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const period: 'daily' | 'weekly' | 'monthly' =
          timePeriod === '7days' ? 'daily' : timePeriod === '30days' ? 'weekly' : 'monthly';
        const res = await dashboardService.getStats(period);
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
  }, [timePeriod]);

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
        try {
          const d = new Date(s.date);
          label = `${d.getMonth() + 1}/${d.getDate()}`;
        } catch (e) {
          label = `Day ${idx + 1}`;
        }
      } else {
        label = `Day ${idx + 1}`;
      }
      
      return {
        label,
        success: s.successfulSolves || 0,
        failed: s.failedAttempts || 0,
        requests: s.totalRequests || 0,
      };
    });
  }, [statsData]);

  // API 키별 사용량 조회 핸들러
  const handleApiKeyUsage = async () => {
    if (!apiKeyInput.trim()) return;
    setApiKeyLoading(true);
    try {
      const res = await dashboardService.getApiKeyUsage(apiKeyInput.trim());
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

  // 사용량 제한 퍼센트 계산 유틸리티
  const calcPercentage = (current: number, limit: number) => {
    if (!limit || limit <= 0) return 0;
    return Math.min(100, Math.round((current / limit) * 100));
  };

  // 중복 데이터 정리 핸들러
  const handleCleanupDuplicates = async () => {
    try {
      const res = await dashboardService.cleanupDuplicates();
      if (res.success) {
        const deletedCount = (res as any)?.data?.deletedCount ?? 0;
        alert(`중복 데이터 정리 완료: ${deletedCount}건 삭제`);
        // 필요 시 재조회
        try {
          const period: 'daily' | 'weekly' | 'monthly' =
            timePeriod === '7days' ? 'daily' : timePeriod === '30days' ? 'weekly' : 'monthly';
          const refreshed = await dashboardService.getStats(period);
          if (refreshed.success) setStatsData(refreshed.data);
        } catch {}
      } else {
        alert((res as any)?.message || '중복 데이터 정리에 실패했습니다.');
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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>분석</Typography>
          <Typography variant="body2" color="text.secondary">
            기간별 통계와 사용량 현황을 확인하세요.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="period-label">기간</InputLabel>
            <Select
              labelId="period-label"
              id="period"
              value={timePeriod}
              label="기간"
              onChange={handleTimePeriodChange}
            >
              <MenuItem value="7days">최근 7일</MenuItem>
              <MenuItem value="30days">최근 30일</MenuItem>
              <MenuItem value="90days">최근 90일</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" size="small" onClick={handleCleanupDuplicates}>중복 정리</Button>
        </Box>
      </Box>

      {/* API 사용량 제한 요약 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">API 사용량 제한</Typography>
            {usageLimits && (
              <Chip
                label={usageLimits.planDisplayName || usageLimits.plan.toUpperCase()}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
          </Box>

          {usageLimits ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>분당</Typography>
                <LinearProgress variant="determinate" value={calcPercentage(usageLimits.currentUsage.perMinute, usageLimits.limits.perMinute)} />
                <Typography variant="caption" color="text.secondary">
                  {formatNumber(usageLimits.currentUsage.perMinute)} / {formatNumber(usageLimits.limits.perMinute)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>일일</Typography>
                <LinearProgress variant="determinate" value={calcPercentage(usageLimits.currentUsage.perDay, usageLimits.limits.perDay)} />
                <Typography variant="caption" color="text.secondary">
                  {formatNumber(usageLimits.currentUsage.perDay)} / {formatNumber(usageLimits.limits.perDay)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>월간</Typography>
                <LinearProgress variant="determinate" value={calcPercentage(usageLimits.currentUsage.perMonth, usageLimits.limits.perMonth)} />
                <Typography variant="caption" color="text.secondary">
                  {formatNumber(usageLimits.currentUsage.perMonth)} / {formatNumber(usageLimits.limits.perMonth)}
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Skeleton variant="rectangular" height={80} />
          )}
        </CardContent>
      </Card>

      {/* API 키별 사용량 조회 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>API 키별 사용량 조회</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="API 키 입력"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button variant="contained" onClick={handleApiKeyUsage} disabled={apiKeyLoading}>조회</Button>
          </Box>
          {apiKeyLoading && <LinearProgress sx={{ mt: 2 }} />}
          {apiKeyUsage && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                최근 사용량 요약(예시): {JSON.stringify(apiKeyUsage)}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* 통계 차트 */}
      <AnalyticsChart data={chartData as any} loading={loading} timePeriod={timePeriod} />

      {/* 오류 처리 */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      )}
    </Box>
  );
};

export default AnalyticsScreen;
