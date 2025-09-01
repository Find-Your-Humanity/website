// 언어별 사이드바 아이템 목록
export const sidebarItems = {
  ko: [
    'api_key_usage_guide',
    '설정',
    'invisible_captcha',
    'custom_theme',
    'language_codes',
    'enterprise_account_management',
    'recaptcha_migration',
    'mobile_sdk',
    '통합',
    'pro_features',
    'enterprise_overview'
  ],
  en: [
    'api_key_usage_guide',
    '설정',
    'invisible_captcha',
    'custom_theme',
    'language_codes',
    'enterprise_account_management',
    'recaptcha_migration',
    'mobile_sdk',
    '통합',
    'pro_features',
    'enterprise_overview'
  ]
};

// 언어별 사이드바 표시 이름
export const sidebarDisplayNames = {
  ko: {
    'developer_guide': '개발자 가이드',
    'api_key_usage_guide': 'API 키 사용 가이드',
    '설정': '설정',
    'invisible_captcha': '보이지 않는 캡차',
    'custom_theme': '사용자 정의 테마',
    'language_codes': '언어 코드',
    'enterprise_account_management': '엔터프라이즈 계정 관리',
    'recaptcha_migration': 'reCAPTCHA에서 전환',
    'mobile_sdk': '모바일 SDK',
    '통합': '프레임워크 통합',
    'pro_features': 'Pro 기능',
    'enterprise_overview': '엔터프라이즈 개요'
  },
  en: {
    'developer_guide': 'Developer Guide',
    'api_key_usage_guide': 'API Key Usage Guide',
    '설정': 'Configuration',
    'invisible_captcha': 'Invisible Captcha',
    'custom_theme': 'Custom Theme',
    'language_codes': 'Language Codes',
    'enterprise_account_management': 'Enterprise Account Management',
    'recaptcha_migration': 'reCAPTCHA Migration',
    'mobile_sdk': 'Mobile SDK',
    '통합': 'Framework Integrations',
    'pro_features': 'Pro Features',
    'enterprise_overview': 'Enterprise Overview'
  }
};

