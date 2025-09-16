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

const SettingsScreen: React.FC = () => {
  const { user } = useAuth();
  // 사용자 API 키 입력/저장 (없으면 호출 차단하고 안내)
  const [apiKeyInput, setApiKeyInput] = useState<string>(() => {
    const fromUser = (user as any)?.apiKey || (user as any)?.api_key;
    const fromStorage = typeof window !== 'undefined' ? localStorage.getItem('rc_dashboard_api_key') || '' : '';
    return fromUser || fromStorage || '';
  });
  const apiKeyHeader = apiKeyInput.trim();
  const [message, setMessage] = useState<string | null>(null);
  
  // 의심스러운 IP 관리 상태
  const [suspiciousIPs, setSuspiciousIPs] = useState<any[]>([]);
  const [loadingIPs, setLoadingIPs] = useState(false);
  const [ipStats, setIpStats] = useState<any>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [lastRaw, setLastRaw] = useState<any>(null);
  const [myKeys, setMyKeys] = useState<string[]>([]);
  const [blockDialog, setBlockDialog] = useState<{open: boolean, ip: string, reason: string}>({
    open: false,
    ip: '',
    reason: ''
  });

  const handleSettingChange = (_key: string, _value: any) => {};

  // 의심스러운 IP 목록 조회
  const fetchSuspiciousIPs = async () => {
    setLoadingIPs(true);
    setErrorText(null);
    if (!apiKeyHeader) {
      setSuspiciousIPs([]);
      setLoadingIPs(false);
      setErrorText('API 키가 설정되어 있지 않습니다. 아래에서 API 키를 입력해 주세요.');
      return;
    }
    try {
      const qp = apiKeyHeader ? `&key_id=${encodeURIComponent(apiKeyHeader)}` : '';
      const response = await fetch(`https://gateway.realcatcha.com/api/admin/suspicious-ips?page=1&limit=50${qp}`, {
        headers: {
          'X-API-Key': apiKeyHeader,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLastRaw({ endpoint: 'suspicious-ips', data });
        const items = Array.isArray(data) ? data : (data?.suspicious_ips ?? []);
        setSuspiciousIPs(items);
      } else {
        setErrorText('의심 IP 조회 실패: 권한 또는 네트워크 오류');
      }
    } catch (error) {
      setErrorText('의심 IP 조회 중 오류가 발생했습니다.');
    } finally {
      setLoadingIPs(false);
    }
  };

  // IP 통계 조회
  const fetchIPStats = async () => {
    try {
      setErrorText(null);
      if (!apiKeyHeader) return;
      const response = await fetch(`https://gateway.realcatcha.com/api/admin/ip-stats?key_id=${encodeURIComponent(apiKeyHeader)}`, {
        headers: {
          'X-API-Key': apiKeyHeader,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLastRaw({ endpoint: 'ip-stats', data });
        setIpStats(data);
      } else {
        setIpStats(null);
        setErrorText('IP 통계 조회 실패: 권한 또는 네트워크 오류');
      }
    } catch (error) {
      setErrorText('IP 통계 조회 중 오류가 발생했습니다.');
    }
  };

  // 내 API 키 목록 조회
  const fetchMyApiKeys = async () => {
    try {
      const response = await fetch('https://gateway.realcatcha.com/api/admin/my-api-keys', {
        headers: {
          'X-API-Key': apiKeyHeader || undefined,
          'Content-Type': 'application/json'
        } as any
      });
      if (response.ok) {
        const data = await response.json();
        const keys = (data?.api_keys || []).map((k: any) => k.key_id).filter(Boolean);
        setMyKeys(keys);
        // 저장된 키가 없고 서버에서 받은 키가 있으면 첫 키 자동 선택
        if (!apiKeyHeader && keys.length > 0) {
          setApiKeyInput(keys[0]);
          if (typeof window !== 'undefined') localStorage.setItem('rc_dashboard_api_key', keys[0]);
        }
      }
    } catch {}
  };

  // IP 차단
  const blockIP = async (ip: string, reason: string) => {
    try {
      const response = await fetch('https://gateway.realcatcha.com/api/admin/block-ip', {
        method: 'POST',
        headers: {
          'X-API-Key': apiKeyHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ip_address: ip, reason })
      });
      
      if (response.ok) {
        setMessage(`IP ${ip}이(가) 차단되었습니다.`);
        fetchSuspiciousIPs();
        fetchIPStats();
      } else {
        setMessage('IP 차단에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error blocking IP:', error);
      setMessage('IP 차단 중 오류가 발생했습니다.');
    }
  };

  // IP 차단 해제
  const unblockIP = async (ip: string) => {
    try {
      const response = await fetch('https://gateway.realcatcha.com/api/admin/unblock-ip', {
        method: 'POST',
        headers: {
          'X-API-Key': apiKeyHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ip_address: ip })
      });
      
      if (response.ok) {
        setMessage(`IP ${ip}의 차단이 해제되었습니다.`);
        fetchSuspiciousIPs();
        fetchIPStats();
      } else {
        setMessage('IP 차단 해제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error unblocking IP:', error);
      setMessage('IP 차단 해제 중 오류가 발생했습니다.');
    }
  };

  // 데이터 로드
  useEffect(() => {
    fetchMyApiKeys();
    fetchSuspiciousIPs();
    fetchIPStats();
  }, [apiKeyHeader]);

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
        <Typography variant="h5" sx={{ fontWeight: 700 }}>의심 IP 관리</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => { fetchSuspiciousIPs(); fetchIPStats(); }}>
            새로고침
          </Button>
        </Box>
      </Box>  
      {!apiKeyHeader && (
        <Alert severity="warning" sx={{ mb: 2 }}>API 키가 설정되어 있지 않습니다. 아래 입력란에 API 키를 입력하고 저장해 주세요.</Alert>
      )}
      {errorText && (
        <Alert severity="error" sx={{ mb: 2 }}>{errorText}</Alert>
      )}

      <Grid container spacing={2}>
        {/* API 키 선택/저장 */}
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
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(String(e.target.value))}
                    >
                      {myKeys.map(k => (
                        <MenuItem key={k} value={k}>{k}</MenuItem>
                      ))}
                      {myKeys.length === 0 && (
                        <MenuItem value="">(키 없음) 먼저 API 키를 입력/저장하세요</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('rc_dashboard_api_key', apiKeyInput.trim());
                      }
                      setMessage('API 키가 저장되었습니다.');
                      fetchSuspiciousIPs();
                      fetchIPStats();
                    }}
                    disabled={!apiKeyInput.trim()}
                  >
                    API 키 저장
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  {message && (
                    <Alert severity={message.includes('오류') ? 'error' : 'success'} sx={{ mt: 1 }}>
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
            <Card>
              <CardContent>
                {/* 디버그 정보 */}
                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary">
                    API 키: {apiKeyHeader ? apiKeyHeader : '(미설정)'} | 아이템 수: {suspiciousIPs.length} {lastRaw?.endpoint ? `| 마지막: ${lastRaw.endpoint}` : ''}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">의심스러운 IP 관리</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={() => {
                      fetchSuspiciousIPs();
                      fetchIPStats();
                    }}
                    disabled={loadingIPs}
                  >
                    새로고침
                  </Button>
                </Box>

                {/* IP 통계 */}
                {ipStats && (
                  <Grid container spacing={2} mb={3}>
                    <Grid item xs={6} md={3}>
                      <Box textAlign="center" p={2} bgcolor="warning.light" borderRadius={1}>
                        <Typography variant="h4" color="warning.contrastText">
                          {ipStats.total_suspicious_ips}
                        </Typography>
                        <Typography variant="body2" color="warning.contrastText">
                          총 의심 IP
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box textAlign="center" p={2} bgcolor="error.light" borderRadius={1}>
                        <Typography variant="h4" color="error.contrastText">
                          {ipStats.blocked_ips}
                        </Typography>
                        <Typography variant="body2" color="error.contrastText">
                          차단된 IP
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box textAlign="center" p={2} bgcolor="info.light" borderRadius={1}>
                        <Typography variant="h4" color="info.contrastText">
                          {ipStats.active_suspicious_ips}
                        </Typography>
                        <Typography variant="body2" color="info.contrastText">
                          활성 의심 IP
                        </Typography>
                      </Box>
                </Grid>
                    <Grid item xs={6} md={3}>
                      <Box textAlign="center" p={2} bgcolor="success.light" borderRadius={1}>
                        <Typography variant="h4" color="success.contrastText">
                          {ipStats.recent_violations_24h}
                        </Typography>
                        <Typography variant="body2" color="success.contrastText">
                          24시간 내 위반
                        </Typography>
                      </Box>
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
          )}
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
