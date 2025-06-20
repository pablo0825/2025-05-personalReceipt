//HomePage.tsx
import { useState } from "react";
import Popup from "../components/Popup";
import { useGeneratePDF } from "../hooks/useGeneratePDF";
import Form from "../components/Form";
import Checkbox from "../components/Checkbox";
import { useGeneratePostalPDF } from "../hooks/useGeneratePostalPDF";
import PostalForm from "../components/PostalForm";

const HomePage = () => {
  const [progress, setProgress] = useState<number>(0);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [toggleFormMode, setToggleFormMode] = useState<boolean>(false);

  const { generatePDF } = useGeneratePDF();
  const { generatePostalPDF } = useGeneratePostalPDF();

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-10">
      <div className="p-6 border rounded-lg shadow-xl bg-white">
        <Checkbox onChange={setToggleFormMode} label="啟用郵局模式" />
        {toggleFormMode ? (
          <PostalForm
            generatePostalPDF={generatePostalPDF}
            setProgress={setProgress}
            setIsPopupOpen={setIsPopupOpen}
          />
        ) : (
          <Form
            generatePDF={generatePDF}
            setProgress={setProgress}
            setIsPopupOpen={setIsPopupOpen}
          />
        )}
      </div>
      <Popup visible={isPopupOpen} progress={progress} />
    </div>
  );
};

export default HomePage;
