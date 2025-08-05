import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaFacebook, FaApple, FaGoogle } from 'react-icons/fa';
import './SignInPage.css';

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 로그인 로직 구현
    console.log('Sign in attempt:', { email, password });
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
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Enter E-mail or User Name"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
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
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-links">
                <Link to="/signup" className="link">Sign Up</Link>
                <span className="separator">|</span>
                <a href="#forgot-password" className="link">Forgot password ?</a>
              </div>

                          <button type="submit" className="signin-button">
              Sign In
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