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
} from '@mui/material';
import { dashboardService } from '../services/dashboardService';

// 백엔드 응답 형태가 고정되어 있지 않을 수 있으므로 유연하게 처리합니다.
const RequestStatusScreen: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await dashboardService.getCaptchaPerformance();
        if (resp.success) {
          setData(resp.data);
        } else {
          setError((resp as any).message || '요청 상태 정보를 불러오지 못했습니다.');
        }
      } catch (e: any) {
        setError(e?.message || '요청 상태 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const renderSummary = () => {
    const summary = (data && (data.summary || data.metrics || data)) || {};
    const entries = Object.entries(summary).slice(0, 12);

    if (entries.length === 0) {
      return <Alert severity="info">표시할 요약 정보가 없습니다.</Alert>;
    }

    return (
      <Grid container spacing={2}>
        {entries.map(([key, value], idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">{key}</Typography>
              <Typography variant="h6" sx={{ mt: 0.5 }}>
                {typeof value === 'number' ? value.toLocaleString() : String(value)}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderRecentIssues = () => {
    const issues = (data && (data.issues || data.recent || data.items)) || [];
    if (!Array.isArray(issues) || issues.length === 0) {
      return <Alert severity="info">최근 이슈가 없습니다.</Alert>;
    }
    return (
      <List dense>
        {issues.slice(0, 20).map((it: any, idx: number) => (
          <React.Fragment key={idx}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={it.title || it.type || it.status || '이슈'}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.secondary">
                      {it.message || it.detail || it.description || ''}
                    </Typography>
                    <br />
                    <Typography component="span" variant="caption" color="text.secondary">
                      {it.time ? new Date(it.time).toLocaleString() : it.created_at ? new Date(it.created_at).toLocaleString() : ''}
                    </Typography>
                  </>
                }
              />
              {it.severity && (
                <Chip size="small" label={String(it.severity)} color={String(it.severity).toLowerCase() === 'critical' ? 'error' : 'default'} />
              )}
            </ListItem>
            {idx < issues.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    );
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>요청 상태</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : !data ? (
        <Alert severity="info">표시할 데이터가 없습니다.</Alert>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>요약</Typography>
                {renderSummary()}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>최근 이슈</Typography>
                {renderRecentIssues()}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default RequestStatusScreen;