// 사이드바 콘텐츠 데이터
export const sidebarContent = {
  'developer_guide': {
    ko: {
      title: '개발자 가이드',
      content: 'REAL 캡차를 사용하여 웹사이트를 보호하는 방법을 알아보세요.',
      sections: {
        'introduction': {
          title: '소개',
          content: 'REAL은 봇, 스팸 및 기타 자동화된 악용으로부터 애플리케이션을 보호하는 데 도움을 줄 수 있습니다.'
        },
        'basic-principles': {
          title: '기본 원칙',
          content: '1. 사이트에 REAL 위젯을 임베드합니다. 예를 들어 로그인 폼에 배치합니다.\n2. 위젯은 사용자가 인간임을 증명하도록 도전합니다.\n3. 완료 시 REAL은 응답 토큰을 제공합니다.\n4. 서버에서 토큰을 확인하여 유효성을 검증합니다.\n5. 유효한 경우 사용자가 의도한 작업을 진행할 수 있도록 허용합니다.'
        },
        'installation': {
          title: '설치 방법',
          content: 'SDK 설치는 빠르고 간단합니다. HTML/서버 사이드 코드 또는 네이티브 도구를 사용할 수 있습니다.'
        },
        'usage': {
          title: '사용 방법',
          content: '많은 프레임워크에 대한 플러그인과 코드 예제를 사용할 수 있습니다.'
        }
      }
    },
    en: {
      title: 'Developer Guide',
      content: 'Learn how to protect your website using REAL captcha.',
      sections: {
        'introduction': {
          title: 'Introduction',
          content: 'REAL can help protect your applications from bots, spam, and other forms of automated abuse.'
        },
        'basic-principles': {
          title: 'Basic Principles',
          content: '1. You embed the REAL widget on your site. For example, on a login form.\n2. The widget challenges the user to prove they are human.\n3. Upon completion, REAL provides a response token.\n4. You verify the token on your server to ensure it\'s valid.\n5. If valid, you allow the user to proceed with their intended action.'
        },
        'installation': {
          title: 'Installation',
          content: 'SDK installation is fast and easy. You can use HTML/server-side code or native tools.'
        },
        'usage': {
          title: 'Usage',
          content: 'Plugins and code examples are available for many frameworks.'
        }
      }
    }
  },
  'api_key_usage_guide': {
    ko: {
      title: 'API 키 사용 가이드',
      content: '발급받은 API 키와 Secret 키를 사용하여 REAL 캡차를 웹사이트에 통합하는 방법을 단계별로 알아보세요.',
      sections: {
        'api-key-overview': {
          title: 'API 키 개요',
          content: 'API 키는 프론트엔드에서 위젯을 렌더링하는 데 사용되고, Secret 키는 서버 사이드에서 토큰을 검증하는 데 사용됩니다. 두 키 모두 안전하게 보관해야 합니다.'
        },
        'frontend-integration': {
          title: '프론트엔드 통합',
          content: '1. HTML에 REAL 스크립트 추가\n2. 위젯 컨테이너 생성\n3. API 키로 위젯 초기화\n4. 콜백 함수 설정'
        },
        'backend-verification': {
          title: '백엔드 검증',
          content: '프론트엔드에서 받은 토큰을 서버에서 검증하는 방법입니다. Node.js, Python, PHP 등 다양한 언어로 구현할 수 있습니다.'
        }
      }
    },
    en: {
      title: 'API Key Usage Guide',
      content: 'Learn how to integrate REAL captcha into your website using your issued API key and Secret key step by step.',
      sections: {
        'api-key-overview': {
          title: 'API Key Overview',
          content: 'The API key is used to render widgets on the frontend, and the Secret key is used to verify tokens on the server side. Both keys must be kept secure.'
        },
        'frontend-integration': {
          title: 'Frontend Integration',
          content: '1. Add REAL script to HTML\n2. Create widget container\n3. Initialize widget with API key\n4. Set callback functions'
        },
        'backend-verification': {
          title: 'Backend Verification',
          content: 'How to verify tokens received from the frontend on the server. Can be implemented in various languages such as Node.js, Python, PHP, etc.'
        }
      }
    }
  },
  '설정': {
    ko: {
      title: '설정',
      content: 'REAL 캡차의 기본 설정과 고급 옵션을 구성하는 방법을 알아보세요.',
      sections: {
        'basic-configuration': {
          title: '기본 설정',
          content: 'API 키 설정, 위젯 테마, 크기, 언어 등 기본적인 설정 방법을 안내합니다.'
        },
        'advanced-configuration': {
          title: '고급 설정',
          content: '커스텀 테마, 콜백 함수, 성능 최적화 등 고급 설정 옵션을 설명합니다.'
        },
        'security-settings': {
          title: '보안 설정',
          content: '도메인 제한, API 키 보안, HTTPS 설정 등 보안 관련 설정을 안내합니다.'
        }
      }
    },
    en: {
      title: 'Configuration',
      content: 'Learn how to configure basic settings and advanced options for REAL captcha.',
      sections: {
        'basic-configuration': {
          title: 'Basic Configuration',
          content: 'Guide to basic setup methods such as API key configuration, widget theme, size, language, etc.'
        },
        'advanced-configuration': {
          title: 'Advanced Configuration',
          content: 'Explains advanced configuration options such as custom themes, callback functions, performance optimization, etc.'
        },
        'security-settings': {
          title: 'Security Settings',
          content: 'Guide to security-related settings such as domain restrictions, API key security, HTTPS configuration, etc.'
        }
      }
    }
  },
  'invisible_captcha': {
    ko: {
      title: '보이지 않는 캡차',
      content: '사용자에게 보이지 않으면서도 효과적인 봇 방지 기능을 제공하는 invisible 캡차 구현 방법을 알아보세요.',
      sections: {
        'concept': {
          title: '개념',
          content: 'Invisible 캡차는 사용자 경험을 방해하지 않으면서도 봇을 효과적으로 차단하는 기술입니다.'
        },
        'implementation': {
          title: '구현 방법',
          content: 'JavaScript 이벤트 리스너를 사용하여 사용자 행동을 분석하고 자동으로 캡차를 활성화하는 방법을 설명합니다.'
        },
        'use-cases': {
          title: '사용 사례',
          content: '로그인 폼, 댓글 시스템, 파일 업로드 등 다양한 상황에서 invisible 캡차를 적용하는 방법을 제시합니다.'
        }
      }
    },
    en: {
      title: 'Invisible Captcha',
      content: 'Learn how to implement invisible captcha that provides effective bot protection without being visible to users.',
      sections: {
        'concept': {
          title: 'Concept',
          content: 'Invisible captcha is a technology that effectively blocks bots without interfering with user experience.'
        },
        'implementation': {
          title: 'Implementation',
          content: 'Explains how to use JavaScript event listeners to analyze user behavior and automatically activate captcha.'
        },
        'use-cases': {
          title: 'Use Cases',
          content: 'Presents methods for applying invisible captcha in various situations such as login forms, comment systems, file uploads, etc.'
        }
      }
    }
  },
  'custom_theme': {
    ko: {
      title: '사용자 정의 테마',
      content: '웹사이트의 디자인과 일치하도록 REAL 캡차 위젯의 테마를 커스터마이징하는 방법을 알아보세요.',
      sections: {
        'theme-options': {
          title: '테마 옵션',
          content: '기본 제공되는 light, dark 테마와 완전히 커스텀 가능한 테마 옵션을 소개합니다.'
        },
        'css-customization': {
          title: 'CSS 커스터마이징',
          content: 'CSS를 사용하여 위젯의 색상, 폰트, 크기, 모양 등을 자유롭게 변경하는 방법을 설명합니다.'
        },
        'responsive-design': {
          title: '반응형 디자인',
          content: '모바일과 데스크톱에서 모두 잘 작동하는 반응형 테마를 만드는 방법을 안내합니다.'
        }
      }
    },
    en: {
      title: 'Custom Theme',
      content: 'Learn how to customize the REAL captcha widget theme to match your website design.',
      sections: {
        'theme-options': {
          title: 'Theme Options',
          content: 'Introduces the default light and dark themes and fully customizable theme options.'
        },
        'css-customization': {
          title: 'CSS Customization',
          content: 'Explains how to freely change widget colors, fonts, sizes, shapes, etc. using CSS.'
        },
        'responsive-design': {
          title: 'Responsive Design',
          content: 'Guide to creating responsive themes that work well on both mobile and desktop.'
        }
      }
    }
  },
  'language_codes': {
    ko: {
      title: '언어 코드',
      content: 'REAL 캡차에서 지원하는 언어와 지역화 옵션에 대한 안내입니다.',
      sections: {
        'supported-languages': {
          title: '지원 언어',
          content: '한국어(ko), 영어(en), 일본어(ja), 중국어(zh) 등 다양한 언어를 지원합니다.'
        },
        'localization': {
          title: '지역화',
          content: '사용자의 브라우저 언어 설정에 따라 자동으로 언어를 변경하는 방법을 설명합니다.'
        },
        'custom-translations': {
          title: '커스텀 번역',
          content: '지원되지 않는 언어에 대해 사용자 정의 번역을 추가하는 방법을 안내합니다.'
        }
      }
    },
    en: {
      title: 'Language Codes',
      content: 'Guide to languages supported by REAL captcha and localization options.',
      sections: {
        'supported-languages': {
          title: 'Supported Languages',
          content: 'Supports various languages including Korean (ko), English (en), Japanese (ja), Chinese (zh), etc.'
        },
        'localization': {
          title: 'Localization',
          content: 'Explains how to automatically change language based on user browser language settings.'
        },
        'custom-translations': {
          title: 'Custom Translations',
          content: 'Guide to adding custom translations for unsupported languages.'
        }
      }
    }
  },
  'enterprise_account_management': {
    ko: {
      title: '엔터프라이즈 계정 관리',
      content: '대규모 조직을 위한 REAL 캡차 엔터프라이즈 계정 관리 및 메트릭 API 안내입니다.',
      sections: {
        'account-management': {
          title: '계정 관리',
          content: '다중 사용자 계정, 역할 기반 접근 제어, 조직 구조 관리 등 엔터프라이즈급 계정 관리 기능을 설명합니다.'
        },
        'metrics-api': {
          title: '메트릭 API',
          content: '사용량 통계, 성능 모니터링, 보안 이벤트 등을 추적할 수 있는 API를 제공합니다.'
        },
        'billing-management': {
          title: '결제 관리',
          content: '대량 할인, 연간 계약, 사용량 기반 과금 등 엔터프라이즈 결제 옵션을 안내합니다.'
        }
      }
    },
    en: {
      title: 'Enterprise Account Management',
      content: 'Guide to REAL captcha enterprise account management and metrics API for large organizations.',
      sections: {
        'account-management': {
          title: 'Account Management',
          content: 'Explains enterprise-level account management features such as multi-user accounts, role-based access control, organizational structure management, etc.'
        },
        'metrics-api': {
          title: 'Metrics API',
          content: 'Provides APIs to track usage statistics, performance monitoring, security events, etc.'
        },
        'billing-management': {
          title: 'Billing Management',
          content: 'Guide to enterprise billing options such as volume discounts, annual contracts, usage-based billing, etc.'
        }
      }
    }
  },
  'recaptcha_migration': {
    ko: {
      title: 'reCAPTCHA에서 전환',
      content: '기존 Google reCAPTCHA를 사용하고 있다면, REAL 캡차로 쉽게 전환할 수 있습니다.',
      sections: {
        'migration-reasons': {
          title: '전환 이유',
          content: '성능 향상, 사용자 경험 개선, API 호환성, 보안 강화 등 전환의 장점을 설명합니다.'
        },
        'migration-steps': {
          title: '전환 단계',
          content: 'API 키 발급부터 코드 변경, 테스트까지 단계별 전환 가이드를 제공합니다.'
        },
        'compatibility': {
          title: '호환성',
          content: 'REAL이 reCAPTCHA의 주요 API와 호환되도록 설계되어 있어 기존 코드를 최소한으로 수정할 수 있습니다.'
        }
      }
    },
    en: {
      title: 'reCAPTCHA Migration',
      content: 'If you are currently using Google reCAPTCHA, you can easily transition to REAL captcha.',
      sections: {
        'migration-reasons': {
          title: 'Migration Reasons',
          content: 'Explains the benefits of migration such as performance improvement, better user experience, API compatibility, enhanced security, etc.'
        },
        'migration-steps': {
          title: 'Migration Steps',
          content: 'Provides step-by-step migration guide from API key issuance to code changes and testing.'
        },
        'compatibility': {
          title: 'Compatibility',
          content: 'REAL is designed to be compatible with reCAPTCHA\'s main APIs, allowing you to modify existing code minimally.'
        }
      }
    }
  },
  'mobile_sdk': {
    ko: {
      title: '모바일 SDK',
      content: 'iOS 및 Android 애플리케이션에 REAL 캡차를 통합하여 포괄적인 봇 방지 기능을 제공합니다.',
      sections: {
        'ios-sdk': {
          title: 'iOS SDK',
          content: 'Swift와 Objective-C를 지원하는 네이티브 iOS SDK의 설치 및 사용 방법을 안내합니다.'
        },
        'android-sdk': {
          title: 'Android SDK',
          content: 'Kotlin과 Java를 지원하는 네이티브 Android SDK의 설치 및 사용 방법을 설명합니다.'
        },
        'cross-platform': {
          title: '크로스 플랫폼',
          content: 'React Native, Flutter 등 크로스 플랫폼 프레임워크에서 REAL 캡차를 사용하는 방법을 제시합니다.'
        }
      }
    },
    en: {
      title: 'Mobile SDK',
      content: 'Integrate REAL captcha into iOS and Android applications to provide comprehensive bot protection.',
      sections: {
        'ios-sdk': {
          title: 'iOS SDK',
          content: 'Guide to installation and usage of native iOS SDK that supports Swift and Objective-C.'
        },
        'android-sdk': {
          title: 'Android SDK',
          content: 'Explains installation and usage of native Android SDK that supports Kotlin and Java.'
        },
        'cross-platform': {
          title: 'Cross Platform',
          content: 'Presents methods for using REAL captcha in cross-platform frameworks such as React Native, Flutter, etc.'
        }
      }
    }
  },
  '통합': {
    ko: {
      title: '프레임워크 통합',
      content: '인기 있는 웹 프레임워크와 플랫폼에 REAL 캡차를 통합하는 포괄적인 가이드입니다.',
      sections: {
        'frontend-frameworks': {
          title: '프론트엔드 프레임워크',
          content: 'React, Vue.js, Angular 등 주요 프론트엔드 프레임워크에서의 통합 방법을 설명합니다.'
        },
        'backend-frameworks': {
          title: '백엔드 프레임워크',
          content: 'Node.js, Python, PHP 등 다양한 백엔드 언어와 프레임워크에서의 검증 방법을 안내합니다.'
        },
        'cms-platforms': {
          title: 'CMS 플랫폼',
          content: 'WordPress, Shopify, Laravel 등 인기 있는 CMS와 플랫폼에서의 통합 방법을 제시합니다.'
        }
      }
    },
    en: {
      title: 'Framework Integrations',
      content: 'Comprehensive guide for integrating REAL captcha with popular web frameworks and platforms.',
      sections: {
        'frontend-frameworks': {
          title: 'Frontend Frameworks',
          content: 'Explains integration methods in major frontend frameworks such as React, Vue.js, Angular, etc.'
        },
        'backend-frameworks': {
          title: 'Backend Frameworks',
          content: 'Guide to verification methods in various backend languages and frameworks such as Node.js, Python, PHP, etc.'
        },
        'cms-platforms': {
          title: 'CMS Platforms',
          content: 'Presents integration methods in popular CMS and platforms such as WordPress, Shopify, Laravel, etc.'
        }
      }
    }
  },
  'pro_features': {
    ko: {
      title: 'Pro 기능',
      content: 'Pro 계정 전용으로 제공되는 고급 캡차 보호 및 커스터마이징 옵션에 대한 개요입니다.',
      sections: {
        'advanced-protection': {
          title: '고급 보호',
          content: '머신러닝 기반 행동 분석, 적응형 챌린지, 위험 기반 점수 등 고급 봇 탐지 기능을 제공합니다.'
        },
        'enhanced-analytics': {
          title: '향상된 분석',
          content: '실시간 모니터링, 고급 보고서, 보안 인사이트 등 상세한 분석 도구를 제공합니다.'
        },
        'customization-options': {
          title: '커스터마이징 옵션',
          content: '고급 테마, 다중 위젯, 조건부 표시 등 확장된 커스터마이징 옵션을 제공합니다.'
        }
      }
    },
    en: {
      title: 'Pro Features',
      content: 'Overview of advanced captcha protection and customization options exclusively available to Pro accounts.',
      sections: {
        'advanced-protection': {
          title: 'Advanced Protection',
          content: 'Provides advanced bot detection features such as machine learning-based behavioral analysis, adaptive challenges, risk-based scoring, etc.'
        },
        'enhanced-analytics': {
          title: 'Enhanced Analytics',
          content: 'Provides detailed analytics tools such as real-time monitoring, advanced reporting, security insights, etc.'
        },
        'customization-options': {
          title: 'Customization Options',
          content: 'Provides extended customization options such as advanced themes, multiple widgets, conditional display, etc.'
        }
      }
    }
  },
  'enterprise_overview': {
    ko: {
      title: '엔터프라이즈 개요',
      content: '대규모 조직을 위한 REAL 캡차 엔터프라이즈 기능의 개요입니다.',
      sections: {
        'enterprise-features': {
          title: '엔터프라이즈 기능',
          content: '다중 테넌트, SSO 통합, 고급 보안, 규정 준수 등 엔터프라이즈급 기능을 제공합니다.'
        },
        'scalability': {
          title: '확장성',
          content: '수백만 건의 요청을 처리할 수 있는 고성능 아키텍처와 자동 확장 기능을 제공합니다.'
        },
        'support-services': {
          title: '지원 서비스',
          content: '전담 계정 관리자, 24/7 지원, 맞춤형 통합 서비스 등 프리미엄 지원을 제공합니다.'
        }
      }
    },
    en: {
      title: 'Enterprise Overview',
      content: 'Overview of REAL captcha enterprise features for large organizations.',
      sections: {
        'enterprise-features': {
          title: 'Enterprise Features',
          content: 'Provides enterprise-level features such as multi-tenancy, SSO integration, advanced security, compliance, etc.'
        },
        'scalability': {
          title: 'Scalability',
          content: 'Provides high-performance architecture and auto-scaling capabilities that can handle millions of requests.'
        },
        'support-services': {
          title: 'Support Services',
          content: 'Provides premium support such as dedicated account managers, 24/7 support, custom integration services, etc.'
        }
      }
    }
  }
};
