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
import { 
  Edit, 
  Visibility, 
  Person, 
  TrendingUp, 
  AccessTime 
} from '@mui/icons-material';
import { adminService, type Plan, type PlanSubscriber, type PlanSubscriberStats } from '../services/adminService';

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

  // 구독자 상세보기 모달 상태
  const [subscribersDialogOpen, setSubscribersDialogOpen] = useState(false);
  const [selectedPlanSubscribers, setSelectedPlanSubscribers] = useState<PlanSubscriber[]>([]);
  const [selectedPlanStats, setSelectedPlanStats] = useState<PlanSubscriberStats | null>(null);
  const [subscribersLoading, setSubscribersLoading] = useState(false);

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

  // 구독자 상세보기
  const openSubscribersDialog = async (plan: Plan) => {
    try {
      setSubscribersLoading(true);
      setSubscribersDialogOpen(true);
      
      const response = await adminService.getPlanSubscribers(plan.id);
      if (response.success) {
        setSelectedPlanSubscribers(response.data.subscribers);
        setSelectedPlanStats(response.data.plan_stats);
      } else {
        setError('구독자 정보를 불러올 수 없습니다.');
      }
    } catch (error) {
      setError('구독자 정보 조회 중 오류가 발생했습니다.');
    } finally {
      setSubscribersLoading(false);
    }
  };

  // 구독자 모달 닫기
  const closeSubscribersDialog = () => {
    setSubscribersDialogOpen(false);
    setSelectedPlanSubscribers([]);
    setSelectedPlanStats(null);
  };

  return (
    <Box className="rc-container">
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
            <TableContainer component={Paper} className="rc-scroll-x rc-sticky-header">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>이름</TableCell>
                    <TableCell>표시명</TableCell>
                    <TableCell>월 요금(₩)</TableCell>
                    <TableCell>월 요청 한도</TableCell>
                    <TableCell>분당 제한</TableCell>
                    <TableCell>구독자</TableCell>
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
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" fontWeight="bold">
                            {p.subscriber_count || 0}명
                          </Typography>
                          <Chip 
                            label={`구독: ${p.active_subscribers ?? 0}`}
                            size="small"
                            color="default"
                            variant="outlined"
                          />
                          {p.subscriber_count && p.subscriber_count > 0 && (
                            <IconButton
                              size="small"
                              onClick={() => openSubscribersDialog(p)}
                              color="info"
                              title="구독자 상세보기"
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
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

      {/* 구독자 상세보기 모달 */}
      <Dialog 
        open={subscribersDialogOpen} 
        onClose={closeSubscribersDialog} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Person />
            <Box>
              <Typography variant="h6">
                {selectedPlanStats?.plan_info.display_name} 구독자 목록
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedPlanStats?.plan_info.name}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {subscribersLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {/* 통계 요약 */}
              {selectedPlanStats && (
                <Box mb={3}>
                  <Typography variant="h6" gutterBottom>📊 통계 요약</Typography>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Chip 
                      icon={<Person />}
                      label={`총 구독자: ${selectedPlanStats.total_subscribers}명`} 
                      color="primary" 
                      variant="outlined"
                    />
                    <Chip 
                      icon={<TrendingUp />}
                      label={`활성 구독자: ${selectedPlanStats.active_subscribers}명`} 
                      color="success" 
                      variant="outlined"
                    />
                    <Chip 
                      icon={<AccessTime />}
                      label={`월간 총 요청: ${selectedPlanStats.total_monthly_requests.toLocaleString()}회`} 
                      color="info" 
                      variant="outlined"
                    />
                    <Chip 
                      label={`오늘 총 요청: ${selectedPlanStats.total_daily_requests.toLocaleString()}회`} 
                      color="warning" 
                      variant="outlined"
                    />
                  </Box>
                </Box>
              )}

              {/* 구독자 목록 테이블 */}
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>사용자</TableCell>
                      <TableCell>구독 기간</TableCell>
                      <TableCell>상태</TableCell>
                      <TableCell>사용량</TableCell>
                      <TableCell>마지막 요청</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedPlanSubscribers.map((subscriber) => (
                      <TableRow key={subscriber.subscription_id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {subscriber.name || subscriber.username}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {subscriber.email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              시작: {new Date(subscriber.start_date).toLocaleDateString('ko-KR')}
                            </Typography>
                            {subscriber.end_date && (
                              <Typography variant="body2" color="text.secondary">
                                종료: {new Date(subscriber.end_date).toLocaleDateString('ko-KR')}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={
                              subscriber.subscription_status === 'active' ? '활성' :
                              subscriber.subscription_status === 'expired' ? '만료' :
                              subscriber.subscription_status === 'cancelled' ? '취소' : 
                              subscriber.subscription_status
                            }
                            color={
                              subscriber.subscription_status === 'active' ? 'success' :
                              subscriber.subscription_status === 'expired' ? 'error' :
                              'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              월간: {subscriber.monthly_requests_used.toLocaleString()} / {
                                subscriber.monthly_request_limit ? 
                                subscriber.monthly_request_limit.toLocaleString() : 
                                '무제한'
                              }
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              오늘: {subscriber.daily_requests_used.toLocaleString()}회
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {subscriber.last_request_time ? 
                              new Date(subscriber.last_request_time).toLocaleString('ko-KR') : 
                              '요청 없음'
                            }
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {selectedPlanSubscribers.length === 0 && !subscribersLoading && (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">
                    이 요금제의 구독자가 없습니다.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSubscribersDialog}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlansScreen;
