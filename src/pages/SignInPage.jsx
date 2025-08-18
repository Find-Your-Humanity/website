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
  
  console.log('SignInPage 렌더링 중...'); // 디버깅용
  
  let login;
  try {
    const auth = useAuth();
    login = auth.login;
  } catch (authError) {
    console.error('AuthContext 오류:', authError);
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>로그인 페이지를 불러올 수 없습니다</h2>
        <p>인증 시스템에 문제가 발생했습니다.</p>
        <p style={{ color: 'red', fontSize: '0.9rem' }}>{authError.message}</p>
      </div>
    );
  }
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('로그인 시도:', { email, password: '***' }); // 디버깅용

    try {
      const result = await login(email, password);
      console.log('로그인 결과:', result); // 디버깅용
      
      if (result.success) {
        navigate('/'); // 로그인 성공 시 홈으로 이동
      } else {
        setError(result.error || '아이디와 비밀번호가 다릅니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error); // 디버깅용
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  console.log('SignInPage 렌더링 시작...', { email, isLoading, error }); // 디버깅용

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