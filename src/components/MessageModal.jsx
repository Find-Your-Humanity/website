import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import '../styles/components/MessageModal.css';

const MessageModal = ({ isOpen, onClose, type, message, title }) => {
  // 3초 후 자동 닫기
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSuccess = type === 'success';
  const icon = isSuccess ? <FaCheckCircle /> : <FaExclamationTriangle />;
  const modalClass = isSuccess ? 'success-modal' : 'error-modal';

  return (
    <div className="message-modal-overlay" onClick={onClose}>
      <div className={`message-modal ${modalClass}`} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="modal-content">
          <div className="modal-icon">
            {icon}
          </div>
          
          <h3 className="modal-title">{title}</h3>
          
          <p className="modal-message">{message}</p>
          
          {isSuccess && (
            <div className="success-tip">
              💡 답변 확인은 로그인 후 상단 프로필 메뉴에서 "문의사항 확인"을 클릭하세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageModal; 