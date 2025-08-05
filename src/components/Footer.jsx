import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Top Section - Navigation Links */}
        <div className="footer-nav">
          <a href="#terms">서비스 이용약관</a>
          <a href="#privacy">개인정보처리방침</a>
          <a href="#faq">FAQ</a>
        </div>
        
        {/* Middle Section - Logo */}
        <div className="footer-logo">
          <img src="/real-logo.png" alt="REAL" className="real-logo" />
        </div>
        
        {/* Bottom Section - Copyright */}
        <div className="footer-bottom">
          <p className="copyright">&copy; 2025 REAL Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 