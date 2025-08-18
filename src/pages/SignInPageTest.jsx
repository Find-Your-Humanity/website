import React from 'react';

const SignInPageTest = () => {
  console.log('SignInPageTest 렌더링됨!');
  
  return (
    <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <h1>로그인 페이지 테스트</h1>
      <p>이 페이지가 보인다면 라우팅은 정상 작동합니다.</p>
      <form style={{ maxWidth: '400px', margin: '2rem auto' }}>
        <input 
          type="email" 
          placeholder="이메일" 
          style={{ 
            width: '100%', 
            padding: '1rem', 
            marginBottom: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }} 
        />
        <input 
          type="password" 
          placeholder="비밀번호" 
          style={{ 
            width: '100%', 
            padding: '1rem', 
            marginBottom: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }} 
        />
        <button 
          type="submit"
          style={{ 
            width: '100%', 
            padding: '1rem', 
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          로그인 (테스트)
        </button>
      </form>
    </div>
  );
};

export default SignInPageTest;
