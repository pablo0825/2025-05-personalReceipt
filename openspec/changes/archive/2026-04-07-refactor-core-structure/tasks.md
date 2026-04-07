## 1. 拆分 `GlobalVariable.ts`（Module separation for GlobalVariable）

- [x] 1.1 實作 Module separation for GlobalVariable：建立 `src/constants/pdfCoordinates.ts`，將 `bankAccountX` 與 `idNumberX` 移入
- [x] 1.2 建立 `src/constants/formFields.ts`，將 `formField`、`postalFormField`、`item` 移入
- [x] 1.3 建立 `src/schemas/receiptSchema.ts`，提取共用 Zod schema 基底（`baseReceiptSchema` / Shared base Zod schema），並以 `.extend()` 衍生 `formFieldSchema` 與 `postalFormFieldSchema`，同時 export 衍生型別
- [x] 1.4 改寫 `src/var/GlobalVariable.ts` 為純 re-export 相容層（backward-compatible re-export），頂部加註說明此為相容層，原始定義已移至各模組

## 2. 提取共用 PDF 工具函式 `buildPDF`（Shared PDF build utility）

- [x] 2.1 建立 `src/utils/buildPDF.ts`，定義 `CommonFields`、`BankFields`、`PostalFields` 介面與 `BuildPDFData` discriminated union 型別
- [x] 2.2 實作 Shared PDF build utility — `buildPDF(data: BuildPDFData): Promise<Uint8Array>`，包含：載入模板、載入字型、繪製共用欄位（fullName、organization、jobTitle、receiptReason、amount、idNumber、email）、根據 `mode` 繪製模式特定欄位（銀行：bankBranchCode、bankBranchName、bankAccountNumber；郵局：postalCode、postOfficeAccount）
- [x] 2.3 在 `buildPDF` 中實作統一日期解析 / Unified date parsing（`parseDate`），支援 `YYYY-MM-DD` 與 `YYYYMMDD` 兩種格式，並以統一邏輯寫入年/月/日

## 3. 重構四個 PDF Hook

- [x] 3.1 重構 `useGeneratePDF.ts`：移除重複邏輯，改為呼叫 `buildPDF({ ...formData, mode: 'bank' })` 後執行 `saveAs`
- [x] 3.2 重構 `useGeneratePostalPDF.ts`：移除重複邏輯，改為呼叫 `buildPDF({ ...formData, mode: 'postal' })` 後執行 `saveAs`
- [x] 3.3 重構 `useGenerateMultiplePDFs.ts`：移除逐筆重複邏輯，迴圈內改為呼叫 `buildPDF({ ...row, mode: 'bank' })` 後存入 JSZip
- [x] 3.4 重構 `useGenerateMultiplePostalPDFs.ts`：移除逐筆重複邏輯，迴圈內改為呼叫 `buildPDF({ ...row, mode: 'postal' })` 後存入 JSZip

## 4. 清理死碼

- [x] 4.1 移除 `useGenerateMultiplePDFs.ts` 與 `useGenerateMultiplePostalPDFs.ts` 中的 `console.log(day)`
- [x] 4.2 移除所有 comment 掉的程式碼（`GlobalVariable.ts` 中的 extraFormField、各 hook 中的 bankBranchName 郵局區塊等）
- [x] 4.3 移除 `GlobalVariable.ts` 中的 `requiredFields` 與 `requiredPostalFields` 陣列（若確認無任何地方使用；若有使用則移至對應模組）

## 5. 驗證

- [x] 5.1 執行 `npm run build` 確認型別檢查通過、無 import 錯誤
- [x] 5.2 執行 `npm run test` 確認所有現有單元測試仍通過
- [x] 5.3 手動測試單筆銀行模式與單筆郵局模式的 PDF 產生結果正確
- [x] 5.4 手動測試批次銀行模式的日期解析正確（以 Excel 匯入）
