## Context

目前專案有四個 PDF 產生 hook，彼此共用約 80% 的邏輯（載入模板、載入字型、繪製共用欄位），僅在帳號區塊（銀行 vs 郵局）有差異。`GlobalVariable.ts` 同時存放表單定義、Zod schema、型別與 PDF 座標，導致職責混亂。此外批次模式與單筆模式的日期字串切法不同，是潛在 bug 來源。

## Goals / Non-Goals

**Goals:**

- 提取 PDF 產生邏輯至共用工具函式，消除四個 hook 之間的重複
- 將 `GlobalVariable.ts` 拆分為職責單一的模組
- 提取 Zod schema 共用基底，兩種模式繼承
- 統一日期格式解析
- 清除死碼與 debug log

**Non-Goals:**

- 不修改 UI 元件行為
- 不新增功能
- 不改變 PDF 產生結果（純重構，輸出不變）

## Decisions

### 提取共用 PDF 工具函式 `buildPDF`

將四個 hook 共用的步驟（fetch template、fetch font、繪製 fullName / organization / jobTitle / receiptReason / amount / idNumber / email / date）抽取為 `src/utils/buildPDF.ts`。

函式簽名：
```ts
type PDFMode = 'bank' | 'postal';

interface BankFields {
  bankBranchCode: string;
  bankBranchName: string;
  bankAccountNumber: string;
}

interface PostalFields {
  postalCode: string;
  postOfficeAccount: string;
}

interface CommonFields {
  fullName: string;
  organization: string;
  jobTitle: string;
  receiptReason?: string;
  amount?: number;
  idNumber: string;
  email: string;
  date: string;
}

type BuildPDFData =
  | (CommonFields & BankFields & { mode: 'bank' })
  | (CommonFields & PostalFields & { mode: 'postal' });

export async function buildPDF(data: BuildPDFData): Promise<Uint8Array>
```

四個 hook 改為呼叫 `buildPDF` 後自行處理 `saveAs` 或 JSZip。

**Alternatives considered**: 保留四個 hook 各自實作 → 維護負擔持續存在，被否決。

---

### 拆分 `GlobalVariable.ts`

| 新檔案 | 內容 |
|--------|------|
| `src/constants/pdfCoordinates.ts` | `bankAccountX`、`idNumberX` |
| `src/constants/formFields.ts` | `formField`、`postalFormField`、`item` |
| `src/schemas/receiptSchema.ts` | `baseReceiptSchema`、`formFieldSchema`、`postalFormFieldSchema`、`formFieldTypes`、`postalFormFieldTypes` |

`GlobalVariable.ts` 保留，改為從以上三個模組 re-export 所有 symbol，避免一次性大規模改動 import 路徑（現有測試、元件都不需修改）。

**Alternatives considered**: 直接刪除 `GlobalVariable.ts` 並更新所有 import → 風險高、改動點多，不符合此次純重構原則，被否決。

---

### 提取共用 Zod schema 基底

```ts
// src/schemas/receiptSchema.ts
const baseReceiptSchema = z.object({
  fullName: z.string().nonempty("請輸入姓名"),
  organization: z.string().nonempty("請輸入服務單位"),
  jobTitle: z.string().nonempty("請輸入職稱"),
  receiptReason: z.string().optional(),
  amount: z.number().min(0, "金額不能小於0").optional(),
  idNumber: z.string().regex(/^[A-Z][0-9]{9}$/, "格式錯誤，需為1英文字+9數字"),
  email: z.string().email("請輸入有效的 Email").nonempty("請輸入 Email"),
  date: z.string().nonempty("請輸入日期"),
});

export const formFieldSchema = baseReceiptSchema.extend({
  bankBranchCode: z.string().nonempty("請輸入7碼銀行分行代號"),
  bankBranchName: z.string().nonempty("請輸入銀行分行名稱"),
  bankAccountNumber: z.string().nonempty("請輸入銀行帳號"),
});

export const postalFormFieldSchema = baseReceiptSchema.extend({
  postalCode: z.string().nonempty("請輸入700郵局代號"),
  postOfficeAccount: z.string().nonempty("請輸入銀行帳號"),
});
```

---

### 統一日期解析

單筆模式（表單）的 `date` 格式為 `YYYY-MM-DD`（HTML date input 標準格式）。批次模式（Excel）目前使用 `slice(0,4)` / `slice(4,6)` / `slice(6,8)`，暗示 `YYYYMMDD`，但 Excel 實際匯出的日期字串格式因 XLSX 解析方式而不同。

決策：統一在 `buildPDF` 內部以 `Date` 物件或正規表達式解析，支援 `YYYY-MM-DD` 與 `YYYYMMDD` 兩種格式，讓批次模式日期解析對齊單筆模式。

```ts
function parseDate(dateStr: string): { year: string; month: string; day: string } {
  const normalized = dateStr.replace(/-/g, '');
  return {
    year: normalized.slice(0, 4),
    month: normalized.slice(4, 6),
    day: normalized.slice(6, 8),
  };
}
```

## Risks / Trade-offs

- **Re-export 相容層**：`GlobalVariable.ts` 變成純 re-export 後，若未來有人直接修改它而忘記原始檔，可能造成混淆。→ 在檔案頂端加註清楚說明。
- **`buildPDF` 型別設計**：使用 discriminated union（`mode` 欄位）增加型別安全，但呼叫端需傳入 `mode`，稍微增加 call site 的改動量。→ 這是可接受的 trade-off。
- **日期格式統一**：若 Excel 實際傳入的格式不是 `YYYYMMDD`，統一解析後仍需對齊實際格式。→ 重構後需執行批次功能的手動煙霧測試。
