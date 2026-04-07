export const formField = [
  { name: "fullName", label: "姓名", type: "text", required: true },
  { name: "organization", label: "服務單位", type: "text", required: true },
  { name: "jobTitle", label: "職稱", type: "text", required: true },
  { name: "receiptReason", label: "受領事由", type: "text", required: false },
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

export const postalFormField = [
  { name: "fullName", label: "姓名", type: "text", required: true },
  { name: "organization", label: "服務單位", type: "text", required: true },
  { name: "jobTitle", label: "職稱", type: "text", required: true },
  { name: "receiptReason", label: "受領事由", type: "text", required: false },
  { name: "amount", label: "金額", type: "number", required: false },
  { name: "idNumber", label: "身分證字號", type: "text", required: true },
  { name: "email", label: "Email", type: "text", required: true },
  {
    name: "postalCode",
    label: "郵局代號",
    type: "text",
    required: true,
  },
  {
    name: "postOfficeAccount",
    label: "郵局帳號",
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

export const item = [
  { key: "receiptReason", label: "受領事由" },
  { key: "amount", label: "金額" },
];

export const requiredFields = [
  "fullName",
  "organization",
  "jobTitle",
  "receiptReason",
  "amount",
  "idNumber",
  "email",
  "bankBranchCode",
  "bankBranchName",
  "bankAccountNumber",
  "date",
];

export const requiredPostalFields = [
  "fullName",
  "organization",
  "jobTitle",
  "receiptReason",
  "amount",
  "idNumber",
  "email",
  "postalCode",
  "postOfficeAccount",
  "date",
];
