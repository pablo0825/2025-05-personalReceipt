import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { wrapTextByLength } from "./wrapTextByLength";
import { splitStringIntoGroups } from "./splitStringIntoGroups";
import { bankAccountX, idNumberX } from "../constants/pdfCoordinates";

/* ── 型別定義 ─────────────────────────────────────── */

export interface CommonFields {
  fullName: string;
  organization: string;
  jobTitle: string;
  receiptReason?: string;
  amount?: number;
  idNumber: string;
  email: string;
  date: string;
}

export interface BankFields {
  bankBranchCode: string;
  bankBranchName: string;
  bankAccountNumber: string;
}

export interface PostalFields {
  postalCode: string;
  postOfficeAccount: string;
}

export type BuildPDFData =
  | (CommonFields & BankFields & { mode: "bank" })
  | (CommonFields & PostalFields & { mode: "postal" });

/* ── 輔助函式 ─────────────────────────────────────── */

/**
 * 統一日期解析（Unified date parsing）
 * 支援 YYYY-MM-DD（HTML date input）與 YYYYMMDD（Excel 匯出）兩種格式。
 */
function parseDate(dateStr: string): {
  year: string;
  month: string;
  day: string;
} {
  const normalized = String(dateStr).replace(/-/g, "");
  return {
    year: normalized.slice(0, 4),
    month: normalized.slice(4, 6),
    day: normalized.slice(6, 8),
  };
}

/* ── 主函式 ───────────────────────────────────────── */

/**
 * Shared PDF build utility
 * 根據傳入資料與模式（bank / postal）產生 PDF，回傳 Uint8Array。
 */
export async function buildPDF(data: BuildPDFData): Promise<Uint8Array> {
  /* 載入 PDF 模板 */
  const templateResponse = await fetch("/template.pdf");
  if (!templateResponse.ok) throw new Error("無法載入 PDF 模板");
  const pdfArrayBuffer = await templateResponse.arrayBuffer();

  /* 載入中文字型 */
  const fontResponse = await fetch("/fonts/NotoSansCJK-Regular.ttf");
  if (!fontResponse.ok) throw new Error("無法載入中文字型");
  const fontArrayBuffer = await fontResponse.arrayBuffer();

  const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
  pdfDoc.registerFontkit(fontkit);

  const customFont = await pdfDoc.embedFont(fontArrayBuffer);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const page = pdfDoc.getPages()[0];
  const safeStr = (v: unknown) => String(v ?? "");

  /* ── 共用欄位 ── */

  /* fullName */
  page.drawText(safeStr(data.fullName), {
    x: 85,
    y: 670,
    size: 12,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  /* organization */
  const orgLines = wrapTextByLength(safeStr(data.organization), 11);
  orgLines.forEach((line, i) => {
    page.drawText(line, {
      x: 248,
      y: data.organization.length > 11 ? 678 - i * 15 : 670,
      size: 12,
      font: customFont,
      color: rgb(0, 0, 0),
    });
  });

  /* jobTitle */
  page.drawText(safeStr(data.jobTitle), {
    x: 458,
    y: 670,
    size: 12,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  /* receiptReason */
  page.drawText(safeStr(data.receiptReason), {
    x: 90,
    y: 523,
    size: 12,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  /* amount */
  page.drawText(safeStr(data.amount), {
    x: 75,
    y: 465,
    size: 12,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  /* idNumber — 每格獨立 x 座標 */
  const idChars = splitStringIntoGroups(safeStr(data.idNumber));
  idChars.forEach((ch, idx) => {
    page.drawText(ch, {
      x: idNumberX[idx],
      y: 428,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
  });

  /* email */
  const emailLines = wrapTextByLength(safeStr(data.email), 20);
  emailLines.forEach((line, i) => {
    page.drawText(line, {
      x: 424,
      y: data.email.length > 20 ? 434 - i * 15 : 428,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
  });

  /* ── 模式特定欄位 ── */

  if (data.mode === "bank") {
    /* bankBranchCode */
    page.drawText(safeStr(data.bankBranchCode), {
      x: 172,
      y: 364,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    /* bankBranchName */
    const branchLines = wrapTextByLength(safeStr(data.bankBranchName), 6);
    branchLines.forEach((line, i) => {
      page.drawText(line, {
        x: 172,
        y: data.bankBranchName.length > 6 ? 350 - i * 15 : 350,
        size: 10,
        font: customFont,
        color: rgb(0, 0, 0),
      });
    });

    /* bankAccountNumber — 每格獨立 x 座標 */
    const bankChars = splitStringIntoGroups(safeStr(data.bankAccountNumber));
    bankChars.forEach((ch, idx) => {
      page.drawText(ch, {
        x: bankAccountX[idx],
        y: 354,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
    });
  } else {
    /* postalCode */
    page.drawText(safeStr(data.postalCode), {
      x: 180,
      y: 354,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    /* postOfficeAccount — 每格獨立 x 座標 */
    const postalChars = splitStringIntoGroups(safeStr(data.postOfficeAccount));
    postalChars.forEach((ch, idx) => {
      page.drawText(ch, {
        x: bankAccountX[idx],
        y: 354,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
    });
  }

  /* ── 日期 ── */
  const { year, month, day } = parseDate(data.date);

  page.drawText(year, {
    x: 430,
    y: 258,
    size: 12,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(month, {
    x: 480,
    y: 258,
    size: 12,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(day, {
    x: 515,
    y: 258,
    size: 12,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  return pdfDoc.save();
}
