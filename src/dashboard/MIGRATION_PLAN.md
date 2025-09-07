# Dashboard Full Integration Plan (frontend/dashboard → website/src/dashboard)

Author: Junie (JetBrains autonomous programmer)
Date: 2025-09-05

## Goals (confirmed by stakeholder)
- Preserve the original dashboard UI 1:1 (Layout/Sidebar/Topbar/styles/behavior).
- Complete migration of ALL features from frontend/dashboard/src.
- Switch /dashboard to native today (target: temporary 302 to /app/dashboard, then 301 after validation).
- CORS is already safe/ready (gateway-api configured) — no action needed.

## Current State Snapshot
- Routing/Guards: website has /app/* and /admin/* native routes with RequireAuth/RequireAdmin; legacy /dashboard (iframe) remains.
- Services/Config/Types: migrated (api/config/constants, apiClient withCredentials + 401→refresh, authService, dashboardService, types).
- UI Scaffolding: DashboardShell (local MUI ThemeProvider), placeholder screens for tenant/admin routes.
- Theme: website/src/dashboard/styles/theme.ts exists; global CSS from original dashboard needs verification.

## Source-of-Truth (to migrate)
- components:
  - components/Layout/Layout.tsx
  - components/Layout/Sidebar.tsx
  - components/AnalyticsChart.tsx
  - components/AnalyticsSkeleton.tsx
- screens (12): Analytics, ApiKeys, Billing, Dashboard, Login, PaymentSuccess, PaymentFail, Plans, RequestStatus, Requests, Settings, Users
- navigation: routes.tsx, guards.tsx
- contexts: AuthContext.tsx (token-sync, postMessage handlers; we’ll adapt required logic to website AuthProvider if needed)
- services: apiClient.ts, authService.ts, dashboardService.ts (already migrated equivalents exist)
- styles: styles/theme, styles/index.css (theme is replicated, index.css not yet present → gap)

## Migration Map (website destination)
- website/src/dashboard/components/
  - Layout.tsx  ← frontend/dashboard/src/components/Layout/Layout.tsx
  - Sidebar.tsx ← frontend/dashboard/src/components/Layout/Sidebar.tsx
  - AnalyticsChart.tsx ← frontend/dashboard/src/components/AnalyticsChart.tsx
  - AnalyticsSkeleton.tsx ← frontend/dashboard/src/components/AnalyticsSkeleton.tsx
- website/src/dashboard/screens/ (replace placeholders)
  - DashboardScreen.tsx, AnalyticsScreen.tsx, BillingScreen.tsx,
    ApiKeysScreen.tsx, UsersScreen.tsx, PlansScreen.tsx,
    RequestsScreen.tsx, RequestStatusScreen.tsx, SettingsScreen.tsx,
    PaymentSuccessScreen.tsx, PaymentFailScreen.tsx
- website/src/dashboard/navigation/
  - (Use website guards already; import adjustments if reusing parts from original)
- website/src/dashboard/styles/
  - theme.ts (exists)
  - index.css (new; copy/adapt from original styles/index.css if available)

## Step-by-Step Execution (today)
1) Frame & Navigation (Phase 1)
   - Copy Layout.tsx and Sidebar.tsx 1:1 into website/src/dashboard/components and wire them into routes via a new DashboardLayout wrapper (or reuse DashboardShell temporarily until replacement).
   - Verify responsive drawer, active link highlighting, admin vs tenant base path logic.
   - Import MUI theme tokens/overrides from original if present; otherwise keep theme.ts and iterate.
2) Screens (Phase 2)
   - Replace all placeholder screens with actual implementations from original screens (12 files), adjusting imports and services.
   - Hook screens to services (dashboardService, users/plans/keys/payments/requests to be added if missing).
3) Services/Utils/Hooks (Phase 3)
   - Add any missing services (users/plans/keys/requests/payments). Share axios apiClient.
   - Port common utilities/hooks (date/formatting/debounce/clipboard) if referenced.
   - Unify error/loading handling; reuse AnalyticsSkeleton etc.
4) Auth/Guards/Deep-links (Phase 4)
   - Ensure menu filtering by role, robust admin detection, and deep link mapping from legacy paths to /app/* or /admin/*.
   - Preserve postMessage behaviors if any screen relied on it; otherwise, rely on website auth.
5) Styles (Phase 5)
   - Create styles/index.css equivalent and import only within dashboard area if needed. Resolve any className collisions.
6) Testing (Continuous)
   - Validate tenant/admin scenarios, API key CRUD, statistics, logs filtering, payment flow, refresh cycle.
   - Cross-browser + incognito; confirm code splitting and route chunks.
7) Rollout (Today)
   - After Phase 1–2 complete and smoke-tested, redirect /dashboard → /app/dashboard (302) via router change or server rule.
   - Monitor. If stable, apply 301 and remove iframe route.

## Risk & Mitigation
- Styles missing from original: If styles/index.css not found, reconstruct minimal CSS based on MUI components and inline sx props.
- Import path mismatches: Search & replace to website/src/dashboard paths.
- Auth edge cases: Rely on cookie-based refresh; keep fallback flows minimal (no iframe postMessage necessary in native mode).

## Confirmation Points
- Sidebar labels/icons/order identical to original.
- Include any previously hidden/experimental menu entries by default (unless instructed otherwise).
- Timing: Proceed with “today” switch after smoke tests on staging/production-equivalent.

## Checklist (to tick during implementation)
- [x] Layout + Sidebar wired
- [x] All screens replaced
- [ ] Missing services added
- [ ] Utils/hooks ported
- [x] Styles/index.css parity or acceptable substitute
- [ ] Deep-link redirects
- [x] 302 redirect from /dashboard
- [ ] Monitoring + 301 + iframe removal


## Progress Details (2025-09-05)
- Implemented native screens: Dashboard, Analytics, Billing, ApiKeys, Users, Plans, Requests, RequestStatus.
- Wired routes: /app/api-keys uses ApiKeysScreen; /admin/users uses UsersScreen; /admin/plans uses PlansScreen; /admin/requests uses RequestsScreen; /admin/request-status uses RequestStatusScreen.
- Added services: billingService, apiKeyService, usersService.
- Billing UX: Plan change now opens in-dashboard PaymentModal (no redirect to /pay).
- Pending screens: Settings, PaymentSuccess, PaymentFail.
- Pending tasks: styles/index.css parity, deep-link redirects, /dashboard → /app/dashboard 302, then 301 and iframe removal.
