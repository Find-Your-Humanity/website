import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import '../styles/pages/PaymentFailPage.css';

const PaymentFailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // URL 파라미터에서 에러 정보 추출
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');
  const orderId = searchParams.get('orderId');
  const planType = searchParams.get('planType');

  // 에러 코드별 메시지 매핑
  const getErrorMessage = (code) => {
    const errorMessages = {
      'NOT_FOUND_PAYMENT_SESSION': '결제 시간이 만료되었습니다. 다시 시도해주세요.',
      'REJECT_CARD_COMPANY': '카드사에서 결제를 거절했습니다.',
      'FORBIDDEN_REQUEST': '잘못된 결제 요청입니다.',
      'UNAUTHORIZED_KEY': '인증에 실패했습니다.',
      'INVALID_PAYMENT_METHOD': '지원하지 않는 결제 수단입니다.',
      'PAYMENT_CANCELLED': '결제가 취소되었습니다.',
      'PAYMENT_FAILED': '결제에 실패했습니다.'
    };
    
    return errorMessages[code] || errorMessage || '알 수 없는 오류가 발생했습니다.';
  };

  const handleRetryPayment = () => {
    // PayPage로 돌아가서 다시 결제 시도
    navigate('/payment', { 
      state: { 
        plan: planType,
        retry: true 
      } 
    });
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  const handleGoToContact = () => {
    navigate('/contact');
  };

  return (
    <div className="payment-fail-page">
      <div className="fail-container">
        <div className="fail-content">
          <FaTimesCircle className="fail-icon" />
          <h1>❌ 결제에 실패했습니다</h1>
          
          <div className="error-details">
            <h2>오류 정보</h2>
            <div className="detail-item">
              <span className="label">오류 코드:</span>
              <span className="value">{errorCode || 'UNKNOWN'}</span>
            </div>
            {orderId && (
              <div className="detail-item">
                <span className="label">주문 ID:</span>
                <span className="value">{orderId}</span>
              </div>
            )}
            {planType && (
              <div className="detail-item">
                <span className="label">선택 요금제:</span>
                <span className="value">{planType}</span>
              </div>
            )}
          </div>

          <div className="error-message">
            <FaExclamationTriangle className="warning-icon" />
            <p>{getErrorMessage(errorCode)}</p>
          </div>

          <div className="suggestions">
            <h3>해결 방법</h3>
            <ul>
              <li>다른 카드나 결제 수단을 사용해보세요.</li>
              <li>카드 잔액을 확인해보세요.</li>
              <li>카드사에서 결제 제한을 설정했는지 확인해보세요.</li>
              <li>문제가 지속되면 고객 지원팀에 문의해주세요.</li>
            </ul>
          </div>

          <div className="payment-fail-button-group">
            <button onClick={handleRetryPayment} className="payment-fail-btn payment-fail-btn-primary">
              다시 시도하기
            </button>
            <button onClick={handleGoToHome} className="payment-fail-btn payment-fail-btn-secondary">
              홈으로 돌아가기
            </button>
            <button onClick={handleGoToContact} className="payment-fail-btn payment-fail-btn-outline">
              고객 지원 문의
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailPage; 