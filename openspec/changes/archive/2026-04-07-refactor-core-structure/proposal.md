## Why

四個 PDF 產生 hook 之間存在大量重複邏輯，`GlobalVariable.ts` 承擔過多責任，且批次模式與單筆模式的日期解析格式不一致，導致維護困難與潛在 bug。

## What Changes

- 將四個 PDF hook（`useGeneratePDF`、`useGeneratePostalPDF`、`useGenerateMultiplePDFs`、`useGenerateMultiplePostalPDFs`）的共用邏輯提取為 `src/utils/buildPDF.ts`，各 hook 改為薄包裝層
- 拆分 `GlobalVariable.ts` 為職責獨立的模組：
  - `src/constants/pdfCoordinates.ts`：PDF 座標常數（`bankAccountX`、`idNumberX`）
  - `src/constants/formFields.ts`：表單欄位定義（`formField`、`postalFormField`）
  - `src/schemas/receiptSchema.ts`：Zod schema 與衍生型別
- 提取銀行/郵局共用的 Zod schema 基底（`baseReceiptSchema`），兩種模式以 `.extend()` 繼承
- 統一日期解析格式：批次模式（Excel）日期目前使用 `YYYYMMDD` 切法，與單筆模式的 `YYYY-MM-DD` 不一致，對齊為同一格式
- 移除殘留的 `console.log(day)`、comment 掉的死碼、重複的 `requiredFields` 陣列

## Non-Goals

- 不改動 UI 元件（`Form.tsx`、`PostalForm.tsx`、`BatchPage.tsx` 等）
- 不新增功能或改變使用者行為
- 不更動 PDF 模板與字型資源
- 不調整測試以外的設定檔（Vite、ESLint、Netlify）

## Capabilities

### New Capabilities

- `pdf-generation-core`：共用 PDF 產生邏輯，支援銀行與郵局兩種模式

### Modified Capabilities

（無，此次重構不變更需求層級行為）

## Impact

- Affected code:
  - `src/hooks/useGeneratePDF.ts`
  - `src/hooks/useGeneratePostalPDF.ts`
  - `src/hooks/useGenerateMultiplePDFs.ts`
  - `src/hooks/useGenerateMultiplePostalPDFs.ts`
  - `src/var/GlobalVariable.ts`（拆分後保留 re-export 以維持向後相容，或直接更新所有 import）
  - 新增 `src/utils/buildPDF.ts`
  - 新增 `src/constants/pdfCoordinates.ts`
  - 新增 `src/constants/formFields.ts`
  - 新增 `src/schemas/receiptSchema.ts`
