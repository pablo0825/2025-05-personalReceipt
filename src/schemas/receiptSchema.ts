import { z } from "zod";

const baseReceiptSchema = z.object({
  fullName: z.string().nonempty("請輸入姓名"),
  organization: z.string().nonempty("請輸入服務單位"),
  jobTitle: z.string().nonempty("請輸入職稱"),
  receiptReason: z.string().optional(),
  amount: z.number().min(0, "金額不能小於0").optional(),
  idNumber: z.string().regex(/^[A-Z][0-9]{9}$/, "格式錯誤，需為1英文字+9數字"),
  email: z.string().email("請輸入有效的 Email").nonempty("請輸入 Email"),
  date: z.string().nonempty("請輸入日期"),
});

export const formFieldSchema = baseReceiptSchema.extend({
  bankBranchCode: z.string().nonempty("請輸入7碼銀行分行代號"),
  bankBranchName: z.string().nonempty("請輸入銀行分行名稱"),
  bankAccountNumber: z.string().nonempty("請輸入銀行帳號"),
});

export const postalFormFieldSchema = baseReceiptSchema.extend({
  postalCode: z.string().nonempty("請輸入700郵局代號"),
  postOfficeAccount: z.string().nonempty("請輸入銀行帳號"),
});

export type formFieldTypes = z.infer<typeof formFieldSchema>;
export type postalFormFieldTypes = z.infer<typeof postalFormFieldSchema>;
