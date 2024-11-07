# 使用官方的 Node.js 映像作為基礎映像
FROM node:14

# 設置工作目錄
WORKDIR /usr/src/app

# 複製應用程序代碼
COPY . .

# 安裝依賴項
RUN npm install

# 暴露應用程序運行的端口
EXPOSE 3001

# 定義啟動命令
CMD ["node", "server.js"]