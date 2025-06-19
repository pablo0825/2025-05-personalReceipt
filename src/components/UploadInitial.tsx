//UploadInitial.tsx
import React from "react";

interface UploadInitialProps {
  href: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const UploadInitial = ({ href, fileInputRef }: UploadInitialProps) => {
  console.log(href);
  return (
    <div className="m-14 flex items-center justify-center flex-col space-y-4">
      <img className="w-[12.5rem] h-[12.5rem]" src="../upload.png" alt="" />
      <p>
        這是範例檔案，可以直接下載填寫：
        <a href={href} download className="text-blue-600 underline">
          點我下載
        </a>
      </p>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer px-8 py-4 bg-[#8fa791] text-white rounded hover:bg-[#708f76]"
      >
        選擇檔案
      </button>
    </div>
  );
};

export default UploadInitial;
