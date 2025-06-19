import { Files, X } from "lucide-react";

interface UploadPrepareProps {
  fileName: string;
  resetUploadState: () => void;
  handleGeneratePDFs: () => void;
}

const UploadPrepaer = ({
  fileName,
  resetUploadState,
  handleGeneratePDFs,
}: UploadPrepareProps) => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex border-2  border-[#8fa791] rounded-md p-4">
        {/* fileName */}
        {fileName && (
          <div className="flex-1 flex items-center space-x-2 ">
            <Files />
            <p className="">{fileName}</p>
          </div>
        )}
        {/* 進度條 */}
        <button
          onClick={resetUploadState}
          className="flex-none hover:text-[#cd7c82] "
        >
          <X />
        </button>
      </div>
      <button
        onClick={handleGeneratePDFs}
        className="cursor-pointer px-8 py-4 bg-[#8fa791] text-white rounded hover:bg-[#708f76]"
      >
        產生PDF
      </button>
    </div>
  );
};

export default UploadPrepaer;
