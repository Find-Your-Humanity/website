import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaCheck, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import '../styles/pages/PayPage.css';

const PayPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [openFaqs, setOpenFaqs] = useState({});

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

  const toggleFaq = (index) => {
    setOpenFaqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="pay-page">
      {/* Pricing Plans */}
      <section className="pricing-section">
        <div className="pricing-container">
          {/* Hero Content */}
          <div className="pay-hero-content">
            <h1 className="pay-hero-title">요금제 선택</h1>
            <p className="pay-hero-subtitle">
              귀하의 비즈니스 규모와 요구사항에 맞는 최적의 CAPTCHA 솔루션을 선택하세요
            </p>
          </div>

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
                  개인 개발자와 소규모 프로젝트를 위한 <br />
                  기본 CAPTCHA 서비스
                </p>
              </div>
              
              <div className="plan-features">
                <h4 className="features-title">포함 기능</h4>
                <ul className="features-list">
                  <li><FaCheck className="check-icon" /> 일일 1,000회 요청</li>
                  <li><FaCheck className="check-icon" /> 기본 봇 차단</li>
                  <li><FaCheck className="check-icon" /> 이미지 기반 CAPTCHA</li>
                  <li><FaCheck className="check-icon" /> 기본 API 연동</li>
                  <li><FaCheck className="check-icon" /> 이메일 지원</li>
                </ul>
              </div>

              <button 
                className="btn btn-primary plan-btn"
                onClick={() => handleSelectPlan('basic')}
              >
                무료로 시작하기
              </button>
              
              <button 
                className="btn btn-secondary plan-btn"
                onClick={handleContactUs}
              >
                문의하기
              </button>
            </div>

            {/* Advanced Plan */}
            <div className="pricing-card featured">
              <div className="featured-badge">인기</div>
              <div className="plan-header">
                <h3 className="plan-name">Plus Plan</h3>
                <div className="plan-price">
                  <span className="price">₩9,900</span>
                  <span className="period">/월</span>
                </div>
                <p className="plan-description">
                  중소기업과 성장하는 서비스를 위한 <br />
                  고급 CAPTCHA 솔루션
                </p>
              </div>
              
              <div className="plan-features">
                <h4 className="features-title">포함 기능</h4>
                <ul className="features-list">
                  <li><FaCheck className="check-icon" /> 일일 100,000회 요청</li>
                  <li><FaCheck className="check-icon" /> AI 기반 행동 분석</li>
                  <li><FaCheck className="check-icon" /> 3단계 난이도 조절</li>
                  <li><FaCheck className="check-icon" /> 실시간 학습 시스템</li>
                  <li><FaCheck className="check-icon" /> 고급 API 및 SDK</li>
                  <li><FaCheck className="check-icon" /> 24/7 모니터링</li>
                  <li><FaCheck className="check-icon" /> 우선 지원</li>
                </ul>
              </div>

              <button 
                className="btn btn-primary plan-btn"
                onClick={() => handleSelectPlan('advanced')}
              >
                Plus Plan 시작하기
              </button>
              
              <button 
                className="btn btn-secondary plan-btn"
                onClick={handleContactUs}
              >
                문의하기
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="pricing-card">
              <div className="plan-header">
                <h3 className="plan-name">Pro Plan</h3>
                <div className="plan-price">
                  <span className="price">₩29,900</span>
                  <span className="period">/월</span>
                </div>
                <p className="plan-description">
                  대규모 기업을 위한 맞춤형 <br />
                  CAPTCHA 솔루션
                </p>
              </div>
              
              <div className="plan-features">
                <h4 className="features-title">포함 기능</h4>
                <ul className="features-list">
                  <li><FaCheck className="check-icon" /> 무제한 요청</li>
                  <li><FaCheck className="check-icon" /> 맞춤형 개발</li>
                  <li><FaCheck className="check-icon" /> 전담 매니저</li>
                  <li><FaCheck className="check-icon" /> SLA 보장</li>
                  <li><FaCheck className="check-icon" /> 24/7 전담 지원</li>
                  <li><FaCheck className="check-icon" /> 보안 감사 지원</li>
                  <li><FaCheck className="check-icon" /> 온프레미스 옵션</li>
                </ul>
              </div>

              <button 
                className="btn btn-primary plan-btn"
                onClick={() => handleSelectPlan('pro')}
              >
                Pro Plan 시작하기
              </button>
              
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
                <div 
                  className="faq-question-container"
                  onClick={() => toggleFaq(0)}
                >
                  <h4 className="faq-question">요금제를 언제든지 변경할 수 있나요?</h4>
                  {openFaqs[0] ? (
                    <FaChevronDown className="faq-icon" />
                  ) : (
                    <FaChevronRight className="faq-icon" />
                  )}
                </div>
                {openFaqs[0] && (
                  <p className="faq-answer">
                    네, 언제든지 요금제를 업그레이드하거나 다운그레이드할 수 있습니다. 
                    변경은 즉시 적용되며, 비용은 일할 계산됩니다.
                  </p>
                )}
              </div>
              
              <div className="faq-item">
                <div 
                  className="faq-question-container"
                  onClick={() => toggleFaq(1)}
                >
                  <h4 className="faq-question">무료 플랜의 제한사항은 무엇인가요?</h4>
                  {openFaqs[1] ? (
                    <FaChevronDown className="faq-icon" />
                  ) : (
                    <FaChevronRight className="faq-icon" />
                  )}
                </div>
                {openFaqs[1] && (
                  <p className="faq-answer">
                    무료 플랜은 일일 1,000회 요청으로 제한되며, 기본적인 봇 차단 기능만 제공합니다. 
                    고급 기능을 사용하려면 Advanced 플랜으로 업그레이드하세요.
                  </p>
                )}
              </div>
              
              <div className="faq-item">
                <div 
                  className="faq-question-container"
                  onClick={() => toggleFaq(2)}
                >
                  <h4 className="faq-question">연간 계약 시 할인이 있나요?</h4>
                  {openFaqs[2] ? (
                    <FaChevronDown className="faq-icon" />
                  ) : (
                    <FaChevronRight className="faq-icon" />
                  )}
                </div>
                {openFaqs[2] && (
                  <p className="faq-answer">
                    Enterprise 플랜의 경우 연간 계약 시 할인 혜택을 제공합니다. 
                    자세한 내용은 영업팀에 문의해 주세요.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PayPage; 