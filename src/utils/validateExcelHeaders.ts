import { requiredFields } from "../var/GlobalVariable";
import * as XLSX from "xlsx";

type ExcelRow = string[];

export async function validateExcelHeaders(
  file: File
): Promise<string[] | null> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json<ExcelRow>(sheet, { header: 1 });
  const headers = json[0] as string[];
  const missing = requiredFields.filter((field) => !headers.includes(field));
  return missing.length > 0 ? missing : null;
}
