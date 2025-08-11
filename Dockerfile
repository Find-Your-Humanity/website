# 멀티스테이지 빌드
FROM node:18-alpine as builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json 복사
COPY package*.json ./

# 의존성 설치 (개발 의존성 포함)
RUN npm ci

# 소스 코드 복사
COPY . .

# 빌드
RUN npm run build

# 프로덕션 이미지
FROM nginx:alpine

# nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 포트 노출
EXPOSE 80

# 헬스체크 (alpine busybox의 wget 사용)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://localhost:80/ || exit 1

# nginx 시작
CMD ["nginx", "-g", "daemon off;"] 