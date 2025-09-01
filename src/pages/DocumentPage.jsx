import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMoon, FaSun, FaHome, FaReact, FaVuejs, FaWordpress, FaAngular, FaNodeJs } from 'react-icons/fa';
import useScrollToTop from '../hooks/useScrollToTop';
import { koreanContent, englishContent } from '../data/documentContent';
import { sidebarItems, sidebarContent } from '../data/sidebarContent';
 import '../styles/pages/DocumentPage.css';

const DocumentPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ko');
  const [selectedSidebarItem, setSelectedSidebarItem] = useState('developer_guide');
  
  // 페이지 이동 시 스크롤을 맨 위로 올림
  useScrollToTop();
  
  // 현재 언어에 따른 콘텐츠 선택
  const currentContent = selectedLanguage === 'ko' ? koreanContent : englishContent;

  // 테마 토글 함수
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    
    // HTML 요소에 클래스 추가/제거
    const documentPage = document.querySelector('.document-page');
    if (documentPage) {
      if (newDarkMode) {
        documentPage.classList.add('dark-mode');
      } else {
        documentPage.classList.remove('dark-mode');
      }
    }
  };

  // 컴포넌트 마운트 시 저장된 테마 설정 불러오기
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      const darkMode = JSON.parse(savedDarkMode);
      setIsDarkMode(darkMode);
      
      const documentPage = document.querySelector('.document-page');
      if (documentPage && darkMode) {
        documentPage.classList.add('dark-mode');
      }
    }
  }, []);
  
  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.language-selector')) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const frameworks = [
    { name: 'ReactJS', icon: FaReact, color: '#61DAFB' },
    { name: 'VueJS', icon: FaVuejs, color: '#4FC08D' },
    { name: 'WordPress', icon: FaWordpress, color: '#21759B' },
    { name: 'Angular', icon: FaAngular, color: '#DD0031' },
    { name: 'Node.js', icon: FaNodeJs, color: '#339933' }
  ];

  const languages = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage);

  // Sidebar item 클릭 핸들러
  const handleSidebarItemClick = (item) => {
    console.log(`Clicked: ${item}`);
    setSelectedSidebarItem(item);
  };

  // TOC 링크 클릭 핸들러
  const handleTocClick = (item) => {
    // TOC 아이템을 섹션 키와 매핑
    const sectionKey = Object.keys(currentContent.sections).find(key => 
      currentContent.sections[key].title === item
    );
    
    if (sectionKey) {
      const element = document.getElementById(sectionKey);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  const tocItems = [
    'reCAPTCHA에서 전환하기',
    '기본 원칙',
    '요청 흐름',
    '콘텐츠 보안 정책 설정',
    '웹페이지에 REAL 위젯 추가하기',
    '서버 사이드에서 사용자 응답 확인하기',
    'Siteverify 오류 코드 테이블',
    'Siteverify 비밀키 순환하기',
    '로컬 개발',
    'TypeScript 타입',
    '설치 방법',
    '사용 방법',
    '통합 테스트: 테스트 키',
    '테스트 키 세트: 퍼블리셔 또는 Pro 계정',
    '테스트 키 세트: 엔터프라이즈 계정 (안전한 최종 사용자)',
    '테스트 키 세트: 엔터프라이즈 계정 (봇 감지)',
    '프론트엔드 테스트: 시각적 챌린지 강제하기',
    '백엔드 테스트: 거부된 토큰의 올바른 처리 보장하기',
    '다음 단계'
  ];

  return (
    <div className="document-page">
      {/* Top Header Bar */}
      <header className="docs-header">
        <div className="header-right">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="docs-search-input"
            />
          </div>
          <div className="header-controls">
            <div className={`language-selector ${isLanguageDropdownOpen ? 'dropdown-open' : ''}`} onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}>
              <span className="language-flag">{currentLanguage.flag}</span>
              <span className="language-name">{currentLanguage.name}</span>
              <span className="dropdown-arrow">▼</span>
              
              {isLanguageDropdownOpen && (
                <div className="language-dropdown">
                  {languages.map((language) => (
                    <div
                      key={language.code}
                      className={`language-option ${selectedLanguage === language.code ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLanguage(language.code);
                        setIsLanguageDropdownOpen(false);
                      }}
                    >
                      <span className="language-flag">{language.flag}</span>
                      <span className="language-name">{language.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link to="/faq" className="header-link">FAQ</Link>
            <button className="theme-toggle" onClick={toggleTheme}>
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </header>

      <div className="docs-container">
        {/* Left Sidebar */}
        <aside className="docs-sidebar">
          <div className="docs-sidebar-section">
            <div 
              className={`docs-sidebar-item ${selectedSidebarItem === 'developer_guide' ? 'active' : ''}`}
              onClick={() => handleSidebarItemClick('developer_guide')}
            >
              <FaHome className="docs-sidebar-icon" />
              Developer Guide
            </div>
            {sidebarItems.map((item, index) => (
              <div 
                key={index} 
                className={`docs-sidebar-item ${selectedSidebarItem === item ? 'active' : ''}`}
                onClick={() => handleSidebarItemClick(item)}
              >
                {(
                  sidebarContent[item] && sidebarContent[item][selectedLanguage]
                ) ? sidebarContent[item][selectedLanguage].title : item}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="docs-main-content">
          <div className="docs-content-wrapper">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
              <FaHome className="breadcrumb-icon" />
              <span>{(sidebarContent[selectedSidebarItem] && sidebarContent[selectedSidebarItem][selectedLanguage]) ? sidebarContent[selectedSidebarItem][selectedLanguage].title : selectedSidebarItem}</span>
            </nav>

            {/* 선택된 사이드바 아이템에 따른 콘텐츠 표시 */}
            {(() => {
              const selectedContent = sidebarContent[selectedSidebarItem];
              if (!selectedContent) return null;
              
              const content = selectedContent[selectedLanguage];
              if (!content) return null;
              
              // Developer Guide인 경우 기존 콘텐츠 표시
              if (selectedSidebarItem === 'developer_guide') {
                return (
                  <>
            {/* Main Title */}
                    <h1 className="main-title">{currentContent.mainTitle}</h1>

            {/* Introduction */}
            <p className="intro-text">
                      {currentContent.introText}
            </p>

            {/* Installation Info */}
            <p className="installation-text">
                      {currentContent.installationText}
            </p>

            {/* Framework Integrations */}
            <p className="framework-intro">
                      {currentContent.frameworkIntro}
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
                      {currentContent.integrationLink}
                    </p>

                    {/* 동적으로 섹션 렌더링 */}
                    {Object.entries(currentContent.sections).map(([key, section]) => (
                      <section key={key} id={key.replace(/-/g, '-')} className="content-section">
                        <h2 className="section-title">{section.title}</h2>
                        {Array.isArray(section.content) ? (
              <ol className="principles-list">
                            {section.content.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
              </ol>
                        ) : (
                          <p>{section.content}</p>
                        )}
            </section>
                    ))}
                  </>
                );
              }
              
              // 다른 사이드바 아이템인 경우 해당 콘텐츠 표시
              return (
                <>
                  {/* Main Title */}
                  <h1 className="main-title">{content.title}</h1>

                  {/* Introduction */}
                  <p className="intro-text">
                    {content.content}
                  </p>

                  {/* Sub-sections */}
                  {content.sections && Object.entries(content.sections).map(([key, section]) => (
                    <section key={key} id={key} className="content-section">
                      <h2 className="section-title">{section.title}</h2>
                      <div dangerouslySetInnerHTML={{ 
                        __html: section.content
                          .replace(/```(\w+)\n([\s\S]*?)```/g, (match, lang, code) => {
                            const escaped = code
                              .replace(/&/g, '&amp;')
                              .replace(/</g, '&lt;')
                              .replace(/>/g, '&gt;')
                              .replace(/\"/g, '&quot;')
                              .replace(/'/g, '&#39;');
                            return `<pre data-language="${lang}"><code class="language-${lang}">${escaped}</code></pre>`;
                          })
                      }} />
            </section>
                  ))}
                </>
              );
            })()}
          </div>
        </main>

        {/* Right Sidebar - Table of Contents */}
        <aside className="toc-sidebar">
          <div className="toc-container">
            <h3 className="toc-title">On this page</h3>
            <nav className="toc-nav">
              {(() => {
                const selectedContent = sidebarContent[selectedSidebarItem];
                if (!selectedContent) return null;
                
                const content = selectedContent[selectedLanguage];
                if (!content) return null;
                
                // Developer Guide인 경우 기존 TOC 표시
                if (selectedSidebarItem === 'developer_guide') {
                  return tocItems.map((item, index) => {
                    const sectionKey = Object.keys(currentContent.sections).find(key => 
                      currentContent.sections[key].title === item
                    );
                    return (
                      <a 
                        key={index} 
                        href={`#${sectionKey || item.toLowerCase().replace(/\s+/g, '-')}`} 
                        className="toc-link"
                        onClick={(e) => {
                          e.preventDefault();
                          handleTocClick(item);
                        }}
                      >
                  {item}
                </a>
                    );
                  });
                }
                
                // 다른 사이드바 아이템인 경우 해당 섹션들의 TOC 표시
                if (content.sections) {
                  return Object.entries(content.sections).map(([key, section]) => (
                    <a 
                      key={key} 
                      href={`#${key}`} 
                      className="toc-link"
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(key);
                        if (element) {
                          element.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                          });
                        }
                      }}
                    >
                      {section.title}
                    </a>
                  ));
                }
                
                return null;
              })()}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DocumentPage; 
                            block: 'start'
                          });
                        }
                      }}
                    >
                      {section.title}
                    </a>
                  ));
                }
                
                return null;
              })()}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
};


export default DocumentPage; 