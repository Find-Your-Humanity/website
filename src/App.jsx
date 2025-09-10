import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import DocumentPage from './pages/DocumentPage';
import CompanyPage from './pages/CompanyPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ContactPage from './pages/ContactPage';
import ContactStatusPage from './pages/ContactStatusPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import FAQPage from './pages/FAQPage';
import MyInquiriesPage from './pages/MyInquiriesPage';
import DashboardEmbed from './pages/DashboardEmbed';
import PayPage from './pages/PayPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailPage from './pages/PaymentFailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import PaymentResultOverlay from './components/PaymentResultOverlay';

// Dashboard (native) imports
import DashboardShell from './dashboard/components/DashboardShell';
import { RequireAuth, RequireAdmin } from './dashboard/navigation/guards';
import DashboardScreen from './dashboard/screens/DashboardScreen';
import AdminDashboardScreen from './dashboard/screens/AdminDashboardScreen';
import AnalyticsScreen from './dashboard/screens/AnalyticsScreen';
import AdminAnalyticsScreen from './dashboard/screens/AdminAnalyticsScreen';
import BillingScreen from './dashboard/screens/BillingScreen';
import ApiKeysScreen from './dashboard/screens/ApiKeysScreen';
import UsersScreen from './dashboard/screens/UsersScreen';
import PlansScreen from './dashboard/screens/PlansScreen';
import RequestsScreen from './dashboard/screens/RequestsScreen';
import RequestStatusScreen from './dashboard/screens/RequestStatusScreen';
import { SettingsScreen } from './dashboard/screens/ManagementScreens';

import RedirectLegacy from './components/RedirectLegacy';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <MainLayout>
            <PaymentResultOverlay />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/document" element={<DocumentPage />} />
              <Route path="/company" element={<CompanyPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/contact-status" element={<ContactStatusPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/my-inquiries" element={<MyInquiriesPage />} />

              {/* Legacy routes handler */}
              <Route path="/dashboard" element={<RedirectLegacy />} />
              <Route path="/dashboard/*" element={<RedirectLegacy />} />

              {/* Old iframe dashboard access */}
              <Route path="/old-dashboard" element={<DashboardEmbed />} />

              {/* Convenience redirects */}
              <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

              {/* Native dashboard routes (tenant) */}
              <Route path="/app/dashboard" element={
                <RequireAuth>
                  <DashboardShell>
                    <DashboardScreen />
                  </DashboardShell>
                </RequireAuth>
              } />
              <Route path="/app/analytics" element={
                <RequireAuth>
                  <DashboardShell>
                    <AnalyticsScreen />
                  </DashboardShell>
                </RequireAuth>
              } />
              <Route path="/app/billing" element={
                <RequireAuth>
                  <DashboardShell>
                    <BillingScreen />
                  </DashboardShell>
                </RequireAuth>
              } />
              <Route path="/app/api-keys" element={
                <RequireAuth>
                  <DashboardShell>
                    <ApiKeysScreen />
                  </DashboardShell>
                </RequireAuth>
              } />
              <Route path="/app/settings" element={
                <RequireAuth>
                  <DashboardShell>
                    <SettingsScreen />
                  </DashboardShell>
                </RequireAuth>
              } />

              {/* Admin dashboard routes */}
              <Route path="/admin/dashboard" element={
                <RequireAdmin>
                  <DashboardShell>
                    <AdminDashboardScreen />
                  </DashboardShell>
                </RequireAdmin>
              } />
              <Route path="/admin/analytics" element={
                <RequireAdmin>
                  <DashboardShell>
                    <AdminAnalyticsScreen />
                  </DashboardShell>
                </RequireAdmin>
              } />
              <Route path="/admin/users" element={
                <RequireAdmin>
                  <DashboardShell>
                    <UsersScreen />
                  </DashboardShell>
                </RequireAdmin>
              } />
              <Route path="/admin/plans" element={
                <RequireAdmin>
                  <DashboardShell>
                    <PlansScreen />
                  </DashboardShell>
                </RequireAdmin>
              } />
              <Route path="/admin/requests" element={
                <RequireAdmin>
                  <DashboardShell>
                    <RequestsScreen />
                  </DashboardShell>
                </RequireAdmin>
              } />
              <Route path="/admin/request-status" element={
                <RequireAdmin>
                  <DashboardShell>
                    <RequestStatusScreen />
                  </DashboardShell>
                </RequireAdmin>
              } />
              <Route path="/admin/settings" element={
                <RequireAdmin>
                  <DashboardShell>
                    <SettingsScreen />
                  </DashboardShell>
                </RequireAdmin>
              } />

              {/* Existing payment routes */}
              <Route path="/pay" element={<PayPage />} />
              <Route path="/payment/success" element={<RedirectLegacy />} />
              <Route path="/payment/fail" element={<RedirectLegacy />} />
              <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
            </Routes>
          </MainLayout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
