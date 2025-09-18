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
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Chip,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { usersService } from '../services/usersService';
import type { User } from '../types';

const UsersScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 사용자 수정/삭제 관련 상태
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    email: '',
    username: '',
    name: '',
    contact: '',
    is_active: true,
    is_admin: false,
  });

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

  // 사용자 수정 핸들러
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      email: user.email,
      username: user.username,
      name: user.name || '',
      contact: user.contact || '',
      is_active: user.is_active,
      is_admin: user.is_admin,
    });
    setEditDialogOpen(true);
  };

  // 사용자 삭제 핸들러
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // 사용자 수정 저장
  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    
    try {
      const resp = await usersService.update(String(selectedUser.id), {
        email: editForm.email,
        name: editForm.name,
        is_admin: editForm.is_admin,
      });
      if (resp.success) {
        // 사용자 목록 새로고침
        const usersResp = await usersService.list();
        if (usersResp.success) {
          setUsers(usersResp.data);
        }
        setEditDialogOpen(false);
        setSelectedUser(null);
      } else {
        setError(resp.error || '사용자 수정에 실패했습니다.');
      }
    } catch (e: any) {
      setError(e?.message || '사용자 수정에 실패했습니다.');
    }
  };

  // 사용자 삭제 확인
  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      const resp = await usersService.remove(String(selectedUser.id));
      if (resp.success) {
        // 사용자 목록 새로고침
        const usersResp = await usersService.list();
        if (usersResp.success) {
          setUsers(usersResp.data);
        }
        setDeleteDialogOpen(false);
        setSelectedUser(null);
      } else {
        setError(resp.error || '사용자 삭제에 실패했습니다.');
      }
    } catch (e: any) {
      setError(e?.message || '사용자 삭제에 실패했습니다.');
    }
  };

  return (
    <Box className="rc-container">
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
            <TableContainer component={Paper} className="rc-scroll-x rc-sticky-header">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>이메일</TableCell>
                    <TableCell>이름</TableCell>
                    <TableCell>권한</TableCell>
                    <TableCell>상태</TableCell>
                    <TableCell>가입일</TableCell>
                    <TableCell>액션</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} hover>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.name || u.username || '-'}</TableCell>
                      <TableCell>
                        <Chip 
                          size="small" 
                          color={u.is_admin ? "primary" : "default"} 
                          label={u.is_admin ? "관리자" : "사용자"} 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          size="small" 
                          color={u.is_active ? "success" : "default"} 
                          label={u.is_active ? "활성" : "비활성"} 
                        />
                      </TableCell>
                      <TableCell>{u.created_at ? new Date(u.created_at).toLocaleString() : '-'}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditUser(u)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteUser(u)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* 사용자 수정 다이얼로그 */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>사용자 정보 수정</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="이메일"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              fullWidth
              disabled
            />
            <TextField
              label="사용자명"
              value={editForm.username}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              fullWidth
            />
            <TextField
              label="이름"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="연락처"
              value={editForm.contact}
              onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editForm.is_active}
                  onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                />
              }
              label="활성 상태"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editForm.is_admin}
                  onChange={(e) => setEditForm({ ...editForm, is_admin: e.target.checked })}
                />
              }
              label="관리자 권한"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>취소</Button>
          <Button onClick={handleSaveEdit} variant="contained">저장</Button>
        </DialogActions>
      </Dialog>

      {/* 사용자 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>사용자 삭제 확인</DialogTitle>
        <DialogContent>
          <Typography>
            정말로 <strong>{selectedUser?.email}</strong> 사용자를 삭제하시겠습니까?
            <br />
            이 작업은 되돌릴 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersScreen;
