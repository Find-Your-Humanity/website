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
} from '@mui/material';
import { usersService } from '../services/usersService';
import type { User } from '../types';

const UsersScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await usersService.list();
        if (resp.success) {
          setUsers(resp.data);
        } else {
          setError(resp.error || '사용자 목록을 불러오지 못했습니다.');
        }
      } catch (e: any) {
        setError(e?.message || '사용자 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>사용자 관리</Typography>
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : users.length === 0 ? (
            <Alert severity="info">등록된 사용자가 없습니다.</Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>이메일</TableCell>
                    <TableCell>이름</TableCell>
                    <TableCell>권한</TableCell>
                    <TableCell>가입일</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} hover>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.name || u.username || '-'}</TableCell>
                      <TableCell>{u.is_admin === true || (u as any).is_admin === 1 || u.role === 'admin' ? '관리자' : '사용자'}</TableCell>
                      <TableCell>{u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}</TableCell>
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

export default UsersScreen;
