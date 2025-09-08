import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Divider,
  Alert,
  CircularProgress,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Check as CheckIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { billingService, Plan, CurrentPlan } from '../services/billingService';
import { adminService, PlanSubscriber, PlanSubscriberStats } from '../services/adminService';
import PaymentModal from '../../components/PaymentModal';
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';
import { useLocation } from 'react-router-dom';

const BillingScreen: React.FC = () => {
  const { user } = useAuth();
  const [currentPlanData, setCurrentPlanData] = useState<CurrentPlan | null>(null);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 구독자 관련 상태
  const [subscribersDialogOpen, setSubscribersDialogOpen] = useState(false);
  const [selectedPlanSubscribers, setSelectedPlanSubscribers] = useState<PlanSubscriber[]>([]);
  const [selectedPlanStats, setSelectedPlanStats] = useState<PlanSubscriberStats | null>(null);
  const [subscribersLoading, setSubscribersLoading] = useState(false);

  // 결제 모달 상태 및 Toss Payments 위젯
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ type: string; id: number; name: string; price: number } | null>(null);
  const [paymentWidget, setPaymentWidget] = useState<any>(null);

  // Toss Payments SDK 초기화
  useEffect(() => {
    (async () => {
      try {
        const widget = await loadPaymentWidget(
          'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm',
          'ANONYMOUS'
        );
        setPaymentWidget(widget);
      } catch (e) {
        console.error('Toss Payments 위젯 초기화 실패:', e);
      }
    })();
  }, []);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const location = useLocation();
  // 결제 결과 쿼리(pay) 감지 시 데이터 재조회 후 쿼리 제거
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pay = params.get('pay');
    if (pay) {
      fetchBillingData();
      // URL 정리: 쿼리 제거
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.search]);

  // planChanged 커스텀 이벤트로도 재조회 보장
  useEffect(() => {
    const onPlanChanged = () => fetchBillingData();
    window.addEventListener('planChanged', onPlanChanged);
    return () => window.removeEventListener('planChanged', onPlanChanged);
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentPlanResponse = await billingService.getCurrentPlan();
      if (currentPlanResponse.success) {
        setCurrentPlanData(currentPlanResponse.data);
      } else {
        setError(currentPlanResponse.error || '현재 요금제 정보를 불러오는데 실패했습니다.');
      }

      const plansResponse = await billingService.getAvailablePlans();
      if (plansResponse.success) {
        setAvailablePlans(plansResponse.data);
      } else {
        setError(plansResponse.error || '요금제 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('요금제 정보 조회 실패:', err);
      setError('요금제 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = (plan: Plan) => {
    const planType = (plan.name || '').toLowerCase();
    setSelectedPlan({
      type: planType || 'basic',
      id: plan.id,
      name: plan.name,
      price: plan.price,
    });
    setIsModalOpen(true);
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
    } catch (e: any) {
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

  const getUsagePercentage = () => {
    if (!currentPlanData) return 0;
    const { tokens_used, tokens_limit } = currentPlanData.current_usage;
    return Math.min((tokens_used / tokens_limit) * 100, 100);
  };

  const getUsageColor = () => {
    const percentage = getUsagePercentage();
    if (percentage >= 90) return 'error';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        요금제 관리
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 현재 요금제 정보 */}
      {currentPlanData && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              현재 요금제: {currentPlanData.plan.name}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  월 요금
                </Typography>
                <Typography variant="h6">
                  ₩{currentPlanData.plan.price.toLocaleString()}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  사용량
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <LinearProgress
                    variant="determinate"
                    value={getUsagePercentage()}
                    color={getUsageColor()}
                    sx={{ flexGrow: 1 }}
                  />
                  <Typography variant="body2">
                    {Math.round(getUsagePercentage())}%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {currentPlanData.current_usage.tokens_used.toLocaleString()} / {currentPlanData.current_usage.tokens_limit.toLocaleString()} 요청
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary">
              다음 결제일: 정보 없음
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* 사용 가능한 요금제 목록 */}
      <Typography variant="h5" gutterBottom>
        요금제 변경
      </Typography>

      <Grid container spacing={3}>
        {availablePlans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {plan.name}
                </Typography>
                
                <Typography variant="h4" color="primary" gutterBottom>
                  ₩{plan.price.toLocaleString()}
                  <Typography component="span" variant="body2" color="text.secondary">
                    /월
                  </Typography>
                </Typography>

                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUpIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`${plan.request_limit.toLocaleString()} 요청/월`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SpeedIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`${plan.rate_limit_per_minute} 요청/분`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PeopleIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`구독자: ${plan.subscriber_count || 0}명`}
                    />
                  </ListItem>
                </List>
                
                <Box mt="auto" pt={2}>
                  <Box display="flex" gap={1} mb={1}>
                    {plan.subscriber_count && plan.subscriber_count > 0 && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => openSubscribersDialog(plan)}
                        sx={{ flex: 1 }}
                      >
                        구독자 보기
                      </Button>
                    )}
                  </Box>
                  {currentPlanData?.plan.id === plan.id ? (
                    <Button
                      variant="outlined"
                      fullWidth
                      disabled
                    >
                      현재 요금제
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handlePlanChange(plan)}
                    >
                      요금제 변경
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlan={selectedPlan}
        paymentWidget={paymentWidget}
        from="dashboard"
        onPaymentSuccess={() => {
          setIsModalOpen(false);
          fetchBillingData();
          window.dispatchEvent(new CustomEvent('planChanged'));
        }}
      />

      {/* 구독자 상세보기 모달 */}
      <Dialog 
        open={subscribersDialogOpen} 
        onClose={closeSubscribersDialog} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <PeopleIcon color="primary" />
            {selectedPlanStats?.plan_info.display_name} 구독자 목록
          </Box>
        </DialogTitle>
        <DialogContent>
          {subscribersLoading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {/* 구독자 통계 */}
              <Box display="flex" gap={2} mb={3}>
                <Chip 
                  icon={<PeopleIcon />}
                  label={`총 구독자: ${selectedPlanStats?.total_subscribers || 0}명`} 
                  color="primary" 
                  variant="outlined"
                />
                <Chip 
                  icon={<CheckIcon />}
                  label={`활성 구독자: ${selectedPlanStats?.active_subscribers || 0}명`} 
                  color="success" 
                  variant="outlined"
                />
              </Box>

              {/* 구독자 목록 테이블 */}
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>사용자</TableCell>
                      <TableCell>이메일</TableCell>
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
                          <Typography variant="subtitle2">
                            {subscriber.name || subscriber.username}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {subscriber.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            시작: {new Date(subscriber.start_date).toLocaleDateString('ko-KR')}
                          </Typography>
                          {subscriber.end_date && (
                            <Typography variant="body2" color="text.secondary">
                              종료: {new Date(subscriber.end_date).toLocaleDateString('ko-KR')}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            size="small"
                            color={
                              subscriber.subscription_status === 'active' ? 'success' :
                              subscriber.subscription_status === 'expired' ? 'error' :
                              'default'
                            }
                            label={
                              subscriber.subscription_status === 'active' ? '활성' :
                              subscriber.subscription_status === 'expired' ? '만료' :
                              subscriber.subscription_status === 'cancelled' ? '취소' : 
                              subscriber.subscription_status
                            }
                          />
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {subscriber.last_request_time ? 
                              new Date(subscriber.last_request_time).toLocaleString('ko-KR') : 
                              '없음'
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

export default BillingScreen;
