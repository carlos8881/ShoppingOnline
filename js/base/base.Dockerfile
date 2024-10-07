# 使用官方的 Node.js 映像作為基礎映像
FROM node:14

# 設置工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json
COPY package.json ./

# 安裝依賴
RUN npm install aws-sdk body-parser cors express firebase mysql multer multer-s3 @aws-sdk/client-s3

# 暴露應用程序運行的端口（可選）
EXPOSE 3000