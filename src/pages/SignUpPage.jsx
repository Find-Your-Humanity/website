import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { validateSignupForm, hasErrors } from '../utils/validation';
import '../styles/pages/SignUpPage.css';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    contact: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [codeRequesting, setCodeRequesting] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const GATEWAY = 'https://gateway.realcatcha.com';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) 클라이언트측 검증
    const errors = validateSignupForm(formData);
    setFieldErrors(errors);
    setServerError('');

    if (hasErrors(errors)) {
      return; // 폼 위에 에러가 표시됨
    }

    // 2) 이메일 인증 강제
    if (!emailVerified) {
      setServerError('이메일 인증을 먼저 완료해 주세요.');
      return;
    }

    // 3) 서버 요청
    const result = await signup({
      email: formData.email,
      username: formData.username,
      password: formData.password,
      contact: formData.contact,
      full_name: formData.fullName
    });

    if (result.success) {
      alert('회원가입이 완료되었습니다!');
      navigate('/signin');
    } else {
      // 3) 서버 에러 메시지 보여주기 (422 detail 등)
      setServerError(result.error || '회원가입 중 오류가 발생했습니다.');
    }
  };

  const requestEmailCode = async () => {
    if (!formData.email) {
      setServerError('이메일을 입력해 주세요.');
      return;
    }
    setServerError('');
    setCodeRequesting(true);
    try {
      const res = await fetch(`${GATEWAY}/api/auth/verify-email/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || '인증코드 발송에 실패했습니다.');
      alert('인증코드를 이메일로 발송했습니다.');
    } catch (e) {
      setServerError(e.message);
    } finally {
      setCodeRequesting(false);
    }
  };

  const verifyEmailCode = async () => {
    if (!verifyCode || verifyCode.length !== 6) {
      setServerError('6자리 인증코드를 입력해 주세요.');
      return;
    }
    setServerError('');
    try {
      const res = await fetch(`${GATEWAY}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code: verifyCode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || '이메일 인증에 실패했습니다.');
      setEmailVerified(true);
      alert('이메일 인증이 완료되었습니다. 회원가입을 진행하세요.');
    } catch (e) {
      setServerError(e.message);
    }
  };

  return (
    <div className="signup-page-mobile">
      <div className="mobile-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h1 className="mobile-title">회원가입</h1>
      </div>

      <div className="mobile-form-container">
        {serverError && (
          <div className="error-message">{serverError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* 이메일 + 중복확인 */}
          <div className="mobile-form-group">
            <div className="input-with-button">
              <input
                type="email"
                name="email"
                placeholder="아이디 (이메일 주소)"
                value={formData.email}
                onChange={handleChange}
                className="mobile-input"
                required
              />
              <button
                type="button"
                onClick={requestEmailCode}
                disabled={codeRequesting}
                className="inline-verify-btn"
              >
                {codeRequesting ? '전송중...' : '중복확인'}
              </button>
            </div>
            {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
          </div>

          {/* 비밀번호 */}
          <div className="mobile-form-group">
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="비밀번호"
                value={formData.password}
                onChange={handleChange}
                className="mobile-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
          </div>

          {/* 비밀번호 확인 */}
          <div className="mobile-form-group">
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="비밀번호 확인"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mobile-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {fieldErrors.confirmPassword && <div className="field-error">{fieldErrors.confirmPassword}</div>}
          </div>

          {/* 이름 (실명 입력) */}
          <div className="mobile-form-group">
            <input
              type="text"
              name="fullName"
              placeholder="이름 (실명 입력)"
              value={formData.fullName}
              onChange={handleChange}
              className="mobile-input"
              required
            />
            {fieldErrors.fullName && <div className="field-error">{fieldErrors.fullName}</div>}
          </div>

          {/* 휴대전화번호 + 인증번호 전송 */}
          <div className="mobile-form-group">
            <div className="input-with-button">
              <input
                type="tel"
                name="contact"
                placeholder="휴대전화번호 ('-'제외)"
                value={formData.contact}
                onChange={handleChange}
                className="mobile-input"
                required
              />
              <button
                type="button"
                className="inline-verify-btn"
                onClick={() => alert('인증번호를 발송했습니다.')}
              >
                인증번호 전송
              </button>
            </div>
            {fieldErrors.contact && <div className="field-error">{fieldErrors.contact}</div>}
          </div>

          {/* 인증번호 입력 */}
          <div className="mobile-form-group">
            <input
              type="text"
              placeholder="인증번호 입력"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              className="mobile-input"
            />
          </div>

          {/* 생년월일 */}
          <div className="mobile-form-group">
            <input
              type="text"
              name="birthDate"
              placeholder="생년월일 (8자리 입력)"
              className="mobile-input"
            />
          </div>

          {/* 동의 체크박스들 */}
          <div className="agreement-section">
            <div className="agreement-item">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                <span className="agreement-text">이용약관 동의</span>
              </label>
              <button type="button" className="agreement-link">›</button>
            </div>

            <div className="agreement-item">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                <span className="agreement-text">개인정보 취급방침 동의</span>
              </label>
              <button type="button" className="agreement-link">›</button>
            </div>

            <div className="agreement-item">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                <span className="agreement-text">마케팅 정보 수신 동의</span>
              </label>
              <button type="button" className="agreement-link">›</button>
            </div>
          </div>

          <button type="submit" className="mobile-signup-button">
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;