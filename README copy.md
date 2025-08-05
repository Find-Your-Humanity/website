# REAL CAPTCHA Landing Page

이미지 기반 AI CAPTCHA 서비스 "REAL"의 랜딩 페이지입니다.

## 기술 스택

- React 18
- Vite
- React Router DOM
- HTML5
- CSS3

## 주요 기능

- 반응형 디자인
- 모던한 UI/UX
- 한국어 콘텐츠 지원
- 호버 효과 및 애니메이션
- 컴포넌트 기반 아키텍처
- 라우팅 시스템

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── Header.jsx      # 헤더 컴포넌트
│   ├── Header.css      # 헤더 스타일
│   ├── Footer.jsx      # 푸터 컴포넌트
│   └── Footer.css      # 푸터 스타일
├── layouts/            # 레이아웃 컴포넌트
│   ├── MainLayout.jsx  # 메인 레이아웃
│   └── MainLayout.css  # 레이아웃 스타일
├── pages/              # 페이지 컴포넌트
│   ├── HomePage.jsx    # 홈페이지
│   ├── HomePage.css    # 홈페이지 스타일
│   ├── ProductsPage.jsx # 제품 페이지
│   └── ProductsPage.css # 제품 페이지 스타일
├── App.jsx             # 메인 앱 컴포넌트
├── App.css             # 전역 스타일
├── index.css           # 기본 스타일
└── main.jsx            # 앱 진입점
```

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하세요.

### 빌드

```bash
npm run build
```

### 미리보기

```bash
npm run preview
```

## 페이지 구조

- **홈페이지 (`/`)**: 메인 랜딩 페이지
- **제품 페이지 (`/products`)**: 제품 소개 페이지

## 컴포넌트 특징

### 공통 컴포넌트
- **Header**: 네비게이션과 로고
- **Footer**: 회사 정보와 링크
- **MainLayout**: 헤더와 푸터를 포함한 기본 레이아웃

### 페이지 컴포넌트
- **HomePage**: 히어로 섹션, 메인 콘텐츠, 기능 소개
- **ProductsPage**: 제품 카드 그리드

## 디자인 특징

- 흰색 배경에 검은색 텍스트
- 연한 노란색-초록색 (#DFFF00) 액센트 색상
- 깔끔하고 모던한 폰트
- 반응형 그리드 레이아웃
- 컴포넌트별 스타일 분리
