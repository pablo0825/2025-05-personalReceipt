import React, { useRef, useState } from "react";
import { useGenerateMultiplePDFs } from "../hooks/useGenerateMultiplePDFs";
import Popup from "../components/Popup";
import { validateExcelHeaders } from "../utils/validateExcelHeaders";

const BatchPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [isFileUpload, setIsFileUpload] = useState<boolean>(false);
  const [isProgressComplete, setIsProgressComplete] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);

  const { generatePDFs } = useGenerateMultiplePDFs();

  //重置上傳狀態
  const resetUploadState = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFileName("");
    setIsFileUpload(false);
    setIsProgressComplete(false);
    setProgress(0);
    setIsPopupVisible(false);
  };

  //模擬loading
  const simulateLoading = () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve(); // 1.5秒後完成
      }, 1500);
    });
  };

  //處理邏輯
  const handleFile = async (file: File) => {
    console.log("處理中檔案:", file.name);

    setFileName(file.name);
    setIsFileUpload(true);

    try {
      await simulateLoading();

      const missing = await validateExcelHeaders(file);

      if (missing) {
        alert(`❌ 檔案欄位缺少：${missing.join(", ")}`);
        resetUploadState();
        return;
      }

      setIsProgressComplete(true);
      console.log("✔ 上傳完成");
    } catch (err) {
      console.error("❌ 檔案處理錯誤:", err);
      alert("❌ 檔案處理發生錯誤");
      resetUploadState();
    }
  };

  //處理與input UI的互動
  const handleFileChange = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) handleFile(file);
  };

  /* 處理生成PDF */
  const handleGeneratePDFs = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert("請先選擇檔案");
      return;
    }

    setIsPopupVisible(true);
    setProgress(0);

    try {
      console.log("📄 開始產生 PDF");
      await generatePDFs(file, (percent) => {
        setProgress(percent);
      });

      setTimeout(() => {
        resetUploadState();
      }, 500);
    } catch (error) {
      console.error("❌ PDF 產生失敗", error);
      alert("產生 PDF 發生錯誤");
      resetUploadState();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-10">
      <div className="p-6 border rounded-lg shadow-xl bg-white">
        <div className="border-2 border-dashed border-[#8fa791] rounded-md p-8 flex flex-col items-center justify-center space-y-4 bg-white shadow-sm">
          {isFileUpload ? (
            <div>
              {isProgressComplete ? (
                <div>
                  <div className="flex space-x-4">
                    {/* fileName */}
                    {fileName && <p>已選擇檔案: {fileName}</p>}
                    {/* 進度條 */}
                    <button
                      onClick={resetUploadState}
                      className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                      ❌ 清除檔案
                    </button>
                  </div>
                  <button
                    onClick={handleGeneratePDFs}
                    className="cursor-pointer px-8 py-8 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    產生PDF
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-20">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          ) : (
            <div className="m-14">
              <img src="../upload.png" alt="" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer px-8 py-4 bg-[#8fa791] text-white rounded hover:bg-[#708f76]"
              >
                📁 選擇檔案
              </button>
            </div>
          )}
        </div>
      </div>

      <Popup visible={isPopupVisible} progress={progress} />

      {/* 隱藏 input，只用 ref 控制它 */}
      <input
        type="file"
        accept=".xlsx"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }} // 不讓使用者直接看到 input
      />
    </div>
  );
};

export default BatchPage;
