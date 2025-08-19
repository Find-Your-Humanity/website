import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/pages/ContactStatusPage.css';

const ContactStatusPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [contactId, setContactId] = useState(searchParams.get('id') || '');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // URL 파라미터가 있으면 자동으로 조회
  useEffect(() => {
    if (email && contactId) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams({ email });
      if (contactId) {
        params.append('contact_id', contactId);
      }
      
      const response = await fetch(
        `https://gateway.realcatcha.com/api/contact-status?${params.toString()}`
      );
      
      const result = await response.json();
      
      if (result.success) {
        setContacts(result.data);
        if (result.data.length === 0) {
          setError('해당 이메일로 접수된 문의가 없습니다.');
        }
      } else {
        setError('문의 조회 중 오류가 발생했습니다.');
      }
    } catch (e) {
      setError('문의 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  const getStatusStyle = (status) => {
    const styles = {
      unread: { backgroundColor: '#f44336', color: 'white' },
      in_progress: { backgroundColor: '#ff9800', color: 'white' },
      resolved: { backgroundColor: '#4caf50', color: 'white' }
    };
    return styles[status] || { backgroundColor: '#9e9e9e', color: 'white' };
  };

  return (
    <div className="contact-status-page">
      <div className="contact-status-container">
        <div className="contact-status-form">
          <h1 className="contact-status-title">문의 상태 조회</h1>
          
          <div className="search-section">
            <div className="form-group">
              <label className="label">이메일</label>
              <input
                type="email"
                placeholder="문의 시 입력한 이메일을 입력해주세요"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="label">문의 번호 (선택사항)</label>
              <input
                type="text"
                placeholder="특정 문의를 조회하려면 문의 번호를 입력하세요"
                className="form-input"
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="actions">
              <button 
                type="button" 
                className="secondary-button" 
                onClick={() => navigate(-1)}
              >
                이전
              </button>
              <button 
                type="button" 
                className="primary-button" 
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? '조회 중...' : '조회하기'}
              </button>
            </div>
          </div>

          {/* 문의 목록 */}
          {contacts.length > 0 && (
            <div className="contact-results">
              <h2 className="section-title">문의 내역</h2>
              
              {contacts.map((contact) => (
                <div key={contact.id} className="contact-item">
                  <div className="contact-header">
                    <div className="contact-info">
                      <h3 className="contact-subject">#{contact.id} {contact.subject}</h3>
                      <span 
                        className="contact-status"
                        style={getStatusStyle(contact.status)}
                      >
                        {contact.status_display}
                      </span>
                    </div>
                    <div className="contact-date">
                      접수일: {formatDate(contact.created_at)}
                    </div>
                  </div>
                  
                  <div className="contact-content">
                    <div className="contact-message">
                      <h4>문의 내용:</h4>
                      <p>{contact.message}</p>
                    </div>
                    
                    {contact.admin_response && (
                      <div className="admin-response">
                        <h4>관리자 답변:</h4>
                        <div className="response-content">
                          <p>{contact.admin_response}</p>
                          {contact.updated_at && (
                            <div className="response-date">
                              답변일: {formatDate(contact.updated_at)}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {contact.status === 'resolved' && contact.resolved_at && (
                      <div className="resolved-info">
                        <span className="resolved-text">
                          ✅ {formatDate(contact.resolved_at)}에 해결되었습니다.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactStatusPage;
