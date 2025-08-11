import React, { useState } from 'react';
import { FaSearch, FaMoon, FaHome, FaReact, FaVuejs, FaWordpress, FaAngular, FaNodeJs } from 'react-icons/fa';
import '../styles/pages/DocumentPage.css';

const DocumentPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const frameworks = [
    { name: 'ReactJS', icon: FaReact, color: '#61DAFB' },
    { name: 'VueJS', icon: FaVuejs, color: '#4FC08D' },
    { name: 'WordPress', icon: FaWordpress, color: '#21759B' },
    { name: 'Angular', icon: FaAngular, color: '#DD0031' },
    { name: 'Node.js', icon: FaNodeJs, color: '#339933' }
  ];

  const sidebarItems = [
    'Configuration',
    'Invisible Captcha',
    'Custom Themes',
    'Language Codes',
    'Frequently Asked Questions',
    'Account Management and Metrics APIs (Enterprise)',
    'Switch from reCAPTCHA to hCaptcha',
    'Mobile App SDKs',
    'Integrations',
    'Pro Features',
    'Enterprise Overview'
  ];

  const tocItems = [
    'Switching from reCAPTCHA',
    'Basic Principles',
    'Request Flow',
    'Content-Security-Policy Settings',
    'Add the hCaptcha Widget to your Webpage',
    'Verify the User Response Server Side',
    'Siteverify Error Codes Table',
    'Rotating Your Siteverify Secret',
    'Local Development',
    'TypeScript Types',
    'How to install',
    'How to use',
    'Integration Testing: Test Keys',
    'Test Key Set: Publisher or Pro Account',
    'Test Key Set: Enterprise Account (Safe End User)',
    'Test Key Set: Enterprise Account (Bot Detected)',
    'Frontend Testing: Force a Visual Challenge',
    'Backend Testing: Ensure Correct Handling of Rejected Tokens',
    "What's next?"
  ];

  return (
    <div className="document-page">
      {/* Top Header Bar */}
      <header className="docs-header">
        <div className="header-left">
          <div className="logo-section">
            <span className="logo-text">REAL</span>
            <span className="docs-text">Docs</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="language-selector">
            <span>English</span>
            <span className="dropdown-arrow">▼</span>
          </div>
          <a href="#faq" className="header-link">FAQ</a>
          <a href="#login" className="header-link">
            Login
            <span className="external-icon">↗</span>
          </a>
          <button className="theme-toggle">
            <FaMoon />
          </button>
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="keyboard-shortcut">æ</button>
          <button className="keyboard-shortcut">K</button>
        </div>
      </header>

      <div className="docs-container">
        {/* Left Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-item active">
              <FaHome className="sidebar-icon" />
              Developer Guide
            </div>
            {sidebarItems.map((item, index) => (
              <div key={index} className="sidebar-item">
                {item}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="content-wrapper">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
              <FaHome className="breadcrumb-icon" />
              <span>Developer Guide</span>
            </nav>

            {/* Main Title */}
            <h1 className="main-title">Developer Guide</h1>

            {/* Introduction */}
            <p className="intro-text">
              REAL can help protect your applications from bots, spam, and other forms of automated abuse.
            </p>

            {/* Installation Info */}
            <p className="installation-text">
              SDK installation is fast and easy. You can use HTML/server-side code or native tools.
            </p>

            {/* Framework Integrations */}
            <p className="framework-intro">
              Plugins and code examples are available for many frameworks.
            </p>

            {/* Framework Badges */}
            <div className="framework-badges">
              {frameworks.map((framework, index) => (
                <div key={index} className="framework-badge" style={{ '--framework-color': framework.color }}>
                  <framework.icon className="framework-icon" />
                  <span>{framework.name}</span>
                </div>
              ))}
            </div>

            <p className="integration-link">
              A complete list of known REAL integrations is also available if you'd like to submit a new one.
            </p>

            {/* Switching from reCAPTCHA Section */}
            <section className="content-section">
              <h2 className="section-title">Switching from reCAPTCHA</h2>
              <p>
                Existing Google reCAPTCHA code can be used with only a few changes. REAL methods are API-compatible 
                (e.g., <code>render()</code> and <code>onload()</code>). We also support custom data attributes 
                like <code>theme</code>, <code>size</code>, and <code>tab-index</code>.
              </p>
            </section>

            {/* Basic Principles Section */}
            <section className="content-section">
              <h2 className="section-title">Basic Principles</h2>
              <ol className="principles-list">
                <li>You embed the REAL widget on your site. For example, on a login form.</li>
                <li>The widget challenges the user to prove they are human.</li>
                <li>Upon completion, REAL provides a response token.</li>
                <li>You verify the token on your server to ensure it's valid.</li>
                <li>If valid, you allow the user to proceed with their intended action.</li>
              </ol>
            </section>

            {/* Request Flow Section */}
            <section className="content-section">
              <h2 className="section-title">Request Flow</h2>
              <p>
                The typical request flow involves client-side widget rendering, user interaction, 
                token generation, and server-side verification.
              </p>
            </section>

            {/* Content Security Policy Section */}
            <section className="content-section">
              <h2 className="section-title">Content-Security-Policy Settings</h2>
              <p>
                Configure your CSP headers to allow REAL scripts and resources to load properly 
                while maintaining security.
              </p>
            </section>

            {/* Add Widget Section */}
            <section className="content-section">
              <h2 className="section-title">Add the REAL Widget to your Webpage</h2>
              <p>
                Include the REAL script and add the widget container to your HTML. 
                Configure the widget with your site key and callback functions.
              </p>
            </section>

            {/* Verify Response Section */}
            <section className="content-section">
              <h2 className="section-title">Verify the User Response Server Side</h2>
              <p>
                Send the response token to REAL's verification endpoint to confirm 
                the user's humanity and prevent automated abuse.
              </p>
            </section>

            {/* Error Codes Section */}
            <section className="content-section">
              <h2 className="section-title">Siteverify Error Codes Table</h2>
              <p>
                Reference table for common error codes and their meanings when 
                verifying tokens with REAL's API.
              </p>
            </section>

            {/* Rotating Secret Section */}
            <section className="content-section">
              <h2 className="section-title">Rotating Your Siteverify Secret</h2>
              <p>
                Best practices for rotating your verification secret to maintain 
                security and prevent token reuse.
              </p>
            </section>

            {/* Local Development Section */}
            <section className="content-section">
              <h2 className="section-title">Local Development</h2>
              <p>
                Set up your development environment to work with REAL, including 
                test keys and localhost configuration.
              </p>
            </section>

            {/* TypeScript Types Section */}
            <section className="content-section">
              <h2 className="section-title">TypeScript Types</h2>
              <p>
                TypeScript definitions and interfaces for REAL integration, 
                providing better development experience and type safety.
              </p>
            </section>

            {/* How to install Section */}
            <section className="content-section">
              <h2 className="section-title">How to install</h2>
              <p>
                Step-by-step installation guide for different platforms and frameworks.
              </p>
            </section>

            {/* How to use Section */}
            <section className="content-section">
              <h2 className="section-title">How to use</h2>
              <p>
                Basic usage examples and common integration patterns for REAL.
              </p>
            </section>

            {/* Integration Testing Section */}
            <section className="content-section">
              <h2 className="section-title">Integration Testing: Test Keys</h2>
              <p>
                Use test keys to verify your integration without affecting real users.
              </p>
            </section>

            {/* Test Key Sets */}
            <section className="content-section">
              <h2 className="section-title">Test Key Set: Publisher or Pro Account</h2>
              <p>
                Test keys for publisher and pro account holders.
              </p>
            </section>

            <section className="content-section">
              <h2 className="section-title">Test Key Set: Enterprise Account (Safe End User)</h2>
              <p>
                Test keys for enterprise accounts with safe end user scenarios.
              </p>
            </section>

            <section className="content-section">
              <h2 className="section-title">Test Key Set: Enterprise Account (Bot Detected)</h2>
              <p>
                Test keys for enterprise accounts with bot detection scenarios.
              </p>
            </section>

            {/* Frontend Testing Section */}
            <section className="content-section">
              <h2 className="section-title">Frontend Testing: Force a Visual Challenge</h2>
              <p>
                How to force visual challenges during testing to ensure proper widget behavior.
              </p>
            </section>

            {/* Backend Testing Section */}
            <section className="content-section">
              <h2 className="section-title">Backend Testing: Ensure Correct Handling of Rejected Tokens</h2>
              <p>
                Test your backend to ensure it properly handles rejected tokens and error scenarios.
              </p>
            </section>

            {/* What's next Section */}
            <section className="content-section">
              <h2 className="section-title">What's next?</h2>
              <p>
                Next steps for advanced configuration, customization, and optimization of your REAL integration.
              </p>
            </section>
          </div>
        </main>

        {/* Right Sidebar - Table of Contents */}
        <aside className="toc-sidebar">
          <div className="toc-container">
            <h3 className="toc-title">On this page</h3>
            <nav className="toc-nav">
              {tocItems.map((item, index) => (
                <a key={index} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="toc-link">
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DocumentPage; 