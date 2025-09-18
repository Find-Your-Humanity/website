import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Block as BlockIcon,
  CheckCircle as UnblockIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { settingsService, SuspiciousIP, IPStats, ApiKey } from '../services/settingsService';

const SettingsScreen: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  // API 키 관리 상태 (세션 기반으로 변경)
  const [myApiKeys, setMyApiKeys] = useState<ApiKey[]>([]);
  const [selectedApiKey, setSelectedApiKey] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  
  // 의심스러운 IP 관리 상태
  const [suspiciousIPs, setSuspiciousIPs] = useState<SuspiciousIP[]>([]);
  const [loadingIPs, setLoadingIPs] = useState(false);
  const [ipStats, setIpStats] = useState<IPStats | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [lastRaw, setLastRaw] = useState<any>(null);
  const [blockDialog, setBlockDialog] = useState<{open: boolean, ip: string, reason: string}>({
    open: false,
    ip: '',
    reason: ''
  });

  // 요청 취소 없음

  const handleSettingChange = (_key: string, _value: any) => {};

  // 의심스러운 IP 목록 조회 (세션 기반)
  const fetchSuspiciousIPs = async () => {
    setLoadingIPs(true);
    setErrorText(null);
    
    if (!isAuthenticated) {
      setSuspiciousIPs([]);
      setLoadingIPs(false);
      setErrorText('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await settingsService.getSuspiciousIPs(1, 50, selectedApiKey && selectedApiKey.trim() ? selectedApiKey : undefined);
      
      if (response.success && response.data) {
        setLastRaw({ endpoint: 'suspicious-ips', data: response.data });
        setSuspiciousIPs(response.data.suspicious_ips);
      } else {
        setErrorText('의심 IP 조회 실패: 서버 응답 오류');
      }
    } catch (error: any) {
      console.error('의심 IP 조회 오류:', error);
      if (error.response?.status === 401) {
        setErrorText('세션이 만료되었습니다. 페이지를 새로고침해주세요.');
      } else if (error.response?.status === 403) {
        setErrorText('권한이 없습니다.');
      } else {
        setErrorText('의심 IP 조회 중 오류가 발생했습니다.');
      }
    } finally {
      setLoadingIPs(false);
    }
  };

  // IP 통계 조회 (세션 기반)
  const fetchIPStats = async () => {
    try {
      setErrorText(null);
      
      if (!isAuthenticated) {
        setIpStats(null);
        return;
      }

      const response = await settingsService.getIPStats(selectedApiKey && selectedApiKey.trim() ? selectedApiKey : undefined);
      
      if (response.success && response.data) {
        setLastRaw({ endpoint: 'ip-stats', data: response.data });
        setIpStats(response.data);
      } else {
        setIpStats(null);
        setErrorText('IP 통계 조회 실패: 서버 응답 오류');
      }
    } catch (error: any) {
      console.error('IP 통계 조회 오류:', error);
      if (error.response?.status === 401) {
        setErrorText('세션이 만료되었습니다. 페이지를 새로고침해주세요.');
      } else {
        setErrorText('IP 통계 조회 중 오류가 발생했습니다.');
      }
    }
  };

  // 내 API 키 목록 조회 (세션 기반)
  const fetchMyApiKeys = async () => {
    try {
      if (!isAuthenticated) {
        setMyApiKeys([]);
        return;
      }

      const response = await settingsService.getMyApiKeys();
      
      if (response.success && response.data) {
        setMyApiKeys(response.data.api_keys);
      } else {
        console.error('API 키 조회 실패: 서버 응답 오류');
      }
    } catch (error: any) {
      console.error('API 키 조회 오류:', error);
      if (error.response?.status === 401) {
        setErrorText('세션이 만료되었습니다. 페이지를 새로고침해주세요.');
      }
    }
  };

  // IP 차단 (세션 기반)
  const blockIP = async (ip: string, reason: string) => {
    try {
      if (!isAuthenticated) {
        setMessage('로그인이 필요합니다.');
        return;
      }

      const response = await settingsService.blockIP(ip, reason);
      
      if (response.success) {
        setMessage(`IP ${ip} 차단 완료`);
        fetchSuspiciousIPs();
        fetchIPStats();
      } else {
        setMessage('IP 차단 실패');
      }
    } catch (error: any) {
      console.error('IP 차단 오류:', error);
      if (error.response?.status === 401) {
        setMessage('세션이 만료되었습니다. 페이지를 새로고침해주세요.');
      } else {
        setMessage(error?.message || 'IP 차단 중 오류가 발생했습니다.');
      }
    }
  };

  // IP 차단 해제 (세션 기반)
  const unblockIP = async (ip: string) => {
    try {
      if (!isAuthenticated) {
        setMessage('로그인이 필요합니다.');
        return;
      }

      const response = await settingsService.unblockIP(ip);
      
      if (response.success) {
        setMessage(`IP ${ip} 차단 해제 완료`);
        fetchSuspiciousIPs();
        fetchIPStats();
      } else {
        setMessage('IP 차단 해제 실패');
      }
    } catch (error: any) {
      console.error('IP 차단 해제 오류:', error);
      if (error.response?.status === 401) {
        setMessage('세션이 만료되었습니다. 페이지를 새로고침해주세요.');
      } else {
        setMessage(error?.message || 'IP 차단 해제 중 오류가 발생했습니다.');
      }
    }
  };

  // 데이터 로드 (세션 기반)
  useEffect(() => {
    if (isAuthenticated) {
      fetchMyApiKeys();
      fetchSuspiciousIPs();
      fetchIPStats();
    }
  }, [isAuthenticated, selectedApiKey]);

  // 로그인 사용자 변경 시 초기화
  useEffect(() => {
    if (!isAuthenticated) {
      setMyApiKeys([]);
      setSelectedApiKey('');
      setSuspiciousIPs([]);
      setIpStats(null);
      setErrorText(null);
    }
  }, [isAuthenticated]);

  // 시간 포맷팅 함수 (ISO 문자열/epoch seconds 모두 지원)
  const formatTimestamp = (ts: any) => {
    if (ts === null || ts === undefined) return '-';
    const d = typeof ts === 'number' ? new Date(ts * 1000) : new Date(ts);
    return isNaN(d.getTime()) ? '-' : d.toLocaleString('ko-KR');
  };

  // 제거된 설정/프로필 관련 함수들 (미사용)

  return (
    <Box className="rc-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>의심 IP 관리</Typography>
          <Typography variant="body2" color="text.secondary">
            사용자 전용 서비스 - API 키별 의심스러운 IP 모니터링 및 차단 관리
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => { fetchSuspiciousIPs(); fetchIPStats(); }}>
            새로고침
          </Button>
        </Box>
      </Box>  
      {!isAuthenticated && (
        <Alert severity="warning" sx={{ mb: 2 }}>로그인이 필요합니다. 세션 인증이 필요합니다.</Alert>
      )}
      {errorText && (
        <Alert severity="error" sx={{ mb: 2 }}>{errorText}</Alert>
      )}

      <Grid container spacing={2}>
        {/* API 키 선택 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel id="api-key-select-label">API 키 선택</InputLabel>
                    <Select
                      labelId="api-key-select-label"
                      label="API 키 선택"
                      value={selectedApiKey}
                      onChange={(e) => setSelectedApiKey(String(e.target.value))}
                      disabled={!isAuthenticated || myApiKeys.length === 0}
                    >
                      <MenuItem value="">전체 API 키</MenuItem>
                      {myApiKeys.map(k => (
                        <MenuItem key={k.key_id} value={k.key_id}>
                          {k.name || k.key_id}
                        </MenuItem>
                      ))}
                      {myApiKeys.length === 0 && isAuthenticated && (
                        <MenuItem value="" disabled>API 키가 없습니다</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  {message && (
                    <Alert severity={message.includes('오류') || message.includes('실패') ? 'error' : 'success'} sx={{ mt: 1 }}>
                      {message}
                    </Alert>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 의심스러운 IP 관리 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">의심스러운 IP 관리</Typography>
                  
                </Box>

                {/* IP 통계 */}
                {ipStats && (
                  <Grid container spacing={2} mb={3}>
                    <Grid item xs={6} md={3}>
                      <Card variant="outlined" sx={{ textAlign: 'center', p: 2, borderLeft: '4px solid #ff9800' }}>
                        <Typography variant="h4" color="text.primary" sx={{ fontWeight: 600 }}>
                          {ipStats.total_suspicious_ips || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          총 의심 IP
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card variant="outlined" sx={{ textAlign: 'center', p: 2, borderLeft: '4px solid #f44336' }}>
                        <Typography variant="h4" color="text.primary" sx={{ fontWeight: 600 }}>
                          {ipStats.blocked_ips}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          차단된 IP
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card variant="outlined" sx={{ textAlign: 'center', p: 2, borderLeft: '4px solid #2196f3' }}>
                        <Typography variant="h4" color="text.primary" sx={{ fontWeight: 600 }}>
                          {ipStats.active_suspicious_ips || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          활성 의심 IP
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card variant="outlined" sx={{ textAlign: 'center', p: 2, borderLeft: '4px solid #4caf50' }}>
                        <Typography variant="h4" color="text.primary" sx={{ fontWeight: 600 }}>
                          {ipStats.recent_violations_24h || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          24시간 내 위반
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                )}

                {/* 의심스러운 IP 목록 */}
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>IP 주소</TableCell>
                        <TableCell>상태</TableCell>
                        <TableCell>위반 횟수</TableCell>
                        <TableCell>최근 위반</TableCell>
                        <TableCell>차단 사유</TableCell>
                        <TableCell>작업</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {suspiciousIPs.map((ipData, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <WarningIcon color="warning" sx={{ mr: 1 }} />
                              <Typography variant="body2" fontFamily="monospace">
                                {ipData.ip_address}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={ipData.is_blocked ? "차단됨" : "활성"}
                              color={ipData.is_blocked ? "error" : "warning"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {ipData.violation_count}회
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatTimestamp(ipData.last_violation_time)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {ipData.block_reason || "Rate limit 초과"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" gap={1}>
                              {ipData.is_blocked ? (
                                <Tooltip title="차단 해제">
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => unblockIP(ipData.ip_address)}
                                  >
                                    <UnblockIcon />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip title="IP 차단">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => setBlockDialog({
                                      open: true,
                                      ip: ipData.ip_address,
                                      reason: 'Manual block'
                                    })}
                                  >
                                    <BlockIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                      {suspiciousIPs.length === 0 && !loadingIPs && (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <Typography variant="body2" color="text.secondary">
                              의심스러운 IP가 없습니다.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                      {loadingIPs && (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <Typography variant="body2" color="text.secondary">
                              로딩 중...
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* IP 차단 다이얼로그 */}
      <Dialog open={blockDialog.open} onClose={() => setBlockDialog({open: false, ip: '', reason: ''})}>
        <DialogTitle>IP 차단</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            IP 주소 <strong>{blockDialog.ip}</strong>를 차단하시겠습니까?
          </Typography>
          <TextField
            fullWidth
            label="차단 사유"
            value={blockDialog.reason}
            onChange={(e) => setBlockDialog(prev => ({...prev, reason: e.target.value}))}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialog({open: false, ip: '', reason: ''})}>
            취소
          </Button>
          <Button 
            onClick={() => {
              blockIP(blockDialog.ip, blockDialog.reason);
              setBlockDialog({open: false, ip: '', reason: ''});
            }}
            color="error"
            variant="contained"
          >
            차단
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsScreen;
