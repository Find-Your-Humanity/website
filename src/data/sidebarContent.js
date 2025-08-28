// 사이드바 아이템 목록
export const sidebarItems = [
  'api_key_usage_guide',
  '설정',
  'invisible_captcha',
  'custom_theme',
  'language_codes',
  'faq',
  'enterprise_account_management',
  'recaptcha_migration',
  'mobile_sdk',
  '통합',
  'pro_features',
  'enterprise_overview'
];

// 사이드바 콘텐츠 데이터
export const sidebarContent = {
  'api_key_usage_guide': {
    ko: {
      title: 'API 키 사용 가이드',
      content: '발급받은 API 키와 Secret 키를 사용하여 REAL 캡차를 웹사이트에 통합하는 방법을 단계별로 알아보세요.',
      sections: {
        'api-key-overview': {
          title: 'API 키 개요',
          content: 'API 키는 프론트엔드에서 위젯을 렌더링하는 데 사용되고, Secret 키는 서버 사이드에서 토큰을 검증하는 데 사용됩니다. 두 키 모두 안전하게 보관해야 합니다.'
        },
        'frontend-integration': {
          title: '프론트엔드 통합',
          content: `1. HTML에 REAL 스크립트 추가
2. 위젯 컨테이너 생성
3. API 키로 위젯 초기화
4. 콜백 함수 설정

예시 코드:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>REAL Captcha 예제</title>
    <script src="https://1df60f5faf3b4f2f992ced2edbae22ad.kakaoiedge.com/latest/realcaptcha-widget.min.js"></script>
</head>
<body>
    <form id="login-form">
        <input type="email" placeholder="이메일" required>
        <input type="password" placeholder="비밀번호" required>
        
        <!-- REAL 위젯 컨테이너 -->
        <div id="real-captcha"></div>
        
        <button type="submit">로그인</button>
    </form>

    <script>
        // API 키로 위젯 초기화
        REAL.init({
            siteKey: 'YOUR_API_KEY_HERE',
            container: '#real-captcha',
            callback: function(token) {
                // 캡차 성공 시 실행
                console.log('캡차 성공:', token);
                document.getElementById('login-form').submit();
            },
            'expired-callback': function() {
                // 토큰 만료 시 실행
                console.log('토큰 만료');
                REAL.reset();
            }
        });
    </script>
</body>
</html>
\`\`\``
        },
        'backend-verification': {
          title: '백엔드 검증',
          content: `프론트엔드에서 받은 토큰을 서버에서 검증하는 방법입니다.

Node.js 예시:
\`\`\`javascript
const axios = require('axios');

async function verifyCaptcha(token) {
    try {
        const response = await axios.post('https://gateway.realcatcha.com/api/captcha/verify', {
            secret: 'YOUR_SECRET_KEY_HERE',
            response: token
        });
        
        if (response.data.success) {
            console.log('캡차 검증 성공');
            return true;
        } else {
            console.log('캡차 검증 실패:', response.data.error);
            return false;
        }
    } catch (error) {
        console.error('검증 오류:', error);
        return false;
    }
}

// Express.js 라우트 예시
app.post('/login', async (req, res) => {
    const { email, password, captchaToken } = req.body;
    
    // 캡차 검증
    const isValidCaptcha = await verifyCaptcha(captchaToken);
    
    if (!isValidCaptcha) {
        return res.status(400).json({ error: '캡차 검증 실패' });
    }
    
    // 로그인 로직 계속...
    res.json({ success: true });
});
\`\`\`

Python 예시:
\`\`\`python
import requests

def verify_captcha(token, secret_key):
    try:
        response = requests.post('https://gateway.realcatcha.com/api/captcha/verify', {
            'secret': secret_key,
            'response': token
        })
        
        data = response.json()
        if data.get('success'):
            print('캡차 검증 성공')
            return True
        else:
            print('캡차 검증 실패:', data.get('error'))
            return False
    except Exception as e:
        print('검증 오류:', e)
        return False

# Flask 예시
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    captcha_token = data.get('captchaToken')
    
    # 캡차 검증
    if not verify_captcha(captcha_token, 'YOUR_SECRET_KEY_HERE'):
        return jsonify({'error': '캡차 검증 실패'}), 400
    
    # 로그인 로직 계속...
    return jsonify({'success': True})
\`\`\``
        },
        'react-integration': {
          title: 'React 통합',
          content: `React 컴포넌트에서 REAL 캡차를 사용하는 방법입니다.

\`\`\`jsx
import React, { useEffect, useRef } from 'react';

const CaptchaWidget = ({ onSuccess, onExpired }) => {
    const captchaRef = useRef(null);
    
    useEffect(() => {
        // REAL 스크립트 로드
        const script = document.createElement('script');
        script.src = 'https://1df60f5faf3b4f2f992ced2edbae22ad.kakaoiedge.com/latest/realcaptcha-widget.min.js';
        script.async = true;
        script.onload = () => {
            // 위젯 초기화
            if (window.REAL && captchaRef.current) {
                window.REAL.init({
                    siteKey: 'YOUR_API_KEY_HERE',
                    container: captchaRef.current,
                    callback: onSuccess,
                    'expired-callback': onExpired
                });
            }
        };
        document.head.appendChild(script);
        
        return () => {
            // 컴포넌트 언마운트 시 정리
            if (window.REAL) {
                window.REAL.reset();
            }
        };
    }, [onSuccess, onExpired]);
    
    return <div ref={captchaRef} />;
};

// 사용 예시
const LoginForm = () => {
    const handleCaptchaSuccess = (token) => {
        console.log('캡차 성공:', token);
        // 폼 제출 로직
    };
    
    const handleCaptchaExpired = () => {
        console.log('캡차 만료');
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="이메일" required />
            <input type="password" placeholder="비밀번호" required />
            <CaptchaWidget 
                onSuccess={handleCaptchaSuccess}
                onExpired={handleCaptchaExpired}
            />
            <button type="submit">로그인</button>
        </form>
    );
};
\`\`\``
        },
        'vue-integration': {
          title: 'Vue.js 통합',
          content: `Vue.js 컴포넌트에서 REAL 캡차를 사용하는 방법입니다.

\`\`\`vue
<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input v-model="email" type="email" placeholder="이메일" required />
      <input v-model="password" type="password" placeholder="비밀번호" required />
      
      <!-- 캡차 위젯 컨테이너 -->
      <div ref="captchaContainer"></div>
      
      <button type="submit">로그인</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      captchaToken: null
    };
  },
  
  mounted() {
    this.loadCaptcha();
  },
  
  methods: {
    loadCaptcha() {
      // REAL 스크립트 로드
      const script = document.createElement('script');
      script.src = 'https://1df60f5faf3b4f2f992ced2edbae22ad.kakaoiedge.com/latest/realcaptcha-widget.min.js';
      script.async = true;
      script.onload = () => {
        this.initCaptcha();
      };
      document.head.appendChild(script);
    },
    
    initCaptcha() {
      if (window.REAL && this.$refs.captchaContainer) {
        window.REAL.init({
          siteKey: 'YOUR_API_KEY_HERE',
          container: this.$refs.captchaContainer,
          callback: this.onCaptchaSuccess,
          'expired-callback': this.onCaptchaExpired
        });
      }
    },
    
    onCaptchaSuccess(token) {
      this.captchaToken = token;
      console.log('캡차 성공:', token);
    },
    
    onCaptchaExpired() {
      this.captchaToken = null;
      console.log('캡차 만료');
      window.REAL.reset();
    },
    
    async handleSubmit() {
      if (!this.captchaToken) {
        alert('캡차를 완료해주세요.');
        return;
      }
      
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            captchaToken: this.captchaToken
          })
        });
        
        const data = await response.json();
        if (data.success) {
          console.log('로그인 성공');
        } else {
          console.log('로그인 실패:', data.error);
        }
      } catch (error) {
        console.error('로그인 오류:', error);
      }
    }
  }
};
</script>
\`\`\``
        },
        'security-best-practices': {
          title: '보안 모범 사례',
          content: `API 키와 Secret 키를 안전하게 사용하기 위한 모범 사례입니다.

1. **환경 변수 사용**
   - API 키와 Secret 키를 코드에 직접 하드코딩하지 마세요
   - 환경 변수나 설정 파일을 사용하세요

2. **도메인 제한**
   - 대시보드에서 허용된 도메인을 설정하세요
   - localhost 개발 환경과 프로덕션 도메인을 모두 등록하세요

3. **HTTPS 사용**
   - 프로덕션 환경에서는 반드시 HTTPS를 사용하세요
   - HTTP에서는 캡차가 제대로 작동하지 않을 수 있습니다

4. **토큰 검증**
   - 모든 사용자 입력에 대해 서버 사이드 검증을 수행하세요
   - 토큰은 일회성이며 재사용할 수 없습니다

5. **에러 처리**
   - 캡차 검증 실패 시 적절한 에러 메시지를 표시하세요
   - 사용자에게 다시 시도하도록 안내하세요

예시 환경 변수 설정:
\`\`\`bash
# .env 파일
REAL_API_KEY=rc_live_your_api_key_here
REAL_SECRET_KEY=rc_sk_your_secret_key_here
\`\`\`

Node.js에서 환경 변수 사용:
\`\`\`javascript
require('dotenv').config();

const apiKey = process.env.REAL_API_KEY;
const secretKey = process.env.REAL_SECRET_KEY;
\`\`\`

Python에서 환경 변수 사용:
\`\`\`python
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('REAL_API_KEY')
secret_key = os.getenv('REAL_SECRET_KEY')
\`\`\``
        },
        'troubleshooting': {
          title: '문제 해결',
          content: `일반적인 문제들과 해결 방법입니다.

**1. "Invalid site key" 오류**
- API 키가 올바른지 확인하세요
- 도메인이 허용 목록에 등록되어 있는지 확인하세요
- localhost 개발 시 http://localhost:3000 형식으로 등록하세요

**2. "Invalid secret key" 오류**
- Secret 키가 올바른지 확인하세요
- 환경 변수가 제대로 설정되어 있는지 확인하세요

**3. 위젯이 표시되지 않음**
- REAL 스크립트가 제대로 로드되었는지 확인하세요
- 컨테이너 요소가 존재하는지 확인하세요
- 브라우저 콘솔에서 오류 메시지를 확인하세요

**4. 토큰 검증 실패**
- 토큰이 만료되지 않았는지 확인하세요 (토큰은 2분 후 만료)
- 올바른 Secret 키를 사용하고 있는지 확인하세요
- 서버 시간이 정확한지 확인하세요

**5. CORS 오류**
- 허용된 도메인에 현재 도메인이 등록되어 있는지 확인하세요
- 개발 환경에서는 localhost를 등록하세요

**디버깅 팁:**
\`\`\`javascript
// 브라우저 콘솔에서 위젯 상태 확인
console.log('REAL 객체:', window.REAL);

// 위젯 초기화 상태 확인
if (window.REAL) {
    console.log('위젯 초기화됨');
} else {
    console.log('위젯 초기화 안됨');
}
\`\`\``
        }
      }
    },
    en: {
      title: 'API Key Usage Guide',
      content: 'Learn how to integrate REAL captcha into your website using your issued API key and Secret key step by step.',
      sections: {
        'api-key-overview': {
          title: 'API Key Overview',
          content: 'The API key is used to render widgets on the frontend, and the Secret key is used to verify tokens on the server side. Both keys must be kept secure.'
        },
        'frontend-integration': {
          title: 'Frontend Integration',
          content: `1. Add REAL script to HTML
2. Create widget container
3. Initialize widget with API key
4. Set callback functions

Example code:
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>REAL Captcha Example</title>
    <script src="https://1df60f5faf3b4f2f992ced2edbae22ad.kakaoiedge.com/latest/realcaptcha-widget.min.js"></script>
</head>
<body>
    <form id="login-form">
        <input type="email" placeholder="Email" required>
        <input type="password" placeholder="Password" required>
        
        <!-- REAL widget container -->
        <div id="real-captcha"></div>
        
        <button type="submit">Login</button>
    </form>

    <script>
        // Initialize widget with API key
        REAL.init({
            siteKey: 'YOUR_API_KEY_HERE',
            container: '#real-captcha',
            callback: function(token) {
                // Executed when captcha succeeds
                console.log('Captcha success:', token);
                document.getElementById('login-form').submit();
            },
            'expired-callback': function() {
                // Executed when token expires
                console.log('Token expired');
                REAL.reset();
            }
        });
    </script>
</body>
</html>
\`\`\``
        },
        'backend-verification': {
          title: 'Backend Verification',
          content: `How to verify tokens received from the frontend on the server.

Node.js example:
\`\`\`javascript
const axios = require('axios');

async function verifyCaptcha(token) {
    try {
        const response = await axios.post('https://gateway.realcatcha.com/api/captcha/verify', {
            secret: 'YOUR_SECRET_KEY_HERE',
            response: token
        });
        
        if (response.data.success) {
            console.log('Captcha verification successful');
            return true;
        } else {
            console.log('Captcha verification failed:', response.data.error);
            return false;
        }
    } catch (error) {
        console.error('Verification error:', error);
        return false;
    }
}

// Express.js route example
app.post('/login', async (req, res) => {
    const { email, password, captchaToken } = req.body;
    
    // Verify captcha
    const isValidCaptcha = await verifyCaptcha(captchaToken);
    
    if (!isValidCaptcha) {
        return res.status(400).json({ error: 'Captcha verification failed' });
    }
    
    // Continue login logic...
    res.json({ success: true });
});
\`\`\`

Python example:
\`\`\`python
import requests

def verify_captcha(token, secret_key):
    try:
        response = requests.post('https://gateway.realcatcha.com/api/captcha/verify', {
            'secret': secret_key,
            'response': token
        })
        
        data = response.json()
        if data.get('success'):
            print('Captcha verification successful')
            return True
        else:
            print('Captcha verification failed:', data.get('error'))
            return False
    except Exception as e:
        print('Verification error:', e)
        return False

# Flask example
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    captcha_token = data.get('captchaToken')
    
    # Verify captcha
    if not verify_captcha(captcha_token, 'YOUR_SECRET_KEY_HERE'):
        return jsonify({'error': 'Captcha verification failed'}), 400
    
    # Continue login logic...
    return jsonify({'success': True})
\`\`\``
        },
        'react-integration': {
          title: 'React Integration',
          content: `How to use REAL captcha in React components.

\`\`\`jsx
import React, { useEffect, useRef } from 'react';

const CaptchaWidget = ({ onSuccess, onExpired }) => {
    const captchaRef = useRef(null);
    
    useEffect(() => {
        // Load REAL script
        const script = document.createElement('script');
        script.src = 'https://1df60f5faf3b4f2f992ced2edbae22ad.kakaoiedge.com/latest/realcaptcha-widget.min.js';
        script.async = true;
        script.onload = () => {
            // Initialize widget
            if (window.REAL && captchaRef.current) {
                window.REAL.init({
                    siteKey: 'YOUR_API_KEY_HERE',
                    container: captchaRef.current,
                    callback: onSuccess,
                    'expired-callback': onExpired
                });
            }
        };
        document.head.appendChild(script);
        
        return () => {
            // Cleanup on component unmount
            if (window.REAL) {
                window.REAL.reset();
            }
        };
    }, [onSuccess, onExpired]);
    
    return <div ref={captchaRef} />;
};

// Usage example
const LoginForm = () => {
    const handleCaptchaSuccess = (token) => {
        console.log('Captcha success:', token);
        // Form submission logic
    };
    
    const handleCaptchaExpired = () => {
        console.log('Captcha expired');
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <CaptchaWidget 
                onSuccess={handleCaptchaSuccess}
                onExpired={handleCaptchaExpired}
            />
            <button type="submit">Login</button>
        </form>
    );
};
\`\`\``
        },
        'vue-integration': {
          title: 'Vue.js Integration',
          content: `How to use REAL captcha in Vue.js components.

\`\`\`vue
<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      
      <!-- Captcha widget container -->
      <div ref="captchaContainer"></div>
      
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      captchaToken: null
    };
  },
  
  mounted() {
    this.loadCaptcha();
  },
  
  methods: {
    loadCaptcha() {
      // Load REAL script
      const script = document.createElement('script');
      script.src = 'https://1df60f5faf3b4f2f992ced2edbae22ad.kakaoiedge.com/latest/realcaptcha-widget.min.js';
      script.async = true;
      script.onload = () => {
        this.initCaptcha();
      };
      document.head.appendChild(script);
    },
    
    initCaptcha() {
      if (window.REAL && this.$refs.captchaContainer) {
        window.REAL.init({
          siteKey: 'YOUR_API_KEY_HERE',
          container: this.$refs.captchaContainer,
          callback: this.onCaptchaSuccess,
          'expired-callback': this.onCaptchaExpired
        });
      }
    },
    
    onCaptchaSuccess(token) {
      this.captchaToken = token;
      console.log('Captcha success:', token);
    },
    
    onCaptchaExpired() {
      this.captchaToken = null;
      console.log('Captcha expired');
      window.REAL.reset();
    },
    
    async handleSubmit() {
      if (!this.captchaToken) {
        alert('Please complete the captcha.');
        return;
      }
      
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            captchaToken: this.captchaToken
          })
        });
        
        const data = await response.json();
        if (data.success) {
          console.log('Login successful');
        } else {
          console.log('Login failed:', data.error);
        }
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  }
};
</script>
\`\`\``
        },
        'security-best-practices': {
          title: 'Security Best Practices',
          content: `Best practices for securely using API keys and Secret keys.

1. **Use Environment Variables**
   - Don't hardcode API keys and Secret keys directly in your code
   - Use environment variables or configuration files

2. **Domain Restrictions**
   - Set allowed domains in the dashboard
   - Register both localhost development environment and production domains

3. **Use HTTPS**
   - Always use HTTPS in production environments
   - Captcha may not work properly on HTTP

4. **Token Verification**
   - Perform server-side verification for all user inputs
   - Tokens are one-time use and cannot be reused

5. **Error Handling**
   - Display appropriate error messages when captcha verification fails
   - Guide users to try again

Example environment variable setup:
\`\`\`bash
# .env file
REAL_API_KEY=rc_live_your_api_key_here
REAL_SECRET_KEY=rc_sk_your_secret_key_here
\`\`\`

Using environment variables in Node.js:
\`\`\`javascript
require('dotenv').config();

const apiKey = process.env.REAL_API_KEY;
const secretKey = process.env.REAL_SECRET_KEY;
\`\`\`

Using environment variables in Python:
\`\`\`python
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('REAL_API_KEY')
secret_key = os.getenv('REAL_SECRET_KEY')
\`\`\``
        },
        'troubleshooting': {
          title: 'Troubleshooting',
          content: `Common issues and solutions.

**1. "Invalid site key" error**
- Verify that your API key is correct
- Check if your domain is registered in the allowed list
- For localhost development, register as http://localhost:3000

**2. "Invalid secret key" error**
- Verify that your Secret key is correct
- Check if environment variables are properly set

**3. Widget not displaying**
- Check if the REAL script is properly loaded
- Verify that the container element exists
- Check for error messages in the browser console

**4. Token verification failure**
- Check if the token has not expired (tokens expire after 2 minutes)
- Verify you are using the correct Secret key
- Check if server time is accurate

**5. CORS error**
- Check if your current domain is registered in allowed domains
- Register localhost for development environments

**Debugging tips:**
\`\`\`javascript
// Check widget status in browser console
console.log('REAL object:', window.REAL);

// Check widget initialization status
if (window.REAL) {
    console.log('Widget initialized');
} else {
    console.log('Widget not initialized');
}
\`\`\``
        }
      }
    }
  }
};
