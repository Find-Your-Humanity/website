import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get('token');
    if (t) setToken(t);
  }, [location]);

  const GATEWAY = 'https://gateway.realcatcha.com';

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!token) return setMessage('토큰이 없습니다. 메일의 링크를 다시 확인해 주세요.');
    if (!password || password !== confirm) return setMessage('비밀번호가 일치하지 않습니다.');
    setLoading(true);
    try {
      const res = await fetch(`${GATEWAY}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || '변경에 실패했습니다.');
      setMessage('비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다.');
      setTimeout(()=> navigate('/signin'), 1000);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'80vh' }}>
      <div className="signin-container" style={{ width:'100%', maxWidth:520 }}>
        <div className="form-side" style={{ width:'100%' }}>
          <div className="signin-form" style={{ width:'100%' }}>
            <h1 className="signin-title">비밀번호 재설정</h1>
            {message && <div className="error-message">{message}</div>}
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <input
                  type="password"
                  className="form-input"
                  placeholder="새 비밀번호"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-input"
                  placeholder="비밀번호 재입력"
                  value={confirm}
                  onChange={(e)=>setConfirm(e.target.value)}
                  required
                />
              </div>
              <button className="signin-button" type="submit" disabled={loading}>
                {loading ? '변경 중…' : '비밀번호 재설정'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;



