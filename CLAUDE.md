# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git Commit 規範

遵循 Conventional Commits，格式如下：

| Prefix | 用途 |
|--------|------|
| `feat:` | 新功能 |
| `fix:` | 修復 Bug |
| `refactor:` | 重構（無功能變更） |
| `test:` | 測試相關修改 |
| `docs:` | 文件更新 |

## 協作原則

1. **逐步思考**：回答前先展示思考過程，不直接跳到結論。
2. **釐清需求**：若需求不夠清楚，主動要求補充說明，再開始作業。
3. **一問一答**：遇到需要多方確認的問題時，每次只問一個問題，等待回覆後再繼續。
4. **誠實回覆**：不知道的事直接說不知道，不捏造或推測不確定的資訊。

## Commands

```bash
npm run dev        # 啟動開發伺服器（http://localhost:5173）
npm run build      # 型別檢查 + 打包
npm run lint       # ESLint 檢查
npm run test       # 執行所有單元測試（Vitest）
```

執行單一測試檔案：
```bash
npx vitest run src/tests/utils/validateExcelHeaders.test.ts
```

## 架構概覽

這是一個「個人領據 PDF 產生器」，使用者填寫表單或上傳 Excel，系統將資料寫入 PDF 模板並下載。

### 兩種頁面模式

| 路由 | 功能 |
|------|------|
| `/` (HomePage) | 單筆輸入：填表單 → 產生單一 PDF |
| `/batch` (BatchPage) | 批次上傳：上傳 `.xlsx` → 產生多個 PDF 壓縮包（JSZip） |

兩頁都支援「銀行模式」與「郵局模式」切換（Checkbox toggle）。

### PDF 產生流程

四個 hook 各自對應一種組合：

| Hook | 模式 |
|------|------|
| `useGeneratePDF` | 單筆 × 銀行 |
| `useGeneratePostalPDF` | 單筆 × 郵局 |
| `useGenerateMultiplePDFs` | 批次 × 銀行 |
| `useGenerateMultiplePostalPDFs` | 批次 × 郵局 |

所有 hook 皆從 `public/template.pdf` 載入 PDF 模板，搭配 `public/fonts/NotoSansCJK-Regular.ttf` 嵌入中文字型，使用 `pdf-lib` 在固定座標寫入欄位值。

座標常數（身分證字號每格 x、銀行帳號每格 x）定義在 `src/var/GlobalVariable.ts`。

### 表單驗證

`src/var/GlobalVariable.ts` 同時存放：
- 表單欄位定義（`formField` / `postalFormField`）
- Zod schema（`formFieldSchema` / `postalFormFieldSchema`）
- 衍生型別（`formFieldTypes` / `postalFormFieldTypes`）
- PDF 座標常數

透過 `react-hook-form` + `@hookform/resolvers/zod` 整合驗證。

### 批次上傳狀態機

`BatchPage` 的 UI 狀態：
1. **initial**：`UploadInitial`（拖曳/選擇 xlsx）
2. **loading**：Spinner（`simulateLoading` 1.5 秒）
3. **prepare**：`validateExcelHeaders` 驗證欄位 → 若缺欄位則回到 initial
4. **generating**：`UploadPrepaer` + `Popup`（進度條）→ 下載 zip

### 部署

Netlify，`netlify.toml` 設定 SPA redirect（`/* → /index.html`）。
