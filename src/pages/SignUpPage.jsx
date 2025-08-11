import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEye, FaEyeSlash, FaFacebook, FaApple, FaGoogle } from 'react-icons/fa';
import { validateSignupForm, hasErrors } from '../utils/validation';
import './SignUpPage.css';

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

    // 2) 서버 요청
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
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
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