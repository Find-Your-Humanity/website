import React, { useState } from 'react';
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
} from '@mui/material';
import { Save as SaveIcon, Refresh as RefreshIcon, DeleteForever as DeleteForeverIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../services/apiClient';

const SettingsScreen: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState<string>(user?.name || '');
  const [email] = useState<string>(user?.email || '');
  const isGoogleOAuth = (user as any)?.oauth_provider === 'google';
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

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const res = await apiClient.put('/api/auth/me', { name });
      if (res.data?.success) {
        setMessage('프로필이 저장되었습니다.');
      } else {
        setMessage('프로필 저장에 실패했습니다.');
      }
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
          <Button color="error" variant="outlined" startIcon={<DeleteForeverIcon />} onClick={async ()=>{
            if (!window.confirm('정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
            try {
              const res = await apiClient.delete('/api/auth/me');
              if (res.data?.success) {
                localStorage.clear();
                window.location.href = '/';
              }
            } catch (err:any) {
              alert(err?.response?.data?.detail || '회원 탈퇴 중 오류가 발생했습니다.');
            }
          }}>
            회원 탈퇴
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
                {!isGoogleOAuth && (
                  <>
                    <Grid item xs={12} md={6}>
                      <TextField label="이름" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="outlined" onClick={handleSave} disabled={saving}>
                        {saving ? '저장 중...' : '프로필 저장'}
                      </Button>
                    </Grid>
                  </>
                )}
                {isGoogleOAuth && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Google OAuth 로그인 사용자는 Google 계정의 이름이 자동으로 동기화되며 이 화면에서 변경할 수 없습니다.
                    </Typography>
                  </Grid>
                )}
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsScreen;
