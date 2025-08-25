import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEye, FaEyeSlash, FaFacebook, FaApple, FaGoogle } from 'react-icons/fa';
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
    confirmPassword: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [codeRequesting, setCodeRequesting] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCodes, setVerificationCodes] = useState(['', '', '', '', '', '']);
  const [activeCodeIndex, setActiveCodeIndex] = useState(0);
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
      contact: formData.contact
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
      setShowVerificationModal(true);
      setVerificationCodes(['', '', '', '', '', '']);
      setActiveCodeIndex(0);
    } catch (e) {
      setServerError(e.message);
    } finally {
      setCodeRequesting(false);
    }
  };

  const handleCodeInput = (index, value) => {
    if (value.length > 1) return; // 한 글자만 입력 가능
    
    const newCodes = [...verificationCodes];
    newCodes[index] = value;
    setVerificationCodes(newCodes);
    
    // 다음 입력 필드로 이동
    if (value && index < 5) {
      setActiveCodeIndex(index + 1);
    }
    
    // 이전 입력 필드로 이동 (백스페이스 시)
    if (!value && index > 0) {
      setActiveCodeIndex(index - 1);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCodes[index] && index > 0) {
      setActiveCodeIndex(index - 1);
    }
  };

  const verifyEmailCode = async () => {
    const code = verificationCodes.join('');
    if (code.length !== 6) {
      setServerError('6자리 인증코드를 모두 입력해 주세요.');
      return;
    }
    setServerError('');
    try {
      const res = await fetch(`${GATEWAY}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code: code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || '이메일 인증에 실패했습니다.');
      setEmailVerified(true);
      setShowVerificationModal(false);
      alert('이메일 인증이 완료되었습니다. 회원가입을 진행하세요.');
    } catch (e) {
      setServerError(e.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setServerError('');
      
      // Google OAuth URL 가져오기
      const response = await fetch('https://gateway.realcatcha.com/api/auth/google');
      const data = await response.json();
      
      if (data.auth_url) {
        // Google OAuth 페이지로 리디렉트
        window.location.href = data.auth_url;
      } else {
        setServerError('Google 로그인을 시작할 수 없습니다.');
      }
    } catch (error) {
      setServerError('Google 로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* Left Side - Illustration */}
        <div className="illustration-side">
          <div className="illustration">
            <img src="/signup-illustration.svg" alt="Sign Up Illustration" />
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="form-side">
          <div className="signup-form">
            <h1 className="signup-title">Sign Up</h1>

            {serverError && (
              <div className="error-message">{serverError}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* 1) 이메일 입력 + 인증번호 받기 버튼 (분리) */}
              <div className="signup-form-group">
                <label className="signup-form-label">이메일</label>
                <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                  <div className="email-input-container">
                    <input
                      type="email"
                      name="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="signup-form-input"
                      style={{ flex: 1 }}
                      required
                    />
                    <div className={`email-verification-status ${emailVerified ? 'verified' : 'unverified'}`}>
                      {emailVerified ? (
                        <span className="verification-check">✓</span>
                      ) : (
                        <span className="verification-pending">○</span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={requestEmailCode}
                    disabled={codeRequesting}
                    className="inline-btn"
                    style={{ width: 100 }}
                  >
                    {codeRequesting ? (
                      <div className="signup-loading-spinner">
                        <div className="signup-spinner"></div>
                      </div>
                    ) : (
                      '인증번호 전송'
                    )}
                  </button>
                </div>
                {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
              </div>



              <div className="signup-form-group">
                <label className="signup-form-label">이름</label>
                <input
                  type="text"
                  name="username"
                  placeholder="이름을 입력하세요"
                  value={formData.username}
                  onChange={handleChange}
                  className="signup-form-input"
                  required
                />
                {fieldErrors.username && <div className="field-error">{fieldErrors.username}</div>}
              </div>

              <div className="signup-form-group">
                <label className="signup-form-label">연락처</label>
                <input
                  type="tel"
                  name="contact"
                  placeholder="연락처를 입력하세요"
                  value={formData.contact}
                  onChange={handleChange}
                  className="signup-form-input"
                  required
                />
                {fieldErrors.contact && <div className="field-error">{fieldErrors.contact}</div>}
              </div>

              <div className="signup-form-group">
                <label className="signup-form-label">비밀번호</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={handleChange}
                    className="signup-form-input"
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

              <div className="signup-form-group">
                <label className="signup-form-label">비밀번호 확인</label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="signup-form-input"
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

              <button type="submit" className="signup-button">
                Register
              </button>
            </form>

            <button 
              type="button"
              className="google-login-button" 
              onClick={handleGoogleLogin}
            >
              <FaGoogle />
              <span>Google로 시작하기</span>
            </button>
          </div>
        </div>
      </div>

      {/* 인증코드 입력 모달 */}
      {showVerificationModal && (
        <div className="verification-modal-overlay">
          <div className="verification-modal">
            <div className="verification-modal-header">
              <h2 className="verification-modal-title">인증코드 입력</h2>
              <p className="verification-modal-subtitle">
                {formData.email}로 인증코드를 발송했습니다.
              </p>
            </div>
            
            <div className="verification-codes-container">
              {verificationCodes.map((code, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={code}
                  onChange={(e) => handleCodeInput(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`verification-code-input ${index === activeCodeIndex ? 'active' : ''}`}
                  ref={(el) => {
                    if (el && index === activeCodeIndex) {
                      el.focus();
                    }
                  }}
                />
              ))}
            </div>

            <div className="verification-modal-actions">
              <button
                type="button"
                className="verification-submit-btn"
                onClick={verifyEmailCode}
                disabled={verificationCodes.some(code => !code)}
              >
                인증하기
              </button>
              <button
                type="button"
                className="verification-cancel-btn"
                onClick={() => setShowVerificationModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;