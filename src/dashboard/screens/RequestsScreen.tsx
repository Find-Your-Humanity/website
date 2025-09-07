import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { dashboardService } from '../services/dashboardService';

const RequestsScreen: React.FC = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await dashboardService.getCaptchaLogs({ page: 1, pageSize: 20 });
        if (resp.success) {
          // 백엔드 응답 구조 유연 대응
          const data: any[] = (resp as any).data?.items || (resp as any).data?.logs || (resp as any).data || [];
          setRows(Array.isArray(data) ? data : []);
        } else {
          setError((resp as any).message || '요청 목록을 불러오지 못했습니다.');
        }
      } catch (e: any) {
        setError(e?.message || '요청 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>요청사항</Typography>
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : rows.length === 0 ? (
            <Alert severity="info">표시할 요청이 없습니다.</Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>상태</TableCell>
                    <TableCell>생성 시각</TableCell>
                    <TableCell>요약</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r: any, idx: number) => (
                    <TableRow key={r.id || r._id || idx} hover>
                      <TableCell>{r.id || r._id || '-'}</TableCell>
                      <TableCell>
                        {r.status ? <Chip size="small" color={r.status === 'success' ? 'success' : r.status === 'failed' ? 'error' : 'default'} label={String(r.status)} /> : '-'}
                      </TableCell>
                      <TableCell>{r.created_at ? new Date(r.created_at).toLocaleString() : r.date ? new Date(r.date).toLocaleString() : '-'}</TableCell>
                      <TableCell>
                        <code style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', maxWidth: 360 }}>
                          {r.summary || r.message || JSON.stringify(r).slice(0, 200)}
                        </code>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default RequestsScreen;
