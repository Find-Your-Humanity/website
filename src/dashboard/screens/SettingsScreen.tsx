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
  Switch,
  FormControlLabel,
  Divider,
  Slider,
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
  Save as SaveIcon, 
  Refresh as RefreshIcon,
  Block as BlockIcon,
  CheckCircle as UnblockIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const SettingsScreen: React.FC = () => {
  const { user } = useAuth();
  // 로그인 사용자의 API 키 사용 (없을 경우 마지막에 데모키 폴백)
  const apiKeyHeader = (user as any)?.apiKey || (user as any)?.api_key || 'rc_live_f49a055d62283fd02e8203ccaba70fc2';
  const [name, setName] = useState<string>(user?.name || '');
  const [email] = useState<string>(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  // 구 대시보드 설정 UI 통합 상태
  const [settings, setSettings] = useState({
    // 캡차 설정
    imageRecognitionEnabled: true,
    handwritingRecognitionEnabled: true,
    emotionRecognitionEnabled: false,
    difficultyLevel: 3,
    timeoutDuration: 30,
    maxAttempts: 3,
    // 시스템 설정
    autoScalingEnabled: true,
    debugMode: false,
    analyticsEnabled: true,
    alertsEnabled: true,
    // 보안 설정
    rateLimitEnabled: true,
    rateLimitPerMinute: 60,
    blockSuspiciousIPs: true,
    requireSSL: true,
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  // 의심스러운 IP 관리 상태
  const [suspiciousIPs, setSuspiciousIPs] = useState<any[]>([]);
  const [loadingIPs, setLoadingIPs] = useState(false);
  const [ipStats, setIpStats] = useState<any>(null);
  const [blockDialog, setBlockDialog] = useState<{open: boolean, ip: string, reason: string}>({
    open: false,
    ip: '',
    reason: ''
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // 의심스러운 IP 목록 조회
  const fetchSuspiciousIPs = async () => {
    setLoadingIPs(true);
    try {
      const response = await fetch('https://gateway.realcatcha.com/api/admin/suspicious-ips', {
        headers: {
          'X-API-Key': apiKeyHeader,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const items = Array.isArray(data) ? data : (data?.suspicious_ips ?? []);
        setSuspiciousIPs(items);
      } else {
        console.error('Failed to fetch suspicious IPs');
      }
    } catch (error) {
      console.error('Error fetching suspicious IPs:', error);
    } finally {
      setLoadingIPs(false);
    }
  };

  // IP 통계 조회
  const fetchIPStats = async () => {
    try {
      const response = await fetch('https://gateway.realcatcha.com/api/admin/ip-stats', {
        headers: {
          'X-API-Key': apiKeyHeader,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIpStats(data);
      }
    } catch (error) {
      console.error('Error fetching IP stats:', error);
    }
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

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    if (settings.blockSuspiciousIPs) {
      fetchSuspiciousIPs();
      fetchIPStats();
    }
  }, [settings.blockSuspiciousIPs]);

  // 시간 포맷팅 함수 (ISO 문자열/epoch seconds 모두 지원)
  const formatTimestamp = (ts: any) => {
    if (ts === null || ts === undefined) return '-';
    const d = typeof ts === 'number' ? new Date(ts * 1000) : new Date(ts);
    return isNaN(d.getTime()) ? '-' : d.toLocaleString('ko-KR');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      // 실제 저장 API는 후속 단계에서 연결합니다. (프로필 저장)
      await new Promise(resolve => setTimeout(resolve, 400));
      setMessage('프로필이 저장되었습니다. (데모)');
      setSaving(false);
    } catch (e: any) {
      setSaving(false);
      setMessage(e?.message || '저장 중 오류가 발생했습니다.');
    }
  };

  const handleSaveSettings = async () => {
    setSaveStatus('saving');
    try {
      // 실제 설정 저장 API는 후속 단계에서 연결합니다.
      await new Promise(resolve => setTimeout(resolve, 600));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleResetSettings = () => {
    setSettings({
      imageRecognitionEnabled: true,
      handwritingRecognitionEnabled: true,
      emotionRecognitionEnabled: false,
      difficultyLevel: 3,
      timeoutDuration: 30,
      maxAttempts: 3,
      autoScalingEnabled: true,
      debugMode: false,
      analyticsEnabled: true,
      alertsEnabled: true,
      rateLimitEnabled: true,
      rateLimitPerMinute: 60,
      blockSuspiciousIPs: true,
      requireSSL: true,
    });
  };

  return (
    <Box className="rc-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>설정</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleResetSettings}>
            초기화
          </Button>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveSettings} disabled={saveStatus === 'saving'}>
            {saveStatus === 'saving' ? '저장 중...' : '설정 저장'}
          </Button>
        </Box>
      </Box>  

      {saveStatus === 'success' && (
        <Alert severity="success" sx={{ mb: 2 }}>설정이 저장되었습니다. (데모)</Alert>
      )}
      {saveStatus === 'error' && (
        <Alert severity="error" sx={{ mb: 2 }}>설정 저장 중 오류가 발생했습니다.</Alert>
      )}

      <Grid container spacing={2}>
        {/* 프로필 카드 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              {message && (
                <Alert severity={message.includes('오류') ? 'error' : 'success'} sx={{ mb: 2 }}>
                  {message}
                </Alert>
              )}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField label="이메일" fullWidth value={email} disabled />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="이름" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" onClick={handleSave} disabled={saving}>
                    {saving ? '저장 중...' : '프로필 저장'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 캡차 설정 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>캡차 설정</Typography>
              <FormControlLabel control={<Switch checked={settings.imageRecognitionEnabled} onChange={(e) => handleSettingChange('imageRecognitionEnabled', e.target.checked)} />} label="이미지 인식 캡차" sx={{ display: 'block', mb: 2 }} />
              <FormControlLabel control={<Switch checked={settings.handwritingRecognitionEnabled} onChange={(e) => handleSettingChange('handwritingRecognitionEnabled', e.target.checked)} />} label="필기 인식 캡차" sx={{ display: 'block', mb: 2 }} />
              <FormControlLabel control={<Switch checked={settings.emotionRecognitionEnabled} onChange={(e) => handleSettingChange('emotionRecognitionEnabled', e.target.checked)} />} label="감정 인식 캡차" sx={{ display: 'block', mb: 3 }} />
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" gutterBottom>난이도 레벨: {settings.difficultyLevel}</Typography>
              <Slider value={settings.difficultyLevel} onChange={(_, v) => handleSettingChange('difficultyLevel', v)} min={1} max={5} marks sx={{ mb: 2 }} />
              <TextField fullWidth label="타임아웃 (초)" type="number" value={settings.timeoutDuration} onChange={(e) => handleSettingChange('timeoutDuration', parseInt(e.target.value))} sx={{ mb: 2 }} />
              <TextField fullWidth label="최대 시도 횟수" type="number" value={settings.maxAttempts} onChange={(e) => handleSettingChange('maxAttempts', parseInt(e.target.value))} />
            </CardContent>
          </Card>
        </Grid>

        {/* 시스템 설정 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>시스템 설정</Typography>
              <FormControlLabel control={<Switch checked={settings.autoScalingEnabled} onChange={(e) => handleSettingChange('autoScalingEnabled', e.target.checked)} />} label="자동 스케일링" sx={{ display: 'block', mb: 2 }} />
              <FormControlLabel control={<Switch checked={settings.debugMode} onChange={(e) => handleSettingChange('debugMode', e.target.checked)} />} label="디버그 모드" sx={{ display: 'block', mb: 2 }} />
              <FormControlLabel control={<Switch checked={settings.analyticsEnabled} onChange={(e) => handleSettingChange('analyticsEnabled', e.target.checked)} />} label="분석 데이터 수집" sx={{ display: 'block', mb: 2 }} />
              <FormControlLabel control={<Switch checked={settings.alertsEnabled} onChange={(e) => handleSettingChange('alertsEnabled', e.target.checked)} />} label="알림 사용" sx={{ display: 'block', mb: 2 }} />
            </CardContent>
          </Card>
        </Grid>

        {/* 보안 설정 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>보안 설정</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel control={<Switch checked={settings.rateLimitEnabled} onChange={(e) => handleSettingChange('rateLimitEnabled', e.target.checked)} />} label="요청 빈도 제한" sx={{ display: 'block', mb: 2 }} />
                  <TextField fullWidth label="분당 최대 요청 수" type="number" value={settings.rateLimitPerMinute} onChange={(e) => handleSettingChange('rateLimitPerMinute', parseInt(e.target.value))} disabled={!settings.rateLimitEnabled} sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel control={<Switch checked={settings.blockSuspiciousIPs} onChange={(e) => handleSettingChange('blockSuspiciousIPs', e.target.checked)} />} label="의심스러운 IP 차단" sx={{ display: 'block', mb: 2 }} />
                  <FormControlLabel control={<Switch checked={settings.requireSSL} onChange={(e) => handleSettingChange('requireSSL', e.target.checked)} />} label="SSL 연결 요구" sx={{ display: 'block', mb: 2 }} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* 의심스러운 IP 관리 */}
          {settings.blockSuspiciousIPs && (
            <Card>
              <CardContent>
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
