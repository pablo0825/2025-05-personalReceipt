import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import fontkit from "@pdf-lib/fontkit";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { useCallback } from "react";
import type { formFieldTypes } from "../var/GlobalVariable";
import { wrapTextByLength } from "../utils/wrapTextByLength";
import { splitStringIntoGroups } from "../utils/splitStringIntoGroups";
import { bankAccountX } from "../var/GlobalVariable";
import { idNumberX } from "../var/GlobalVariable";

export const useGenerateMultiplePDFs = () => {
  const generatePDFs = useCallback(async (file: File) => {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<formFieldTypes>(sheet);

      const zip = new JSZip();
      const errorList: string[] = [];
      /* 抓PDF模板 */
      const response = await fetch("/template.pdf");
      if (!response.ok) throw new Error("無法載入 PDF 模板");

      const pdfArrayBuffer = await response.arrayBuffer();

      // 讀取支援中文的字型
      const fontResponse = await fetch("/fonts/NotoSansCJK-Regular.ttf");
      if (!fontResponse.ok) throw new Error("無法載入中文字型");

      const fontArrayBuffer = await fontResponse.arrayBuffer();

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        try {
          const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
          // ✅ 註冊 fontkit
          /* 註冊自訂字型 */
          pdfDoc.registerFontkit(fontkit);

          /* 自訂字形 */
          const customFont = await pdfDoc.embedFont(fontArrayBuffer);

          // 標準字型
          const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

          // 取得第一頁
          const page = pdfDoc.getPages()[0];

          // 字串化
          const safeText = (value: unknown) => String(value ?? "");

          /* fullName */
          page.drawText(safeText(row.fullName), {
            x: 85,
            y: 670,
            size: 12,
            font: customFont,
            color: rgb(0, 0, 0),
          });

          /* organization */
          const organization = wrapTextByLength(safeText(row.organization), 11);

          organization.forEach((line, index) => {
            page.drawText(line, {
              x: 248,
              y: organization.length > 11 ? 678 - index * 15 : 670,
              size: 12,
              font: customFont,
              color: rgb(0, 0, 0),
            });
          });

          /* jobTitle */
          page.drawText(safeText(row.jobTitle), {
            x: 458,
            y: 670,
            size: 12,
            font: customFont,
            color: rgb(0, 0, 0),
          });

          //receiptResaon
          page.drawText(safeText(row.receiptResaon), {
            x: 90,
            y: 523,
            size: 12,
            font: customFont,
            color: rgb(0, 0, 0),
          });

          //amount
          page.drawText(safeText(row.amount), {
            x: 75,
            y: 465,
            size: 12,
            font: customFont,
            color: rgb(0, 0, 0),
          });

          /* idNumber */
          const idNumber = splitStringIntoGroups(safeText(row.idNumber));

          idNumber.forEach((str, idx) => {
            page.drawText(str, {
              x: idNumberX[idx],
              y: 428,
              size: 12,
              font: helveticaFont,
              color: rgb(0, 0, 0),
            });
          });

          /* email */
          const email = wrapTextByLength(safeText(row.email), 20);

          email.forEach((str, index) => {
            page.drawText(str, {
              x: 424,
              y: email.length > 20 ? 434 - index * 15 : 428,
              size: 12,
              font: helveticaFont,
              color: rgb(0, 0, 0),
            });
          });

          /* bankBranchCode */
          page.drawText(safeText(row.bankBranchCode), {
            x: 180,
            y: 354,
            size: 12,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });

          /* bankBranchName */
          const bankBranchName = wrapTextByLength(
            safeText(row.bankAccountNumber),
            6
          );

          bankBranchName.forEach((str, index) => {
            page.drawText(str, {
              x: 172,
              y: bankBranchName.length > 6 ? 350 - index * 15 : 350,
              size: 10,
              font: customFont,
              color: rgb(0, 0, 0),
            });
          });

          /* bankAccountNumber */
          const postOfficeAccount = splitStringIntoGroups(
            safeText(row.bankAccountNumber)
          );

          postOfficeAccount.forEach((nub, idx) => {
            page.drawText(nub, {
              x: bankAccountX[idx],
              y: 354,
              size: 10,
              font: helveticaFont,
              color: rgb(0, 0, 0),
            });
          });

          /* date */
          const year = safeText(row.date).slice(0, 4);
          const month = safeText(row.date).slice(4, 6);
          const day = safeText(row.date).slice(6, 8);
          console.log(day);

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

          const pdfBytes = await pdfDoc.save();
          const filename = `${row["fullName"] || "unknown"}-${i + 1}.pdf`;

          zip.file(filename, pdfBytes);
        } catch (rowError) {
          console.error(`第 ${i + 1} 筆資料產生失敗：`, rowError);
          errorList.push(
            `第 ${i + 1} 筆（${row["fullName"] || "未知"}）PDF 產生失敗`
          );
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "批次領據.zip");

      if (errorList.length > 0) {
        alert(`⚠️ 以下資料產生失敗：\n${errorList.join("\n")}`);
      }
    } catch (error) {
      console.error("處理檔案時發生錯誤：", error);
      alert("❌ 檔案處理失敗，請確認檔案格式正確，或稍後再試。");
    }
  }, []);
  return { generatePDFs };
};
