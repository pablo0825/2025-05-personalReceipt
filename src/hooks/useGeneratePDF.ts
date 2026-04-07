import { saveAs } from "file-saver";
import { useCallback } from "react";
import type { formFieldTypes } from "../var/GlobalVariable";
import { buildPDF } from "../utils/buildPDF";

export const useGeneratePDF = () => {
  const generatePDF = useCallback(async (formData: formFieldTypes) => {
    try {
      const pdfBytes = await buildPDF({ ...formData, mode: "bank" });
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
