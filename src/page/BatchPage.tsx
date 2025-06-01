import React, { useRef, useState } from "react";

const BatchPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [isFileUpload, setIsFileUpload] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  //處理邏輯
  const handleFile = async (file: File) => {
    console.log(file.name);
    setFileName(file.name);
    setIsFileUpload(true);

    setProgress(10);

    try {
      await simulateUpload();
      console.log("完成上傳");
    } catch (err) {
      console.error(err);
    }
  };

  //處理與input UI的互動
  const handleFileChange = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) handleFile(file);
  };

  //模擬進度條
  const simulateUpload = () =>
    new Promise<void>((/* resolve, reject */) => {
      let current = 10;
      //每300毫秒持續執行方法內容
      const interval = setInterval(() => {
        current += 20;
        setProgress(current);
        if (current >= 100) {
          clearInterval(interval); //停止計時
          // 模擬成功或失敗
          /* if (Math.random() > 0.2) {
            resolve();
          } else {
            reject();
          } */
        }
      }, 300);
    });

  return (
    <div>
      {isFileUpload ? (
        <div>
          {/* 進度條 */}
          {progress > 0 && (
            <div className="w-full bg-gray-200 h-4 rounded mt-2">
              <div
                className="bg-green-500 h-4 rounded"
                style={{ width: `${progress}%`, transition: "width 0.3s" }}
              ></div>
            </div>
          )}
          {/* 刪除 */}
          <button
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
                setFileName("");
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            ❌ 清除檔案
          </button>
          {/* fileName */}
          {fileName && <p>已選擇檔案: {fileName}</p>}
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer px-8 py-8 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          📁 選擇檔案
        </button>
      )}

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
