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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Button,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { adminService, type Plan } from '../services/adminService';

const PlansScreen: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 요금제 수정 관련 상태
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    display_name: '',
    price: 0,
    monthly_request_limit: 0,
    rate_limit_per_minute: 0,
    is_active: true,
  });

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

  // 요금제 수정 핸들러
  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setEditForm({
      name: plan.name || '',
      display_name: plan.display_name || '',
      price: plan.price || 0,
      monthly_request_limit: plan.monthly_request_limit || 0,
      rate_limit_per_minute: plan.rate_limit_per_minute || 0,
      is_active: plan.is_active,
    });
    setEditDialogOpen(true);
  };

  // 요금제 수정 저장
  const handleSaveEdit = async () => {
    if (!selectedPlan) return;
    
    try {
      const resp = await adminService.updatePlan(selectedPlan.id, editForm);
      if (resp.success) {
        // 요금제 목록 새로고침
        const plansResp = await adminService.getPlans();
        if (plansResp.success) {
          setPlans(plansResp.data);
        }
        setEditDialogOpen(false);
        setSelectedPlan(null);
      } else {
        setError(resp.error || '요금제 수정에 실패했습니다.');
      }
    } catch (e: any) {
      setError(e?.message || '요금제 수정에 실패했습니다.');
    }
  };

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
                    <TableCell>표시명</TableCell>
                    <TableCell>월 요금(₩)</TableCell>
                    <TableCell>월 요청 한도</TableCell>
                    <TableCell>분당 제한</TableCell>
                    <TableCell>상태</TableCell>
                    <TableCell>액션</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plans.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell>{p.name || '-'}</TableCell>
                      <TableCell>{p.display_name || '-'}</TableCell>
                      <TableCell>{p.price ? p.price.toLocaleString() : '-'}</TableCell>
                      <TableCell>{p.monthly_request_limit ? p.monthly_request_limit.toLocaleString() : '-'}</TableCell>
                      <TableCell>{p.rate_limit_per_minute || '-'}</TableCell>
                      <TableCell>
                        <Chip 
                          size="small" 
                          color={p.is_active ? "success" : "default"} 
                          label={p.is_active ? "활성" : "비활성"} 
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditPlan(p)}
                          color="primary"
                        >
                          <Edit />
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

      {/* 요금제 수정 다이얼로그 */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>요금제 정보 수정</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="이름"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="표시명"
              value={editForm.display_name}
              onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
              fullWidth
            />
            <TextField
              label="월 요금 (원)"
              type="number"
              value={editForm.price}
              onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) || 0 })}
              fullWidth
            />
            <TextField
              label="월 요청 한도"
              type="number"
              value={editForm.monthly_request_limit}
              onChange={(e) => setEditForm({ ...editForm, monthly_request_limit: parseInt(e.target.value) || 0 })}
              fullWidth
            />
            <TextField
              label="분당 제한"
              type="number"
              value={editForm.rate_limit_per_minute}
              onChange={(e) => setEditForm({ ...editForm, rate_limit_per_minute: parseInt(e.target.value) || 0 })}
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>취소</Button>
          <Button onClick={handleSaveEdit} variant="contained">저장</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlansScreen;
