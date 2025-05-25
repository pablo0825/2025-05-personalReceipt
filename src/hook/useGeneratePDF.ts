import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import fontkit from "@pdf-lib/fontkit";
import type { formFieldTypes } from "../var/GlobalVariable";
import { useCallback } from "react";

export const useGeneratePDF = () => {
  const generatePDF = useCallback(async (date: formFieldTypes) => {
    try {
      /* 抓PDF模板 */
      const response = await fetch(`${import.meta.env.BASE_URL}template.pdf`);
      if (!response.ok) throw new Error("無法載入 PDF 模板");

      const pdfArrayBuffer = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

      // 註冊 fontkit
      pdfDoc.registerFontkit(fontkit);

      // 讀取支援中文的字型
      const fontResponse = await fetch(
        `${import.meta.env.BASE_URL}/fonts/NotoSansCJK-Regular.ttf`
      );
      if (!fontResponse.ok) throw new Error("無法載入中文字型");

      const fontArrayBuffer = await fontResponse.arrayBuffer();
      const customFont = await pdfDoc.embedFont(fontArrayBuffer);
    } catch (error) {}
  });
};
