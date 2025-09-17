import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
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
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card sx={{ 
              p: 2, 
              height: '100%',
              transition: 'all 0.3s ease-in-out',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.15)', cursor: 'pointer' }
            }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {stat.icon}
                  <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mt: 0.5,
                    fontWeight: 700,
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
              </CardContent>
            </Card>
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
    <Box className="rc-container">
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
          <Box>
            <Typography variant="h5" component="h5" gutterBottom sx={{ fontWeight: 700, mb: 0 }}>
              실시간 모니터링 대시보드
            </Typography>
            <Typography variant="body1" color="text.secondary">
              API 상태, 응답시간, 에러율, TPS 실시간 현황
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              마지막 업데이트: {formatLastUpdated(lastUpdated)}
            </Typography>
            <Tooltip title="새로고침">
              <IconButton onClick={loadMonitoringData} disabled={loading} size="small">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
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
        <Grid container spacing={{ xs: 2, md: 3 }}>
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
            <Card sx={{
              transition: 'all 0.3s ease-in-out',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.15)', cursor: 'pointer' }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  API 상태 모니터링
                </Typography>
                <ApiStatusMonitor apiStatus={monitoringData.api_status} />
              </CardContent>
            </Card>
          </Grid>

          {/* 응답 시간 차트 */}
          <Grid item xs={12} lg={6}>
            <Card sx={{
              transition: 'all 0.3s ease-in-out',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.15)', cursor: 'pointer' }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  응답 시간 추이
                </Typography>
                <ResponseTimeChart responseTimeData={monitoringData.response_time_data} />
              </CardContent>
            </Card>
          </Grid>

          {/* 에러율 차트 */}
          <Grid item xs={12} lg={6}>
            <Card sx={{
              transition: 'all 0.3s ease-in-out',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.15)', cursor: 'pointer' }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  에러율 추이
                </Typography>
                <ErrorRateChart errorRateData={monitoringData.error_rate_data} />
              </CardContent>
            </Card>
          </Grid>

          {/* TPS 차트 */}
          <Grid item xs={12} lg={6}>
            <Card sx={{
              transition: 'all 0.3s ease-in-out',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.15)', cursor: 'pointer' }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  TPS 추이
                </Typography>
                <TpsChart tpsData={monitoringData.tps_data} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default RequestStatusScreen;
