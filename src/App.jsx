import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
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
            <Route path="/dashboard" element={<DashboardEmbed />} />
            <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
