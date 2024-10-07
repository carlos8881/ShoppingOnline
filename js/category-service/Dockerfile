# 使用官方的 Node.js 映像作為基礎映像
FROM my-node-base

# 設置工作目錄
WORKDIR /usr/src/app

# 複製應用程序代碼
COPY . .

# 暴露應用程序運行的端口
EXPOSE 3003

# 定義啟動命令
CMD ["node", "server.js"]
