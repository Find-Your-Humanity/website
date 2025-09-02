import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import useScrollToTop from '../hooks/useScrollToTop';
import '../styles/pages/PaymentSuccessPage.css';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentResult, setPaymentResult] = useState(null);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(3);

  // 페이지 이동 시 스크롤을 맨 위로 올림
  useScrollToTop();

  // URL 파라미터에서 결제 정보 추출
  const paymentKey = searchParams.get('paymentType') || searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  
  // location.state에서 요금제 정보 추출
  const planType = searchParams.get('planType') || location.state?.plan;
  const planId = searchParams.get('planId') || location.state?.planId;

  useEffect(() => {
    console.log("🔍 PaymentSuccessPage 로드됨");
    console.log("🔍 URL 파라미터:", {
      paymentKey,
      orderId,
      amount,
      planType,
      planId
    });
    
    // AuthContext가 로딩 중이면 기다리기
    if (loading) {
      console.log("🔄 AuthContext 로딩 중...");
      return;
    }
    
    console.log("🔍 AuthContext 로딩 완료, 인증 상태:", isAuthenticated);
    
    if (!isAuthenticated) {
      console.log("❌ 인증되지 않은 사용자");
      navigate('/signin');
      return;
    }

    if (!paymentKey || !orderId || !amount || !planId) {
      console.log("❌ 결제 정보 누락:", { paymentKey, orderId, amount, planId });
      setError("결제 정보가 올바르지 않습니다.");
      setIsProcessing(false);
      return;
    }

    console.log("✅ 결제 정보 확인 완료, 결제 완료 처리 시작");
    // 서버로 결제 승인 요청
    confirmPayment();
  }, [loading, isAuthenticated, paymentKey, orderId, amount, planId, navigate]);

  // 결제 승인 완료 후 대시보드로 자동 이동
  useEffect(() => {
    if (paymentResult && !error) {
      const timer = setTimeout(() => {
        window.location.href = 'https://dashboard.realcatcha.com';
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [paymentResult, error]);

  const confirmPayment = async () => {
    try {
      console.log("🔍 결제 완료 처리 시작");
      console.log("🔍 결제 승인 요청:", {
        paymentKey,
        orderId,
        amount: parseInt(amount),
        plan_id: parseInt(planId)
      });

      const response = await fetch('https://gateway.realcatcha.com/api/payments/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount: parseInt(amount),
          plan_id: parseInt(planId)
        }),
        credentials: 'include'
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setPaymentResult(result);
        console.log("✅ 결제 승인 성공:", result);
        
        // 카운트다운 시작
        startCountdown();
      } else {
        setError(result.detail || "결제 승인에 실패했습니다.");
        console.error("❌ 결제 승인 실패:", result);
      }
    } catch (error) {
      console.error("❌ 결제 승인 요청 오류:", error);
      
      // 에러 타입별 사용자 친화적 메시지
      let errorMessage = "결제 승인 요청 중 오류가 발생했습니다.";
      
      if (error.message && error.message.includes('Unexpected token')) {
        errorMessage = "서버 응답 형식 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      } else if (error.message && error.message.includes('fetch')) {
        errorMessage = "네트워크 연결 오류가 발생했습니다. 인터넷 연결을 확인해주세요.";
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  // 카운트다운 함수
  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(timer);
  };

  if (isProcessing) {
    return (
      <div className="payment-success-page">
        <div className="success-container">
          <div className="loading-content">
            <FaSpinner className="loading-spinner" />
            <h2>결제를 처리하고 있습니다...</h2>
            <p>잠시만 기다려주세요.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-success-page">
        <div className="success-container">
          <div className="error-content">
            <div className="error-icon">❌</div>
            <h2>결제 처리 실패</h2>
            <p className="error-message">{error}</p>
            <div className="payment-success-button-group">
              <button onClick={handleGoToHome} className="payment-success-btn payment-success-btn-primary">
                홈으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-page">
      <div className="success-container">
        <div className="success-content">
          <FaCheckCircle className="success-icon" />
          <h1>🎉 결제가 완료되었습니다!</h1>
          
          {paymentResult && (
            <div className="payment-details">
              <h2>구독 정보</h2>
              <div className="detail-item">
                <span className="label">요금제:</span>
                <span className="value">{paymentResult.message}</span>
              </div>
              <div className="detail-item">
                <span className="label">결제 ID:</span>
                <span className="value">{paymentResult.payment_id}</span>
              </div>
              <div className="detail-item">
                <span className="label">주문 ID:</span>
                <span className="value">{orderId}</span>
              </div>
              <div className="detail-item">
                <span className="label">결제 금액:</span>
                <span className="value">₩{parseInt(amount).toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="success-message">
            <p>선택하신 요금제가 즉시 적용되었습니다.</p>
            <p>이제 CAPTCHA 서비스를 이용하실 수 있습니다.</p>
            <p className="auto-redirect-message">
              {countdown}초 후 자동으로 홈페이지로 이동합니다... ({countdown})
            </p>
          </div>

          <div className="payment-success-button-group">
            <button onClick={handleGoToDashboard} className="payment-success-btn payment-success-btn-primary">
              대시보드로 이동
            </button>
            <button onClick={handleGoToHome} className="payment-success-btn payment-success-btn-secondary">
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage; 