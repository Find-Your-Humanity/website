import React, { useState } from 'react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('request'); // 'request' | 'reset'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const GATEWAY = 'https://gateway.realcatcha.com';

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${GATEWAY}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || '요청에 실패했습니다.');
      setMessage('비밀번호 재설정 메일을 발송했습니다. (개발용: 아래 토큰 입력 후 새 비밀번호 설정)');
      if (data.reset_token) setToken(data.reset_token);
      setStep('reset');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${GATEWAY}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || '변경에 실패했습니다.');
      setMessage('비밀번호가 변경되었습니다. 로그인 페이지로 이동해 주세요.');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <div className="form-side" style={{ width: '100%' }}>
          <div className="signin-form">
            <h1 className="signin-title">Forgot password</h1>
            {message && <div className="error-message">{message}</div>}

            {step === 'request' ? (
              <form onSubmit={handleRequest}>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Enter your E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    required
                    disabled={loading}
                  />
                </div>
                <button type="submit" className="signin-button" disabled={loading}>
                  {loading ? 'Submitting...' : 'Send reset link'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleReset}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Enter reset token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="form-input"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-input"
                    required
                    disabled={loading}
                  />
                </div>
                <button type="submit" className="signin-button" disabled={loading}>
                  {loading ? 'Changing...' : 'Change password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;


