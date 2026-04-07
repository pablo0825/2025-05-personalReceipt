# 個人領據產生器

填寫表單或上傳 Excel，自動產生領據 PDF 並下載。支援銀行與郵局兩種收款模式。

## 功能

- **單筆模式**：填寫表單，產生單一 PDF 並下載
- **批次模式**：上傳 `.xlsx` 檔案，一次產生多份 PDF 並打包成 ZIP 下載
- 支援**銀行**與**郵局**兩種收款模式切換

## 使用方式

### 單筆模式

1. 開啟網站，預設為銀行模式
2. 若要使用郵局模式，勾選頁面上方的「啟用郵局模式」
3. 填寫表單欄位（姓名、服務單位、職稱、身分證字號、Email、帳號資訊、日期等）
4. 點擊「提交」，PDF 自動下載

### 批次模式

1. 點擊上方導覽切換至批次頁面
2. 若要使用郵局模式，勾選「啟用郵局模式」
3. 下載範本 Excel（頁面上有範本連結），按照欄位格式填入資料
4. 拖曳或點擊上傳 `.xlsx` 檔案
5. 確認無誤後點擊產生，ZIP 檔自動下載，內含每位收款人的獨立 PDF

#### Excel 欄位說明

**銀行模式**

| 欄位名稱 | 說明 |
|----------|------|
| fullName | 姓名 |
| organization | 服務單位 |
| jobTitle | 職稱 |
| receiptReason | 受領事由 |
| amount | 金額 |
| idNumber | 身分證字號（格式：1 英文字 + 9 數字，例如 A123456789） |
| email | Email |
| bankBranchCode | 銀行分行代號 |
| bankBranchName | 銀行分行名稱 |
| bankAccountNumber | 銀行帳號 |
| date | 日期（格式：YYYYMMDD，例如 20250616） |

**郵局模式**

| 欄位名稱 | 說明 |
|----------|------|
| fullName | 姓名 |
| organization | 服務單位 |
| jobTitle | 職稱 |
| receiptReason | 受領事由 |
| amount | 金額 |
| idNumber | 身分證字號（格式：1 英文字 + 9 數字，例如 A123456789） |
| email | Email |
| postalCode | 郵局代號 |
| postOfficeAccount | 郵局帳號 |
| date | 日期（格式：YYYYMMDD，例如 20250616） |

## 開發

### 環境需求

- Node.js 18 以上

### 安裝與啟動

```bash
npm install
npm run dev
```

瀏覽器開啟 http://localhost:5173

### 常用指令

```bash
npm run build   # 型別檢查 + 打包
npm run test    # 執行單元測試
npm run lint    # ESLint 檢查
```
