import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/ContactPage.css';

const ContactPage = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({ subject: '', contact: '', email: '', message: '' });
  const [attachedFile, setAttachedFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChooseFile = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setAttachedFile(file || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.subject || !form.contact || !form.email || !form.message) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('올바른 이메일 형식이 아닙니다.');
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
      
      if (attachedFile) {
        formData.append('file', attachedFile);
      }
      
      // 백엔드 API 호출
      const response = await fetch('https://gateway.realcatcha.com/api/contact', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        setStatus('success');
        setForm({ subject: '', contact: '', email: '', message: '' });
        setAttachedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(result.message || '문의 제출에 실패했습니다.');
      }
    } catch (e) {
      setStatus('error');
      setError(e.message || '제출 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-form">
          <h1 className="contact-title">문의하기</h1>

          <section className="section">
            <h2 className="section-title">문의 정보</h2>
            {status === 'success' && (
              <div className="success-message">문의가 접수되었습니다. 빠르게 답변드리겠습니다.</div>
            )}
            {error && <div className="error-message">{error}</div>}

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

              <div className="form-group file-row">
                <label className="label">파일 첨부</label>
                <div className="file-inputs">
                  <input
                    type="text"
                    className="form-input file-name"
                    placeholder="파일 이름"
                    value={attachedFile ? attachedFile.name : ''}
                    readOnly
                  />
                  <input ref={fileInputRef} type="file" onChange={handleFileChange} hidden />
                  <button type="button" className="file-button" onClick={handleChooseFile}>파일 첨부</button>
                </div>
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
                />
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
                <button type="button" className="secondary-button" onClick={() => navigate(-1)}>이전</button>
                <button type="submit" className="primary-button" disabled={status === 'submitting'}>
                  {status === 'submitting' ? '제출 중...' : '문의하기'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;


