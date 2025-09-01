import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMoon, FaSun, FaHome, FaReact, FaVuejs, FaWordpress, FaAngular, FaNodeJs, FaEdit, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import useScrollToTop from '../hooks/useScrollToTop';
import { sidebarItems, sidebarDisplayNames } from '../data/sidebarContent';
import { useAuth } from '../contexts/AuthContext';
import { updateDocument, getDocument } from '../services/documentService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../styles/pages/DocumentPage.css';

const DocumentPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ko');
  const [selectedSidebarItem, setSelectedSidebarItem] = useState('developer_guide');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');
  const [apiContent, setApiContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 인증 컨텍스트에서 사용자 정보 가져오기
  const { user } = useAuth();
  const isAdmin = user && (user.is_admin === true || user.is_admin === 1 || user.role === 'admin');
  
  // 페이지 이동 시 스크롤을 맨 위로 올림
  useScrollToTop();
  
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

  // API에서 문서 로딩하는 함수
  const loadDocumentFromAPI = async (documentType = selectedSidebarItem) => {
    try {
      setIsLoading(true);
      console.log(`🔍 API 호출: language=${selectedLanguage}, documentType=${documentType}`);
      
      const result = await getDocument(selectedLanguage, documentType);
      
      if (result.success && result.data.content) {
        setApiContent(result.data.content);
        console.log('API에서 문서 로딩 성공:', result.data);
      } else {
        console.log('API에서 문서가 없거나 비어있음, 기본 콘텐츠 사용');
        setApiContent(null);
      }
    } catch (error) {
      console.error('API에서 문서 로딩 실패:', error);
      setApiContent(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 편집 모드 토글 함수
  const toggleEditMode = () => {
    if (!isEditMode) {
      // 편집 모드 시작 시 API 콘텐츠를 우선 사용
      if (apiContent) {
        // API에서 가져온 마크다운 콘텐츠를 그대로 사용
        setMarkdownContent(apiContent);
      } else {
        // API 콘텐츠가 없으면 빈 문자열로 시작
        setMarkdownContent('');
      }
    } else {
      // 편집 모드 종료
      setIsEditMode(false);
      setMarkdownContent('');
    }
  };

  // 저장 함수
  const handleSave = async () => {
    try {
      console.log('문서 저장 중...');
      
      // 백엔드 API 호출
      const result = await updateDocument(selectedLanguage, selectedSidebarItem, markdownContent);
      
      if (result.success) {
        console.log('문서 저장 성공:', result.data);
        
        // 저장 완료 모달 표시
        setShowSaveModal(true);
        
        // 3초 후 자동으로 모달 닫기
        setTimeout(() => {
          setShowSaveModal(false);
          setIsEditMode(false); // 편집 모드 종료
          
          // 저장 후 API에서 최신 콘텐츠 다시 로딩
          loadDocumentFromAPI();
        }, 3000);
      } else {
        throw new Error('문서 저장 실패');
      }
    } catch (error) {
      console.error('문서 저장 오류:', error);
      
      // 에러 모달 표시 (간단한 alert로 대체)
      alert(`문서 저장 실패: ${error.message}`);
    }
  };

  // 취소 함수
  const handleCancel = () => {
    setShowCancelModal(true);
  };

  // 편집 모드 완전 종료 (수정사항 저장 안함)
  const exitEditMode = () => {
    setIsEditMode(false);
    setShowCancelModal(false);
    
    // 수정사항을 원래대로 되돌리기 위해 마크다운 내용 초기화
    setMarkdownContent('');
    
    console.log('편집 모드 종료 - 수정사항 저장 안됨');
  };

  // 편집 모드 계속 유지
  const continueEditMode = () => {
    setShowCancelModal(false);
    // 편집 모드는 그대로 유지
    console.log('편집 모드 계속 유지');
  };

  // 컴포넌트 마운트 시 저장된 테마 설정 불러오기 및 초기 문서 로딩
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
    
    // 초기 문서 로딩
    loadDocumentFromAPI();
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

  // 사이드바 아이템이나 언어 변경 시 API에서 문서 로딩
  useEffect(() => {
    if (selectedSidebarItem) {
      loadDocumentFromAPI(selectedSidebarItem);
    }
  }, [selectedSidebarItem, selectedLanguage]);

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
    // 선택된 아이템으로 직접 API 호출하여 상태 동기화 문제 해결
    loadDocumentFromAPI(item);
  };

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
                        // 언어 변경 시 현재 선택된 사이드바 아이템으로 API 호출
                        setTimeout(() => loadDocumentFromAPI(selectedSidebarItem), 100);
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
            
            {/* 관리자 편집 모드 컨트롤 */}
            {isAdmin && (
              <div className="edit-mode-controls">
                {!isEditMode ? (
                  <button 
                    className="edit-mode-toggle"
                    onClick={toggleEditMode}
                    title="편집 모드 시작"
                  >
                    <FaEdit />
                  </button>
                ) : (
                  <div className="edit-buttons">
                    <button 
                      className="save-button"
                      onClick={handleSave}
                    >
                      저장
                    </button>
                    <button 
                      className="cancel-button"
                      onClick={handleCancel}
                    >
                      취소
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="docs-container">
        {/* Left Sidebar */}
        <aside className="docs-sidebar">
          <div className="docs-sidebar-section">
            {sidebarItems[selectedLanguage].map((item, index) => (
              <div 
                key={index} 
                className={`docs-sidebar-item ${selectedSidebarItem === item ? 'active' : ''}`}
                onClick={() => handleSidebarItemClick(item)}
              >
                {index === 0 && <FaHome className="docs-sidebar-icon" />}
                {sidebarDisplayNames[selectedLanguage][item] || item}
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
              <span>{sidebarDisplayNames[selectedLanguage][selectedSidebarItem] || selectedSidebarItem}</span>
            </nav>

            {/* 편집 모드일 때 마크다운 에디터 표시 */}
            {isEditMode ? (
              <div className="markdown-editor-container">
                <div className="editor-header">
                  <h2>마크다운 편집기</h2>
                  <p className="editor-description">
                    문서 내용을 마크다운 형식으로 편집하세요.
                  </p>
                </div>
                <div className="editor-content">
                  <textarea
                    className="markdown-textarea"
                    value={markdownContent}
                    onChange={(e) => setMarkdownContent(e.target.value)}
                    placeholder="마크다운 형식으로 문서를 작성하세요..."
                    rows={30}
                  />
                </div>
              </div>
            ) : (
              // 편집 모드가 아닐 때 기존 콘텐츠 표시
              <>
                {/* API에서 가져온 콘텐츠가 있으면 우선 표시 */}
                {apiContent ? (
                  <div className="api-content">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({node, inline, className, children, ...props}) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <pre data-language={match[1]}>
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {apiContent}
                    </ReactMarkdown>
                  </div>
                ) : (
                  // API 콘텐츠가 없을 때는 마크다운 파일을 불러올 수 없다는 메시지 표시
                  <div className="no-content-message">
                    <FaExclamationTriangle className="warning-icon" />
                    <h3>콘텐츠를 불러올 수 없습니다</h3>
                    <p>마크다운 파일을 찾을 수 없거나 로드할 수 없습니다.</p>
                    <p>관리자에게 문의하거나 페이지를 새로고침해보세요.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {/* Right Sidebar - Table of Contents */}
        <aside className="toc-sidebar">
          <div className="toc-container">
            <h3 className="toc-title">On this page</h3>
            <nav className="toc-nav">
              {/* 마크다운 파일에서 헤딩을 추출하여 TOC 생성 */}
              {apiContent ? (
                // 마크다운 콘텐츠에서 헤딩을 추출하여 TOC 생성
                (() => {
                  const headings = [];
                  const lines = apiContent.split('\n');
                  
                  lines.forEach((line, index) => {
                    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
                    if (headingMatch) {
                      const level = headingMatch[1].length;
                      const text = headingMatch[2].trim();
                      const id = text.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-');
                      
                      headings.push({ level, text, id, lineIndex: index });
                    }
                  });
                  
                  return headings.map((heading, index) => (
                    <a 
                      key={index} 
                      href={`#${heading.id}`} 
                      className={`toc-link toc-level-${heading.level}`}
                      onClick={(e) => {
                        e.preventDefault();
                        // 해당 헤딩으로 스크롤
                        const element = document.getElementById(heading.id);
                        if (element) {
                          element.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                          });
                        }
                      }}
                    >
                      {heading.text}
                    </a>
                  ));
                })()
              ) : (
                <div className="no-toc-message">
                  <p>목차를 불러올 수 없습니다</p>
                </div>
              )}
            </nav>
          </div>
        </aside>
      </div>

      {/* 저장 완료 모달 */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal save-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <FaCheckCircle className="success-icon" />
              <h3>저장 완료</h3>
            </div>
            <div className="modal-body">
              <p>문서가 성공적으로 저장되었습니다.</p>
              <p className="auto-close-notice">3초 후 자동으로 닫힙니다.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-confirm-btn"
                onClick={() => {
                  setShowSaveModal(false);
                  setIsEditMode(false); // 편집 모드 종료
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 취소 확인 모달 */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal cancel-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <FaExclamationTriangle className="warning-icon" />
              <h3>편집 취소</h3>
            </div>
            <div className="modal-body">
              <p>수정사항이 저장되지 않습니다. 계속하시겠습니까?</p>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-confirm-btn"
                onClick={exitEditMode}
              >
                확인
              </button>
              <button 
                className="modal-cancel-btn"
                onClick={continueEditMode}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentPage; 