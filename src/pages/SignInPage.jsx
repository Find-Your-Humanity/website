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
  
  const { login, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // AuthContext가 로딩 중이면 로딩 화면 표시
  if (authLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#ffffff' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #DFFF00',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

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
                  placeholder="Enter E-mail or User Name"
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

export default SignInPage; 