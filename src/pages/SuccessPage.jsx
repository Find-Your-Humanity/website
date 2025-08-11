import React from 'react';
import '../styles/pages/SignInPage.css';

const SuccessPage = () => {
  return (
    <div className="signin-page">
      <div className="signin-container" style={{minHeight:'40vh'}}>
        <div className="form-side" style={{width:'100%'}}>
          <div className="signin-form" style={{textAlign:'center'}}>
            <h1 className="signin-title">로그인 성공</h1>
            <p>환영합니다! 대시보드를 이용하시려면 상단의 대시보드 링크를 눌러주세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;


