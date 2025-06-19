//Popup.tsx
interface PopupProps {
  visible: boolean;
  progress: number;
  onClose?: () => void;
}

const Popup = ({ visible, progress }: PopupProps) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-lg font-bold mb-4">PDF 產生中...</h2>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-[#8fa791] h-4 transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-center">{progress}%</p>
      </div>
    </div>
  );
};

export default Popup;
