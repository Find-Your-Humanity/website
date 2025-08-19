import React, { useState } from 'react';
import '../styles/pages/FAQPage.css';

const FAQPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      category: "서비스 일반",
      questions: [
        {
          question: "RealCaptcha는 어떤 서비스인가요?",
          answer: "RealCaptcha는 웹사이트와 애플리케이션에서 봇과 사람을 구분하는 CAPTCHA 검증 서비스입니다. 간단한 API 호출로 실시간 보안 검증을 제공하며, 스팸과 악성 트래픽으로부터 여러분의 서비스를 보호합니다."
        },
        {
          question: "다른 CAPTCHA 서비스와의 차이점은 무엇인가요?",
          answer: "RealCaptcha는 한국어 환경에 최적화되어 있으며, 높은 정확도와 빠른 응답속도를 자랑합니다. 또한 간단한 통합 과정과 합리적인 가격으로 개발자 친화적인 서비스를 제공합니다."
        },
        {
          question: "어떤 플랫폼에서 사용할 수 있나요?",
          answer: "웹사이트, 모바일 앱, 데스크톱 애플리케이션 등 HTTP API를 지원하는 모든 플랫폼에서 사용 가능합니다. React, Vue, Angular, Node.js, Python, PHP, Java 등 다양한 언어와 프레임워크를 지원합니다."
        }
      ]
    },
    {
      category: "계정 및 요금",
      questions: [
        {
          question: "무료 플랜이 있나요?",
          answer: "네, 월 1,000회까지 무료로 사용할 수 있는 Free 플랜을 제공합니다. 개발 및 테스트 목적으로 충분하며, 신용카드 등록 없이 바로 시작할 수 있습니다."
        },
        {
          question: "요금제는 어떻게 구성되어 있나요?",
          answer: "Free(월 1K 요청), Starter(월 10K 요청, ₩9,900), Professional(월 100K 요청, ₩39,000), Enterprise(무제한, 별도 문의) 플랜을 제공합니다. 사용량에 따라 적합한 플랜을 선택하실 수 있습니다."
        },
        {
          question: "플랜 변경은 언제든 가능한가요?",
          answer: "네, 언제든지 업그레이드나 다운그레이드가 가능합니다. 업그레이드는 즉시 적용되며, 다운그레이드는 다음 결제 주기부터 적용됩니다."
        },
        {
          question: "요금 한도를 초과하면 어떻게 되나요?",
          answer: "요금제 한도를 초과하면 일시적으로 서비스가 제한됩니다. 상위 플랜으로 업그레이드하거나 다음 달까지 기다리시면 서비스를 계속 이용하실 수 있습니다."
        }
      ]
    },
    {
      category: "기술 지원",
      questions: [
        {
          question: "API 키는 어떻게 발급받나요?",
          answer: "회원가입 후 대시보드에서 즉시 API 키를 발급받을 수 있습니다. 보안을 위해 API 키는 안전한 곳에 보관하시고, 외부에 노출되지 않도록 주의해 주세요."
        },
        {
          question: "API 응답 시간은 얼마나 걸리나요?",
          answer: "일반적으로 100-300ms 내에 응답을 제공합니다. 서버 위치와 네트워크 상황에 따라 차이가 있을 수 있지만, 안정적이고 빠른 응답을 보장합니다."
        },
        {
          question: "개발 문서는 어디서 볼 수 있나요?",
          answer: "웹사이트의 '문서' 메뉴에서 상세한 API 문서와 통합 가이드를 확인하실 수 있습니다. 다양한 프로그래밍 언어별 예제 코드도 제공합니다."
        },
        {
          question: "HTTPS는 필수인가요?",
          answer: "보안을 위해 HTTPS 사용을 강력히 권장합니다. HTTP도 지원하지만, 프로덕션 환경에서는 반드시 HTTPS를 사용해 주세요."
        },
        {
          question: "API 키가 노출되었어요. 어떻게 해야 하나요?",
          answer: "즉시 대시보드에서 API 키를 재발급받으세요. 기존 키는 자동으로 비활성화되며, 새로운 키로 서비스를 계속 이용하실 수 있습니다."
        }
      ]
    },
    {
      category: "통합 및 사용법",
      questions: [
        {
          question: "웹사이트에 통합하는 방법이 어렵나요?",
          answer: "매우 간단합니다! JavaScript 한 줄로 통합할 수 있으며, 자세한 가이드와 예제를 제공합니다. 일반적으로 10분 이내에 통합이 완료됩니다."
        },
        {
          question: "모바일 앱에서도 사용할 수 있나요?",
          answer: "네, REST API를 통해 iOS, Android 네이티브 앱과 React Native, Flutter 등 크로스 플랫폼에서 모두 사용 가능합니다."
        },
        {
          question: "검증 실패율은 어느 정도인가요?",
          answer: "일반적으로 95% 이상의 정확도를 보장합니다. 지속적인 머신러닝 모델 개선을 통해 정확도를 높이고 있습니다."
        },
        {
          question: "커스터마이징이 가능한가요?",
          answer: "UI 테마 변경, 언어 설정, 난이도 조절 등 다양한 커스터마이징 옵션을 제공합니다. Enterprise 플랜에서는 완전한 화이트라벨링도 지원합니다."
        }
      ]
    },
    {
      category: "문제 해결",
      questions: [
        {
          question: "API가 작동하지 않아요.",
          answer: "먼저 API 키가 올바른지, 요청 형식이 맞는지 확인해 주세요. 네트워크 연결과 서버 상태도 점검해 보시고, 그래도 해결되지 않으면 고객지원에 문의해 주세요."
        },
        {
          question: "CAPTCHA가 로드되지 않아요.",
          answer: "브라우저의 JavaScript가 활성화되어 있는지, 애드블로커가 차단하고 있지 않은지 확인해 주세요. 콘솔에서 오류 메시지도 확인해 보시기 바랍니다."
        },
        {
          question: "정상적인 사용자가 차단되고 있어요.",
          answer: "검증 난이도가 너무 높게 설정되었을 수 있습니다. 대시보드에서 설정을 조정하거나, 고객지원팀에 문의하여 최적화 도움을 받으실 수 있습니다."
        },
        {
          question: "대량의 요청이 실패해요.",
          answer: "API 호출 한도를 초과했거나, 서버 오류일 수 있습니다. 현재 플랜의 사용량을 확인하시고, 지속적인 문제가 발생하면 즉시 지원팀에 연락해 주세요."
        }
      ]
    },
    {
      category: "보안 및 개인정보",
      questions: [
        {
          question: "개인정보는 어떻게 보호되나요?",
          answer: "모든 데이터는 암호화되어 전송되고 저장됩니다. GDPR, 개인정보보호법 등 관련 법규를 준수하며, 정기적인 보안 감사를 실시합니다."
        },
        {
          question: "사용자 데이터를 수집하나요?",
          answer: "서비스 개선을 위한 최소한의 기술적 데이터만 수집합니다. 개인을 식별할 수 있는 정보는 수집하지 않으며, 상세한 내용은 개인정보처리방침을 참조해 주세요."
        },
        {
          question: "데이터는 얼마나 보관되나요?",
          answer: "검증 로그는 30일간 보관 후 자동 삭제됩니다. 계정 정보는 회원탈퇴 시 즉시 삭제되며, 법적 요구사항에 따른 최소 기간만 보관합니다."
        }
      ]
    }
  ];

  return (
    <div className="faq-page">
      <div className="faq-container">
        <div className="faq-header">
          <h1 className="faq-title">자주 묻는 질문</h1>
          <p className="faq-subtitle">
            RealCaptcha 서비스에 대한 궁금한 점들을 빠르게 해결해보세요.
          </p>
        </div>

        <div className="faq-search">
          <input 
            type="text" 
            placeholder="궁금한 내용을 검색해보세요..." 
            className="search-input"
          />
        </div>

        <div className="faq-content">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="faq-category">
              <h2 className="category-title">{category.category}</h2>
              <div className="faq-list">
                {category.questions.map((faq, faqIndex) => {
                  const uniqueIndex = `${categoryIndex}-${faqIndex}`;
                  return (
                    <div 
                      key={uniqueIndex} 
                      className={`faq-item ${openFAQ === uniqueIndex ? 'active' : ''}`}
                    >
                      <div 
                        className="faq-question" 
                        onClick={() => toggleFAQ(uniqueIndex)}
                      >
                        <h3>{faq.question}</h3>
                        <span className="faq-toggle">
                          {openFAQ === uniqueIndex ? '−' : '+'}
                        </span>
                      </div>
                      {openFAQ === uniqueIndex && (
                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="faq-contact">
          <div className="contact-card">
            <h3>원하는 답을 찾지 못하셨나요?</h3>
            <p>저희 고객지원팀이 도와드리겠습니다.</p>
            <div className="contact-buttons">
              <a href="/contact" className="contact-btn primary">
                문의하기
              </a>
              <a href="mailto:support@realcaptcha.com" className="contact-btn secondary">
                이메일 보내기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
