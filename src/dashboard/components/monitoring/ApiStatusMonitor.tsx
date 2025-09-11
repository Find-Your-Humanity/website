import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as HealthyIcon,
  Warning as WarningIcon,
  Error as CriticalIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { ApiStatus } from '../../services/adminService';

interface ApiStatusMonitorProps {
  apiStatus: ApiStatus[];
}

const ApiStatusMonitor: React.FC<ApiStatusMonitorProps> = ({ apiStatus }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <HealthyIcon color="success" fontSize="small" />;
      case 'warning':
        return <WarningIcon color="warning" fontSize="small" />;
      case 'critical':
        return <CriticalIcon color="error" fontSize="small" />;
      default:
        return <WarningIcon color="disabled" fontSize="small" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'N/A';
    return new Date(timeString).toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatResponseTime = (time: number) => {
    if (time < 1000) {
      return `${time.toFixed(0)}ms`;
    }
    return `${(time / 1000).toFixed(2)}s`;
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            API 상태 모니터링
          </Typography>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={<HealthyIcon />}
              label="정상"
              color="success"
              size="small"
              variant="outlined"
            />
            <Chip
              icon={<WarningIcon />}
              label="주의"
              color="warning"
              size="small"
              variant="outlined"
            />
            <Chip
              icon={<CriticalIcon />}
              label="위험"
              color="error"
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>상태</TableCell>
                <TableCell>엔드포인트</TableCell>
                <TableCell align="right">총 요청</TableCell>
                <TableCell align="right">성공률</TableCell>
                <TableCell align="right">평균 응답시간</TableCell>
                <TableCell align="right">마지막 요청</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {apiStatus.map((api, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getStatusIcon(api.status)}
                      <Chip
                        label={api.status.toUpperCase()}
                        color={getStatusColor(api.status) as any}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {api.endpoint}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {api.total_requests.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                      <Typography
                        variant="body2"
                        color={api.success_rate >= 95 ? 'success.main' : api.success_rate >= 80 ? 'warning.main' : 'error.main'}
                        sx={{ fontWeight: 600 }}
                      >
                        {api.success_rate.toFixed(1)}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({api.success_count}/{api.total_requests})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                      <TimeIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {formatResponseTime(api.avg_response_time)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={api.last_request_time ? new Date(api.last_request_time).toLocaleString() : 'N/A'}>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(api.last_request_time)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {apiStatus.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              최근 1시간 내 API 요청 데이터가 없습니다.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiStatusMonitor;
