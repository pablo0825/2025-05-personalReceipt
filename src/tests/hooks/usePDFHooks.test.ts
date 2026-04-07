import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useGeneratePDF } from "../../hooks/useGeneratePDF";
import { useGeneratePostalPDF } from "../../hooks/useGeneratePostalPDF";
import { saveAs } from "file-saver";

// mock buildPDF 模組
vi.mock("../../utils/buildPDF", () => ({
  buildPDF: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
}));

vi.mock("file-saver", () => ({ saveAs: vi.fn() }));

const bankData = {
  fullName: "王小明",
  organization: "OpenAI Taiwan",
  jobTitle: "工程師",
  receiptReason: "出席講座",
  amount: 3000,
  idNumber: "A123456789",
  email: "test@example.com",
  bankBranchCode: "1234567",
  bankBranchName: "中山分行",
  bankAccountNumber: "000111222333",
  date: "2025-06-16",
};

const postalData = {
  fullName: "李小華",
  organization: "台大",
  jobTitle: "研究員",
  receiptReason: "出席演講",
  amount: 1500,
  idNumber: "B234567890",
  email: "postal@example.com",
  postalCode: "700",
  postOfficeAccount: "123456789012",
  date: "2025-06-16",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Hook-layer tests verify saveAs is called", () => {
  describe("useGeneratePDF calls saveAs on success", () => {
    it("成功產生後應呼叫 saveAs", async () => {
      const { result } = renderHook(() => useGeneratePDF());
      await result.current.generatePDF(bankData);
      expect(saveAs).toHaveBeenCalledOnce();
      expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "王小明-領據.pdf");
    });
  });

  describe("useGeneratePostalPDF calls saveAs on success", () => {
    it("成功產生後應呼叫 saveAs", async () => {
      const { result } = renderHook(() => useGeneratePostalPDF());
      await result.current.generatePostalPDF(postalData);
      expect(saveAs).toHaveBeenCalledOnce();
      expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "李小華-領據.pdf");
    });
  });

  describe("Hook catches buildPDF error and alerts", () => {
    it("buildPDF reject 時應呼叫 alert、不呼叫 saveAs", async () => {
      const { buildPDF } = await import("../../utils/buildPDF");
      vi.mocked(buildPDF).mockRejectedValueOnce(new Error("無法載入 PDF 模板"));

      const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
      const { result } = renderHook(() => useGeneratePDF());
      await result.current.generatePDF(bankData);

      expect(alertSpy).toHaveBeenCalledWith("發生錯誤，請確認模板檔案是否存在");
      expect(saveAs).not.toHaveBeenCalled();
    });
  });
});
