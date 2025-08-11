import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import DocumentPage from './pages/DocumentPage';
import CompanyPage from './pages/CompanyPage';
import SignInPage from './pages/SignInPage';
import SuccessPage from './pages/SuccessPage';
import SignUpPage from './pages/SignUpPage';
import ContactPage from './pages/ContactPage';
import DashboardEmbed from './pages/DashboardEmbed';
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
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/dashboard" element={<DashboardEmbed />} />
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
