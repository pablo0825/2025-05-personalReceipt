/* form.tsx */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { postalFormFieldTypes } from "../var/GlobalVariable";
import { postalFormField, postalFormFieldSchema } from "../var/GlobalVariable";
import Collapse from "./Collapse";

interface PostalFormProps {
  generatePostalPDF: (data: postalFormFieldTypes) => void;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostalForm = ({
  generatePostalPDF,
  setProgress,
  setIsPopupOpen,
}: PostalFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, submitCount },
  } = useForm<postalFormFieldTypes>({
    resolver: zodResolver(postalFormFieldSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: postalFormFieldTypes) => {
    console.log("送出的表單資料:", data);

    setIsPopupOpen(true);
    setProgress(10);

    //模擬進度條
    setTimeout(() => setProgress(75), 300);
    await generatePostalPDF(data); // 負責生成PDF表單
    setProgress(100);

    //close popup and reset form
    setTimeout(() => {
      setIsPopupOpen(false);
      setProgress(0);
      reset(); //重置表單
    }, 1000);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      {postalFormField.map((field) => (
        <div key={field.name} className="flex flex-col mb-4">
          {/* 字段標題 */}
          <label className="font-medium mb-1 text-left">{field.label}</label>
          {/* 受領事由的參考寫法 */}
          {field.name === "receiptResaon" ? (
            <Collapse title="參考範例">
              <ul>
                <li>演講費：05/24(六)授課鐘點費共2小時，4,000元</li>
                <li>交通費：05/24(六)高鐵臺南到臺中來回，1350元</li>
                <li>測試費：05/24(六)系統測試費，100元</li>
              </ul>
            </Collapse>
          ) : (
            ""
          )}
          {/* 字段輸入框 */}
          <input
            type={field.type}
            {...register(field.name as keyof postalFormFieldTypes, {
              valueAsNumber: field.type === "number" ? true : undefined,
            })}
            className="p-2 border rounded mb-1"
          />
          {submitCount > 0 &&
            errors[field.name as keyof postalFormFieldTypes] && (
              <p className="text-red-400">
                {errors[field.name as keyof postalFormFieldTypes]?.message}
              </p>
            )}
        </div>
      ))}
      {/* 提交按鈕 */}
      <button type="submit" className="px-6 py-2 bg-emerald-400">
        提交
      </button>
    </form>
  );
};

export default PostalForm;
