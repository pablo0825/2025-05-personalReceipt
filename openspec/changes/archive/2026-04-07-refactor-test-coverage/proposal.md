## Why

重構後的 `buildPDF` 是核心邏輯，但沒有直接測試；批次 hook 完全沒有測試；現有 hook 測試有一個 test case 意圖不清楚。測試結構需對齊重構後的程式碼架構。

## What Changes

- 新建 `src/tests/utils/buildPDF.test.ts`：直接測 `buildPDF` 工具函式，涵蓋銀行/郵局兩種模式、`parseDate` 的 `YYYY-MM-DD` 與 `YYYYMMDD` 兩種格式、模板載入失敗與字型載入失敗的 Error 路徑
- **BREAKING** 刪除 `src/tests/hooks/useGeneratePDF.test.ts` 與 `src/tests/hooks/useGeneratePostalPDF.test.ts`，改以 `buildPDF.test.ts` 的參數化測試涵蓋等效場景；hook 層保留薄的 smoke test（確認 `saveAs` 被呼叫）
- 新建 `src/tests/hooks/useGenerateMultiplePDFs.test.ts`：測批次銀行模式 — 成功產生 zip、單筆失敗不中斷、進度 callback 正確呼叫
- 修正 `useGeneratePDF.test.ts` 中意圖不清的第三個測試（`應在表單資料缺失時不產生 PDF`）：改為明確測試 `buildPDF` 在 `fullName` 為空時仍嘗試產生 PDF（Zod 驗證在 form 層，hook 層不阻擋），移除模糊的 comment

## Non-Goals

- 不新增 E2E 或整合測試
- 不測試 UI 元件（`BatchPage`、`HomePage`）的行為
- 不改動 `src/tests/components/` 下的測試
- 不改動 `src/tests/utils/validateExcelHeaders.test.ts`

## Capabilities

### New Capabilities

- `test-coverage`: 定義測試套件應覆蓋的範圍與驗收條件（buildPDF、批次 hook、hook smoke test）

### Modified Capabilities

（無，測試層的改動不影響既有 spec 層需求）

## Impact

- Affected code:
  - 刪除 `src/tests/hooks/useGeneratePDF.test.ts`
  - 刪除 `src/tests/hooks/useGeneratePostalPDF.test.ts`
  - 新增 `src/tests/utils/buildPDF.test.ts`
  - 新增 `src/tests/hooks/useGenerateMultiplePDFs.test.ts`
