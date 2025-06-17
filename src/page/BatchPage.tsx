import React, { useRef, useState } from "react";
import { useGenerateMultiplePDFs } from "../hooks/useGenerateMultiplePDFs";
import * as XLSX from "xlsx";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type ExcelRow = string[];

const BatchPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [isFileUpload, setIsFileUpload] = useState<boolean>(false);
  const [isProgressComplete, setIsProgressComplete] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const { generatePDFs } = useGenerateMultiplePDFs();

  //重置上傳狀態
  const resetUploadState = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFileName("");
    setIsFileUpload(false);
    setIsProgressComplete(false);
    setProgress(0);
  };

  //處理邏輯
  const handleFile = async (file: File) => {
    console.log("處理中檔案:", file.name);

    setFileName(file.name);
    setIsFileUpload(true);

    setProgress(10);

    try {
      await simulateLoading();

      //驗證欄位名稱
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<ExcelRow>(sheet, { header: 1 });
      const headers = json[0] as string[];

      const requiredFields = [
        "fullName",
        "organization",
        "jobTitle",
        "receiptResaon",
        "amount",
        "idNumber",
        "email",
        "bankBranchCode",
        "bankBranchName",
        "bankAccountNumber",
        "date",
      ];

      const missingFields = requiredFields.filter(
        (field) => !headers.includes(field)
      );

      if (missingFields.length > 0) {
        alert(`❌ 檔案欄位缺少：${missingFields.join(", ")}`);
        resetUploadState(); // 回到初始狀態
        return;
      }

      // ✅ 欄位符合，模擬進度條
      /* await simulateUpload(); */
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

  //模擬進度條
  const simulateUpload = () =>
    new Promise<void>((resolve) => {
      let current = 10;
      //每300毫秒持續執行方法內容
      const interval = setInterval(() => {
        current += 20;
        setProgress(current);
        if (current >= 100) {
          clearInterval(interval); //停止計時
          resolve();
        }
      }, 300);
    });

  //模擬loading
  const simulateLoading = () => {
    new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve(); // 1.5秒後完成
      }, 1500);
    });
  };

  /* 處理生成PDF */
  const handleGeneratePDFs = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert("請先選擇檔案");
      return;
    }

    console.log("📄 開始產生 PDF");
    await generatePDFs(file);

    resetUploadState();
  };

  return (
    <div>
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
            /* progress > 0 && (
              <div className="w-full bg-gray-200 h-4 rounded mt-2">
                <div
                  className="bg-green-500 h-4 rounded"
                  style={{ width: `${progress}%`, transition: "width 0.3s" }}
                ></div>
              </div>
            ) */
            <div className="h-96">
              <DotLottieReact
                src="https://lottie.host/6f0e5d83-8356-43be-ab64-4b7d983a7d78/K8VRmMzHE8.lottie"
                loop
                autoplay
              />
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer px-8 py-8 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          📁 選擇檔案
        </button>
      )}

      {/* <div className="h-96">
        <DotLottieReact
          src="https://lottie.host/6f0e5d83-8356-43be-ab64-4b7d983a7d78/K8VRmMzHE8.lottie"
          loop
          autoplay
        />
      </div> */}

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
