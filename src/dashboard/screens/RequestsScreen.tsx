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
import { adminService, type ContactRequest } from '../services/adminService';

const RequestsScreen: React.FC = () => {
  const [rows, setRows] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await adminService.getContactRequests();
        if (resp.success) {
          setRows(resp.data.data);
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
                    <TableCell>사용자</TableCell>
                    <TableCell>제목</TableCell>
                    <TableCell>상태</TableCell>
                    <TableCell>생성 시각</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r: ContactRequest, idx: number) => (
                    <TableRow key={r.id || idx} hover>
                      <TableCell>{r.id || '-'}</TableCell>
                      <TableCell>{r.user_email || '-'}</TableCell>
                      <TableCell>{r.subject || '-'}</TableCell>
                      <TableCell>
                        <Chip 
                          size="small" 
                          color={
                            r.status === 'resolved' ? 'success' : 
                            r.status === 'in_progress' ? 'warning' : 
                            'default'
                          } 
                          label={r.status === 'unread' ? '미읽음' : r.status === 'in_progress' ? '진행중' : '해결됨'} 
                        />
                      </TableCell>
                      <TableCell>{r.created_at ? new Date(r.created_at).toLocaleString() : '-'}</TableCell>
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
