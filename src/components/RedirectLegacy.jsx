import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PaymentSuccessPage from '../pages/PaymentSuccessPage';
import PaymentFailPage from '../pages/PaymentFailPage';
import { useAuth } from '../contexts/AuthContext';

// Redirect legacy paths to new native dashboard routes, preserving important query params
export default function RedirectLegacy() {
  const location = useLocation();
  const { pathname, search } = location;
  const params = new URLSearchParams(search);
  const { user } = useAuth();

  // Helper to stringify params
  const toQueryString = (p) => {
    const s = p.toString();
    return s ? `?${s}` : '';
  };

  // 1) Payment legacy: from=dashboard → move to /app/billing with pay
  if (pathname === '/payment/success' || pathname === '/payment/fail') {
    const from = params.get('from');
    if (from === 'dashboard') {
      const pay = pathname.endsWith('/success') ? 'success' : 'fail';
      // Preserve useful params like planType/planId/paymentKey/orderId/amount etc.
      params.set('pay', pay);
      params.set('from', 'dashboard');
      return <Navigate to={`/app/billing${toQueryString(params)}`} replace />;
    }
    // Not from dashboard → render original pages
    return pathname.endsWith('/success') ? <PaymentSuccessPage /> : <PaymentFailPage />;
  }

  // 2) Dashboard legacy base (role-aware)
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    const isAdmin = !!user && (user.is_admin === true || user.is_admin === 1 || user.role === 'admin');
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/app/dashboard'} replace />;
  }

  // 3) Dashboard sub-routes mapping
  if (pathname.startsWith('/dashboard/')) {
    const sub = pathname.substring('/dashboard/'.length);
    const mapApp = new Set(['dashboard', 'analytics', 'billing', 'api-keys', 'settings']);
    const mapAdmin = new Set(['users', 'plans', 'requests', 'request-status', 'settings']);

    if (mapApp.has(sub)) {
      return <Navigate to={`/app/${sub}`} replace />;
    }
    if (mapAdmin.has(sub)) {
      return <Navigate to={`/admin/${sub}`} replace />;
    }
    // Fallback to app dashboard
    return <Navigate to="/app/dashboard" replace />;
  }

  // Default fallback (should not reach here when used for specific legacy paths)
  return <Navigate to="/app/dashboard" replace />;
}
