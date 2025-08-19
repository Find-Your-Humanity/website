import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/MyInquiriesPage.css';

const MyInquiriesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    
    fetchMyInquiries();
  }, [isAuthenticated, user]);

  const fetchMyInquiries = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://gateway.realcatcha.com/api/my-contact-requests', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('문의사항을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setInquiries(data.contact_requests || []);
    } catch (error) {
      console.error('문의사항 조회 오류:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return '#6c757d';
      case 'in_progress': return '#ffc107';
      case 'resolved': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'unread': return '확인 대기';
      case 'in_progress': return '처리 중';
      case 'resolved': return '답변 완료';
      default: return '알 수 없음';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openInquiryDetail = (inquiry) => {
    setSelectedInquiry(inquiry);
  };

  const closeInquiryDetail = () => {
    setSelectedInquiry(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="my-inquiries-page">
        <div className="auth-required">
          <div className="auth-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <h2>로그인이 필요합니다</h2>
          <p>문의사항을 확인하려면 먼저 로그인해 주세요.</p>
          <a href="/signin" className="login-button">로그인하기</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-inquiries-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>문의사항을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-inquiries-page">
      <div className="inquiries-container">
        <div className="page-header">
          <h1>내 문의사항</h1>
          <p>제출하신 문의사항과 관리자 답변을 확인하실 수 있습니다.</p>
        </div>

        {error && (
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>{error}</span>
            <button onClick={fetchMyInquiries} className="retry-button">다시 시도</button>
          </div>
        )}

        {inquiries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                <circle cx="12" cy="11" r="1" fill="currentColor"/>
                <circle cx="8" cy="11" r="1" fill="currentColor"/>
                <circle cx="16" cy="11" r="1" fill="currentColor"/>
              </svg>
            </div>
            <h3>문의사항이 없습니다</h3>
            <p>아직 제출하신 문의사항이 없습니다.</p>
            <a href="/contact" className="contact-button">문의하기</a>
          </div>
        ) : (
          <div className="inquiries-list">
            {inquiries.map((inquiry) => (
              <div 
                key={inquiry.id} 
                className="inquiry-card"
                onClick={() => openInquiryDetail(inquiry)}
              >
                <div className="inquiry-header">
                  <div className="inquiry-subject">
                    <h3>{inquiry.subject}</h3>
                    <span 
                      className="inquiry-status"
                      style={{ backgroundColor: getStatusColor(inquiry.status) }}
                    >
                      {getStatusText(inquiry.status)}
                    </span>
                  </div>
                  <div className="inquiry-date">
                    {formatDate(inquiry.created_at)}
                  </div>
                </div>
                
                <div className="inquiry-preview">
                  <p>{inquiry.message.substring(0, 150)}{inquiry.message.length > 150 ? '...' : ''}</p>
                </div>

                <div className="inquiry-meta">
                  <div className="inquiry-contact">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                    <span>{inquiry.email}</span>
                  </div>
                  {inquiry.admin_response && (
                    <div className="has-response">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                      <span>답변 완료</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 문의사항 상세 모달 */}
        {selectedInquiry && (
          <div className="inquiry-modal-overlay" onClick={closeInquiryDetail}>
            <div className="inquiry-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedInquiry.subject}</h2>
                <button className="close-button" onClick={closeInquiryDetail}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>

              <div className="modal-body">
                <div className="inquiry-info">
                  <div className="info-row">
                    <span className="info-label">상태:</span>
                    <span 
                      className="inquiry-status"
                      style={{ backgroundColor: getStatusColor(selectedInquiry.status) }}
                    >
                      {getStatusText(selectedInquiry.status)}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">제출일:</span>
                    <span>{formatDate(selectedInquiry.created_at)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">연락처:</span>
                    <span>{selectedInquiry.contact}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">이메일:</span>
                    <span>{selectedInquiry.email}</span>
                  </div>
                </div>

                <div className="inquiry-content">
                  <h3>문의 내용</h3>
                  <div className="content-box">
                    <p>{selectedInquiry.message}</p>
                  </div>
                </div>

                {selectedInquiry.attachment_filename && (
                  <div className="inquiry-attachment">
                    <h3>첨부파일</h3>
                    <div className="attachment-info">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C4.89 2 4 2.89 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                      <span>{selectedInquiry.attachment_filename}</span>
                    </div>
                  </div>
                )}

                {selectedInquiry.admin_response && (
                  <div className="admin-response">
                    <h3>관리자 답변</h3>
                    <div className="response-box">
                      <p>{selectedInquiry.admin_response}</p>
                    </div>
                    {selectedInquiry.resolved_at && (
                      <div className="response-date">
                        답변일: {formatDate(selectedInquiry.resolved_at)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInquiriesPage;
