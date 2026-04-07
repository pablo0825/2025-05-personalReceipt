## 1. 建立 buildPDF utility 直接測試（buildPDF utility is directly tested）

- [x] 1.1 實作 buildPDF utility is directly tested：建立 `src/tests/utils/buildPDF.test.ts`，設定 mock：`vi.spyOn(PDFDocument, "load")`、`global.fetch` mock（ok: true）、`vi.mock("file-saver")`
- [x] 1.2 實作 bank mode 測試情境：呼叫 `buildPDF({ ...bankData, mode: "bank" })`，確認回傳 `Uint8Array`（parseDate handles YYYY-MM-DD）
- [x] 1.3 實作 postal mode 測試情境：呼叫 `buildPDF({ ...postalData, mode: "postal" })`，確認回傳 `Uint8Array`（parseDate handles YYYYMMDD — date 格式為 `"20250616"`）
- [x] 1.4 實作模板載入失敗情境：mock fetch 第一次回傳 `ok: false`，確認 `buildPDF` throw Error `"無法載入 PDF 模板"`（Template load failure throws）
- [x] 1.5 實作字型載入失敗情境：mock fetch 第一次 ok、第二次 `ok: false`，確認 `buildPDF` throw Error `"無法載入中文字型"`（Font load failure throws）

## 2. 清理並修正 Hook 層測試（Hook-layer tests verify saveAs is called）

- [x] 2.1 Hook-layer tests verify saveAs is called：刪除 `src/tests/hooks/useGeneratePDF.test.ts` 與 `src/tests/hooks/useGeneratePostalPDF.test.ts`
- [x] 2.2 建立 `src/tests/hooks/useGeneratePDF.test.ts`（重建為薄 smoke test）：mock `buildPDF` 模組，測 `useGeneratePDF calls saveAs on success`
- [x] 2.3 在同個檔案加入 `useGeneratePostalPDF calls saveAs on success`：mock `buildPDF`，確認 `saveAs` 被呼叫（useGeneratePostalPDF calls saveAs on success）
- [x] 2.4 在同個檔案加入 error 情境：`buildPDF` reject 時，`window.alert` 被呼叫、`saveAs` 不被呼叫（Hook catches buildPDF error and alerts）

## 3. 建立批次 Hook 測試（Batch PDF generation is tested）

- [x] 3.1 Batch PDF generation is tested：建立 `src/tests/hooks/useGenerateMultiplePDFs.test.ts`，設定 mock：`vi.mock("../../../utils/buildPDF")`、`vi.mock("file-saver")`、XLSX mock（回傳固定 rows 陣列）
- [x] 3.2 實作全部成功情境：3 筆 rows 全部成功，確認 `saveAs` 以 `"批次領據.zip"` 呼叫一次（All rows succeed and zip is downloaded）
- [x] 3.3 實作單筆失敗不中斷情境：第 2 筆 `buildPDF` reject，確認第 1、3 筆仍處理，`saveAs` 仍被呼叫（One row fails without aborting the rest）
- [x] 3.4 實作進度 callback 情境：3 筆 rows，確認 callback 依序以 `34`、`67`、`100` 呼叫（Progress callback reflects per-row completion）

## 4. 驗證

- [x] 4.1 執行 `npm run test` 確認所有測試通過（包含新增、重建的測試）
