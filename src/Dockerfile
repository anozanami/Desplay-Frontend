# 1단계: 빌드 단계
FROM node:16 AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json을 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 리액트 애플리케이션 빌드
RUN npm run build

# 2단계: 실행 단계
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 파일을 Nginx의 정적 파일 제공 디렉토리로 복사
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 포트 설정
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]

# npm start 스크립트 실행
CMD ["npm", "start"]

# 그리고 Dockerfile로 docker 이미지를 빌드해야한다.
# $ docker build .