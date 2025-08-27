import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMoon, FaSun, FaHome, FaReact, FaVuejs, FaWordpress, FaAngular, FaNodeJs } from 'react-icons/fa';
import useScrollToTop from '../hooks/useScrollToTop';
import '../styles/pages/DocumentPage.css';

const DocumentPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ko');
  const [selectedSidebarItem, setSelectedSidebarItem] = useState('Developer Guide');
  
  // 페이지 이동 시 스크롤을 맨 위로 올림
  useScrollToTop();
  
  // 한국어 콘텐츠
  const koreanContent = {
    mainTitle: '개발자 가이드',
    introText: 'REAL은 봇, 스팸 및 기타 자동화된 악용으로부터 애플리케이션을 보호하는 데 도움을 줄 수 있습니다.',
    installationText: 'SDK 설치는 빠르고 간단합니다. HTML/서버 사이드 코드 또는 네이티브 도구를 사용할 수 있습니다.',
    frameworkIntro: '많은 프레임워크에 대한 플러그인과 코드 예제를 사용할 수 있습니다.',
    integrationLink: '알려진 REAL 통합 목록도 제공되며, 새로운 통합을 제출하고 싶다면 이용할 수 있습니다.',
    sections: {
      'switching-from-recaptcha': {
        title: 'reCAPTCHA에서 전환하기',
        content: '기존 Google reCAPTCHA 코드는 몇 가지 변경 사항만으로 사용할 수 있습니다. REAL 메서드는 API 호환 가능합니다 (예: render() 및 onload()). 또한 theme, size, tab-index와 같은 사용자 정의 데이터 속성도 지원합니다.'
      },
      'basic-principles': {
        title: '기본 원칙',
        content: [
          '사이트에 REAL 위젯을 임베드합니다. 예를 들어 로그인 폼에 배치합니다.',
          '위젯은 사용자가 인간임을 증명하도록 도전합니다.',
          '완료 시 REAL은 응답 토큰을 제공합니다.',
          '서버에서 토큰을 확인하여 유효성을 검증합니다.',
          '유효한 경우 사용자가 의도한 작업을 진행할 수 있도록 허용합니다.'
        ]
      },
      'request-flow': {
        title: '요청 흐름',
        content: '일반적인 요청 흐름에는 클라이언트 사이드 위젯 렌더링, 사용자 상호작용, 토큰 생성 및 서버 사이드 검증이 포함됩니다.'
      },
      'content-security-policy-settings': {
        title: '콘텐츠 보안 정책 설정',
        content: '보안을 유지하면서 REAL 스크립트와 리소스가 제대로 로드되도록 CSP 헤더를 구성하세요.'
      },
      'add-the-real-widget-to-your-webpage': {
        title: '웹페이지에 REAL 위젯 추가하기',
        content: 'REAL 스크립트를 포함하고 HTML에 위젯 컨테이너를 추가하세요. 사이트 키와 콜백 함수로 위젯을 구성하세요.'
      },
      'verify-the-user-response-server-side': {
        title: '서버 사이드에서 사용자 응답 확인하기',
        content: '응답 토큰을 REAL의 검증 엔드포인트로 전송하여 사용자의 인간성을 확인하고 자동화된 악용을 방지하세요.'
      },
      'siteverify-error-codes-table': {
        title: 'Siteverify 오류 코드 테이블',
        content: 'REAL API로 토큰을 확인할 때 일반적인 오류 코드와 그 의미에 대한 참조 테이블입니다.'
      },
      'rotating-your-siteverify-secret': {
        title: 'Siteverify 비밀키 순환하기',
        content: '보안을 유지하고 토큰 재사용을 방지하기 위해 검증 비밀키를 순환하는 모범 사례입니다.'
      },
      'local-development': {
        title: '로컬 개발',
        content: '테스트 키와 localhost 구성을 포함하여 REAL과 함께 작동하도록 개발 환경을 설정하세요.'
      },
      'typescript-types': {
        title: 'TypeScript 타입',
        content: 'REAL 통합을 위한 TypeScript 정의 및 인터페이스로, 더 나은 개발 경험과 타입 안전성을 제공합니다.'
      },
      'how-to-install': {
        title: '설치 방법',
        content: '다양한 플랫폼과 프레임워크에 대한 단계별 설치 가이드입니다.'
      },
      'how-to-use': {
        title: '사용 방법',
        content: 'REAL의 기본 사용 예제와 일반적인 통합 패턴입니다.'
      },
      'integration-testing-test-keys': {
        title: '통합 테스트: 테스트 키',
        content: '실제 사용자에게 영향을 주지 않고 통합을 확인하기 위해 테스트 키를 사용하세요.'
      },
      'test-key-set-publisher-or-pro-account': {
        title: '테스트 키 세트: 퍼블리셔 또는 Pro 계정',
        content: '퍼블리셔 및 Pro 계정 소유자를 위한 테스트 키입니다.'
      },
      'test-key-set-enterprise-account-safe-end-user': {
        title: '테스트 키 세트: 엔터프라이즈 계정 (안전한 최종 사용자)',
        content: '안전한 최종 사용자 시나리오가 있는 엔터프라이즈 계정을 위한 테스트 키입니다.'
      },
      'test-key-set-enterprise-account-bot-detected': {
        title: '테스트 키 세트: 엔터프라이즈 계정 (봇 감지)',
        content: '봇 감지 시나리오가 있는 엔터프라이즈 계정을 위한 테스트 키입니다.'
      },
      'frontend-testing-force-a-visual-challenge': {
        title: '프론트엔드 테스트: 시각적 챌린지 강제하기',
        content: '테스트 중 적절한 위젯 동작을 보장하기 위해 시각적 챌린지를 강제하는 방법입니다.'
      },
      'backend-testing-ensure-correct-handling-of-rejected-tokens': {
        title: '백엔드 테스트: 거부된 토큰의 올바른 처리 보장하기',
        content: '백엔드가 거부된 토큰과 오류 시나리오를 올바르게 처리하는지 테스트하세요.'
      },
      'whats-next': {
        title: '다음 단계',
        content: 'REAL 통합의 고급 구성, 사용자 정의 및 최적화를 위한 다음 단계입니다.'
      }
    }
  };
  
  // 영어 콘텐츠
  const englishContent = {
    mainTitle: 'Developer Guide',
    introText: 'REAL can help protect your applications from bots, spam, and other forms of automated abuse.',
    installationText: 'SDK installation is fast and easy. You can use HTML/server-side code or native tools.',
    frameworkIntro: 'Plugins and code examples are available for many frameworks.',
    integrationLink: 'A complete list of known REAL integrations is also available if you\'d like to submit a new one.',
    sections: {
      'switching-from-recaptcha': {
        title: 'Switching from reCAPTCHA',
        content: 'Existing Google reCAPTCHA code can be used with only a few changes. REAL methods are API-compatible (e.g., render() and onload()). We also support custom data attributes like theme, size, and tab-index.'
      },
      'basic-principles': {
        title: 'Basic Principles',
        content: [
          'You embed the REAL widget on your site. For example, on a login form.',
          'The widget challenges the user to prove they are human.',
          'Upon completion, REAL provides a response token.',
          'You verify the token on your server to ensure it\'s valid.',
          'If valid, you allow the user to proceed with their intended action.'
        ]
      },
      'request-flow': {
        title: 'Request Flow',
        content: 'The typical request flow involves client-side widget rendering, user interaction, token generation, and server-side verification.'
      },
      'content-security-policy-settings': {
        title: 'Content-Security-Policy Settings',
        content: 'Configure your CSP headers to allow REAL scripts and resources to load properly while maintaining security.'
      },
      'add-the-real-widget-to-your-webpage': {
        title: 'Add the REAL Widget to your Webpage',
        content: 'Include the REAL script and add the widget container to your HTML. Configure the widget with your site key and callback functions.'
      },
      'verify-the-user-response-server-side': {
        title: 'Verify the User Response Server Side',
        content: 'Send the response token to REAL\'s verification endpoint to confirm the user\'s humanity and prevent automated abuse.'
      },
      'siteverify-error-codes-table': {
        title: 'Siteverify Error Codes Table',
        content: 'Reference table for common error codes and their meanings when verifying tokens with REAL\'s API.'
      },
      'rotating-your-siteverify-secret': {
        title: 'Rotating Your Siteverify Secret',
        content: 'Best practices for rotating your verification secret to maintain security and prevent token reuse.'
      },
      'local-development': {
        title: 'Local Development',
        content: 'Set up your development environment to work with REAL, including test keys and localhost configuration.'
      },
      'typescript-types': {
        title: 'TypeScript Types',
        content: 'TypeScript definitions and interfaces for REAL integration, providing better development experience and type safety.'
      },
      'how-to-install': {
        title: 'How to install',
        content: 'Step-by-step installation guide for different platforms and frameworks.'
      },
      'how-to-use': {
        title: 'How to use',
        content: 'Basic usage examples and common integration patterns for REAL.'
      },
      'integration-testing-test-keys': {
        title: 'Integration Testing: Test Keys',
        content: 'Use test keys to verify your integration without affecting real users.'
      },
      'test-key-set-publisher-or-pro-account': {
        title: 'Test Key Set: Publisher or Pro Account',
        content: 'Test keys for publisher and pro account holders.'
      },
      'test-key-set-enterprise-account-safe-end-user': {
        title: 'Test Key Set: Enterprise Account (Safe End User)',
        content: 'Test keys for enterprise accounts with safe end user scenarios.'
      },
      'test-key-set-enterprise-account-bot-detected': {
        title: 'Test Key Set: Enterprise Account (Bot Detected)',
        content: 'Test keys for enterprise accounts with bot detection scenarios.'
      },
      'frontend-testing-force-a-visual-challenge': {
        title: 'Frontend Testing: Force a Visual Challenge',
        content: 'How to force visual challenges during testing to ensure proper widget behavior.'
      },
      'backend-testing-ensure-correct-handling-of-rejected-tokens': {
        title: 'Backend Testing: Ensure Correct Handling of Rejected Tokens',
        content: 'Test your backend to ensure it properly handles rejected tokens and error scenarios.'
      },
      'whats-next': {
        title: 'What\'s next?',
        content: 'Next steps for advanced configuration, customization, and optimization of your REAL integration.'
      }
    }
  };
  
  // 현재 언어에 따른 콘텐츠 선택
  const currentContent = selectedLanguage === 'ko' ? koreanContent : englishContent;

  // 테마 토글 함수
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    
    // HTML 요소에 클래스 추가/제거
    const documentPage = document.querySelector('.document-page');
    if (documentPage) {
      if (newDarkMode) {
        documentPage.classList.add('dark-mode');
      } else {
        documentPage.classList.remove('dark-mode');
      }
    }
  };

  // 컴포넌트 마운트 시 저장된 테마 설정 불러오기
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      const darkMode = JSON.parse(savedDarkMode);
      setIsDarkMode(darkMode);
      
      const documentPage = document.querySelector('.document-page');
      if (documentPage && darkMode) {
        documentPage.classList.add('dark-mode');
      }
    }
  }, []);
  
  // 언어 변경 시 콘텐츠 업데이트
  useEffect(() => {
    // 언어가 변경되면 콘텐츠가 자동으로 업데이트됩니다
    // currentContent가 selectedLanguage에 따라 자동으로 변경됨
  }, [selectedLanguage]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.language-selector')) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const frameworks = [
    { name: 'ReactJS', icon: FaReact, color: '#61DAFB' },
    { name: 'VueJS', icon: FaVuejs, color: '#4FC08D' },
    { name: 'WordPress', icon: FaWordpress, color: '#21759B' },
    { name: 'Angular', icon: FaAngular, color: '#DD0031' },
    { name: 'Node.js', icon: FaNodeJs, color: '#339933' }
  ];

  const languages = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage);

  // Sidebar item 클릭 핸들러
  const handleSidebarItemClick = (item) => {
    console.log(`Clicked: ${item}`);
    setSelectedSidebarItem(item);
  };

  // TOC 링크 클릭 핸들러
  const handleTocClick = (item) => {
    // TOC 아이템을 섹션 키와 매핑
    const sectionKey = Object.keys(currentContent.sections).find(key => 
      currentContent.sections[key].title === item
    );
    
    if (sectionKey) {
      const element = document.getElementById(sectionKey);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  const sidebarItems = [
    '설정',
    '보이지 않는 캡차',
    '사용자 정의 테마',
    '언어 코드',
    '자주 묻는 질문',
    '계정 관리 및 메트릭 API (엔터프라이즈)',
    'reCAPTCHA에서 REAL로 전환',
    '모바일 앱 SDK',
    '통합',
    'Pro 기능',
    '엔터프라이즈 개요'
  ];
  
  // 사이드바 아이템별 상세 내용
  const sidebarContent = {
    'Developer Guide': {
      ko: {
        title: '개발자 가이드',
        content: 'REAL 캡차의 기본 개념과 사용법을 알아보세요.',
        sections: currentContent.sections
      },
      en: {
        title: 'Developer Guide',
        content: 'Learn the basic concepts and usage of REAL captcha.',
        sections: currentContent.sections
      }
    },
    '설정': {
      ko: {
        title: '설정',
        content: 'REAL 캡차의 기본 설정을 구성하는 방법을 알아보세요.',
        sections: {
          'site-keys': {
            title: '사이트 키 설정',
            content: 'REAL 대시보드에서 사이트 키를 생성하고 관리하는 방법입니다. 사이트 키는 프론트엔드에서 위젯을 렌더링하는 데 사용됩니다.'
          },
          'secret-keys': {
            title: '비밀 키 관리',
            content: '서버 사이드 검증을 위한 비밀 키를 안전하게 관리하고 순환하는 방법입니다. 정기적인 키 순환이 보안에 중요합니다.'
          },
          'domain-settings': {
            title: '도메인 설정',
            content: '허용된 도메인을 설정하여 무단 사용을 방지합니다. localhost 개발 환경과 프로덕션 도메인을 모두 구성할 수 있습니다.'
          },
          'rate-limiting': {
            title: '속도 제한',
            content: 'API 호출 빈도를 제한하여 악용을 방지하고 서비스 안정성을 보장합니다. IP 기반 및 사용자 기반 제한을 설정할 수 있습니다.'
          }
        }
      },
      en: {
        title: 'Configuration',
        content: 'Learn how to configure basic settings for REAL captcha.',
        sections: {
          'site-keys': {
            title: 'Site Key Settings',
            content: 'How to generate and manage site keys from the REAL dashboard. Site keys are used to render widgets on the frontend.'
          },
          'secret-keys': {
            title: 'Secret Key Management',
            content: 'How to safely manage and rotate secret keys for server-side verification. Regular key rotation is important for security.'
          },
          'domain-settings': {
            title: 'Domain Settings',
            content: 'Set allowed domains to prevent unauthorized use. You can configure both localhost development environment and production domains.'
          },
          'rate-limiting': {
            title: 'Rate Limiting',
            content: 'Limit API call frequency to prevent abuse and ensure service stability. You can set IP-based and user-based limits.'
          }
        }
      }
    },
    '보이지 않는 캡차': {
      ko: {
        title: '보이지 않는 캡차',
        content: '사용자 경험을 방해하지 않는 보이지 않는 캡차를 구현하는 방법을 알아보세요.',
        sections: {
          'implementation': {
            title: '구현 방법',
            content: 'HTML 폼에 보이지 않는 캡차를 추가하는 방법입니다. 사용자가 폼을 제출할 때만 캡차가 실행되어 봇을 감지합니다.'
          },
          'callback-functions': {
            title: '콜백 함수',
            content: '캡차 성공/실패 시 실행되는 콜백 함수를 설정하여 사용자 경험을 향상시킵니다.'
          },
          'fallback-options': {
            title: '대체 옵션',
            content: '보이지 않는 캡차가 실패할 경우를 대비한 대체 옵션을 제공합니다.'
          }
        }
      },
      en: {
        title: 'Invisible Captcha',
        content: 'Learn how to implement invisible captcha that doesn\'t interfere with user experience.',
        sections: {
          'implementation': {
            title: 'Implementation',
            content: 'How to add invisible captcha to HTML forms. The captcha only runs when users submit the form to detect bots.'
          },
          'callback-functions': {
            title: 'Callback Functions',
            content: 'Set callback functions that run on captcha success/failure to improve user experience.'
          },
          'fallback-options': {
            title: 'Fallback Options',
            content: 'Provide fallback options in case invisible captcha fails.'
          }
        }
      }
    },
    '사용자 정의 테마': {
      ko: {
        title: '사용자 정의 테마',
        content: '웹사이트의 디자인과 일치하도록 캡차 위젯의 테마를 사용자 정의하는 방법을 알아보세요.',
        sections: {
          'color-schemes': {
            title: '색상 구성',
            content: '브랜드에 맞는 색상 구성으로 캡차 위젯을 커스터마이징합니다. 주요 색상, 보조 색상, 텍스트 색상을 설정할 수 있습니다.'
          },
          'typography': {
            title: '타이포그래피',
            content: '폰트 패밀리, 크기, 굵기 등을 조정하여 웹사이트의 타이포그래피와 일치시킵니다.'
          },
          'layout-options': {
            title: '레이아웃 옵션',
            content: '위젯의 크기, 위치, 간격 등을 조정하여 다양한 레이아웃에 맞게 배치합니다.'
          }
        }
      },
      en: {
        title: 'Custom Themes',
        content: 'Learn how to customize the theme of the captcha widget to match your website\'s design.',
        sections: {
          'color-schemes': {
            title: 'Color Schemes',
            content: 'Customize captcha widgets with brand-appropriate color schemes. You can set primary colors, secondary colors, and text colors.'
          },
          'typography': {
            title: 'Typography',
            content: 'Adjust font family, size, weight, etc. to match your website\'s typography.'
          },
          'layout-options': {
            title: 'Layout Options',
            content: 'Adjust widget size, position, spacing, etc. to fit various layouts.'
          }
        }
      }
    },
    '언어 코드': {
      ko: {
        title: '언어 코드',
        content: 'REAL 캡차에서 지원하는 모든 언어 코드와 지역화 옵션을 확인하세요.',
        sections: {
          'supported-languages': {
            title: '지원 언어',
            content: '한국어, 영어, 일본어, 중국어 등 50개 이상의 언어를 지원합니다. 각 언어별로 자연스러운 표현을 제공합니다.'
          },
          'localization': {
            title: '지역화',
            content: '사용자의 브라우저 언어 설정에 따라 자동으로 언어를 변경하거나 수동으로 언어를 선택할 수 있습니다.'
          },
          'custom-translations': {
            title: '사용자 정의 번역',
            content: '특정 언어나 방언에 대한 사용자 정의 번역을 추가하여 더 나은 사용자 경험을 제공합니다.'
          }
        }
      },
      en: {
        title: 'Language Codes',
        content: 'Check all language codes and localization options supported by REAL captcha.',
        sections: {
          'supported-languages': {
            title: 'Supported Languages',
            content: 'Supports over 50 languages including Korean, English, Japanese, Chinese, etc. Provides natural expressions for each language.'
          },
          'localization': {
            title: 'Localization',
            content: 'Automatically change language based on user\'s browser language settings or manually select language.'
          },
          'custom-translations': {
            title: 'Custom Translations',
            content: 'Add custom translations for specific languages or dialects to provide better user experience.'
          }
        }
      }
    },
    '자주 묻는 질문': {
      ko: {
        title: '자주 묻는 질문',
        content: 'REAL 캡차 사용에 대한 일반적인 질문과 답변을 찾아보세요.',
        sections: {
          'general-questions': {
            title: '일반 질문',
            content: '캡차의 작동 원리, 보안성, 성능 등에 대한 기본적인 질문과 답변입니다.'
          },
          'technical-issues': {
            title: '기술적 문제',
            content: '구현 과정에서 발생할 수 있는 일반적인 문제들과 해결 방법을 제공합니다.'
          },
          'billing-support': {
            title: '결제 및 지원',
            content: '요금제, 결제 방법, 기술 지원 등에 대한 정보를 확인할 수 있습니다.'
          }
        }
      },
      en: {
        title: 'Frequently Asked Questions',
        content: 'Find answers to common questions about using REAL captcha.',
        sections: {
          'general-questions': {
            title: 'General Questions',
            content: 'Basic questions and answers about how captcha works, security, performance, etc.'
          },
          'technical-issues': {
            title: 'Technical Issues',
            content: 'Provides solutions to common problems that may occur during implementation.'
          },
          'billing-support': {
            title: 'Billing & Support',
            content: 'You can check information about pricing plans, payment methods, technical support, etc.'
          }
        }
      }
    },
    '계정 관리 및 메트릭 API (엔터프라이즈)': {
      ko: {
        title: '계정 관리 및 메트릭 API (엔터프라이즈)',
        content: '엔터프라이즈 계정을 위한 고급 계정 관리 기능과 상세한 메트릭 API를 활용하세요.',
        sections: {
          'account-management': {
            title: '계정 관리',
            content: '팀 멤버 관리, 권한 설정, SSO 통합 등 엔터프라이즈급 계정 관리 기능을 제공합니다.'
          },
          'metrics-api': {
            title: '메트릭 API',
            content: '실시간 성능 지표, 사용량 통계, 보안 이벤트 등을 API를 통해 모니터링할 수 있습니다.'
          },
          'advanced-analytics': {
            title: '고급 분석',
            content: '봇 감지 패턴, 사용자 행동 분석, 위협 인텔리전스 등 심층적인 분석 데이터를 제공합니다.'
          }
        }
      },
      en: {
        title: 'Account Management and Metrics APIs (Enterprise)',
        content: 'Leverage advanced account management features and detailed metrics APIs for enterprise accounts.',
        sections: {
          'account-management': {
            title: 'Account Management',
            content: 'Provides enterprise-grade account management features including team member management, permission settings, SSO integration, etc.'
          },
          'metrics-api': {
            title: 'Metrics API',
            content: 'Monitor real-time performance indicators, usage statistics, security events, etc. through APIs.'
          },
          'advanced-analytics': {
            title: 'Advanced Analytics',
            content: 'Provides in-depth analytical data including bot detection patterns, user behavior analysis, threat intelligence, etc.'
          }
        }
      }
    },
    'reCAPTCHA에서 REAL로 전환': {
      ko: {
        title: 'reCAPTCHA에서 REAL로 전환',
        content: '기존 Google reCAPTCHA 구현을 REAL로 쉽게 전환하는 단계별 가이드를 확인하세요.',
        sections: {
          'migration-steps': {
            title: '마이그레이션 단계',
            content: '1. 기존 reCAPTCHA 코드 분석\n2. REAL API 키 발급\n3. 위젯 코드 교체\n4. 서버 사이드 검증 로직 수정\n5. 테스트 및 검증'
          },
          'api-compatibility': {
            title: 'API 호환성',
            content: 'REAL은 reCAPTCHA의 주요 API 메서드와 호환되므로 최소한의 코드 변경으로 전환이 가능합니다.'
          },
          'best-practices': {
            title: '모범 사례',
            content: '마이그레이션 과정에서 발생할 수 있는 문제를 방지하고 원활한 전환을 위한 모범 사례를 제공합니다.'
          }
        }
      },
      en: {
        title: 'Switch from reCAPTCHA to REAL',
        content: 'Check the step-by-step guide to easily migrate your existing Google reCAPTCHA implementation to REAL.',
        sections: {
          'migration-steps': {
            title: 'Migration Steps',
            content: '1. Analyze existing reCAPTCHA code\n2. Issue REAL API keys\n3. Replace widget code\n4. Modify server-side verification logic\n5. Test and validate'
          },
          'api-compatibility': {
            title: 'API Compatibility',
            content: 'REAL is compatible with reCAPTCHA\'s main API methods, so migration is possible with minimal code changes.'
          },
          'best-practices': {
            title: 'Best Practices',
            content: 'Provides best practices to prevent problems that may occur during migration and ensure smooth transition.'
          }
        }
      }
    },
    '모바일 앱 SDK': {
      ko: {
        title: '모바일 앱 SDK',
        content: 'iOS와 Android 모바일 애플리케이션에 REAL 캡차를 통합하는 방법을 알아보세요.',
        sections: {
          'ios-sdk': {
            title: 'iOS SDK',
            content: 'Swift와 Objective-C를 지원하는 iOS SDK를 제공합니다. CocoaPods, Swift Package Manager를 통한 설치를 지원합니다.'
          },
          'android-sdk': {
            title: 'Android SDK',
            content: 'Kotlin과 Java를 지원하는 Android SDK를 제공합니다. Gradle을 통한 의존성 관리와 Maven Central 배포를 지원합니다.'
          },
          'flutter-plugin': {
            title: 'Flutter 플러그인',
            content: '크로스 플랫폼 개발을 위한 Flutter 플러그인을 제공합니다. iOS와 Android를 동시에 지원합니다.'
          }
        }
      },
      en: {
        title: 'Mobile App SDKs',
        content: 'Learn how to integrate REAL captcha into iOS and Android mobile applications.',
        sections: {
          'ios-sdk': {
            title: 'iOS SDK',
            content: 'Provides iOS SDK supporting Swift and Objective-C. Supports installation through CocoaPods and Swift Package Manager.'
          },
          'android-sdk': {
            title: 'Android SDK',
            content: 'Provides Android SDK supporting Kotlin and Java. Supports dependency management through Gradle and Maven Central deployment.'
          },
          'flutter-plugin': {
            title: 'Flutter Plugin',
            content: 'Provides Flutter plugin for cross-platform development. Supports both iOS and Android simultaneously.'
          }
        }
      }
    },
    '통합': {
      ko: {
        title: '통합',
        content: '다양한 프레임워크와 플랫폼에 대한 REAL 캡차 통합 가이드를 확인하세요.',
        sections: {
          'react-integration': {
            title: 'React 통합',
            content: 'React 컴포넌트로 REAL 캡차를 쉽게 통합할 수 있습니다. Hooks와 함께 사용하여 상태 관리를 간소화합니다.'
          },
          'vue-integration': {
            title: 'Vue.js 통합',
            content: 'Vue.js 컴포넌트와 디렉티브를 통해 REAL 캡차를 통합합니다. Composition API와 Options API를 모두 지원합니다.'
          },
          'wordpress-plugin': {
            title: 'WordPress 플러그인',
            content: 'WordPress 사이트에 REAL 캡차를 쉽게 추가할 수 있는 플러그인을 제공합니다. 설정이 간단하고 관리가 용이합니다.'
          }
        }
      },
      en: {
        title: 'Integrations',
        content: 'Check REAL captcha integration guides for various frameworks and platforms.',
        sections: {
          'react-integration': {
            title: 'React Integration',
            content: 'Easily integrate REAL captcha as React components. Simplifies state management when used with Hooks.'
          },
          'vue-integration': {
            title: 'Vue.js Integration',
            content: 'Integrate REAL captcha through Vue.js components and directives. Supports both Composition API and Options API.'
          },
          'wordpress-plugin': {
            title: 'WordPress Plugin',
            content: 'Provides a plugin to easily add REAL captcha to WordPress sites. Simple setup and easy management.'
          }
        }
      }
    },
    'Pro 기능': {
      ko: {
        title: 'Pro 기능',
        content: 'Pro 계정에서 사용할 수 있는 고급 기능과 설정 옵션을 알아보세요.',
        sections: {
          'advanced-security': {
            title: '고급 보안',
            content: 'AI 기반 봇 감지, 행동 분석, 위협 인텔리전스 등 Pro 계정만의 고급 보안 기능을 제공합니다.'
          },
          'customization': {
            title: '사용자 정의',
            content: '브랜드에 맞는 완전한 커스터마이징, 사용자 정의 테마, 로고 변경 등을 지원합니다.'
          },
          'priority-support': {
            title: '우선 지원',
            content: 'Pro 계정 사용자를 위한 우선 기술 지원과 빠른 응답 시간을 보장합니다.'
          }
        }
      },
      en: {
        title: 'Pro Features',
        content: 'Learn about advanced features and configuration options available with Pro accounts.',
        sections: {
          'advanced-security': {
            title: 'Advanced Security',
            content: 'Provides advanced security features exclusive to Pro accounts such as AI-based bot detection, behavior analysis, and threat intelligence.'
          },
          'customization': {
            title: 'Customization',
            content: 'Supports complete customization for your brand, custom themes, logo changes, etc.'
          },
          'priority-support': {
            title: 'Priority Support',
            content: 'Ensures priority technical support and fast response times for Pro account users.'
          }
        }
      }
    },
    '엔터프라이즈 개요': {
      ko: {
        title: '엔터프라이즈 개요',
        content: '대규모 조직을 위한 REAL 캡차의 엔터프라이즈급 기능과 지원을 확인하세요.',
        sections: {
          'enterprise-features': {
            title: '엔터프라이즈 기능',
            content: 'SLA 보장, 전용 인프라, 고급 분석, 맞춤형 통합 등 엔터프라이즈급 서비스를 제공합니다.'
          },
          'compliance': {
            title: '규정 준수',
            content: 'GDPR, CCPA, SOC 2, ISO 27001 등 국제 보안 표준을 준수하여 데이터 보호를 보장합니다.'
          },
          'dedicated-support': {
            title: '전담 지원',
            content: '전담 계정 매니저와 24/7 기술 지원을 통해 비즈니스 연속성을 보장합니다.'
          }
        }
      },
      en: {
        title: 'Enterprise Overview',
        content: 'Check REAL captcha\'s enterprise-grade features and support for large organizations.',
        sections: {
          'enterprise-features': {
            title: 'Enterprise Features',
            content: 'Provides enterprise-grade services including SLA guarantees, dedicated infrastructure, advanced analytics, and custom integrations.'
          },
          'compliance': {
            title: 'Compliance',
            content: 'Ensures data protection by complying with international security standards such as GDPR, CCPA, SOC 2, and ISO 27001.'
          },
          'dedicated-support': {
            title: 'Dedicated Support',
            content: 'Ensures business continuity through dedicated account managers and 24/7 technical support.'
          }
        }
      }
    }
  };

  const tocItems = [
    'reCAPTCHA에서 전환하기',
    '기본 원칙',
    '요청 흐름',
    '콘텐츠 보안 정책 설정',
    '웹페이지에 REAL 위젯 추가하기',
    '서버 사이드에서 사용자 응답 확인하기',
    'Siteverify 오류 코드 테이블',
    'Siteverify 비밀키 순환하기',
    '로컬 개발',
    'TypeScript 타입',
    '설치 방법',
    '사용 방법',
    '통합 테스트: 테스트 키',
    '테스트 키 세트: 퍼블리셔 또는 Pro 계정',
    '테스트 키 세트: 엔터프라이즈 계정 (안전한 최종 사용자)',
    '테스트 키 세트: 엔터프라이즈 계정 (봇 감지)',
    '프론트엔드 테스트: 시각적 챌린지 강제하기',
    '백엔드 테스트: 거부된 토큰의 올바른 처리 보장하기',
    '다음 단계'
  ];

  return (
    <div className="document-page">
      {/* Top Header Bar */}
      <header className="docs-header">
        
        <div className="header-right">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="docs-search-input"
            />
          </div>
          <div className="header-controls">
            <div className={`language-selector ${isLanguageDropdownOpen ? 'dropdown-open' : ''}`} onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}>
              <span className="language-flag">{currentLanguage.flag}</span>
              <span className="language-name">{currentLanguage.name}</span>
              <span className="dropdown-arrow">▼</span>
              
              {isLanguageDropdownOpen && (
                <div className="language-dropdown">
                  {languages.map((language) => (
                    <div
                      key={language.code}
                      className={`language-option ${selectedLanguage === language.code ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLanguage(language.code);
                        setIsLanguageDropdownOpen(false);
                      }}
                    >
                      <span className="language-flag">{language.flag}</span>
                      <span className="language-name">{language.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link to="/faq" className="header-link">FAQ</Link>
            <button className="theme-toggle" onClick={toggleTheme}>
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </header>

      <div className="docs-container">
        {/* Left Sidebar */}
        <aside className="docs-sidebar">
          <div className="docs-sidebar-section">
            <div 
              className={`docs-sidebar-item ${selectedSidebarItem === 'Developer Guide' ? 'active' : ''}`}
              onClick={() => handleSidebarItemClick('Developer Guide')}
            >
              <FaHome className="docs-sidebar-icon" />
              Developer Guide
            </div>
            {sidebarItems.map((item, index) => (
              <div 
                key={index} 
                className={`docs-sidebar-item ${selectedSidebarItem === item ? 'active' : ''}`}
                onClick={() => handleSidebarItemClick(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="docs-main-content">
          <div className="docs-content-wrapper">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
              <FaHome className="breadcrumb-icon" />
              <span>{selectedSidebarItem}</span>
            </nav>

            {/* 선택된 사이드바 아이템에 따른 콘텐츠 표시 */}
            {(() => {
              const selectedContent = sidebarContent[selectedSidebarItem];
              if (!selectedContent) return null;
              
              const content = selectedContent[selectedLanguage];
              if (!content) return null;
              
              // Developer Guide인 경우 기존 콘텐츠 표시
              if (selectedSidebarItem === 'Developer Guide') {
                return (
                  <>
            {/* Main Title */}
                    <h1 className="main-title">{currentContent.mainTitle}</h1>

            {/* Introduction */}
            <p className="intro-text">
                      {currentContent.introText}
            </p>

            {/* Installation Info */}
            <p className="installation-text">
                      {currentContent.installationText}
            </p>

            {/* Framework Integrations */}
            <p className="framework-intro">
                      {currentContent.frameworkIntro}
            </p>

            {/* Framework Badges */}
            <div className="framework-badges">
              {frameworks.map((framework, index) => (
                <div key={index} className="framework-badge" style={{ '--framework-color': framework.color }}>
                  <framework.icon className="framework-icon" />
                  <span>{framework.name}</span>
                </div>
              ))}
            </div>

            <p className="integration-link">
                      {currentContent.integrationLink}
                    </p>

                    {/* 동적으로 섹션 렌더링 */}
                    {Object.entries(currentContent.sections).map(([key, section]) => (
                      <section key={key} id={key.replace(/-/g, '-')} className="content-section">
                        <h2 className="section-title">{section.title}</h2>
                        {Array.isArray(section.content) ? (
              <ol className="principles-list">
                            {section.content.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
              </ol>
                        ) : (
                          <p>{section.content}</p>
                        )}
            </section>
                    ))}
                  </>
                );
              }
              
              // 다른 사이드바 아이템인 경우 해당 콘텐츠 표시
              return (
                <>
                  {/* Main Title */}
                  <h1 className="main-title">{content.title}</h1>

                  {/* Introduction */}
                  <p className="intro-text">
                    {content.content}
                  </p>

                  {/* Sub-sections */}
                  {content.sections && Object.entries(content.sections).map(([key, section]) => (
                    <section key={key} id={key} className="content-section">
                      <h2 className="section-title">{section.title}</h2>
                      <p>{section.content}</p>
            </section>
                  ))}
                </>
              );
            })()}
          </div>
        </main>

        {/* Right Sidebar - Table of Contents */}
        <aside className="toc-sidebar">
          <div className="toc-container">
            <h3 className="toc-title">On this page</h3>
            <nav className="toc-nav">
              {(() => {
                const selectedContent = sidebarContent[selectedSidebarItem];
                if (!selectedContent) return null;
                
                const content = selectedContent[selectedLanguage];
                if (!content) return null;
                
                // Developer Guide인 경우 기존 TOC 표시
                if (selectedSidebarItem === 'Developer Guide') {
                  return tocItems.map((item, index) => {
                    const sectionKey = Object.keys(currentContent.sections).find(key => 
                      currentContent.sections[key].title === item
                    );
                    return (
                      <a 
                        key={index} 
                        href={`#${sectionKey || item.toLowerCase().replace(/\s+/g, '-')}`} 
                        className="toc-link"
                        onClick={(e) => {
                          e.preventDefault();
                          handleTocClick(item);
                        }}
                      >
                  {item}
                </a>
                    );
                  });
                }
                
                // 다른 사이드바 아이템인 경우 해당 섹션들의 TOC 표시
                if (content.sections) {
                  return Object.entries(content.sections).map(([key, section]) => (
                    <a 
                      key={key} 
                      href={`#${key}`} 
                      className="toc-link"
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(key);
                        if (element) {
                          element.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                          });
                        }
                      }}
                    >
                      {section.title}
                    </a>
                  ));
                }
                
                return null;
              })()}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DocumentPage; 