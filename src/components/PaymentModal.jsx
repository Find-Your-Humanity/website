import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import '../styles/components/PaymentModal.css';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  selectedPlan, 
  paymentWidget, 
  onPaymentSuccess 
}) => {
  const [searchParams] = useSearchParams();
  const [paymentMethods, setPaymentMethods] = useState(null);
  const [isPaymentUIReady, setIsPaymentUIReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 모달이 열릴 때마다 결제 UI 렌더링
  useEffect(() => {
    if (isOpen && paymentWidget && selectedPlan) {
      renderPaymentUI();
    }
  }, [isOpen, paymentWidget, selectedPlan]);

  // 결제 UI 렌더링
  const renderPaymentUI = async () => {
    try {
      if (typeof paymentWidget.renderPaymentMethods === 'function') {
        const methods = paymentWidget.renderPaymentMethods(
          "#modal-payment-method", 
          { value: selectedPlan.price }, // 선택된 요금제의 금액
          { variantKey: "DEFAULT" } // 기본 결제 UI
        );
        
        // 이용약관 UI 렌더링
        if (typeof paymentWidget.renderAgreement === 'function') {
          paymentWidget.renderAgreement("#modal-agreement");
        }
        
        setPaymentMethods(methods);
        
        // 결제 UI 렌더링 완료 이벤트 리스너
        if (methods && typeof methods.on === 'function') {
          methods.on('ready', () => {
            console.log("✅ 모달 내 결제 UI 렌더링 완료");
            setIsPaymentUIReady(true);
          });
          
          // 결제 금액 변경 이벤트 리스너
          methods.on('amountChange', (amount) => {
            console.log("💰 모달 내 결제 금액 변경:", amount);
          });
        } else {
          console.warn("⚠️ paymentMethods.on 메서드가 없습니다");
          setIsPaymentUIReady(true);
        }
      } else {
        console.error("❌ widget.renderPaymentMethods가 함수가 아닙니다");
        throw new Error("renderPaymentMethods 메서드를 찾을 수 없습니다");
      }
    } catch (error) {
      console.error("❌ 모달 내 결제 UI 렌더링 실패:", error);
      alert("결제 시스템 초기화에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 주문 ID 생성
  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `ORDER_${timestamp}_${random}`;
  };

  // 결제 요청 처리
  const handlePaymentRequest = async () => {
    if (!selectedPlan || !paymentWidget || !paymentMethods) {
      alert("결제 정보가 준비되지 않았습니다. 다시 시도해주세요.");
      return;
    }

    if (!isPaymentUIReady) {
      alert("결제 시스템이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      
      const orderId = generateOrderId();
      const amount = selectedPlan.price;
      const planName = selectedPlan.name;
      const planId = selectedPlan.id;

      console.log(`🔍 모달 내 결제 요청 - 플랜: ${planName}, 금액: ${amount}원, 주문ID: ${orderId}`);
      console.log(`🔍 결제 요청 URL 설정:`, {
        successUrl: `${window.location.origin}/payment/success?planType=${selectedPlan.type}&planId=${planId}&from=${searchParams.get('from') || 'website'}`,
        failUrl: `${window.location.origin}/payment/fail?planType=${selectedPlan.type}&planId=${planId}&from=${searchParams.get('from') || 'website'}`,
        selectedPlan: selectedPlan
      });

      // 결제 요청 (공식 문서 패턴)
      await paymentWidget.requestPayment({
        orderId: orderId,
        orderName: `${planName} - CAPTCHA 서비스`,
        amount: amount,
        successUrl: `${window.location.origin}/payment/success?planType=${selectedPlan.type}&planId=${planId}&from=${searchParams.get('from') || 'website'}`,
        failUrl: `${window.location.origin}/payment/fail?planType=${selectedPlan.type}&planId=${planId}&from=${searchParams.get('from') || 'website'}`,
        customerEmail: "test@example.com", // 실제로는 사용자 이메일 사용
        customerName: "테스트 사용자", // 실제로는 사용자 이름 사용
        // 추가 파라미터 (선택사항)
        windowTarget: 'self', // 새 창으로 결제창 열기 (iframe 대신)
        useInternationalCardOnly: false, // 국제카드 전용 여부
        flowMode: 'BILLING' // 결제 흐름 모드
      });

    } catch (error) {
      console.error("❌ 모달 내 결제 요청 오류:", error);
      
      // 에러 타입별 사용자 친화적 메시지
      let errorMessage = "결제 요청 중 오류가 발생했습니다. 다시 시도해주세요.";
      
      if (error.message && error.message.includes('UNAUTHORIZED_KEY')) {
        errorMessage = "결제 시스템 인증에 실패했습니다. 관리자에게 문의해주세요.";
      } else if (error.message && error.message.includes('NOT_REGISTERED_PAYMENT_WIDGET')) {
        errorMessage = "결제 UI가 등록되지 않았습니다. 관리자에게 문의해주세요.";
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 모달이 닫힐 때 정리
  const handleClose = () => {
    setIsPaymentUIReady(false);
    setPaymentMethods(null);
    onClose();
  };

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay" onClick={handleClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        {/* 모달 헤더 */}
        <div className="modal-header">
          <h3 className="modal-title">
            {selectedPlan ? `${selectedPlan.name} - 결제 방법 선택` : '결제 방법 선택'}
          </h3>
          <button className="modal-close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        {/* 모달 내용 */}
        <div className="modal-content">
          {/* 결제 방법 선택 UI */}
          <div id="modal-payment-method" className="modal-payment-method"></div>
          
          {/* 약관 동의 UI */}
          <div id="modal-agreement" className="modal-agreement"></div>
          
          {/* 결제 UI 상태 표시 */}
          {!isPaymentUIReady && (
            <div className="modal-loading">
              <p>결제 시스템을 초기화하는 중입니다...</p>
            </div>
          )}
          
          {isPaymentUIReady && (
            <div className="modal-ready">
              <p>결제 방법을 선택하고 아래 버튼을 클릭하세요.</p>
              <button 
                className="modal-payment-btn"
                onClick={handlePaymentRequest}
                disabled={isLoading}
              >
                {isLoading ? '결제 진행 중...' : '결제 요청'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 