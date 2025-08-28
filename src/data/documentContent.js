// 한국어 콘텐츠
export const koreanContent = {
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
export const englishContent = {
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
