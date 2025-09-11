import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Error as ErrorIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { adminService, RealtimeMonitoringData } from '../services/adminService';
import ApiStatusMonitor from '../components/monitoring/ApiStatusMonitor';
import ResponseTimeChart from '../components/monitoring/ResponseTimeChart';
import ErrorRateChart from '../components/monitoring/ErrorRateChart';
import TpsChart from '../components/monitoring/TpsChart';

const RequestStatusScreen: React.FC = () => {
  const [monitoringData, setMonitoringData] = useState<RealtimeMonitoringData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadMonitoringData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getRealtimeMonitoring();
      if (response.success) {
        setMonitoringData(response.data);
        setLastUpdated(new Date());
      } else {
        setError('실시간 모니터링 데이터를 불러오지 못했습니다.');
      }
    } catch (e: any) {
      setError(e?.message || '실시간 모니터링 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonitoringData();
    
    // 30초마다 자동 새로고침
    const interval = setInterval(loadMonitoringData, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderSystemSummary = () => {
    if (!monitoringData) return <Alert severity="info">표시할 요약 정보가 없습니다.</Alert>;
    
    const summary = monitoringData.system_summary;
    const stats = [
      { 
        label: '총 요청 수 (1시간)', 
        value: summary.total_requests_1h.toLocaleString(),
        icon: <AssessmentIcon color="primary" />,
        color: 'primary'
      },
      { 
        label: '성공률 (1시간)', 
        value: `${summary.success_rate_1h.toFixed(1)}%`,
        icon: <TrendingUpIcon color="success" />,
        color: summary.success_rate_1h >= 95 ? 'success' : summary.success_rate_1h >= 80 ? 'warning' : 'error'
      },
      { 
        label: '평균 응답시간 (1시간)', 
        value: `${summary.avg_response_time_1h.toFixed(0)}ms`,
        icon: <SpeedIcon color="info" />,
        color: summary.avg_response_time_1h < 500 ? 'success' : summary.avg_response_time_1h < 1000 ? 'warning' : 'error'
      },
      { 
        label: '에러율 (1시간)', 
        value: `${summary.error_rate_1h.toFixed(2)}%`,
        icon: <ErrorIcon color="error" />,
        color: summary.error_rate_1h < 1 ? 'success' : summary.error_rate_1h < 5 ? 'warning' : 'error'
      },
      { 
        label: '활성 사용자 (1시간)', 
        value: summary.unique_users_1h.toLocaleString(),
        icon: <AssessmentIcon color="secondary" />,
        color: 'secondary'
      },
    ];

    return (
      <Grid container spacing={2}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {stat.icon}
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  mt: 0.5,
                  color: stat.color === 'success' ? 'success.main' : 
                         stat.color === 'warning' ? 'warning.main' : 
                         stat.color === 'error' ? 'error.main' : 
                         stat.color === 'primary' ? 'primary.main' : 
                         stat.color === 'secondary' ? 'secondary.main' : 
                         stat.color === 'info' ? 'info.main' : 'text.primary'
                }}
              >
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  };

  const formatLastUpdated = (date: Date) => {
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          실시간 모니터링 대시보드
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" color="text.secondary">
            마지막 업데이트: {formatLastUpdated(lastUpdated)}
          </Typography>
          <Tooltip title="새로고침">
            <IconButton 
              onClick={loadMonitoringData} 
              disabled={loading}
              size="small"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : !monitoringData ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          표시할 모니터링 데이터가 없습니다.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* 시스템 요약 */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  시스템 요약 (최근 1시간)
                </Typography>
                {renderSystemSummary()}
              </CardContent>
            </Card>
          </Grid>

          {/* API 상태 모니터링 */}
          <Grid item xs={12} lg={6}>
            <ApiStatusMonitor apiStatus={monitoringData.api_status} />
          </Grid>

          {/* 응답 시간 차트 */}
          <Grid item xs={12} lg={6}>
            <ResponseTimeChart responseTimeData={monitoringData.response_time_data} />
          </Grid>

          {/* 에러율 차트 */}
          <Grid item xs={12} lg={6}>
            <ErrorRateChart errorRateData={monitoringData.error_rate_data} />
          </Grid>

          {/* TPS 차트 */}
          <Grid item xs={12} lg={6}>
            <TpsChart tpsData={monitoringData.tps_data} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default RequestStatusScreen;
