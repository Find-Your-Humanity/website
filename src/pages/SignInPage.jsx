import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaFacebook, FaApple, FaGoogle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/SignInPage.css';

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/'); // 로그인 성공 시 홈으로 이동
      } else {
        setError(result.error || '아이디와 비밀번호가 다릅니다.');
      }
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setIsLoading(true);
      
      // Google OAuth URL 가져오기
      const response = await fetch('https://gateway.realcatcha.com/api/auth/google');
      const data = await response.json();
      
      if (data.auth_url) {
        // Google OAuth 페이지로 리디렉트
        window.location.href = data.auth_url;
      } else {
        setError('Google 로그인을 시작할 수 없습니다.');
      }
    } catch (error) {
      setError('Google 로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        {/* Left Side - Illustration */}
        <div className="illustration-side">
          <div className="illustration">
            <img src="/signin-illustration.svg" alt="Sign In Illustration" />
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="form-side">
          <div className="signin-form">
            <h1 className="signin-title">Sign in</h1>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Enter E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-links">
                <Link to="/signup" className="link">Sign Up</Link>
                <span className="separator">|</span>
                <Link to="/forgot-password" className="link">Forgot password ?</Link>
              </div>

              <button type="submit" className="signin-button" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

          <div className="divider">
            <span>or</span>
          </div>

          <button 
            type="button"
            className="google-login-button" 
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <FaGoogle />
            <span>Google로 시작하기</span>
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage; 