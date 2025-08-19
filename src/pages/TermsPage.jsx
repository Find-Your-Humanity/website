import React from 'react';
import '../styles/pages/LegalPage.css';

const TermsPage = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <h1 className="legal-title">서비스 이용약관</h1>
          <p className="legal-subtitle">RealCaptcha 서비스 이용에 관한 약관입니다.</p>
          <div className="legal-date">최종 업데이트: 2024년 8월 19일</div>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>제1조 (목적)</h2>
            <p>
              본 약관은 RealCaptcha(이하 "회사")가 제공하는 CAPTCHA 검증 서비스(이하 "서비스")의 
              이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 
              규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="legal-section">
            <h2>제2조 (정의)</h2>
            <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
            <ul>
              <li><strong>"서비스"</strong>: 회사가 제공하는 CAPTCHA 검증 API 및 관련 서비스</li>
              <li><strong>"이용자"</strong>: 본 약관에 따라 서비스를 이용하는 개인 또는 법인</li>
              <li><strong>"계정"</strong>: 서비스 이용을 위해 이용자가 설정한 고유 식별자</li>
              <li><strong>"API"</strong>: 서비스에 접근하기 위한 애플리케이션 프로그래밍 인터페이스</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>제3조 (약관의 효력 및 변경)</h2>
            <ol>
              <li>본 약관은 이용자가 동의함으로써 효력이 발생합니다.</li>
              <li>회사는 필요에 따라 본 약관을 변경할 수 있으며, 변경된 약관은 웹사이트에 공지 후 적용됩니다.</li>
              <li>이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있습니다.</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2>제4조 (서비스의 제공)</h2>
            <p>회사는 다음과 같은 서비스를 제공합니다:</p>
            <ul>
              <li>CAPTCHA 검증 API 서비스</li>
              <li>실시간 검증 결과 제공</li>
              <li>사용량 통계 및 분석 도구</li>
              <li>기술 지원 및 고객 서비스</li>
              <li>개발자 문서 및 가이드</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>제5조 (회원가입 및 계정 관리)</h2>
            <ol>
              <li>서비스 이용을 위해서는 회원가입이 필요합니다.</li>
              <li>이용자는 정확하고 최신의 정보를 제공해야 합니다.</li>
              <li>계정 정보의 보안 유지는 이용자의 책임입니다.</li>
              <li>계정의 부정 사용이 발견될 경우 즉시 회사에 신고해야 합니다.</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2>제6조 (서비스 이용)</h2>
            <ol>
              <li>이용자는 본 약관 및 관련 법령을 준수하여 서비스를 이용해야 합니다.</li>
              <li>다음 행위는 금지됩니다:
                <ul>
                  <li>서비스의 오남용 또는 부정 사용</li>
                  <li>API 제한량을 초과하는 과도한 요청</li>
                  <li>다른 이용자의 서비스 이용 방해</li>
                  <li>불법적인 목적으로의 서비스 사용</li>
                </ul>
              </li>
              <li>위반 시 서비스 이용이 제한될 수 있습니다.</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2>제7조 (요금 및 결제)</h2>
            <ol>
              <li>서비스는 요금제에 따라 유료로 제공될 수 있습니다.</li>
              <li>요금은 월 단위로 청구되며, 사전 결제가 원칙입니다.</li>
              <li>환불 정책은 별도 정책에 따릅니다.</li>
              <li>요금 미납 시 서비스 이용이 제한될 수 있습니다.</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2>제8조 (개인정보 보호)</h2>
            <p>
              개인정보의 수집, 이용, 보관, 처리에 관한 사항은 별도의 
              「개인정보처리방침」에 따릅니다.
            </p>
          </section>

          <section className="legal-section">
            <h2>제9조 (서비스의 중단)</h2>
            <ol>
              <li>회사는 시스템 점검, 보수 등의 사유로 서비스를 일시 중단할 수 있습니다.</li>
              <li>천재지변, 전쟁, 기타 불가항력적 사유로 인한 서비스 중단은 면책됩니다.</li>
              <li>서비스 중단 시 사전 공지를 원칙으로 합니다.</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2>제10조 (책임의 제한)</h2>
            <ol>
              <li>회사는 서비스의 정확성, 안정성을 보장하지 않습니다.</li>
              <li>이용자의 서비스 이용으로 인한 손해에 대해 회사는 책임지지 않습니다.</li>
              <li>회사의 책임은 이용자가 지불한 서비스 요금을 초과하지 않습니다.</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2>제11조 (분쟁 해결)</h2>
            <ol>
              <li>본 약관과 관련된 분쟁은 대한민국 법률에 따라 해결됩니다.</li>
              <li>분쟁 발생 시 관할 법원은 회사 소재지 법원으로 합니다.</li>
              <li>분쟁 해결을 위해 성실히 협의합니다.</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2>제12조 (기타)</h2>
            <ol>
              <li>본 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따릅니다.</li>
              <li>약관의 일부가 무효화되어도 나머지 조항은 유효합니다.</li>
            </ol>
          </section>
        </div>

        <div className="legal-footer">
          <div className="contact-info">
            <h3>문의처</h3>
            <p>이메일: legal@realcaptcha.com</p>
            <p>전화: 02-1234-5678</p>
            <p>주소: 서울시 강남구 테헤란로 123, 456호</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
