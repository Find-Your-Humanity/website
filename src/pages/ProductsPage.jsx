import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaRobot, FaBullseye, FaBolt, FaShieldAlt, FaChartBar, FaTools } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import '../styles/pages/ProductsPage.css';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProductsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [visibleLevels, setVisibleLevels] = useState(new Set());
  const [playingVideos, setPlayingVideos] = useState(new Set());
  const videoSectionRef = useRef(null);
  const videoTimerRef = useRef(null);
  const levelRefs = useRef({});
  const levelVideoRefs = useRef({});

  // Chart.js 데이터 및 옵션 - 간단한 설정
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    },
    elements: {
      point: {
        radius: 0
      }
    }
  };

  // ResNet-152 차트 데이터 - 간단한 테스트 데이터
  const resnetData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'ResNet-152',
      data: [85, 88, 92, 89, 95, 98.7],
      borderColor: '#DFFF00',
      backgroundColor: 'rgba(223, 255, 0, 0.2)',
      borderWidth: 3,
      fill: true,
      tension: 0.3
    }]
  };

  // BERT-Large 차트 데이터 - 간단한 테스트 데이터
  const bertData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'BERT-Large',
      data: [70, 75, 80, 85, 88, 99.2],
      borderColor: '#DFFF00',
      backgroundColor: 'rgba(223, 255, 0, 0.2)',
      borderWidth: 3,
      fill: true,
      tension: 0.3
    }]
  };

  // YOLO v8 차트 데이터 - 간단한 테스트 데이터
  const yoloData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'YOLO v8',
      data: [90, 92, 94, 93, 96, 97.5],
      borderColor: '#DFFF00',
      backgroundColor: 'rgba(223, 255, 0, 0.2)',
      borderWidth: 3,
      fill: true,
      tension: 0.3
    }]
  };

  // Transformer-XL 차트 데이터 - 간단한 테스트 데이터
  const transformerData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Transformer-XL',
      data: [80, 85, 88, 90, 93, 99.1],
      borderColor: '#DFFF00',
      backgroundColor: 'rgba(223, 255, 0, 0.2)',
      borderWidth: 3,
      fill: true,
      tension: 0.3
    }]
  };

  // 성능 비교 차트 데이터 - Epoch vs Accuracy
  const performanceComparisonData = {
    labels: ['Epoch 1', 'Epoch 5', 'Epoch 10', 'Epoch 15', 'Epoch 20', 'Epoch 25', 'Epoch 30'],
    datasets: [
      {
        label: 'MobileNetV2',
        data: [75, 82, 88, 92, 95, 97, 98.7],
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4
      },
      {
        label: 'BERT-Large',
        data: [70, 78, 85, 90, 94, 97, 99.2],
        borderColor: '#4ECDC4',
        backgroundColor: 'rgba(78, 205, 196, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4
      },
      {
        label: 'YOLO v8',
        data: [80, 85, 89, 92, 94, 96, 97.5],
        borderColor: '#45B7D1',
        backgroundColor: 'rgba(69, 183, 209, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4
      },
      {
        label: 'Transformer-XL',
        data: [72, 80, 87, 91, 94, 97, 99.1],
        borderColor: '#96CEB4',
        backgroundColor: 'rgba(150, 206, 180, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4
      }
    ]
  };

  // 성능 비교 차트 옵션 - 간단한 설정
  const performanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Epoch'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Accuracy (%)'
        },
        min: 60,
        max: 100
      }
    }
  };

  // 디버깅을 위한 콘솔 로그
  console.log('Chart Data Loaded:', { resnetData, bertData, yoloData, transformerData, performanceComparisonData });

  const handleStartFreePlan = () => {
    if (isAuthenticated) {
      // 로그인된 상태: PayPage로 이동
      navigate('/pay');
    } else {
      // 로그인되지 않은 상태: 로그인페이지로 이동
      navigate('/signin?next=/pay');
    }
  };

  const handleLearnMore = () => {
    // ContactUs Page로 이동
    navigate('/contact');
  };

  // 비디오 섹션 감지 및 타이머 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 화면에 보이기 시작하면 3초 타이머 시작
            videoTimerRef.current = setTimeout(() => {
              setIsVideoActive(true);
            }, 2500);
          } else {
            // 화면에서 벗어나면 타이머 취소 및 상태 초기화
            if (videoTimerRef.current) {
              clearTimeout(videoTimerRef.current);
            }
            setIsVideoActive(false);
          }
        });
      },
      { threshold: 0.5 } // 50% 이상 보일 때 감지
    );

    if (videoSectionRef.current) {
      observer.observe(videoSectionRef.current);
    }

    return () => {
      if (videoTimerRef.current) {
        clearTimeout(videoTimerRef.current);
      }
      observer.disconnect();
    };
  }, []);

  // 레벨 아이템들의 스크롤 애니메이션 감지
  useEffect(() => {
    const levelObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const level = parseInt(entry.target.dataset.level);
            setVisibleLevels(prev => new Set([...prev, level]));
          }
        });
      },
      { 
        threshold: 0.3, // 30% 이상 보일 때 감지
        rootMargin: '0px 0px -100px 0px' // 하단에서 100px 전에 감지
      }
    );

    // 모든 레벨 아이템들을 관찰
    Object.values(levelRefs.current).forEach(ref => {
      if (ref) {
        levelObserver.observe(ref);
      }
    });

    return () => {
      levelObserver.disconnect();
    };
  }, []);

  // Level 비디오들의 재생 제어
  useEffect(() => {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const level = parseInt(entry.target.dataset.level);
          const video = entry.target;
          
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // 50% 이상 보일 때 비디오 재생
            setPlayingVideos(prev => new Set([...prev, level]));
            video.play().catch(e => console.log('Video play failed:', e));
          } else {
            // 화면에서 벗어나거나 50% 미만일 때 비디오 일시정지
            setPlayingVideos(prev => {
              const newSet = new Set(prev);
              newSet.delete(level);
              return newSet;
            });
            video.pause();
            video.currentTime = 0; // 처음으로 되돌리기
          }
        });
      },
      { 
        threshold: 0.5, // 50% 이상 보일 때 감지
        rootMargin: '0px 0px -50px 0px' // 하단에서 50px 전에 감지
      }
    );

    // 모든 Level 비디오들을 관찰
    Object.values(levelVideoRefs.current).forEach(videoRef => {
      if (videoRef) {
        videoObserver.observe(videoRef);
      }
    });

    return () => {
      videoObserver.disconnect();
    };
  }, []);

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
              REAL은 이미지 분류 기반의 단계구분형 CAPTCHA 서비스로 행동 패턴 분석을 통해 <br />
              사람이 자연스럽게 풀 수 있고, 봇은 통과하기 어려운 단계구분형 CAPTCHA 문제를 제공합니다.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={handleStartFreePlan}>Start Free Plan</button>
            <button className="btn btn-secondary" onClick={handleLearnMore}>Learn More</button>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section ref={videoSectionRef} className={`video-section ${isVideoActive ? 'video-active' : ''}`}>
        <div className="video-background">
          <video 
            className={`background-video ${isVideoActive ? 'video-clear' : ''}`}
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/product_page_mv.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className={`video-overlay ${isVideoActive ? 'overlay-fade' : ''}`}>
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

      {/* CAPTCHA Levels Section */}
      <section className="captcha-levels-section">
        <div className="captcha-levels-container">
          
          {/* Level 0 */}
          <div 
            ref={(el) => (levelRefs.current[0] = el)}
            className={`level-item level-0 ${visibleLevels.has(0) ? 'visible' : ''}`} 
            data-level="0"
          >
            <div className="level-content">
              <div className="level-text">
                <h3 className="level-title">Level 0 - I'm not a robot</h3>
                <p className="level-description">
                  가장 기본적인 CAPTCHA 단계로, 간단한 이미지 분류 문제를 제공합니다. 
                  사용자가 쉽게 해결할 수 있도록 설계되어 있으며, 기본적인 봇 차단 기능을 수행합니다.
                </p>
              </div>
              <div className="level-image">
                <video 
                  ref={(el) => (levelVideoRefs.current[0] = el)}
                  className="level-video"
                  muted
                  loop
                  playsInline
                  data-level="0"
                >
                  <source src="/captcha.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>

          {/* Level 1 */}
          <div 
            ref={(el) => (levelRefs.current[1] = el)}
            className={`level-item level-1 ${visibleLevels.has(1) ? 'visible' : ''}`} 
            data-level="1"
          >
            <div className="level-content">
              <div className="level-image">
                <video 
                  ref={(el) => (levelVideoRefs.current[1] = el)}
                  className="level-video"
                  muted
                  loop
                  playsInline
                  data-level="1"
                >
                  <source src="/basic_captcha.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="level-text">
                <h3 className="level-title">Level 1 - Basic CAPTCHA</h3>
                <p className="level-description">
                  중간 난이도의 CAPTCHA로, 더 복잡한 이미지 분석이 요구됩니다. 
                  행동 패턴 분석을 통해 봇과 인간을 구분하는 능력이 향상됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* Level 2 */}
          <div 
            ref={(el) => (levelRefs.current[2] = el)}
            className={`level-item level-2 ${visibleLevels.has(2) ? 'visible' : ''}`} 
            data-level="2"
          >
            <div className="level-content">
              <div className="level-text">
                <h3 className="level-title">Level 2 - Writing CAPTCHA</h3>
                <p className="level-description">
                  고난이도 CAPTCHA로, 다중 단계 검증과 복잡한 패턴 인식이 필요합니다. 
                  AI 기반 봇 탐지 시스템과 연동되어 고급 보안을 제공합니다.
                </p>
              </div>
              <div className="level-image">
                <video 
                  ref={(el) => (levelVideoRefs.current[2] = el)}
                  className="level-video"
                  muted
                  loop
                  playsInline
                  data-level="2"
                >
                  <source src="/writing_captcha.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>

          {/* Level 3 */}
          <div 
            ref={(el) => (levelRefs.current[3] = el)}
            className={`level-item level-3 ${visibleLevels.has(3) ? 'visible' : ''}`} 
            data-level="3"
          >
            <div className="level-content">
              <div className="level-image">
                <video 
                  ref={(el) => (levelVideoRefs.current[3] = el)}
                  className="level-video"
                  muted
                  loop
                  playsInline
                  data-level="3"
                >
                  <source src="/abstract_captcha.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="level-text">
                <h3 className="level-title">Level 3 - Abstract CAPTCHA</h3>
                <p className="level-description">
                  최고 난이도의 CAPTCHA로, 실시간 학습과 적응형 보안을 제공합니다. 
                  딥러닝 알고리즘을 통해 지속적으로 진화하며, 최고 수준의 봇 차단 성능을 보여줍니다.
                </p>
              </div>
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
              <div className="feature-icon">
                <FaRobot />
              </div>
              <h3 className="feature-card-title">AI 기반 봇 탐지</h3>
              <p className="feature-card-description">
                딥러닝 알고리즘을 통해 봇의 행동 패턴을 정확하게 분석하고 차단합니다.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaBullseye />
              </div>
              <h3 className="feature-card-title">맞춤형 난이도</h3>
              <p className="feature-card-description">
                사용자의 행동 패턴에 따라 실시간으로 난이도를 조절하여 최적의 경험을 제공합니다.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaBolt />
              </div>
              <h3 className="feature-card-title">빠른 응답</h3>
              <p className="feature-card-description">
                평균 0.5초 이내의 빠른 응답 시간으로 사용자 경험을 해치지 않습니다.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3 className="feature-card-title">보안 강화</h3>
              <p className="feature-card-description">
                다중 레이어 보안 시스템으로 봇 공격을 효과적으로 차단합니다.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaChartBar />
              </div>
              <h3 className="feature-card-title">상세한 분석</h3>
              <p className="feature-card-description">
                실시간 대시보드를 통해 보안 상황과 성능 지표를 한눈에 확인할 수 있습니다.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaTools />
              </div>
              <h3 className="feature-card-title">쉬운 연동</h3>
              <p className="feature-card-description">
                다양한 프로그래밍 언어와 프레임워크를 지원하여 쉽게 연동할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Models Section */}
      <section className="ai-models-section">
        <div className="ai-models-container">
          <h2 className="ai-models-title">AI 모델 성능</h2>
          <p className="ai-models-subtitle">
            REAL CAPTCHA는 최첨단 AI 모델을 통해 뛰어난 봇 차단 성능을 제공합니다
          </p>
          
          {/* Model 1 - ResNet-152 */}
          <div className="ai-model-item model-1">
            <div className="model-content">
              <div className="model-text">
                <div className="model-header">
                  <h3 className="model-name">MobileNetV2</h3>
                  <div className="model-badge">Image Classification</div>
                </div>
                <p className="model-description">
                  이미지 분류를 위한 고성능 CNN 모델로, 복잡한 시각적 패턴을 정확하게 인식합니다. 
                  깊은 레이어 구조를 통해 이미지의 세밀한 특징까지 포착하여 봇의 자동화된 이미지 처리 시도를 효과적으로 차단합니다.
                </p>
              </div>
              <div className="model-visual">
                <div className="model-stats-card">
                  <div className="chart-container">
                    <Line data={resnetData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Model 2 - BERT-Large */}
          <div className="ai-model-item model-2">
            <div className="model-content">
              <div className="model-visual">
                <div className="model-stats-card">
                  <div className="chart-container">
                    <Line data={bertData} options={chartOptions} />
                  </div>
                </div>
              </div>
              <div className="model-text">
                <div className="model-header">
                  <h3 className="model-name">BERT-Large</h3>
                  <div className="model-badge">Behavior Analysis</div>
                </div>
                <p className="model-description">
                  사용자 행동 패턴을 분석하여 봇과 인간을 구분하는 핵심 AI 모델입니다. 
                  자연어 처리와 행동 분석을 결합하여 사용자의 입력 패턴, 타이핑 속도, 마우스 움직임 등을 종합적으로 분석합니다.
                </p>
              </div>
            </div>
          </div>

          {/* Model 3 - YOLO v8 */}
          <div className="ai-model-item model-3">
            <div className="model-content">
              <div className="model-text">
                <div className="model-header">
                  <h3 className="model-name">YOLO v8</h3>
                  <div className="model-badge">Real-time Detection</div>
                </div>
                <p className="model-description">
                  실시간 객체 탐지를 위한 경량화된 모델로, 빠른 응답 속도를 보장합니다. 
                  이미지 내 객체를 실시간으로 감지하고 분류하여 CAPTCHA 문제의 동적 요소를 효과적으로 처리합니다.
                </p>
              </div>
              <div className="model-visual">
                <div className="model-stats-card">
                  <div className="chart-container">
                    <Line data={yoloData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Model 4 - Transformer-XL */}
          <div className="ai-model-item model-4">
            <div className="model-content">
              <div className="model-visual">
                <div className="model-stats-card">
                  <div className="chart-container">
                    <Line data={transformerData} options={chartOptions} />
                  </div>
                </div>
              </div>
              <div className="model-text">
                <div className="model-header">
                  <h3 className="model-name">Transformer-XL</h3>
                  <div className="model-badge">Sequence Analysis</div>
                </div>
                <p className="model-description">
                  시퀀스 데이터 분석을 통해 사용자의 상호작용 패턴을 학습합니다. 
                  긴 시퀀스의 의존성을 효과적으로 모델링하여 사용자의 행동 흐름을 정확하게 예측하고 봇을 식별합니다.
                </p>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="ai-performance-summary">
            <h3 className="summary-title">모델별 정확도 비교</h3>
            <p className="summary-description">
              각 AI 모델의 학습 과정에서 정확도 변화를 확인할 수 있습니다
            </p>
          </div>
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