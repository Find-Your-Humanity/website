import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from 'recharts';
import { ErrorRateData } from '../../services/adminService';

interface ErrorRateChartProps {
  errorRateData: ErrorRateData[];
}

const ErrorRateChart: React.FC<ErrorRateChartProps> = ({ errorRateData }) => {
  const formatTimeLabel = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAverageErrorRate = () => {
    if (errorRateData.length === 0) return 0;
    const sum = errorRateData.reduce((acc, item) => acc + item.error_rate, 0);
    return sum / errorRateData.length;
  };

  const getMaxErrorRate = () => {
    if (errorRateData.length === 0) return 0;
    return Math.max(...errorRateData.map(item => item.error_rate));
  };

  const getTotalErrors = () => {
    return errorRateData.reduce((acc, item) => acc + item.error_count, 0);
  };

  const getTotalRequests = () => {
    return errorRateData.reduce((acc, item) => acc + item.total_requests, 0);
  };

  const averageErrorRate = getAverageErrorRate();
  const maxErrorRate = getMaxErrorRate();
  const totalErrors = getTotalErrors();
  const totalRequests = getTotalRequests();

  const getErrorRateColor = (rate: number) => {
    if (rate < 1) return '#4caf50'; // Green - Good
    if (rate < 5) return '#ff9800'; // Orange - Warning
    return '#f44336'; // Red - Critical
  };

  const getErrorRateStatus = (rate: number) => {
    if (rate < 1) return { status: 'good', color: 'success', message: '정상' };
    if (rate < 5) return { status: 'warning', color: 'warning', message: '주의' };
    return { status: 'critical', color: 'error', message: '위험' };
  };

  const currentStatus = getErrorRateStatus(averageErrorRate);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: 1,
            p: 2,
            boxShadow: 2,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {formatTimeLabel(label)}
          </Typography>
          <Typography variant="body2" color="error">
            에러율: {data.error_rate.toFixed(2)}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            에러 수: {data.error_count.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            총 요청: {data.total_requests.toLocaleString()}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            에러율 모니터링
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={`평균: ${averageErrorRate.toFixed(2)}%`}
              color={currentStatus.color as any}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`최대: ${maxErrorRate.toFixed(2)}%`}
              color={maxErrorRate > 5 ? 'error' : maxErrorRate > 1 ? 'warning' : 'success'}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>

        {/* 현재 상태 알림 */}
        <Alert 
          severity={currentStatus.color as any} 
          sx={{ mb: 2 }}
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">
                총 에러: {totalErrors.toLocaleString()} / {totalRequests.toLocaleString()}
              </Typography>
            </Box>
          }
        >
          현재 평균 에러율: <strong>{averageErrorRate.toFixed(2)}%</strong> ({currentStatus.message})
        </Alert>

        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={errorRateData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="time"
                tickFormatter={formatTimeLabel}
                stroke="#666"
                fontSize={12}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                stroke="#666"
                fontSize={12}
                tick={{ fontSize: 11 }}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              
              {/* 에러율 기준선 */}
              <ReferenceLine y={1} stroke="#4caf50" strokeDasharray="5 5" label="Good (1%)" />
              <ReferenceLine y={5} stroke="#ff9800" strokeDasharray="5 5" label="Warning (5%)" />
              <ReferenceLine y={10} stroke="#f44336" strokeDasharray="5 5" label="Critical (10%)" />
              
              <Area
                type="monotone"
                dataKey="error_rate"
                stroke="#f44336"
                strokeWidth={2}
                fill="#f44336"
                fillOpacity={0.3}
                dot={{ fill: '#f44336', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#f44336', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              최근 1시간 에러율 분포
            </Typography>
            <Typography variant="caption" color="text.secondary">
              평균 에러율: {averageErrorRate.toFixed(2)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(averageErrorRate, 10)} // 최대 10%로 제한
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getErrorRateColor(averageErrorRate),
                borderRadius: 4,
              },
            }}
          />
        </Box>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            최근 1시간 데이터 (5분 단위)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 2, backgroundColor: '#4caf50' }} />
              <Typography variant="caption">Good (&lt;1%)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 2, backgroundColor: '#ff9800' }} />
              <Typography variant="caption">Warning (&lt;5%)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 2, backgroundColor: '#f44336' }} />
              <Typography variant="caption">Critical (&gt;5%)</Typography>
            </Box>
          </Box>
        </Box>

        {errorRateData.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              최근 1시간 내 에러율 데이터가 없습니다.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ErrorRateChart;
