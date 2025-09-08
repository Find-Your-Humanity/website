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
import { adminService, type Plan } from '../services/adminService';

const PlansScreen: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await adminService.getPlans();
        if (resp.success) {
          setPlans(resp.data);
        } else {
          setError(resp.error || '요금제 목록을 불러오지 못했습니다.');
        }
      } catch (e: any) {
        setError(e?.message || '요금제 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>요금제 관리</Typography>
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : plans.length === 0 ? (
            <Alert severity="info">등록된 요금제가 없습니다.</Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>이름</TableCell>
                    <TableCell>월 요금(₩)</TableCell>
                    <TableCell>월 요청 한도</TableCell>
                    <TableCell>분당 제한</TableCell>
                    <TableCell>인기</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plans.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.price.toLocaleString()}</TableCell>
                      <TableCell>{p.request_limit.toLocaleString()}</TableCell>
                      <TableCell>{p.rate_limit_per_minute}</TableCell>
                      <TableCell>
                        {p.is_popular ? <Chip size="small" color="primary" label="인기" /> : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Alert severity="info" sx={{ mt: 2 }}>
            관리(생성/수정/삭제) 기능은 후속 단계에서 연결합니다.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PlansScreen;
