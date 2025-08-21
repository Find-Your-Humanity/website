import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('request'); // 'request' | 'sent' | 'reset-token' | 'reset-code'
  const [mode, setMode] = useState('token'); // 'token' | 'code'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    try {
      const search = location?.search || window.location.search;
      const params = new URLSearchParams(search);
      const t = params.get('token');
      if (t) {
        setToken(t);
        setMode('token');
        setStep('reset-token');
      }
    } catch (e) {
      // ignore
    }
  }, [location]);

  const GATEWAY = 'https://gateway.realcatcha.com';

  const handleRequestLink = async (e) => {
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
      setMessage('비밀번호 재설정 메일을 발송했습니다. 메일함을 확인해 주세요.');
      setStep('sent');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${GATEWAY}/api/auth/forgot-password/code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || '인증코드 발송에 실패했습니다.');
      setMessage('6자리 인증코드를 이메일로 전송했습니다. 메일의 코드를 입력해 새 비밀번호를 설정해 주세요.');
      setMode('code');
      setStep('reset-code');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetToken = async (e) => {
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

  const handleResetCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${GATEWAY}/api/auth/reset-password/code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, new_password: newPassword }),
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
    <div className="signin-page" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'80vh' }}>
      <div className="signin-container" style={{ width:'100%', maxWidth:920 }}>
        <div className="form-side" style={{ width: '100%', display:'flex', justifyContent:'center' }}>
          <div className="signin-form" style={{ width:'100%', maxWidth:520, margin:'0 auto' }}>
            <h1 className="signin-title">Forgot password</h1>
            {message && <div className="error-message">{message}</div>}

            {step === 'request' ? (
              <form onSubmit={(e)=>e.preventDefault()}>
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
                <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
                  <button onClick={handleRequestLink} className="signin-button" style={{ maxWidth:520 }} disabled={loading}>
                    {loading && mode==='token' ? 'Submitting...' : 'Send reset link'}
                  </button>
                  <button onClick={handleRequestCode} className="signin-button" style={{ maxWidth:520 }} disabled={loading}>
                    {loading && mode==='code' ? 'Submitting...' : 'Send 6-digit code'}
                  </button>
                </div>
              </form>
            ) : step === 'sent' ? (
              <div style={{ textAlign:'center', padding:'24px 0' }}>
                <div style={{ fontSize:28, fontWeight:700, marginBottom:8 }}>비밀번호 재설정 메일 발송 완료</div>
                <div style={{ color:'#666', marginBottom:24 }}>비밀번호 재설정 이메일을 확인해 주세요. 링크 유효기간은 발송 후 12시간입니다.</div>
                <div style={{ display:'flex', justifyContent:'center' }}>
                  <button onClick={()=>setStep('request')} className="signin-button" style={{ maxWidth:300 }}>다시 보내기</button>
                </div>
              </div>
            ) : step === 'reset-token' ? (
              <form onSubmit={handleResetToken}>
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
            ) : (
              <form onSubmit={handleResetCode}>
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
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="form-input"
                    required
                    disabled={loading}
                    maxLength={6}
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


