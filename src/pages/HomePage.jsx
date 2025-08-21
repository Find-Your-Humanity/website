import React from 'react';
import '../styles/pages/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="real-text">REAL</span> or <span className="not-text">Not</span>?
          </h1>
          <p className="hero-subtitle">Bots won't know.</p>
          <div className="hero-buttons">
            <button 
              className="btn btn-primary" 
              onClick={() => window.open('https://test.realcatcha.com/', '_blank')}
            >
              Try CAPTCHA
            </button>
            <button className="btn btn-primary">Start Free Plan</button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="main-content">
        <div className="content-wrapper">
          <h2 className="main-title">
            사람은 지나가고, 봇은 멈추는 <br />
            이미지 기반 AI CAPTCHA 서비스
          </h2>
          <p className="main-description">
            REAL은 딥러닝 기반 이미지 분류와 행동 패턴 분석을 통해 사람이 자연스럽게 풀 수 있고,<br />
            봇은 통과하기 어려운 맞춤형 CAPTCHA 문제를 제공합니다.
          </p>
        </div>
      </section>

      {/* Feature Boxes */}
      <section className="features">
        <div className="features-grid">
          <div className="feature-box">
            <h3 className="feature-title">맞춤형 3단계 CAPTCHA</h3>
            <p className="feature-description">
              사용자 행동 기반 난이도 조절을 통해 <br />
              봇을 탐지해낼 수 있습니다.
            </p>
          </div>
          <div className="feature-box">
            <h3 className="feature-title">딥러닝 이미지 분류</h3>
            <p className="feature-description">
              위 주제에 대한 설명 추가
            </p>
          </div>
          <div className="feature-box">
            <h3 className="feature-title">주관적 판단 문제</h3>
            <p className="feature-description">
              "따뜻한 이미지를 모두 선택하세요."와 같이 <br />
              봇이 어려워하는 문제를 제공합니다.
            </p>
          </div>
          <div className="feature-box">
            <h3 className="feature-title">간편한 API 연동</h3>
            <p className="feature-description">
              FastAPI 기반의 REST API를 제공해 <br />
              간편하게 연동하여 사용할 수 있도록 구현하였습니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 