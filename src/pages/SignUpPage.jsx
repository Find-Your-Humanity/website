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
              {/* 1) 이메일 입력 + 내부 버튼 (한 줄) */}
              <div className="form-group">
                <div style={{ position:'relative' }}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                    style={{ paddingRight: '36%' }}
                  />
                  <button
                    type="button"
                    onClick={requestEmailCode}
                    disabled={codeRequesting}
                    style={{ position:'absolute', right:6, top:4, height:40, width:'32%', minWidth:140, borderRadius:10, background:'#DFFF00', color:'#000', fontWeight:700, border:'1.5px solid #000', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', lineHeight:1, padding:'0 10px' }}
                  >
                    {codeRequesting ? 'Sending...' : (<><span style={{lineHeight:1}}>인증번호</span><span style={{lineHeight:1}}>받기</span></>)}
                  </button>
                </div>
                {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
              </div>

              {/* 2) 코드 입력 + 인증 버튼 (한 줄, 분리) */}
              <div className="form-group">
                <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                  <input
                    type="text"
                    placeholder="6-digit code"
                    value={verifyCode}
                    onChange={(e)=>setVerifyCode(e.target.value)}
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="signup-button"
                    onClick={verifyEmailCode}
                    disabled={emailVerified}
                    style={{ width: 180, border:'1.5px solid #000', borderRadius:10 }}
                  >
                    {emailVerified ? '인증 완료' : '인증하기'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Create User name"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                {fieldErrors.username && <div className="field-error">{fieldErrors.username}</div>}
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  name="contact"
                  placeholder="Contact number"
                  value={formData.contact}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                {fieldErrors.contact && <div className="field-error">{fieldErrors.contact}</div>}
              </div>

              <div className="form-group">
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
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

              <div className="form-group">
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input"
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

            <div className="divider">
              <span>or continue with</span>
            </div>

            <div className="social-login">
              <button className="social-button facebook">
                <FaFacebook />
              </button>
              <button className="social-button apple">
                <FaApple />
              </button>
              <button className="social-button google">
                <FaGoogle />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;