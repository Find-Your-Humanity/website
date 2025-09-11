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
import { TpsData } from '../../services/adminService';

interface TpsChartProps {
  tpsData: TpsData[];
}

const TpsChart: React.FC<TpsChartProps> = ({ tpsData }) => {
  const formatTimeLabel = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAverageTps = () => {
    if (tpsData.length === 0) return 0;
    const sum = tpsData.reduce((acc, item) => acc + item.tps, 0);
    return sum / tpsData.length;
  };

  const getMaxTps = () => {
    if (tpsData.length === 0) return 0;
    return Math.max(...tpsData.map(item => item.tps));
  };

  const getMinTps = () => {
    if (tpsData.length === 0) return 0;
    return Math.min(...tpsData.map(item => item.tps));
  };

  const getCurrentTps = () => {
    if (tpsData.length === 0) return 0;
    return tpsData[tpsData.length - 1]?.tps || 0;
  };

  const averageTps = getAverageTps();
  const maxTps = getMaxTps();
  const minTps = getMinTps();
  const currentTps = getCurrentTps();

  const getTpsColor = (tps: number) => {
    if (tps < 10) return '#4caf50'; // Green - Low
    if (tps < 50) return '#ff9800'; // Orange - Medium
    return '#f44336'; // Red - High
  };

  const getTpsStatus = (tps: number) => {
    if (tps < 10) return { status: 'low', color: 'success', message: '낮음' };
    if (tps < 50) return { status: 'medium', color: 'warning', message: '보통' };
    return { status: 'high', color: 'error', message: '높음' };
  };

  const currentStatus = getTpsStatus(currentTps);

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
          <Typography variant="body2" color="primary">
            TPS: {data.tps.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            분당 요청: {(data.tps * 60).toFixed(0)}
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
            처리량 (TPS) 모니터링
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={`현재: ${currentTps.toFixed(2)} TPS`}
              color={currentStatus.color as any}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`평균: ${averageTps.toFixed(2)} TPS`}
              color="primary"
              size="small"
              variant="outlined"
            />
            <Chip
              label={`최대: ${maxTps.toFixed(2)} TPS`}
              color="error"
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
                분당 요청: {(currentTps * 60).toFixed(0)}
              </Typography>
            </Box>
          }
        >
          현재 처리량: <strong>{currentTps.toFixed(2)} TPS</strong> ({currentStatus.message})
        </Alert>

        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tpsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="time"
                tickFormatter={formatTimeLabel}
                stroke="#666"
                fontSize={12}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickFormatter={(value) => `${value.toFixed(1)}`}
                stroke="#666"
                fontSize={12}
                tick={{ fontSize: 11 }}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              
              {/* TPS 기준선 */}
              <ReferenceLine y={10} stroke="#4caf50" strokeDasharray="5 5" label="Low (10 TPS)" />
              <ReferenceLine y={50} stroke="#ff9800" strokeDasharray="5 5" label="Medium (50 TPS)" />
              <ReferenceLine y={100} stroke="#f44336" strokeDasharray="5 5" label="High (100 TPS)" />
              
              <Area
                type="monotone"
                dataKey="tps"
                stroke="#1976d2"
                strokeWidth={2}
                fill="#1976d2"
                fillOpacity={0.3}
                dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#1976d2', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              최근 1시간 처리량 분포
            </Typography>
            <Typography variant="caption" color="text.secondary">
              평균 TPS: {averageTps.toFixed(2)}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min((currentTps / 100) * 100, 100)} // 최대 100 TPS로 제한
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getTpsColor(currentTps),
                borderRadius: 4,
              },
            }}
          />
        </Box>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            최근 1시간 데이터 (1분 단위)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 2, backgroundColor: '#4caf50' }} />
              <Typography variant="caption">Low (&lt;10 TPS)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 2, backgroundColor: '#ff9800' }} />
              <Typography variant="caption">Medium (&lt;50 TPS)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 2, backgroundColor: '#f44336' }} />
              <Typography variant="caption">High (&gt;50 TPS)</Typography>
            </Box>
          </Box>
        </Box>

        {tpsData.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              최근 1시간 내 TPS 데이터가 없습니다.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TpsChart;
