# feat(dashboard): 네이티브 대시보드 웹사이트 통합 · 결제 결과 오버레이 · 레거시 리디렉션

## 요약
- 네이티브 대시보드를 웹사이트에 통합하고 역할 기반 라우팅(/app/*, /admin/*)을 적용했습니다.
- 레거시 접근은 `/old-dashboard`로 유지하며, `/dashboard` 진입 시 역할 기반 목적지로 리디렉션합니다.
- 결제 UX를 개선하여 PaymentSuccess/Fail를 별도 페이지 이동 대신 오버레이 팝업으로 표시합니다.
- Analytics 화면에 오류 유형/성능/사용자 지표 섹션을 추가하여 가시성을 높였습니다.

## 주요 변경 사항
- 라우팅/가드
  - 네이티브 경로: `/app/dashboard|analytics|billing|api-keys|settings`, `/admin/dashboard|analytics|users|plans|requests|request-status|settings`
  - 인증 가드: RequireAuth / RequireAdmin
  - RedirectLegacy로 `/dashboard*`, `/payment/*`를 신규 체계로 연결
- 셸/레이아웃
  - 대시보드 전용 MUI 테마 스코프(DashboardShell + Sidebar/Layout)로 사이트 전역 테마와 충돌 방지
- 서비스/구성/타입
  - apiClient(withCredentials + 401→refresh), authService, dashboardService 정비
  - apiKeys/users/billing 서비스 추가
- 결제 UX
  - PaymentResultOverlay: from=dashboard 흐름에서 성공/실패 결과를 모달로 표시
  - PaymentModal: 내부 리디렉션을 `/app/billing?pay=success|fail&from=dashboard`로 일원화
- Analytics
  - 오류 유형 분석, 성능/사용자 지표 섹션 추가로 대시보드와 동등(parity)에 근접

## 레거시 처리
- `/dashboard` → (역할 기반) `/app/dashboard` 또는 `/admin/dashboard`로 리디렉션
- 전환 기간 동안 `/old-dashboard`에서 기존 iframe 접근 유지

## 빌드/린트
- Vite 빌드: 성공(번들 크기 경고만 존재)
- 기존 린트 경고/에러 일부는 레거시 파일 이슈(이번 PR 범위 밖)

## 테스트 노트
1) 인증: 일반 사용자 → `/app/dashboard`, 관리자 → `/admin/dashboard`
2) 결제: 플랜 변경 → 성공/실패 시 오버레이로 표시, 닫으면 `/app/billing` 복귀
3) 레거시: `/dashboard*` 진입 시 리디렉션; `/old-dashboard` 직접 접근 가능
4) Analytics: 기간 필터 정상 동작 및 신규 섹션 렌더링 확인

## 호환성
- API 변경 없음. `/old-dashboard` 유지로 단계적 롤아웃 가능
- 리디렉션을 통해 기존 딥링크 영향 최소화

## 리스크 & 완화
- 테마 충돌 → 대시보드 테마를 지역 스코프로 격리
- 결제 오버레이 회귀 → `/pay` 경로 유지로 우회 가능
- 롤백 전략 → `/old-dashboard` 경로 상시 유지

## 체크리스트
- [x] 라우팅/가드 적용
- [x] 결제 오버레이 적용
- [x] Analytics 섹션 보강
- [x] 빌드 성공
- [ ] 리뷰어 스모크 테스트
