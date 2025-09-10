import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
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

interface ChartData {
  label: string;
  success: number;
  failed: number;
}

interface AnalyticsChartProps {
  data: ChartData[];
  loading: boolean;
  timePeriod: string;
  apiType?: string;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = React.memo(({ data, loading, timePeriod, apiType }) => {
  const getChartTitle = () => {
    switch (timePeriod) {
      case '1day': return '하루 요청 현황';
      case '7days': return '7일 요청 현황';
      case '30days': return '주간 요청 현황';
      default: return '요청 현황';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {getChartTitle()}
          </Typography>
          <Box sx={{ 
            height: 400, 
            mt: 2, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {getChartTitle()}
          </Typography>
          <Box sx={{ 
            height: 400, 
            mt: 2, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}>
            <Typography variant="body1" color="text.secondary">
              데이터가 없습니다.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // CSS 변수로 차트 색/텍스트 읽기
  const getVar = (name: string, fallback: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  const gridColor = getVar('--border-color', '#e0e0e0');
  const axisColor = getVar('--text-secondary', '#666');
  const successColor = getVar('--success-color', '#28a745');
  const errorColor = getVar('--error-color', '#dc3545');

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {getChartTitle()}
        </Typography>
        <Box sx={{ height: { xs: 260, sm: 320, md: 400 }, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis dataKey="label" stroke={axisColor} tick={{ fill: axisColor }} />
              <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
              <Tooltip contentStyle={{ background: getVar('--bg-primary', '#fff'), color: getVar('--text-primary', '#000'), border: `1px solid ${gridColor}` }} />
              <Bar dataKey="success" fill={successColor} name="성공" />
              <Bar dataKey="failed" fill={errorColor} name="실패" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
});

AnalyticsChart.displayName = 'AnalyticsChart';

export default AnalyticsChart;
