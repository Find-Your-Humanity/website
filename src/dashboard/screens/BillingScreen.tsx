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
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { billingService, Plan, CurrentPlan } from '../services/billingService';
import PaymentModal from '../../components/PaymentModal';
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';
import { useLocation } from 'react-router-dom';

const BillingScreen: React.FC = () => {
  const { user } = useAuth();
  const [currentPlanData, setCurrentPlanData] = useState<CurrentPlan | null>(null);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

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
        // 콘솔 출력 제거
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
      // 콘솔 출력 제거
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
    <Box className="rc-container">
      {/* 헤더 (다른 화면들과 동일한 레이아웃) */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>요금제 관리</Typography>
        </Box>
      </Box>

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
            
            <Grid container spacing={2}>
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

      <Grid container spacing={2}>
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
                </List>
                
                <Box mt="auto" pt={2}>
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

    </Box>
  );
};

export default BillingScreen;
