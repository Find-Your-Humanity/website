import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentSuccessPage from '../pages/PaymentSuccessPage';
import PaymentFailPage from '../pages/PaymentFailPage';
import '../dashboard/styles/index.css';

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10000,
  padding: '20px',
};

const modalStyle = {
  width: 'min(900px, 95vw)',
  maxHeight: '90vh',
  overflowY: 'auto',
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
};

export default function PaymentResultOverlay() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const params = new URLSearchParams(location.search);
  const from = params.get('from');
  const pay = params.get('pay');

  const isDashboardFlow = from === 'dashboard';
  const isSuccess = pathname === '/payment/success' || pay === 'success';
  const isFail = pathname === '/payment/fail' || pay === 'fail';
  const shouldShow = isDashboardFlow && (isSuccess || isFail);

  useEffect(() => {
    if (shouldShow) {
      // prevent background scroll
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [shouldShow]);

  if (!shouldShow) return null;

  const handleClose = () => {
    // Close overlay and send user back to billing screen
    try {
      window.dispatchEvent(new CustomEvent('planChanged'));
    } catch {}
    navigate('/app/billing', { replace: true });
  };

  return (
    <div className="rc-overlay" onClick={handleClose}>
      <div className="rc-modal" onClick={(e) => e.stopPropagation()}>
        {isSuccess ? (
          <PaymentSuccessPage onClose={handleClose} />
        ) : (
          <PaymentFailPage onClose={handleClose} />
        )}
      </div>
    </div>
  );
}
