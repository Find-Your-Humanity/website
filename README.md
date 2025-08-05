# REAL CAPTCHA - 공식 웹사이트

AI 기반 이미지 분류 CAPTCHA 서비스 **REAL**의 공식 웹사이트입니다.

## 🌟 프로젝트 소개

REAL은 딥러닝 기반 이미지 분류와 행동 패턴 분석을 통해 사람은 자연스럽게 풀 수 있고, 봇은 통과하기 어려운 맞춤형 CAPTCHA 서비스를 제공합니다.

### ✨ 주요 특징 (임시)

- **AI 기반 이미지 분류**: 딥러닝을 활용한 정교한 CAPTCHA 생성
- **99.9% 봇 차단률**: 높은 보안성과 정확도
- **0.5초 평균 응답시간**: 빠른 처리 속도
- **사용자 친화적**: 직관적이고 쉬운 인터페이스
- **실시간 분석**: 행동 패턴 기반 봇 탐지

## 🛠️ 기술 스택

- **Frontend**: React 19.1.0
- **Build Tool**: Vite 7.0.6
- **Routing**: React Router DOM 7.7.1
- **Icons**: React Icons 5.5.0
- **Styling**: CSS3 (모듈화)
- **Linting**: ESLint 9.30.1

## 📁 프로젝트 구조

```
frontend/website/
├── public/                    # 정적 파일
│   ├── logo.png              # 메인 로고
│   ├── real-logo.png         # REAL 브랜드 로고
│   ├── signin-illustration.svg # 로그인 일러스트
│   ├── signup-illustration.svg # 회원가입 일러스트
│   └── google-icon.png       # Google 아이콘
├── src/
│   ├── components/           # 공통 컴포넌트
│   │   ├── Header.jsx        # 헤더 컴포넌트
│   │   ├── Header.css
│   │   ├── Footer.jsx        # 푸터 컴포넌트
│   │   └── Footer.css
│   ├── layouts/              # 레이아웃 컴포넌트
│   │   ├── MainLayout.jsx    # 메인 레이아웃
│   │   └── MainLayout.css
│   ├── pages/                # 페이지 컴포넌트
│   │   ├── HomePage.jsx      # 홈페이지
│   │   ├── HomePage.css
│   │   ├── ProductsPage.jsx  # 제품 소개
│   │   ├── ProductsPage.css
│   │   ├── DocumentPage.jsx  # 문서/API
│   │   ├── DocumentPage.css
│   │   ├── CompanyPage.jsx   # 회사 소개
│   │   ├── CompanyPage.css
│   │   ├── SignInPage.jsx    # 로그인
│   │   ├── SignInPage.css
│   │   ├── SignUpPage.jsx    # 회원가입
│   │   └── SignUpPage.css
│   ├── App.jsx               # 메인 앱 컴포넌트
│   ├── App.css
│   ├── main.jsx              # 진입점
│   └── index.css             # 글로벌 스타일
├── index.html                # HTML 템플릿
├── package.json              # 의존성 관리
├── vite.config.js            # Vite 설정
└── eslint.config.js          # ESLint 설정
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 실행되면 `http://localhost:5173`에서 웹사이트를 확인할 수 있습니다.

### 3. 빌드

```bash
npm run build
```

### 4. 프리뷰

```bash
npm run preview
```

### 5. 코드 검사

```bash
npm run lint
```

## 📱 페이지 구성

- **홈페이지** (`/`): REAL 서비스 소개 및 주요 기능
- **제품** (`/products`): CAPTCHA 서비스 상세 정보 및 데모
- **문서** (`/document`): API 문서 및 개발자 가이드
- **회사** (`/company`): 팀 소개 및 회사 정보
- **로그인** (`/signin`): 사용자 로그인
- **회원가입** (`/signup`): 새 사용자 등록

## 🎨 디자인 시스템

### 컬러 팔레트
- Primary: REAL 브랜드 컬러
- Secondary: 보조 컬러
- Neutral: 회색 톤 팔레트

### 타이포그래피
- 한글 폰트 지원
- 반응형 텍스트 크기
- 접근성 고려한 대비율

## 📊 성능 최적화

- Vite의 빠른 번들링
- 코드 스플리팅으로 초기 로딩 최적화
- 이미지 최적화
- CSS 모듈화로 스타일 격리

## 🔧 개발 환경 설정

### Node.js 버전
- Node.js 18+ 권장

### IDE 설정
- VS Code 권장
- ESLint 확장 프로그램 설치 권장

### 환경 변수
개발 시 필요한 환경 변수는 `.env.local` 파일에 설정:

```env
VITE_API_URL=your_api_url_here
VITE_CAPTCHA_SITE_KEY=your_site_key_here
```

## 📄 라이선스

이 프로젝트는 [MIT License](LICENSE)를 따릅니다.

---

© 2024 REAL CAPTCHA. All rights reserved.