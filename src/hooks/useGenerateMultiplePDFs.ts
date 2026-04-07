import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { useCallback } from "react";
import type { formFieldTypes } from "../var/GlobalVariable";
import { buildPDF } from "../utils/buildPDF";

export const useGenerateMultiplePDFs = () => {
  const generatePDFs = useCallback(
    async (file: File, onProgress?: (percent: number) => void) => {
      try {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<formFieldTypes>(sheet);

        const zip = new JSZip();
        const errorList: string[] = [];

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          try {
            const pdfBytes = await buildPDF({ ...row, mode: "bank" });
            const filename = `${row["fullName"] || "unknown"}-${i + 1}.pdf`;
            zip.file(filename, pdfBytes);

            if (onProgress) {
              onProgress(Math.round(((i + 1) / rows.length) * 100));
            }
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
    },
    []
  );
  return { generatePDFs };
};
