import React from 'react';
import { FaUser } from 'react-icons/fa';
import '../styles/pages/CompanyPage.css';

const CompanyPage = () => {
  const teamMembers = [
    {
      id: 1,
      name: '강영모',
      role: 'CEO & Founder',
      description: '10년 이상의 보안 솔루션 개발 경험을 바탕으로 REAL의 비전을 이끌어갑니다.',
      image: '/team-member-1.jpg'
    },
    {
      id: 2,
      name: '임현지',
      role: 'CTO',
      description: 'AI/ML 전문가로서 REAL의 핵심 기술 개발을 담당합니다.',
      image: '/team-member-2.jpg'
    },
    {
      id: 3,
      name: '전남규',
      role: 'Lead Developer',
      description: '프론트엔드 및 백엔드 개발을 총괄하며 사용자 경험을 개선합니다.',
      image: '/team-member-3.jpg'
    },
    {
      id: 4,
      name: '김재현',
      role: 'Product Manager',
      description: '제품 전략과 사용자 피드백을 바탕으로 REAL의 성장을 이끌어갑니다.',
      image: '/team-member-4.jpg'
    }
  ];

  return (
    <div className="company-page">
      {/* Hero Section with Team Photo Background */}
      <section className="company-hero-section">
        <div className="company-hero-background">
          <img src="/company.jpg" alt="Team Photo Background" className="company-hero-bg-image" />
          <div className="company-hero-overlay">
            <div className="company-hero-content">
              <h1 className="company-hero-title">
                <span className="highlight-text">CAPTCHA</span>, 그 이상의 <br />
                솔루션을 만들고 있습니다
              </h1>
              <p className="company-hero-subtitle">
                혁신적인 CAPTCHA 솔루션으로 인터넷을 더 안전하게 만드는<br />
                REAL 팀의 멤버들을 만나보세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="team-section">
        <div className="team-container">
          <h2 className="team-title">팀 멤버</h2>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-member-card">
                <div className="member-image-container">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="member-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="member-image-placeholder">
                    <FaUser className="placeholder-icon" />
                  </div>
                </div>
                <div className="member-info">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-description">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Values Section */}
      <section className="values-section">
        <div className="values-container">
          <h2 className="values-title">REAL의 가치</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>혁신</h3>
              <p>최신 기술을 활용하여 사용자 친화적인 보안 솔루션을 제공합니다.</p>
            </div>
            <div className="value-card">
              <h3>신뢰</h3>
              <p>고객의 데이터와 개인정보 보호를 최우선으로 생각합니다.</p>
            </div>
            <div className="value-card">
              <h3>성장</h3>
              <p>지속적인 학습과 개선을 통해 더 나은 서비스를 제공합니다.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompanyPage;