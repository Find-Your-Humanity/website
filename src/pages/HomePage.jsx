import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useScrollToTop from '../hooks/useScrollToTop';
import '../styles/pages/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false); // 동의 상태 추가
  const heroRef = useRef(null);
  const mainContentRef = useRef(null);
  const featuresRef = useRef(null);
  
  // CDN API 키 가져오기 (프론트엔드에서는 사이트 키만 사용)
  const CAPTCHA_SITE_KEY = process.env.REACT_APP_CAPTCHA_SITE_KEY || 'rc_live_f49a055d62283fd02e8203ccaba70fc2';
  
  // 페이지 이동 시 스크롤을 맨 위로 올림
  useScrollToTop();

  const handleStartFreePlan = () => {
    if (isAuthenticated) {
      // 로그인된 상태: PayPage로 이동
      navigate('/pay');
    } else {
      // 로그인되지 않은 상태: 로그인페이지로 이동
      navigate('/signin?next=/pay');
    }
  };

  const handleTryCaptcha = () => {
    setShowCaptcha(prev => !prev); // true면 false로, false면 true로 토글
    setConsentGiven(false); // CAPTCHA 토글 시 동의 상태 초기화
  };

  const handleConsentChange = (e) => {
    setConsentGiven(e.target.checked);
  };

  // 서버로 토큰 전송 함수
  const sendTokenToServer = async (token) => {
    try {
      const response = await fetch('/api/captcha/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          // 시크릿 키는 백엔드에서만 사용
        })
      });
      
      const result = await response.json();
      if (result.success) {
        alert('캡차 인증이 완료되었습니다! 🎉');
        setShowCaptcha(false); // 캡차 숨기기
      } else {
        alert('캡차 검증 실패: ' + result.message);
      }
    } catch (error) {
      console.error('서버 전송 오류:', error);
      alert('서버 통신 오류가 발생했습니다.');
    }
  };

  // 대체 방법: iframe으로 위젯 로드
  const loadCaptchaWidgetFallback = () => {
    const container = document.getElementById('captcha-container');
    if (container) {
      container.innerHTML = `
        <div style="width: 100%; height: 100%;">
          <iframe 
            src="https://test.realcatcha.com?siteKey=${CAPTCHA_SITE_KEY}&theme=light" 
            width="100%" 
            height="100%" 
            frameborder="0"
            style="border: none; border-radius: 8px; min-height: 400px;"
            allow="camera; microphone; geolocation"
          ></iframe>
        </div>
      `;
    }
  };

  // Captcha 렌더링
  useEffect(() => {
    if (showCaptcha && consentGiven) {
      // 약간의 지연 후 captcha 렌더링 (DOM이 준비된 후)
      const timer = setTimeout(() => {
        try {
          console.log('캡차 렌더링 시작, siteKey:', CAPTCHA_SITE_KEY); // 디버깅용 로그
          
          // 위젯 스크립트가 로드되었는지 확인
          if (typeof window.renderRealCaptcha === 'function') {
            window.renderRealCaptcha('captcha-container', {
              siteKey: CAPTCHA_SITE_KEY, // siteKey를 첫 번째 파라미터로 명시
              theme: 'light',
              size: 'normal',
              onSuccess: function(result) {
                console.log('캡차 성공!', result.token);
                // 성공 시 서버로 토큰 전송 (시크릿 키로 검증)
                sendTokenToServer(result.token);
              },
              onError: function(error) {
                console.error('캡차 오류:', error);
                alert('캡차 인증 실패. 다시 시도해주세요.');
              },
              onExpired: function() {
                console.log('캡차 만료됨');
                alert('캡차가 만료되었습니다. 다시 시도해주세요.');
              }
            });
          } else {
            console.error('renderRealCaptcha 함수를 찾을 수 없습니다. 위젯 스크립트를 확인해주세요.');
            // 대체 방법: iframe으로 위젯 로드
            loadCaptchaWidgetFallback();
          }
        } catch (error) {
          console.error('Captcha 렌더링 오류:', error);
          // 오류 발생 시 대체 방법 사용
          loadCaptchaWidgetFallback();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [showCaptcha, consentGiven, CAPTCHA_SITE_KEY]);

  // Hero section은 페이지 로드 시 약간의 지연 후 애니메이션
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleSections(prev => new Set([...prev, 'hero']));
    }, 100); // 100ms 지연
    
    return () => clearTimeout(timer);
  }, []);

  // Main content와 features의 스크롤 애니메이션
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target.dataset.section;
            setVisibleSections(prev => new Set([...prev, section]));
          }
        });
      },
      { 
        threshold: 0.3, // 30% 이상 보일 때 감지
        rootMargin: '0px 0px -100px 0px' // 하단에서 100px 전에 감지
      }
    );

    // Main content와 features 관찰
    if (mainContentRef.current) {
      observer.observe(mainContentRef.current);
    }
    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div 
          ref={heroRef}
          className={`hero-content ${visibleSections.has('hero') ? 'visible' : ''}`}
          data-section="hero"
        >
          <h1 className="hero-title">
            <span className="real-text">REAL</span> or <span className="not-text">Not</span>?
          </h1>
          <p className="home-hero-subtitle">Bots won't know.</p>
          <div className="hero-buttons">
            <button 
              className="btn btn-primary" 
              onClick={handleTryCaptcha}
            >
              Try CAPTCHA
            </button>
            <button className="btn btn-primary" onClick={handleStartFreePlan}>Start Free Plan</button>
          </div>
          
          {/* 동의 UI */}
          {showCaptcha && !consentGiven && (
            <div className="consent-section">
              <div className="consent-checkbox">
                <input 
                  type="checkbox" 
                  checked={consentGiven} 
                  onChange={handleConsentChange}
                  id="consent-checkbox"
                />
                <span className="consent-text">
                  AI 모델 학습을 위한 데이터 수집에 동의합니다
                </span>
              </div>
            </div>
          )}
          
          {/* Captcha Container */}
          {showCaptcha && consentGiven && (
            <div className="captcha-section">
              <div id="captcha-container"></div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="main-content">
        <div 
          ref={mainContentRef}
          className={`content-wrapper ${visibleSections.has('main') ? 'visible' : ''}`}
          data-section="main"
        >
          <div className="main-content-left">
            <h2 className="main-title">
              사람은 지나가고, 봇은 멈추는 <br />
              이미지 기반 AI CAPTCHA 서비스
            </h2>
            <p className="main-description">
              REAL은 딥러닝 기반 이미지 분류와 행동 패턴 분석을 통해 <br />
              사람이 자연스럽게 풀 수 있고, 봇은 통과하기 어려운  <br />
              단계구분형 CAPTCHA 문제를 제공합니다.
            </p>
          </div>
          <div className="video-container">
            <video 
              className="demo-video" 
              autoPlay 
              loop 
              muted 
              playsInline
            >
              <source src="/captcha.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Feature Boxes */}
      <section className="features">
        <div 
          ref={featuresRef}
          className={`features-grid ${visibleSections.has('features') ? 'visible' : ''}`}
          data-section="features"
        >
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