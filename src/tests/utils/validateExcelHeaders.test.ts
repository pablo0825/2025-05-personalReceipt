import { describe, expect, test } from "vitest";
import { validateExcelHeaders } from "../../utils/validateExcelHeaders";
import { requiredFields, requiredPostalFields } from "../../var/GlobalVariable";
import * as XLSX from "xlsx";
import { File } from "fetch-blob/file.js";

// 建立模擬的 Excel 檔案
const mockExcelFile = (headers: string[]): File => {
  const worksheet = XLSX.utils.aoa_to_sheet([headers]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  return new File([excelBuffer], "test.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
};

// 建立空的 Excel 檔案（無 header）
const mockEmptyExcelFile = (): File => {
  const worksheet = XLSX.utils.aoa_to_sheet([]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  return new File([buffer], "empty.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
};

describe("validateExcelHeaders", () => {
  describe("一般模式", () => {
    test("should return null when all required headers are present", async () => {
      const file = mockExcelFile(requiredFields);
      const result = await validateExcelHeaders(file, false);
      expect(result).toBeNull();
    });

    test("should return missing headers", async () => {
      const file = mockExcelFile(["fullName"]);
      const result = await validateExcelHeaders(file, false);
      expect(result).toContain("organization");
      expect(result).toContain("receiptReason");
    });

    test("should accept headers in wrong order", async () => {
      const file = mockExcelFile([
        "email",
        "date",
        "fullName",
        "organization",
        "jobTitle",
        "receiptReason",
        "amount",
        "idNumber",
        "bankBranchCode",
        "bankAccountNumber",
        "bankBranchName",
      ]);
      const result = await validateExcelHeaders(file, false);
      expect(result).toBeNull(); // 順序錯誤也應該被接受
    });

    test("should handle empty Excel file gracefully", async () => {
      const file = mockEmptyExcelFile();
      const result = await validateExcelHeaders(file, false);
      expect(result).toEqual(requiredFields); // 所有欄位都缺
    });
  });

  describe("郵局模式", () => {
    test("should return null when all required headers are present", async () => {
      const file = mockExcelFile(requiredPostalFields);
      const result = await validateExcelHeaders(file, true);
      expect(result).toBeNull();
    });

    test("should return missing headers", async () => {
      const file = mockExcelFile(["fullName"]);
      const result = await validateExcelHeaders(file, true);
      expect(result).toContain("organization");
      expect(result).toContain("receiptReason");
    });

    test("should accept headers in wrong order", async () => {
      const file = mockExcelFile([
        "fullName",
        "organization",
        "jobTitle",
        "receiptReason",
        "idNumber",
        "postalCode",
        "postOfficeAccount",
        "date",
        "email",
        "amount",
      ]);
      const result = await validateExcelHeaders(file, true);
      expect(result).toBeNull(); // 順序錯誤也應該被接受
    });

    test("should handle empty Excel file gracefully", async () => {
      const file = mockEmptyExcelFile();
      const result = await validateExcelHeaders(file, true);
      expect(result).toEqual(requiredPostalFields); // 所有欄位都缺
    });
  });
});
