import React from 'react';
import '../styles/pages/LegalPage.css';

const PrivacyPage = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <h1 className="legal-title">개인정보처리방침</h1>
          <p className="legal-subtitle">realcatcha의 개인정보 수집, 이용, 보관에 관한 정책입니다.</p>
          <div className="legal-date">최종 업데이트: 2024년 8월 19일</div>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. 개인정보처리방침의 목적</h2>
            <p>
              realcatcha(이하 "회사")는 개인정보보호법 제30조에 따라 정보주체의 개인정보를 
              보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 
              다음과 같이 개인정보처리방침을 수립·공개합니다.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. 개인정보의 처리 목적</h2>
            <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다:</p>
            <ul>
              <li><strong>회원가입 및 관리</strong>
                <ul>
                  <li>서비스 이용자 식별, 회원자격 유지·관리</li>
                  <li>서비스 부정이용 방지, 만14세 미만 아동 개인정보 수집 시 법정대리인 동의여부 확인</li>
                </ul>
              </li>
              <li><strong>서비스 제공</strong>
                <ul>
                  <li>CAPTCHA 검증 서비스 제공</li>
                  <li>API 키 발급 및 관리</li>
                  <li>사용량 통계 제공</li>
                  <li>맞춤형 서비스 제공</li>
                </ul>
              </li>
              <li><strong>요금결제 및 정산</strong>
                <ul>
                  <li>결제서비스 제공, 요금정산</li>
                  <li>세금계산서 발행</li>
                </ul>
              </li>
              <li><strong>고객지원</strong>
                <ul>
                  <li>고객문의 처리, 기술지원</li>
                  <li>공지사항 전달</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. 수집하는 개인정보의 항목</h2>
            
            <div className="info-table">
              <h3>필수 수집 정보</h3>
              <ul>
                <li><strong>회원가입 시</strong>: 이메일, 비밀번호, 이름, 연락처</li>
                <li><strong>결제 시</strong>: 결제 정보, 청구지 주소</li>
                <li><strong>서비스 이용 시</strong>: IP주소, 접속로그, 서비스 이용기록</li>
              </ul>
              
              <h3>선택 수집 정보</h3>
              <ul>
                <li>회사명, 부서, 직책</li>
                <li>마케팅 수신 동의 여부</li>
              </ul>
              
              <h3>자동 수집 정보</h3>
              <ul>
                <li>쿠키, 접속 IP정보, 방문일시</li>
                <li>서비스 이용기록, 불량 이용기록</li>
                <li>기기정보(OS, 브라우저 등)</li>
              </ul>
            </div>
          </section>

          <section className="legal-section">
            <h2>4. 개인정보의 처리 및 보유기간</h2>
            <ol>
              <li><strong>회원정보</strong>: 회원탈퇴 시까지
                <ul>
                  <li>단, 관계법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료 시까지</li>
                </ul>
              </li>
              <li><strong>서비스 이용기록</strong>: 수집일로부터 1년</li>
              <li><strong>결제정보</strong>: 거래 완료일로부터 5년 (전자상거래법)</li>
              <li><strong>고객문의 기록</strong>: 처리 완료일로부터 3년</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2>5. 개인정보의 제3자 제공</h2>
            <p>
              회사는 정보주체의 개인정보를 제2조(개인정보의 처리목적)에서 명시한 범위 내에서만 
              처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조 및 
              제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
            </p>
            
            <div className="info-table">
              <h3>개인정보 제공 현황</h3>
              <ul>
                <li><strong>결제대행업체</strong>
                  <ul>
                    <li>제공받는 자: 토스페이먼츠, 카카오페이 등</li>
                    <li>제공목적: 결제 처리</li>
                    <li>제공항목: 결제 관련 정보</li>
                    <li>보유기간: 거래 완료 후 5년</li>
                  </ul>
                </li>
              </ul>
            </div>
          </section>

          <section className="legal-section">
            <h2>6. 개인정보처리 위탁</h2>
            <p>회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>
            
            <div className="info-table">
              <ul>
                <li><strong>AWS (Amazon Web Services)</strong>
                  <ul>
                    <li>위탁업무: 클라우드 서버 제공</li>
                    <li>개인정보 보유기간: 위탁계약 종료 시까지</li>
                  </ul>
                </li>
                <li><strong>Google Analytics</strong>
                  <ul>
                    <li>위탁업무: 웹사이트 분석</li>
                    <li>개인정보 보유기간: 14개월</li>
                  </ul>
                </li>
              </ul>
            </div>
          </section>

          <section className="legal-section">
            <h2>7. 정보주체의 권리·의무 및 그 행사방법</h2>
            <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
            <ol>
              <li>개인정보 처리현황 통지요구</li>
              <li>개인정보 열람요구</li>
              <li>개인정보 정정·삭제요구</li>
              <li>개인정보 처리정지요구</li>
            </ol>
            <p>
              권리 행사는 개인정보보호법 시행령 제41조제1항에 따라 서면, 전자우편, 
              모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. 개인정보의 파기</h2>
            <ol>
              <li>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
                  지체없이 해당 개인정보를 파기합니다.</li>
              <li><strong>파기절차</strong>
                <ul>
                  <li>불필요한 개인정보 및 개인정보파일은 개인정보보호책임자의 승인을 받아 파기합니다.</li>
                </ul>
              </li>
              <li><strong>파기방법</strong>
                <ul>
                  <li>전자적 파일: 기술적 방법을 사용하여 복구 불가능하게 삭제</li>
                  <li>종이문서: 분쇄기로 분쇄하거나 소각</li>
                </ul>
              </li>
            </ol>
          </section>

          <section className="legal-section">
            <h2>9. 개인정보의 안전성 확보조치</h2>
            <p>회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다:</p>
            <ul>
              <li><strong>관리적 조치</strong>: 개인정보처리 직원의 최소화 및 교육</li>
              <li><strong>기술적 조치</strong>: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 
                  고유식별정보 등의 암호화, 보안프로그램 설치</li>
              <li><strong>물리적 조치</strong>: 전산실, 자료보관실 등의 접근통제</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>10. 개인정보보호책임자</h2>
            <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 
               불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다:</p>
            
            <div className="contact-info">
              <h3>개인정보보호책임자</h3>
              <ul>
                <li>성명: 전남규 </li>
                <li>직책: 개인정보보호책임자</li>
                                 <li>연락처: privacy@realcatcha.com</li>
                <li>전화: 02-1234-5678</li>
              </ul>
            </div>
          </section>

          <section className="legal-section">
            <h2>11. 개인정보 처리방침 변경</h2>
            <ol>
              <li>이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 
                  추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 
                  통하여 고지할 것입니다.</li>
              <li>이전 개인정보처리방침은 아래에서 확인하실 수 있습니다.
                <ul>
                  <li>2024.01.01 ~ 2024.08.18: <a href="#prev-policy">이전 방침 보기</a></li>
                </ul>
              </li>
            </ol>
          </section>

          <section className="legal-section">
            <h2>12. 정보주체의 권익침해 신고센터</h2>
            <p>개인정보보호 관련 신고나 상담이 필요한 경우 아래 기관에 문의하실 수 있습니다:</p>
            <ul>
              <li><strong>개인정보보호위원회</strong>: privacy.go.kr / 국번없이 182</li>
              <li><strong>개인정보보호 종합지원 포털</strong>: privacy.go.kr</li>
              <li><strong>개인정보 침해신고센터</strong>: privacy.go.kr / 국번없이 182</li>
              <li><strong>대검찰청 사이버범죄수사단</strong>: www.spo.go.kr / 02-3480-3573</li>
              <li><strong>경찰청 사이버테러대응센터</strong>: www.netan.go.kr / 국번없이 182</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
