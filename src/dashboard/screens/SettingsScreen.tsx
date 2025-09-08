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
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const SettingsScreen: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState<string>(user?.name || '');
  const [email] = useState<string>(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      // 실제 저장 API는 후속 단계에서 연결합니다. 현재는 성공 메시지만 표시합니다.
      setTimeout(() => {
        setSaving(false);
        setMessage('프로필이 저장되었습니다. (데모)');
      }, 600);
    } catch (e: any) {
      setSaving(false);
      setMessage(e?.message || '저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <Box className="rc-container">
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>설정</Typography>
      <Card>
        <CardContent>
          {message && (
            <Alert severity={message.includes('오류') ? 'error' : 'success'} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="이메일"
                fullWidth
                value={email}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="이름"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleSave} disabled={saving}>
                {saving ? '저장 중...' : '저장'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SettingsScreen;
