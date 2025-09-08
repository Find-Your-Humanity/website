This directory contains the integrated Dashboard (migrated from frontend/dashboard).

Structure to be added in Step 2 and Step 3:
- config/ (api.ts, constants.ts)
- services/ (apiClient.ts, authService.ts, dashboardService.ts)
- navigation/ (routes, guards)
- components/ (Layout, Sidebar, etc.)
- screens/ (Dashboard, Analytics, Billing, ApiKeys, Users, Plans, Requests, RequestStatus, Settings, PaymentSuccess, PaymentFail)
- styles/ (theme, global styles for dashboard only)
- utils/

Note: A local MUI ThemeProvider will wrap only the dashboard shell to avoid impacting the rest of the website theme.