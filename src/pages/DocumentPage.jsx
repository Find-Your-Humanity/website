import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaHome, FaReact, FaVuejs, FaWordpress, FaAngular, FaNodeJs, FaEdit, FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import useScrollToTop from '../hooks/useScrollToTop';
import { sidebarItems, sidebarDisplayNames } from '../data/sidebarContent';
import { useAuth } from '../contexts/AuthContext';
import { updateDocument, getDocument } from '../services/documentService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../styles/pages/DocumentPage.css';

const DocumentPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ko');
  const [selectedSidebarItem, setSelectedSidebarItem] = useState('developer_guide');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');
  const [apiContent, setApiContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 검색 관련 상태 추가
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  
  // 인증 컨텍스트에서 사용자 정보 가져오기
  const { user } = useAuth();
  const isAdmin = user && (user.is_admin === true || user.is_admin === 1 || user.role === 'admin');
  
  // 페이지 이동 시 스크롤을 맨 위로 올림
  useScrollToTop();

  // 검색 기능 구현
  const performSearch = (query, content) => {
    if (!query.trim() || !content) {
      setSearchResults([]);
      setCurrentSearchIndex(0);
      return;
    }

    const results = [];
    const lines = content.split('\n');
    const searchTerm = query.toLowerCase();

    lines.forEach((line, lineIndex) => {
      const lowerLine = line.toLowerCase();
      let startIndex = 0;
      
      while ((startIndex = lowerLine.indexOf(searchTerm, startIndex)) !== -1) {
        results.push({
          lineIndex,
          startIndex,
          endIndex: startIndex + searchTerm.length,
          line: line,
          preview: line.substring(Math.max(0, startIndex - 20), startIndex + searchTerm.length + 20)
        });
        startIndex += 1;
      }
    });



    setSearchResults(results);
    setCurrentSearchIndex(0);
    setIsSearching(true);
  };

  // 검색어 변경 시 검색 실행
  useEffect(() => {
    if (apiContent) {
      performSearch(searchQuery, apiContent);
    }
  }, [searchQuery, apiContent]);

  // 검색 결과로 스크롤
  const scrollToSearchResult = (result) => {
    // 먼저 data-line 속성으로 찾기 시도
    let element = document.querySelector(`[data-line="${result.lineIndex}"]`);
    
    // data-line으로 찾지 못한 경우, 텍스트 내용으로 찾기
    if (!element) {
      const allElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre');
      
      for (let i = 0; i < allElements.length; i++) {
        const el = allElements[i];
        const elText = el.textContent || '';
        
        // 정확한 라인 매칭 또는 부분 텍스트 매칭
        if (elText.includes(result.line) || 
            elText.includes(result.preview) ||
            result.line.includes(elText.trim())) {
          element = el;
          break;
        }
      }
    }
    
    if (element) {
      // 스크롤 위치 조정 (헤더 높이만큼 위로)
      const headerHeight = 80;
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      const targetPosition = elementTop - headerHeight - 100; // 헤더 + 여백
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // 하이라이팅 효과
      element.classList.add('search-highlight');
      setTimeout(() => {
        element.classList.remove('search-highlight');
      }, 3000);
    }
  };

  // 다음 검색 결과로 이동
  const goToNextResult = () => {
    if (searchResults.length > 0) {
      const nextIndex = (currentSearchIndex + 1) % searchResults.length;
      setCurrentSearchIndex(nextIndex);
      scrollToSearchResult(searchResults[nextIndex]);
    }
  };

  // 이전 검색 결과로 이동
  const goToPrevResult = () => {
    if (searchResults.length > 0) {
      const prevIndex = currentSearchIndex === 0 ? searchResults.length - 1 : currentSearchIndex - 1;
      setCurrentSearchIndex(prevIndex);
      scrollToSearchResult(searchResults[prevIndex]);
    }
  };

  // 검색어 하이라이팅 함수
  const highlightSearchTerm = (text) => {
    if (!searchQuery.trim()) return text;
    
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="search-highlight-term">
          {part}
        </mark>
      ) : part
    );
  };

  // 검색 초기화
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setCurrentSearchIndex(0);
    setIsSearching(false);
  };

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+F 또는 Cmd+F로 검색창 포커스
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('.docs-search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
      
      // Enter로 다음 검색 결과로 이동
      if (e.key === 'Enter' && searchQuery && searchResults.length > 0) {
        e.preventDefault();
        // 현재 검색 결과가 있으면 다음으로, 없으면 첫 번째로
        if (currentSearchIndex < searchResults.length - 1) {
          goToNextResult();
        } else {
          setCurrentSearchIndex(0);
          scrollToSearchResult(searchResults[0]);
        }
      }
      
      // Escape로 검색 초기화
      if (e.key === 'Escape' && searchQuery) {
        e.preventDefault();
        clearSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchQuery, searchResults, currentSearchIndex]);
  
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
      // 편집 모드 시작 시
      setIsEditMode(true);  // 편집 모드 상태를 true로 설정
      
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
      console.log('🔍 문서 저장 시작...');
      console.log('🔍 저장할 언어:', selectedLanguage);
      console.log('🔍 저장할 문서 타입:', selectedSidebarItem);
      console.log('🔍 저장할 내용 길이:', markdownContent.length);
      console.log('🔍 저장할 내용 미리보기:', markdownContent.substring(0, 100) + '...');
      
      // 백엔드 API 호출
      console.log('🔍 updateDocument API 호출 시작...');
      const result = await updateDocument(selectedLanguage, selectedSidebarItem, markdownContent);
      console.log('🔍 updateDocument API 응답:', result);
      
      if (result.success) {
        console.log('✅ 문서 저장 성공:', result.data);
        
        // 저장 완료 모달 표시
        setShowSaveModal(true);
        
        // 3초 후 자동으로 모달 닫기
        setTimeout(() => {
          setShowSaveModal(false);
          setIsEditMode(false); // 편집 모드 종료
          
          // 저장 후 API에서 최신 콘텐츠 다시 로딩
          console.log('🔍 저장 후 최신 콘텐츠 로딩 시작...');
          loadDocumentFromAPI(selectedSidebarItem);
        }, 3000);
      } else {
        console.log('❌ 문서 저장 실패 - 응답:', result);
        throw new Error('문서 저장 실패');
      }
    } catch (error) {
      console.error('❌ 문서 저장 오류:', error);
      console.error('❌ 오류 상세:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      
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

  // 언어 변경 시 사이드바 아이템 초기화
  useEffect(() => {
    // 언어가 변경되면 기본 아이템(developer_guide)으로 리셋
    setSelectedSidebarItem('developer_guide');
  }, [selectedLanguage]);

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
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="docs-search-input"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={clearSearch} title="검색어 지우기">
              <FaTimes />
            </button>
          )}
          {isSearching && searchResults.length > 0 && (
            <div className="search-results-info">
              <span className="search-count">{searchResults.length}개 결과</span>
              <div className="search-navigation">
                <button 
                  className="search-nav-btn" 
                  onClick={goToPrevResult}
                  disabled={currentSearchIndex === 0}
                  title="이전 결과"
                >
                  ↑
                </button>
                <span className="search-position">{currentSearchIndex + 1} / {searchResults.length}</span>
                <button 
                  className="search-nav-btn" 
                  onClick={goToNextResult}
                  disabled={currentSearchIndex === searchResults.length - 1}
                  title="다음 결과"
                >
                  ↓
                </button>
              </div>
            </div>
          )}
          {isSearching && searchQuery && searchResults.length === 0 && (
            <div className="search-results-info">
              <span className="search-count">검색 결과가 없습니다</span>
            </div>
          )}
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
              // 편집 모드가 아닐 때는 기존 콘텐츠 표시
              <>
                {/* 검색 결과 섹션 - 문서 내용 위에 표시 */}
                {isSearching && searchResults.length > 0 && (
                  <div className="search-results-section">
                    <div className="search-results-nav">
                      <button onClick={goToPrevResult} disabled={currentSearchIndex === 0}>이전</button>
                      <span>검색 결과 {currentSearchIndex + 1} / {searchResults.length}</span>
                      <button onClick={goToNextResult} disabled={currentSearchIndex === searchResults.length - 1}>다음</button>
                    </div>
                    <div className="search-results-list">
                      <h4>검색 결과 목록</h4>
                      {searchResults.map((result, index) => (
                        <div 
                          key={index} 
                          className={`search-result-item ${currentSearchIndex === index ? 'active' : ''}`}
                                                        onClick={() => {
                                setCurrentSearchIndex(index);
                                scrollToSearchResult(result);
                              }}
                        >
                          <div className="result-preview">
                            <span className="result-number">{index + 1}</span>
                            <span className="result-text">
                              {result.preview}
                            </span>
                          </div>
                          <div className="result-line">
                            라인 {result.lineIndex + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* API에서 가져온 콘텐츠가 있으면 우선 표시 */}
                {apiContent ? (
                  <div className="api-content">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // 헤딩 요소들에 ID 자동 부여 및 검색어 하이라이팅 적용
                        h1: ({node, children, ...props}) => {
                          const text = children?.toString() || '';
                          const id = text.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-');
                          return (
                            <h1 id={id} data-line={node.position?.start?.line} {...props}>
                              {highlightSearchTerm(text)}
                            </h1>
                          );
                        },
                        h2: ({node, children, ...props}) => {
                          const text = children?.toString() || '';
                          const id = text.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-');
                          return (
                            <h2 id={id} data-line={node.position?.start?.line} {...props}>
                              {highlightSearchTerm(text)}
                            </h2>
                          );
                        },
                        h3: ({node, children, ...props}) => {
                          const text = children?.toString() || '';
                          const id = text.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-');
                          return (
                            <h3 id={id} data-line={node.position?.start?.line} {...props}>
                              {highlightSearchTerm(text)}
                            </h3>
                          );
                        },
                        h4: ({node, children, ...props}) => {
                          const text = children?.toString() || '';
                          const id = text.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-');
                          return (
                            <h4 id={id} data-line={node.position?.start?.line} {...props}>
                              {highlightSearchTerm(text)}
                            </h4>
                          );
                        },
                        h5: ({node, children, ...props}) => {
                          const text = children?.toString() || '';
                          const id = text.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-');
                          return (
                            <h5 id={id} data-line={node.position?.start?.line} {...props}>
                              {highlightSearchTerm(text)}
                            </h5>
                          );
                        },
                        h6: ({node, children, ...props}) => {
                          const text = children?.toString() || '';
                          const id = text.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-');
                          return (
                            <h6 id={id} data-line={node.position?.start?.line} {...props}>
                              {highlightSearchTerm(text)}
                            </h6>
                          );
                        },
                        // 텍스트 요소에 검색어 하이라이팅 적용
                        p: ({node, children, ...props}) => {
                          const text = children?.toString() || '';
                          return (
                            <p data-line={node.position?.start?.line} {...props}>
                              {highlightSearchTerm(text)}
                            </p>
                          );
                        },
                        li: ({node, children, ...props}) => {
                          const text = children?.toString() || '';
                          return (
                            <li data-line={node.position?.start?.line} {...props}>
                              {highlightSearchTerm(text)}
                            </li>
                          );
                        },
                        code({node, inline, className, children, ...props}) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <pre data-language={match[1]} data-line={node.position?.start?.line}>
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