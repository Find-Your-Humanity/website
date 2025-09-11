import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { ResponseTimeData } from '../../services/adminService';

interface ResponseTimeChartProps {
  responseTimeData: ResponseTimeData[];
}

const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({ responseTimeData }) => {
  const formatTimeLabel = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatResponseTime = (value: number) => {
    if (value < 1000) {
      return `${value.toFixed(0)}ms`;
    }
    return `${(value / 1000).toFixed(2)}s`;
  };

  const getAverageResponseTime = () => {
    if (responseTimeData.length === 0) return 0;
    const sum = responseTimeData.reduce((acc, item) => acc + item.avg_response_time, 0);
    return sum / responseTimeData.length;
  };

  const getMaxResponseTime = () => {
    if (responseTimeData.length === 0) return 0;
    return Math.max(...responseTimeData.map(item => item.max_response_time));
  };

  const getMinResponseTime = () => {
    if (responseTimeData.length === 0) return 0;
    return Math.min(...responseTimeData.map(item => item.min_response_time));
  };

  const averageResponseTime = getAverageResponseTime();
  const maxResponseTime = getMaxResponseTime();
  const minResponseTime = getMinResponseTime();

  const getResponseTimeColor = (time: number) => {
    if (time < 500) return '#4caf50'; // Green - Good
    if (time < 1000) return '#ff9800'; // Orange - Warning
    return '#f44336'; // Red - Critical
  };

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
            평균: {formatResponseTime(data.avg_response_time)}
          </Typography>
          <Typography variant="body2" color="error">
            최대: {formatResponseTime(data.max_response_time)}
          </Typography>
          <Typography variant="body2" color="success.main">
            최소: {formatResponseTime(data.min_response_time)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            요청 수: {data.request_count.toLocaleString()}
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
            응답 시간 추이
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={`평균: ${formatResponseTime(averageResponseTime)}`}
              color="primary"
              size="small"
              variant="outlined"
            />
            <Chip
              label={`최대: ${formatResponseTime(maxResponseTime)}`}
              color="error"
              size="small"
              variant="outlined"
            />
            <Chip
              label={`최소: ${formatResponseTime(minResponseTime)}`}
              color="success"
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>

        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={responseTimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="time"
                tickFormatter={formatTimeLabel}
                stroke="#666"
                fontSize={12}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickFormatter={formatResponseTime}
                stroke="#666"
                fontSize={12}
                tick={{ fontSize: 11 }}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              
              {/* 성능 기준선 */}
              <ReferenceLine y={500} stroke="#4caf50" strokeDasharray="5 5" label="Good (500ms)" />
              <ReferenceLine y={1000} stroke="#ff9800" strokeDasharray="5 5" label="Warning (1s)" />
              <ReferenceLine y={2000} stroke="#f44336" strokeDasharray="5 5" label="Critical (2s)" />
              
              <Line
                type="monotone"
                dataKey="avg_response_time"
                stroke="#1976d2"
                strokeWidth={2}
                dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#1976d2', strokeWidth: 2 }}
                name="평균 응답시간"
              />
              <Line
                type="monotone"
                dataKey="max_response_time"
                stroke="#f44336"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={{ fill: '#f44336', strokeWidth: 2, r: 3 }}
                name="최대 응답시간"
              />
              <Line
                type="monotone"
                dataKey="min_response_time"
                stroke="#4caf50"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={{ fill: '#4caf50', strokeWidth: 2, r: 3 }}
                name="최소 응답시간"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            최근 1시간 데이터 (5분 단위)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 2, backgroundColor: '#1976d2' }} />
              <Typography variant="caption">평균</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 2, backgroundColor: '#f44336', borderStyle: 'dashed' }} />
              <Typography variant="caption">최대</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 2, backgroundColor: '#4caf50', borderStyle: 'dashed' }} />
              <Typography variant="caption">최소</Typography>
            </Box>
          </Box>
        </Box>

        {responseTimeData.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              최근 1시간 내 응답 시간 데이터가 없습니다.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponseTimeChart;
