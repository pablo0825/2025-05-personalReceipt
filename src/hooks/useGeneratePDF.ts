import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import type { formFieldTypes } from "../var/GlobalVariable";
import fontkit from "@pdf-lib/fontkit";
import { useCallback } from "react";
import { wrapTextByLength } from "../utils/wrapTextByLength";
import { splitStringIntoGroups } from "../utils/splitStringIntoGroups";
import { bankAccountX } from "../var/GlobalVariable";
import { idNumberX } from "../var/GlobalVariable";

export const useGeneratePDF = () => {
  const generatePDF = useCallback(async (formData: formFieldTypes) => {
    try {
      /* 抓PDF模板 */
      const response = await fetch("/template.pdf");
      if (!response.ok) throw new Error("無法載入 PDF 模板");

      const pdfArrayBuffer = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

      // ✅ 註冊 fontkit
      /* 註冊自訂字型 */
      pdfDoc.registerFontkit(fontkit);

      // 讀取支援中文的字型
      const fontResponse = await fetch("/fonts/NotoSansCJK-Regular.ttf");
      if (!fontResponse.ok) throw new Error("無法載入中文字型");

      const fontArrayBuffer = await fontResponse.arrayBuffer();
      const customFont = await pdfDoc.embedFont(fontArrayBuffer);

      // 改為使用標準字型
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // 取得第一頁
      const page = pdfDoc.getPages()[0];

      /* fullName */
      page.drawText(`${formData.fullName}`, {
        x: 85,
        y: 670,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      /* organization */
      const organization = wrapTextByLength(formData.organization, 11);

      organization.forEach((line, index) => {
        page.drawText(line, {
          x: 248,
          y: formData.organization.length > 11 ? 678 - index * 15 : 670,
          size: 12,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      });

      /* jobTitle */
      page.drawText(`${formData.jobTitle}`, {
        x: 458,
        y: 670,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      //receiptResaon
      page.drawText(`${formData.receiptResaon}`, {
        x: 90,
        y: 523,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      //amount
      page.drawText(`${formData.amount}`, {
        x: 75,
        y: 465,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      /* idNumber */
      const idNumber = splitStringIntoGroups(formData.idNumber);

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
      const email = wrapTextByLength(formData.email, 20);

      email.forEach((str, index) => {
        page.drawText(str, {
          x: 424,
          y: formData.email.length > 20 ? 434 - index * 15 : 428,
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      });

      /* bankBranchCode */
      page.drawText(formData.bankBranchCode, {
        x: 172,
        y: 364,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      /* bankBranchName */
      const bankBranchName = wrapTextByLength(formData.bankBranchName, 6);

      bankBranchName.forEach((str, index) => {
        page.drawText(str, {
          x: 172,
          y: formData.bankBranchName.length > 6 ? 350 - index * 15 : 350,
          size: 10,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      });

      /* bankAccountNumber */
      const bankAccountNumber = splitStringIntoGroups(
        formData.bankAccountNumber
      );

      bankAccountNumber.forEach((nub, idx) => {
        page.drawText(nub, {
          x: bankAccountX[idx],
          y: 354,
          size: 10,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      });

      /* date */
      //年
      const year = String(formData.date).slice(0, 4);

      page.drawText(year, {
        x: 430,
        y: 258,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      //月
      const month = String(formData.date).slice(5, 7);

      page.drawText(month, {
        x: 480,
        y: 258,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      //日
      const day = String(formData.date).slice(8, 10);

      page.drawText(day, {
        x: 515,
        y: 258,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();

      // 下載 PDF
      saveAs(
        new Blob([pdfBytes], { type: "application/pdf" }),
        `${formData.fullName || "無名"}-領據.pdf`
      );
    } catch (error) {
      console.error("產生 PDF 檔案失敗:", error);
      alert("發生錯誤，請確認模板檔案是否存在");
    }
  }, []);

  return { generatePDF };
};
