/* form.tsx */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formField, formFieldSchema } from "../var/GlobalVariable";
import type { formFieldTypes } from "../var/GlobalVariable";
import Collapse from "./Collapse";

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, submitCount },
  } = useForm<formFieldTypes>({
    resolver: zodResolver(formFieldSchema),
    mode: "onSubmit",
  });

  const onSubmit = (data: formFieldTypes) => {
    console.log("送出的表單資料:", data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {formField.map((field) => (
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
            {...register(field.name as keyof formFieldTypes, {
              valueAsNumber: field.type === "number" ? true : undefined,
            })}
            className="p-2 border rounded mb-1"
          />
          {submitCount > 0 && errors[field.name as keyof formFieldTypes] && (
            <p className="text-red-400">
              {errors[field.name as keyof formFieldTypes]?.message}
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

export default Form;
