import { saveAs } from "file-saver";
import { useCallback } from "react";
import type { postalFormFieldTypes } from "../var/GlobalVariable";
import { buildPDF } from "../utils/buildPDF";

export const useGeneratePostalPDF = () => {
  const generatePostalPDF = useCallback(
    async (formData: postalFormFieldTypes) => {
      try {
        const pdfBytes = await buildPDF({ ...formData, mode: "postal" });
        saveAs(
          new Blob([pdfBytes], { type: "application/pdf" }),
          `${formData.fullName || "無名"}-領據.pdf`
        );
      } catch (error) {
        console.error("產生 PDF 檔案失敗:", error);
        alert("發生錯誤，請確認模板檔案是否存在");
      }
    },
    []
  );

  return { generatePostalPDF };
};
