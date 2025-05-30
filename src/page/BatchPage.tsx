import React, { useRef, useState } from "react";

const BatchPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      console.log(file.name);
      setFileName(file.name);
    }
  };

  return (
    <div>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        📁 選擇檔案
      </button>
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

      {/* 隱藏 input，只用 ref 控制它 */}
      <input
        type="file"
        accept=".xlsx"
        ref={fileInputRef}
        onChange={handleFileChange}
        //style={{ display: "none" }} // 不讓使用者直接看到 input
      />

      {/* fileName */}
      {fileName && <p>已選擇檔案: {fileName}</p>}
    </div>
  );
};

export default BatchPage;
