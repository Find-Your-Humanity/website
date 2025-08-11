import React, { useState } from 'react';
import '../styles/pages/ContactPage.css';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 간단 검증
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    try {
      setStatus('submitting');
      // 현재는 백엔드 없이 제출 성공 처리
      await new Promise((r) => setTimeout(r, 600));
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (e) {
      setStatus('error');
      setError('제출 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-form">
          <h1 className="contact-title">문의하기</h1>

          {status === 'success' && (
            <div className="success-message">문의가 접수되었습니다. 빠르게 답변드리겠습니다.</div>
          )}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group two-col">
              <input
                type="text"
                name="name"
                placeholder="이름"
                className="form-input"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="이메일"
                className="form-input"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="subject"
                placeholder="제목"
                className="form-input"
                value={form.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <textarea
                name="message"
                placeholder="문의 내용을 작성해주세요."
                className="form-textarea"
                rows={8}
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="contact-button" disabled={status === 'submitting'}>
              {status === 'submitting' ? '제출 중...' : '제출하기'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;


