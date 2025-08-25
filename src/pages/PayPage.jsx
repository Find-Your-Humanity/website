import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/PayPage.css';

const PayPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSelectPlan = (planType) => {
    if (isAuthenticated) {
      // 로그인된 상태: 결제 진행
      navigate('/payment/checkout', { state: { plan: planType } });
    } else {
      // 로그인되지 않은 상태: 로그인페이지로 이동
      navigate('/signin?next=/payment/checkout', { state: { plan: planType } });
    }
  };

  const handleContactUs = () => {
    navigate('/contact');
  };

  return (
    <div className="pay-page">
      {/* Hero Section */}
      <section className="pay-hero">
        <div className="pay-hero-content">
          <h1 className="pay-hero-title">요금제 선택</h1>
          <p className="pay-hero-subtitle">
            귀하의 비즈니스 규모와 요구사항에 맞는 최적의 CAPTCHA 솔루션을 선택하세요
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="pricing-section">
        <div className="pricing-container">
          <div className="pricing-grid">
            {/* Basic Plan */}
            <div className="pricing-card">
              <div className="plan-header">
                <h3 className="plan-name">Basic Plan</h3>
                <div className="plan-price">
                  <span className="price">무료</span>
                  <span className="period">/월</span>
                </div>
                <p className="plan-description">
                  개인 개발자와 소규모 프로젝트를 위한 기본 CAPTCHA 서비스
                </p>
              </div>
              
              <div className="plan-features">
                <h4 className="features-title">포함 기능</h4>
                <ul className="features-list">
                  <li>✅ 일일 1,000회 요청</li>
                  <li>✅ 기본 봇 차단</li>
                  <li>✅ 이미지 기반 CAPTCHA</li>
                  <li>✅ 기본 API 연동</li>
                  <li>✅ 이메일 지원</li>
                </ul>
              </div>

              <div className="plan-limitations">
                <h4 className="limitations-title">제한사항</h4>
                <ul className="limitations-list">
                  <li>❌ AI 기반 행동 분석</li>
                  <li>❌ 고급 설정 옵션</li>
                  <li>❌ 24/7 모니터링</li>
                  <li>❌ 전담 지원</li>
                </ul>
              </div>

              <button 
                className="btn btn-primary plan-btn"
                onClick={() => handleSelectPlan('basic')}
              >
                무료로 시작하기
              </button>
            </div>

            {/* Advanced Plan */}
            <div className="pricing-card featured">
              <div className="featured-badge">인기</div>
              <div className="plan-header">
                <h3 className="plan-name">Advanced Plan</h3>
                <div className="plan-price">
                  <span className="price">₩99,000</span>
                  <span className="period">/월</span>
                </div>
                <p className="plan-description">
                  중소기업과 성장하는 서비스를 위한 고급 CAPTCHA 솔루션
                </p>
              </div>
              
              <div className="plan-features">
                <h4 className="features-title">포함 기능</h4>
                <ul className="features-list">
                  <li>✅ 일일 100,000회 요청</li>
                  <li>✅ AI 기반 행동 분석</li>
                  <li>✅ 3단계 난이도 조절</li>
                  <li>✅ 실시간 학습 시스템</li>
                  <li>✅ 고급 API 및 SDK</li>
                  <li>✅ 24/7 모니터링</li>
                  <li>✅ 우선 지원</li>
                </ul>
              </div>

              <div className="plan-limitations">
                <h4 className="limitations-title">제한사항</h4>
                <ul className="limitations-list">
                  <li>❌ 맞춤형 개발</li>
                  <li>❌ 전담 매니저</li>
                  <li>❌ SLA 보장</li>
                </ul>
              </div>

              <button 
                className="btn btn-primary plan-btn"
                onClick={() => handleSelectPlan('advanced')}
              >
                Advanced 시작하기
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="pricing-card">
              <div className="plan-header">
                <h3 className="plan-name">Enterprise Plan</h3>
                <div className="plan-price">
                  <span className="price">문의</span>
                  <span className="period">/맞춤형</span>
                </div>
                <p className="plan-description">
                  대규모 기업을 위한 맞춤형 CAPTCHA 솔루션
                </p>
              </div>
              
              <div className="plan-features">
                <h4 className="features-title">포함 기능</h4>
                <ul className="features-list">
                  <li>✅ 무제한 요청</li>
                  <li>✅ 맞춤형 개발</li>
                  <li>✅ 전담 매니저</li>
                  <li>✅ SLA 보장</li>
                  <li>✅ 24/7 전담 지원</li>
                  <li>✅ 보안 감사 지원</li>
                  <li>✅ 온프레미스 옵션</li>
                </ul>
              </div>

              <div className="plan-limitations">
                <h4 className="limitations-title">특별 혜택</h4>
                <ul className="limitations-list">
                  <li>🎯 맞춤형 가격 정책</li>
                  <li>🎯 연간 계약 할인</li>
                  <li>🎯 우선 기술 지원</li>
                </ul>
              </div>

              <button 
                className="btn btn-secondary plan-btn"
                onClick={handleContactUs}
              >
                문의하기
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="faq-section">
            <h3 className="faq-title">자주 묻는 질문</h3>
            <div className="faq-grid">
              <div className="faq-item">
                <h4 className="faq-question">요금제를 언제든지 변경할 수 있나요?</h4>
                <p className="faq-answer">
                  네, 언제든지 요금제를 업그레이드하거나 다운그레이드할 수 있습니다. 
                  변경은 즉시 적용되며, 비용은 일할 계산됩니다.
                </p>
              </div>
              
              <div className="faq-item">
                <h4 className="faq-question">무료 플랜의 제한사항은 무엇인가요?</h4>
                <p className="faq-answer">
                  무료 플랜은 일일 1,000회 요청으로 제한되며, 기본적인 봇 차단 기능만 제공합니다. 
                  고급 기능을 사용하려면 Advanced 플랜으로 업그레이드하세요.
                </p>
              </div>
              
              <div className="faq-item">
                <h4 className="faq-question">연간 계약 시 할인이 있나요?</h4>
                <p className="faq-answer">
                  Enterprise 플랜의 경우 연간 계약 시 할인 혜택을 제공합니다. 
                  자세한 내용은 영업팀에 문의해 주세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PayPage; 