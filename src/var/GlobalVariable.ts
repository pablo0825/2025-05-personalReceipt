/* GlobalVariable.ts */
import { z } from "zod";

/* 基礎表單字段 */
export const formField = [
  { name: "fullName", label: "姓名", type: "text", required: true },
  { name: "organization", label: "服務單位", type: "text", required: true },
  { name: "jobTitle", label: "職稱", type: "text", required: true },
  { name: "receiptResaon", label: "受領事由", type: "text", required: false },
  { name: "amount", label: "金額", type: "number", required: false },
  { name: "idNumber", label: "身分證字號", type: "text", required: true },
  { name: "email", label: "Email", type: "text", required: true },
  {
    name: "bankBranchCode",
    label: "銀行分行代號",
    type: "text",
    required: true,
  },
  {
    name: "bankBranchName",
    label: "銀行分行名稱",
    type: "text",
    required: true,
  },
  {
    name: "bankAccountNumber",
    label: "銀行帳號",
    type: "text",
    required: true,
  },
  {
    name: "date",
    label: "日期",
    type: "date",
    required: true,
  },
];

/* 額外表單字段 */
/* export const extraFormField = [
  { name: "receiptResaon", label: "受領事由", type: "text", required: false },
  { name: "amount", label: "金額", type: "number", required: false },
]; */

/* 基礎表單字段驗證 */
export const formFieldSchema = z.object({
  fullName: z.string().nonempty("請輸入姓名"),
  organization: z.string().nonempty("請輸入服務單位"),
  jobTitle: z.string().nonempty("請輸入職稱"),
  receiptResaon: z.string().optional(),
  amount: z.number().min(0, "金額不能小於0").optional(),
  idNumber: z.string().regex(/^[A-Z][0-9]{9}$/, "格式錯誤，需為1英文字+9數字"),
  email: z.string().email("請輸入有效的 Email").nonempty("請輸入 Email"),
  bankBranchCode: z.string().nonempty("請輸入7碼銀行分行代號"),
  bankBranchName: z.string().nonempty("請輸入銀行分行名稱"),
  bankAccountNumber: z.string().nonempty("請輸入銀行帳號"),
  date: z.string().nonempty("請輸入日期"),
});

/* 額外0表單字段驗證 */
/* export const extraFormFieldSchema = z.object({
  receiptResaon: z.string().optional(),
  amount: z.number().min(0, "金額不能小於0").optional(),
  idNumber: z.string().regex(/^[A-Z][0-9]{9}$/, "格式錯誤，需為1英文字+9數字"),
}); */

export const item = [
  { key: "receiptResaon", label: "受領事由" },
  { key: "amount", label: "金額" },
];

/* 表單字段型別 */
export type formFieldTypes = z.infer<typeof formFieldSchema>;

export const bankAccountX = [
  260, 280, 300, 320, 340, 360, 380, 395, 415, 435, 455, 475, 495, 515, 535,
  555,
];

export const idNumberX = [90, 118, 146, 174, 207, 235, 263, 291, 319, 350];
