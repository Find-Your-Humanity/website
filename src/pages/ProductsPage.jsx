import React from 'react';
import '../styles/pages/ProductsPage.css';

const ProductsPage = () => {
  return (
    <div className="products-page">
      {/* Hero Section */}
      <section className="products-hero">
        <div className="products-hero-content">
          <h1 className="products-title">
            Smart CAPTCHA tools <br />
            for <span className="human-text">Human</span>
          </h1>
          <p className="products-subtitle">
            Protect your service with AI-powered image classification
            <br />
            CAPTCHAs that bots can't solve — but humans can.
          </p>
          <button className="btn btn-primary">Start Service</button>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section">
        <div className="video-background">
          <video 
            className="background-video" 
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/captcha-demo.mp4" type="video/mp4" />
            <source src="/captcha-demo.webm" type="video/webm" />
          </video>
          <div className="video-overlay">
            <div className="video-content">
              <h2 className="video-title">REAL CAPTCHA 작동 영상</h2>
              <p className="video-description">
                실제 서비스가 어떻게 작동하는지 확인해보세요
              </p>
              <div className="video-stats">
                <div className="stat-item">
                  <span className="stat-number">99.9%</span>
                  <span className="stat-label">봇 차단률</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">0.5초</span>
                  <span className="stat-label">평균 응답시간</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">실시간 모니터링</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="how-to-use-section">
        <div className="how-to-use-container">
          <h2 className="how-to-use-title">사용 방법</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">계정 생성</h3>
              <p className="step-description">
                REAL 웹사이트에서 계정을 생성하고 API 키를 발급받습니다.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">코드 연동</h3>
              <p className="step-description">
                제공되는 SDK나 API를 사용하여 웹사이트에 CAPTCHA를 추가합니다.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">설정 조정</h3>
              <p className="step-description">
                난이도와 스타일을 조정하여 사용자 경험을 최적화합니다.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3 className="step-title">모니터링</h3>
              <p className="step-description">
                대시보드에서 성능과 보안 지표를 실시간으로 확인합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="features-title">주요 특징</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3 className="feature-card-title">AI 기반 봇 탐지</h3>
              <p className="feature-card-description">
                딥러닝 알고리즘을 통해 봇의 행동 패턴을 정확하게 분석하고 차단합니다.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-card-title">맞춤형 난이도</h3>
              <p className="feature-card-description">
                사용자의 행동 패턴에 따라 실시간으로 난이도를 조절하여 최적의 경험을 제공합니다.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-card-title">빠른 응답</h3>
              <p className="feature-card-description">
                평균 0.5초 이내의 빠른 응답 시간으로 사용자 경험을 해치지 않습니다.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-card-title">보안 강화</h3>
              <p className="feature-card-description">
                다중 레이어 보안 시스템으로 봇 공격을 효과적으로 차단합니다.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-card-title">상세한 분석</h3>
              <p className="feature-card-description">
                실시간 대시보드를 통해 보안 상황과 성능 지표를 한눈에 확인할 수 있습니다.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛠️</div>
              <h3 className="feature-card-title">쉬운 연동</h3>
              <p className="feature-card-description">
                다양한 프로그래밍 언어와 프레임워크를 지원하여 쉽게 연동할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-grid">
        <div className="product-card">
          <div className="product-icon">🛡️</div>
          <h3 className="product-name">Basic CAPTCHA</h3>
          <p className="product-description">
            기본적인 봇 차단 기능을 제공하는 CAPTCHA 서비스입니다.
          </p>
          <ul className="product-features">
            <li>이미지 기반 문제</li>
            <li>기본 봇 차단</li>
            <li>간편한 연동</li>
            <li>무료 플랜 제공</li>
          </ul>
          <div className="product-price">
            <span className="price">무료</span>
          </div>
          <button className="btn btn-primary">시작하기</button>
        </div>

        <div className="product-card featured">
          <div className="featured-badge">인기</div>
          <div className="product-icon">🚀</div>
          <h3 className="product-name">Advanced CAPTCHA</h3>
          <p className="product-description">
            딥러닝 기반 고급 봇 차단 기능을 제공하는 프리미엄 서비스입니다.
          </p>
          <ul className="product-features">
            <li>AI 기반 행동 분석</li>
            <li>3단계 난이도 조절</li>
            <li>실시간 학습</li>
            <li>고급 API</li>
            <li>24/7 모니터링</li>
          </ul>
          <div className="product-price">
            <span className="price">₩99,000</span>
            <span className="period">/월</span>
          </div>
          <button className="btn btn-primary">자세히 보기</button>
        </div>

        <div className="product-card">
          <div className="product-icon">⚡</div>
          <h3 className="product-name">Enterprise CAPTCHA</h3>
          <p className="product-description">
            대규모 기업을 위한 맞춤형 CAPTCHA 솔루션입니다.
          </p>
          <ul className="product-features">
            <li>맞춤형 개발</li>
            <li>24/7 지원</li>
            <li>SLA 보장</li>
            <li>전담 매니저</li>
            <li>무제한 요청</li>
          </ul>
          <div className="product-price">
            <span className="price">문의</span>
          </div>
          <button className="btn btn-primary">문의하기</button>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="features-comparison">
        <div className="comparison-content">
          <h2 className="comparison-title">기능 비교</h2>
          <div className="comparison-table">
            <div className="table-header">
              <div className="feature-name">기능</div>
              <div className="plan-basic">Basic</div>
              <div className="plan-advanced">Advanced</div>
              <div className="plan-enterprise">Enterprise</div>
            </div>
            <div className="table-row">
              <div className="feature-name">일일 요청 수</div>
              <div className="plan-basic">1,000</div>
              <div className="plan-advanced">100,000</div>
              <div className="plan-enterprise">무제한</div>
            </div>
            <div className="table-row">
              <div className="feature-name">AI 분석</div>
              <div className="plan-basic">❌</div>
              <div className="plan-advanced">✅</div>
              <div className="plan-enterprise">✅</div>
            </div>
            <div className="table-row">
              <div className="feature-name">맞춤 설정</div>
              <div className="plan-basic">❌</div>
              <div className="plan-advanced">✅</div>
              <div className="plan-enterprise">✅</div>
            </div>
            <div className="table-row">
              <div className="feature-name">전담 지원</div>
              <div className="plan-basic">❌</div>
              <div className="plan-advanced">❌</div>
              <div className="plan-enterprise">✅</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage; 