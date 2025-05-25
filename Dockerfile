# 使用官方 Node.js 映像
FROM node:18-alpine

# 設定工作目錄
WORKDIR /app

# 複製 package 檔案並安裝依賴
COPY package*.json ./
RUN npm install

# 複製全部專案內容
COPY . .

# Expose 預設 Vite 開發伺服器的 port
EXPOSE 5173

# 啟動 Vite 開發伺服器
CMD ["npm", "run", "dev", "--", "--host"]
