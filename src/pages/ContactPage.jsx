import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useScrollToTop from '../hooks/useScrollToTop';
import MessageModal from '../components/MessageModal';
import '../styles/pages/ContactPage.css';

const ContactPage = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [form, setForm] = useState({ subject: '', contact: '', email: '', message: '' });
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('success');
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  // 페이지 이동 시 스크롤을 맨 위로 올림
  useScrollToTop();

  // 로그인 되어 있으면 이메일 자동 채움(수정 불가)
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setForm((prev) => ({ ...prev, email: user.email }));
    }
  }, [isAuthenticated, user?.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChooseFile = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (indexToRemove) => {
    setAttachedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // 모달 열기 함수
  const openModal = (type, title, message) => {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
    setModalType('success');
    setModalMessage('');
    setModalTitle('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      openModal('error', '로그인 필요', '로그인 후 문의를 제출할 수 있습니다. 로그인해 주세요.');
      return;
    }

    if (!form.subject || !form.contact || !form.email || !form.message) {
      openModal('error', '입력 오류', '모든 필드를 입력해주세요.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      openModal('error', '이메일 형식 오류', '올바른 이메일 형식이 아닙니다.');
      return;
    }

    try {
      setStatus('submitting');
      
      // FormData 생성
      const formData = new FormData();
      formData.append('subject', form.subject);
      formData.append('contact', form.contact);
      formData.append('email', form.email);
      formData.append('message', form.message);

      attachedFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });
      
      // 백엔드 API 호출
      const response = await fetch('https://gateway.realcatcha.com/api/contact', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setStatus('success');
        setForm({ 
          subject: '', 
          contact: '', 
          email: form.email, // 이메일은 유지하여 상태 조회 링크에 사용
          message: '' 
        });
        setAttachedFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // 성공 모달 표시
        openModal('success', '문의 접수 완료', '문의가 접수되었습니다. 빠르게 답변드리겠습니다.');
        
      } else {
        throw new Error(result.message || '문의 제출에 실패했습니다.');
      }
    } catch (e) {
      setStatus('error');
      openModal('error', '제출 실패', e.message || '제출 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-form">
          <h1 className="contact-title">문의하기</h1>

          <section className="section">
            <h2 className="section-title">문의 정보</h2>
            
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="label">제목</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="제목을 입력해 주세요."
                  className="form-input"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">연락처</label>
                <input
                  type="tel"
                  name="contact"
                  placeholder="연락처를 입력해 주세요."
                  className="form-input"
                  value={form.contact}
                  onChange={handleChange}
                  required
                  disabled={status === 'submitting'}
                />
              </div>

              <div className="form-group">
                <label className="label">이메일</label>
                <input
                  type="email"
                  name="email"
                  placeholder="이메일을 입력해 주세요."
                  className="form-input"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={isAuthenticated || status === 'submitting'}
                />
              </div>

              <div className="form-group">
                <label className="label">파일 첨부</label>
                <div 
                  className={`file-drop-area ${isDragOver ? 'drag-over' : ''} ${attachedFiles.length > 0 ? 'has-file' : ''}`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={handleChooseFile}
                >
                  <input ref={fileInputRef} type="file" onChange={handleFileChange} multiple hidden />
                  <div className="file-drop-content">
                    {attachedFiles.length > 0 ? (
                      <>
                        <div className="file-list">
                          {attachedFiles.map((file, index) => (
                            <div key={index} className="file-item">
                              <div className="file-info-inline">
                                <span className="file-name">{file.name}</span>
                                <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                              </div>
                              <button 
                                type="button" 
                                className="file-remove-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(index);
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="add-more-indicator">
                          <span className="add-more-text">+ 더 추가하려면 클릭하거나 드래그하세요</span>
                        </div>
                      </>
                    ) : (
                      <div className="file-placeholder">
                        <div className="file-text">
                          <div>파일을 드래그하거나 클릭하여 첨부하세요</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <h2 className="section-title" style={{ marginTop: '1.5rem' }}>문의 내용</h2>
              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="문의 내용을 입력해 주세요."
                  className="form-textarea"
                  rows={10}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="actions">
                {isAuthenticated ? (
                  <button type="submit" className="primary-button" disabled={status === 'submitting'}>
                    {status === 'submitting' ? '제출 중...' : '문의하기'}
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="primary-button" 
                    onClick={() => {
                      openModal('error', '로그인 필요', '문의하기를 위해 로그인이 필요합니다. 3초 후 로그인 페이지로 이동합니다.');
                      // 3초 후 로그인 페이지로 자동 이동
                      setTimeout(() => {
                        navigate('/signin?next=/contact');
                      }, 3000);
                    }}
                  >
                    문의하기
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>
      </div>

      {/* Message Modal */}
      <MessageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
      />
    </div>
  );
};

export default ContactPage;


